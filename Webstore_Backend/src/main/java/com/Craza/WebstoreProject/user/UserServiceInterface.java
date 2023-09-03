package com.Craza.WebstoreProject.user;

import com.Craza.WebstoreProject.registration.RegistrationRequest;
import com.Craza.WebstoreProject.registration.token.VerificationToken;

import java.util.List;
import java.util.Optional;

public interface UserServiceInterface {
    List<User> getUsers();
    User registerUser(RegistrationRequest request);

    void saveUserVerificationToken(User newUser, String verificationToken);
    Optional<User> findByEmail(String email);

    String validateToken(String verificationToken);

    Optional<User> findByEmailAndPassword(String email, String password);

    String validatePasswordResetToken(String token);

    User findUserByPasswordToken(String token);

    void createPasswordResetTokenForUser(User user, String passwordResetToken);

    boolean oldPasswordIsValid(User user, String oldPassword);

    VerificationToken generateNewVerificationToken(String oldToken);
}
