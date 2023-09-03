package com.Craza.WebstoreProject.user;

import com.Craza.WebstoreProject.exception.UserAlreadyExistsException;
import com.Craza.WebstoreProject.product.ProductService;
import com.Craza.WebstoreProject.registration.RegistrationRequest;

import com.Craza.WebstoreProject.registration.password.PasswordResetToken;
import com.Craza.WebstoreProject.registration.password.PasswordResetTokenRepository;
import com.Craza.WebstoreProject.registration.password.PasswordResetTokenService;
import com.Craza.WebstoreProject.registration.token.VerificationToken;
import com.Craza.WebstoreProject.registration.token.VerificationTokenRepository;
import com.Craza.WebstoreProject.reviews.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class UserService implements UserServiceInterface{
    private final UserRepository userRepository;
    private final ProductService productService;
    private final ReviewService reviewService;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordResetTokenService passwordResetTokenService;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    @Override
    public List<User> getUsers() {
        return userRepository.findAll();
    }


    @Override
    public User registerUser(RegistrationRequest request) {
        Optional<User> user = this.findByEmail(request.email());
        if(user.isPresent())
        {
            throw new UserAlreadyExistsException("A user with the email " + request.email() + " already exists.");
        }
        User newUser = new User();
        newUser.setFirstName(request.firstName());
        newUser.setLastName(request.lastName());
        newUser.setEmail(request.email());
        newUser.setPassword(passwordEncoder.encode(request.password()));
        newUser.setBasket(new HashMap<Long,Integer>());
        newUser.setOrderIds(new ArrayList<>());
        newUser.setRole(request.role());
        newUser.setIsEnabled(false);
        return userRepository.save(newUser);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public String validateToken(String verificationToken) {
        VerificationToken token = verificationTokenRepository.findByToken(verificationToken);
        if(token == null)
        {
            return "Invalid verification token!";
        }
        User user = token.getUser();
        Calendar calendar = Calendar.getInstance();
        if(token.getExpirationTime().getTime()- calendar.getTime().getTime() <= 0)
        {
            return "Token already expired.";
        }
        user.setIsEnabled(true);
        userRepository.save(user);
        return "valid";
    }

    @Override
    public Optional<User> findByEmailAndPassword(String email, String password) {
        return userRepository.findByEmailAndPassword(email,password);
    }

    public void saveUserVerificationToken(User newUser, String verificationToken) {
        VerificationToken verificationTokenToSave = new VerificationToken(verificationToken,newUser);
        verificationTokenRepository.save(verificationTokenToSave);
    }

    public String deleteUser(Long userId)
    {
        reviewService.deleteAllReviewsFromUser(userId);
        reviewService.deleteAllReviewVotesFromUser(userId);
        productService.deleteRatingsFromUser(userId);
        productService.deleteAllProductsFromUser(userId);
        passwordResetTokenRepository.deleteById(userId);
        for(PasswordResetToken a : passwordResetTokenRepository.findByUserId(userId))
        {
            passwordResetTokenRepository.delete(a);
        }
        for(VerificationToken v : verificationTokenRepository.findByUserId(userId))
        {
            verificationTokenRepository.delete(v);
        }

        userRepository.deleteById(userId);

        return "Deleted User";
    }

    public void changePassword(User theUser, String newPassword) {
        theUser.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(theUser);
    }

    @Override
    public String validatePasswordResetToken(String token) {
        return passwordResetTokenService.validatePasswordResetToken(token);
    }

    @Override
    public User findUserByPasswordToken(String token) {
        return passwordResetTokenService.findUserByPasswordToken(token).get();
    }

    @Override
    public void createPasswordResetTokenForUser(User user, String passwordResetToken) {
        passwordResetTokenService.createPasswordResetTokenForUser(user, passwordResetToken);
    }
    @Override
    public boolean oldPasswordIsValid(User user, String oldPassword){
        return passwordEncoder.matches(oldPassword, user.getPassword());
    }

    public String  editFirstName(Long userId, EditUserRequest editUserRequest)
    {
        Optional<User> tempUser =  userRepository.findById(userId);
        if(tempUser.isPresent())
        {
            if(editUserRequest.getFirstName() != null && editUserRequest.getFirstName().length() >= 3 )
            {
                tempUser.get().setFirstName(editUserRequest.getFirstName());
                userRepository.save(tempUser.get());
                return "Edited First Name";
            }
        }
        return "Failed to edit First Name, please make sure that you filled in the field and your name is at least 3 characters.";
    }

    public String editLastName(Long userId, EditUserRequest editUserRequest)
    {
        Optional<User> tempUser =  userRepository.findById(userId);
        if(tempUser.isPresent())
        {
            if(editUserRequest.getLastName() != null && editUserRequest.getLastName().length() >= 3 )
            {
                tempUser.get().setLastName(editUserRequest.getLastName());
                userRepository.save(tempUser.get());
                return "Edited Last Name";
            }
        }
        return "Failed to edit Last Name, please make sure that you filled in the field and your name is at least 3 characters.";

    }

    public String editEmail(Long userId, EditUserRequest editUserRequest)
    {
        Optional<User> tempUser =  userRepository.findById(userId);
        if(tempUser.isPresent())
        {
            if(editUserRequest.getEmail() != null && editUserRequest.getEmail().length() >= 5  && editUserRequest.getEmail().contains("@"))
            {
                tempUser.get().setEmail(editUserRequest.getEmail());
                userRepository.save(tempUser.get());
                return "Edited Email";
            }
        }
        return "Failed to edit Email, please make sure that you filled in the field and your email is at least 5 characters and is valid.";

    }

    @Override
    public VerificationToken generateNewVerificationToken(String oldToken) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(oldToken);
        var tokenExpirationTime = new VerificationToken();
        verificationToken.setToken(UUID.randomUUID().toString());
        verificationToken.setExpirationTime(tokenExpirationTime.getTokenExpirationTime());
        return verificationTokenRepository.save(verificationToken);
    }
}
