package com.Craza.WebstoreProject.security;
import javax.servlet.http.HttpServletResponse;

import com.Craza.WebstoreProject.JWT.JWTFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;

@RequiredArgsConstructor
@Configuration
@EnableWebSecurity

public class UserRegistrationSecurityConfig  {

    private final JWTFilter jwtFilter;

    @Bean
    public PasswordEncoder passwordEncoder()
    {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        return http.cors()
                .and().csrf().disable()
                .authorizeHttpRequests()
                .requestMatchers("api/auth/**").permitAll()
                .requestMatchers("api/v1/**").permitAll()// New
                .and()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and() //New
                .exceptionHandling().authenticationEntryPoint(((request, response, ex) ->
                {response.sendError(HttpServletResponse.SC_UNAUTHORIZED, ex.getMessage());}))
                .and() // New
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class) // New
                .authorizeHttpRequests()
                .requestMatchers("/users/**")
                .hasAnyAuthority("USER", "ADMIN")
                .and().formLogin().and().build();
    }


}
