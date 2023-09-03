package com.Craza.WebstoreProject.registration;

import com.Craza.WebstoreProject.events.RegistrationCompleteEvent;
import com.Craza.WebstoreProject.events.listener.RegistrationCompleteEventListener;
import com.Craza.WebstoreProject.registration.password.PasswordResetRequest;
import com.Craza.WebstoreProject.registration.token.VerificationToken;
import com.Craza.WebstoreProject.registration.token.VerificationTokenRepository;
import com.Craza.WebstoreProject.user.User;
import com.Craza.WebstoreProject.user.UserService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;
import java.io.UnsupportedEncodingException;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Slf4j
public class RegistrationController {
    private final UserService userService;
    private final ApplicationEventPublisher publisher;
    private final VerificationTokenRepository verificationTokenRepository;
    private final RegistrationCompleteEventListener eventListener;
    private final HttpServletRequest servletRequest;

    @Value("${frontEndURL}")
    private String frontEndUrl;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegistrationRequest registrationRequest, final HttpServletRequest request)
    {
        if(userService.findByEmail(registrationRequest.email()).isPresent())
        {
            return new ResponseEntity<>("A user with this email already exists, please try using a different email.", HttpStatus.BAD_REQUEST);
        }
        User user = userService.registerUser(registrationRequest);
        publisher.publishEvent(new RegistrationCompleteEvent(user, applicationUrl(request)));
        return new ResponseEntity<>("Success! Please check your email to complete your registration.",HttpStatus.OK);
    }
    @GetMapping("/verifyEmail")
    public String verifyEmail(@RequestParam("token") String token)
    {
        String url = applicationUrl(servletRequest)+"/api/v1/resend-verification-token?token="+token;
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token);
        if(verificationToken == null)
        {
            return "The token provided is null, Please try logging in again. Or Check your email for the verification link";
        }
        if(verificationToken.getUser().getIsEnabled())
        {
            return "This account has already been verified. Please log in.";
        }
        String verificationResult = userService.validateToken(token);
        if(verificationResult.equalsIgnoreCase("valid"))
        {
            return "Email has been successfully verified. Please log in.";
        }
        return "Invalid verification link , <a href=\"" + url + "\"/> please, check your email for new verification link";
    }

    @PostMapping("/password-reset-request")
    public ResponseEntity<?> resetPasswordRequest(@RequestBody PasswordResetRequest passwordResetRequest,
                                       final HttpServletRequest servletRequest)
            throws MessagingException, UnsupportedEncodingException {

        Optional<User> user = userService.findByEmail(passwordResetRequest.getEmail());
        String passwordResetUrl = "";
        if (user.isPresent()) {
            String passwordResetToken = UUID.randomUUID().toString();
            userService.createPasswordResetTokenForUser(user.get(), passwordResetToken);
            passwordResetUrl = passwordResetEmailLink(user.get(), applicationUrl(servletRequest), passwordResetToken);
            return new ResponseEntity<String>( passwordResetUrl, HttpStatus.OK);
        }
        else
        {
            return new ResponseEntity<String>("A user with the email " + passwordResetRequest.getEmail() + " does not exist, please try again.", HttpStatus.BAD_REQUEST);
        }

    }
    private String passwordResetEmailLink(User user, String applicationUrl,
                                          String passwordToken) throws MessagingException, UnsupportedEncodingException {
        // CHANGE THIS URL WHEN TRYING FROM A DIFFERENT DOMAIN!!!!
        String url = frontEndUrl + "forgotPassReset/" + passwordToken;
        eventListener.sendPasswordResetVerificationEmail(url, user);
        log.info("Click the link to reset your password :  {}", url);
        return url;
    }
    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody PasswordResetRequest passwordResetRequest,
                                @RequestParam("token") String token){
        String tokenVerificationResult = userService.validatePasswordResetToken(token);
        if (!tokenVerificationResult.equalsIgnoreCase("valid")) {
            return "Invalid token password reset token";
        }
        Optional<User> theUser = Optional.ofNullable(userService.findUserByPasswordToken(token));
        if (theUser.isPresent()) {
            userService.changePassword(theUser.get(), passwordResetRequest.getNewPassword());
            return "Password has been reset successfully";
        }
        return "Invalid password reset token";
    }
    @PostMapping("/change-password")
    public String changePassword(@RequestBody PasswordResetRequest passwordResetRequest){
        Optional<User> user = userService.findByEmail(passwordResetRequest.getEmail());
        if(user.isEmpty())
        {
            return "Incorrect Email, Please Try Again.";
        }
        if (!userService.oldPasswordIsValid(user.get(), passwordResetRequest.getOldPassword())){
            return "Incorrect old password";
        }
        userService.changePassword(user.get(), passwordResetRequest.getNewPassword());
        return "Password changed successfully";
    }

    @GetMapping("/resend-verification-token")
    public String resendVerificationToken(@RequestParam("token") String oldToken, HttpServletRequest request)
            throws MessagingException, UnsupportedEncodingException {
        VerificationToken verificationToken =  userService.generateNewVerificationToken(oldToken);
        User theUser = verificationToken.getUser();
        resendVerificationTokenEmail(theUser, applicationUrl(request), verificationToken);
        return "A new verification link hs been sent to your email," +
                " please, check to complete your registration";
    }

    private void resendVerificationTokenEmail(User theUser, String applicationUrl, VerificationToken token)
            throws MessagingException, UnsupportedEncodingException {
        System.out.println("TOKEN::: " + token);
        String url = applicationUrl+"/api/v1/verifyEmail?token="+token.getToken();
        eventListener.sendVerificationEmail(url);
        log.info("Click the link to verify your registration :  {}", url);
    }
    public String applicationUrl(HttpServletRequest request) {
        return "http://"+request.getServerName()+":"+request.getServerPort()+request.getContextPath();
    }
}
