package com.example.discordclonebackend.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        //called whenever an exception is thrown due to an unauthenticated user trying to access a resource that requires authentication
        //we’ll simply return a 401 unauthorized response
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Authentication is required!");
    }
}
