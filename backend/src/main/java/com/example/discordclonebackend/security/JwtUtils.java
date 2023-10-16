package com.example.discordclonebackend.security;


import com.example.discordclonebackend.dto.JwtToken;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtils {

    //set the expiration time for JWT token to 10 hours
//    private static final long JWT_EXPIRATION_MS = 36000000;
//    private static final String JWT_SECRET = "cat";

    //get values from application.properties
    @Value("${jwt.JWT_EXPIRATION_MS}")
    private long JWT_EXPIRATION_MS;
    @Value("${jwt.JWT_REFRESH_EXPIRATION_MS}")
    private long JWT_REFRESH_EXPIRATION_MS;
    @Value("${jwt.JWT_SECRET}")
    private String JWT_SECRET;
    public JwtToken generateToken(Authentication authentication, String tokenType) {
        String username = authentication.getName();
        Date currDate = new Date();
        Date expiryDate = null;
        Long duration = null;
        if (tokenType.equals("refreshToken")) {
            expiryDate = new Date(currDate.getTime() + JWT_REFRESH_EXPIRATION_MS);
            duration = JWT_REFRESH_EXPIRATION_MS / 1000;
        } else {
            expiryDate = new Date(currDate.getTime() + JWT_EXPIRATION_MS);
            duration = JWT_EXPIRATION_MS / 1000;
        }
        System.out.println("Duration = " + duration);
        String token = Jwts.builder()
                .setSubject(username)
                .setIssuedAt(currDate)
                .setExpiration(expiryDate)
                .signWith(SignatureAlgorithm.HS512, JWT_SECRET)
                .compact();
        return new JwtToken(
            tokenType.equals("refreshToken") ? JwtToken.TokenType.REFRESH : JwtToken.TokenType.ACCESS,
            token,
            duration
        );
    }

//    public String generateRefreshToken(Authentication authentication) {
//
//    }

    public String getUsernameFromJwtToken(String token) {
//        return Jwts.parser().setSigningKey(JWT_SECRET).parseClaimsJws(token).getBody().getSubject();
        return Jwts.parserBuilder().setSigningKey(JWT_SECRET).build().parseClaimsJws(token).getBody().getSubject();
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(JWT_SECRET).build().parse(token);
            return true;
        } catch (MalformedJwtException e) {
            System.out.println("Invalid JWT token: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.out.println("JWT token expired: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }
}

