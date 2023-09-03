package com.Craza.WebstoreProject.auth;

import ch.qos.logback.core.util.Duration;
import com.Craza.WebstoreProject.JWT.*;
import com.Craza.WebstoreProject.exception.NullTokenException;
import com.Craza.WebstoreProject.security.UserRegistrationDetails;
import com.Craza.WebstoreProject.user.UserService;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import com.Craza.WebstoreProject.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    private final JWTUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JWTService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthCredentialRequest request)
    {

        try
        {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getEmail(),request.getPassword()));
            String token = jwtService.generateToken(request.getEmail());
            UserRegistrationDetails user = (UserRegistrationDetails) authentication.getPrincipal();
            user.setPassword(null);
            Date expData = (jwtService.extractExpiration(token));
            JWTResponse jwtResponse = new JWTResponse(token,user.getId(),user.getFirstName(),user.getLastName(),user.getUsername(),user.getAuthorities());
            ResponseCookie cookie = ResponseCookie.from("jwt_authorization", token)
                    .domain("localhost")
                    .path("/")
                    .maxAge(Duration.buildByDays(1).getMilliseconds())
                    .httpOnly(true)
                    .build();
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(jwtResponse);
        }
        catch (DisabledException e)
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("This Account Is Not Enabled, Please check your email to enable your account");
        }
        catch (BadCredentialsException e)
        {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Credentials");
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestParam String token,
                                           @AuthenticationPrincipal UserDetails user) {
        try {
                if(token == null || token.equals("undefined") || token.equals("null"))
                {
                    throw new NullTokenException("No Token has been provided");
                }
            String tempUser = jwtService.extractUsername(token);
            Optional<User> tempUser2 = userService.findByEmail(tempUser);
            if(tempUser2.isPresent())
            {
                UserRegistrationDetails temp3 = new UserRegistrationDetails(tempUser2.get());
                temp3.setPassword(null);
                Boolean isValidToken = jwtService.validateToken(token, temp3);

                return ResponseEntity.ok(isValidToken);
            }
            return ResponseEntity.ok(false);


        } catch (ExpiredJwtException | NullTokenException e) {
            return ResponseEntity.ok(false);
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout () {
        ResponseCookie cookie = ResponseCookie.from("jwt_authorization", "")
                .domain("localhost")
                .path("/")
                .maxAge(0)
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString()).body("ok");
    }

}
