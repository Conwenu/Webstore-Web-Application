package com.Craza.WebstoreProject.registration.password;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByToken(String passwordResetToken);

    Iterable<PasswordResetToken> findByUserId(Long userId);
}
