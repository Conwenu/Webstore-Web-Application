package com.Craza.WebstoreProject.JWT;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

@Getter
@Setter
@RequiredArgsConstructor
public class JWTResponse {
    private String accessToken;
    private String type = "Bearer ";
    private String refreshToken;
    private String email;
    private String firstName;
    private String lastName;
    private String roles;
    private Long id;

    public JWTResponse(String accessToken, String type, String email, String firstName, String lastName, String roles, Long id) {
        this.accessToken = accessToken;
        this.type = type;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.roles = roles;
        this.id = id;
    }


    public JWTResponse(String accessToken, String refreshToken, Long id, String firstName, String lastName, String username, Collection<? extends GrantedAuthority> authorities) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = username;
        this.roles = authorities.toString();
    }

    public JWTResponse(String accessToken, Long id, String firstName, String lastName, String username, Collection<? extends GrantedAuthority> authorities) {
        this.accessToken = accessToken;
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = username;
        this.roles = authorities.toString();
    }
}
