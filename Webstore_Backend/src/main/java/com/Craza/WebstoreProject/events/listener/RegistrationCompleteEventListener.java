package com.Craza.WebstoreProject.events.listener;

import com.Craza.WebstoreProject.events.RegistrationCompleteEvent;
import com.Craza.WebstoreProject.user.User;
import com.Craza.WebstoreProject.user.UserService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import java.io.UnsupportedEncodingException;
import java.util.UUID;



@Slf4j
@Component
@RequiredArgsConstructor
public class RegistrationCompleteEventListener implements ApplicationListener<RegistrationCompleteEvent> {
    private final UserService userService;
    private User newUser;
    private final JavaMailSender mailSender;

    @Value("${emailUser}")
    private String EmailUser;
    @Override
    public void onApplicationEvent(RegistrationCompleteEvent event) {
        /*
          1) Get newly registered User
          2) Create verification token for user
          3) Save verification token for user
          4) Build the verification url to be sent to the user
          5) Send the email
         */

        newUser = event.getUser(); // Get newly registered User

        String verificationToken =  UUID.randomUUID().toString(); // Create verification token for user

        userService.saveUserVerificationToken(newUser,verificationToken); //Save verification token for user


        String url = event.getApplicationUrl()+"/api/v1/verifyEmail?token="+verificationToken; //Build the verification url to be sent to the user
        try {
            sendVerificationEmail(url);
        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
        log.info("Click the link to complete your registration : {}", url); //Send the email
    }


    public void sendVerificationEmail(String url) throws MessagingException, UnsupportedEncodingException {
        String subject = "Email Verification";
        String senderName = "Webstore Application Test Service";
        String mailContent = "<p> Hi, "+ newUser.getFirstName()+ ", </p>"+
                "<p>Thank you for registering with us,"+
                "Please, follow the link below to complete your registration.</p>"+
                "<a href=\"" +url+ "\">Verify your email to activate your account</a>"+
                "<p> Thank you <br> Webstore Application Test Service";
        MimeMessage message = mailSender.createMimeMessage();
        var messageHelper = new MimeMessageHelper(message);
        messageHelper.setFrom(EmailUser, senderName);
        messageHelper.setTo(newUser.getEmail());
        messageHelper.setSubject(subject);
        messageHelper.setText(mailContent, true);
        mailSender.send(message);
    }

    public void sendPasswordResetVerificationEmail(String url, User newUser) throws MessagingException, UnsupportedEncodingException {
        String subject = "Password Reset Request Verification";
        String senderName = "Webstore Application Test Service";

        String mailContent = "<p> Hi, "+ newUser.getFirstName()+ ", </p>"+
                "<p><b>You recently requested to reset your password,</b>"+
                "Please, follow the link below to complete the action.</p>"+
                "<a href=\"" +url+ "\">Reset password</a>"+
                "<p> Webstore Application Test Service";
        MimeMessage message = mailSender.createMimeMessage();
        var messageHelper = new MimeMessageHelper(message);
        messageHelper.setFrom(EmailUser, senderName);
        messageHelper.setTo(newUser.getEmail());
        messageHelper.setSubject(subject);
        messageHelper.setText(mailContent, true);
        mailSender.send(message);
    }
}
