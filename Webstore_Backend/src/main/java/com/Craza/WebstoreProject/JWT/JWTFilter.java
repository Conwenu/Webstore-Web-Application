package com.Craza.WebstoreProject.JWT;

import com.Craza.WebstoreProject.security.UserRegistrationDetailsService;
import com.Craza.WebstoreProject.user.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JWTFilter extends OncePerRequestFilter {
    private final UserRepository userRepository;
    private final  UserRegistrationDetailsService userRegistrationDetailsService;

    private final JWTService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token  = null;
        String username = null;
        if (authHeader != null && authHeader.startsWith("Bearer "))
        {
            token = authHeader.substring(7);
            username = jwtService.extractUsername(token);
        }

        if(username != null && SecurityContextHolder.getContext().getAuthentication() == null)
        {
            UserDetails userDetails = userRegistrationDetailsService.loadUserByUsername(username);

            if(jwtService.validateToken(token,userDetails))
            {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails,null,userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }
        filterChain.doFilter(request, response);
    }

//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
//            throws ServletException, IOException {
//        if (request.getCookies() == null) {
//            chain.doFilter(request, response);
//            return ;
//        }
//        // Get authorization header and validate
//        Optional<Cookie> jwtOpt = Arrays.stream(request.getCookies())
//                .filter(cookie -> "jwt".equals(cookie.getName()))
//                .findAny();
//
//        if (jwtOpt.isEmpty()) {
//            chain.doFilter(request, response);
//            return;
//        }
//
//        String token = jwtOpt.get().getValue();
//        UserRegistrationDetails userRegistrationDetails = null;
//        try {
//            Optional<User> appUserOpt = userRepository.findByEmail(jwtUtil.getUsernameFromToken(token));
//        } catch (ExpiredJwtException | SignatureException e) {
//            chain.doFilter(request, response);
//            return;
//        }
//
//        // Get jwt token and validate
//        if (!jwtUtil.validateToken(token, userRegistrationDetails)) {
//            chain.doFilter(request, response);
//            return;
//        }
//
//        UsernamePasswordAuthenticationToken
//                authentication = new UsernamePasswordAuthenticationToken(
//                        userRegistrationDetails, null,
//                userRegistrationDetails == null ? List.of() : userRegistrationDetails.getAuthorities());
//
//        authentication.setDetails(
//                new WebAuthenticationDetailsSource().buildDetails(request)
//        );
//
//        // this is where the authentication magic happens and the user is now valid!
//        SecurityContextHolder.getContext().setAuthentication(authentication);
//
//        chain.doFilter(request, response);
//
//    }




}


