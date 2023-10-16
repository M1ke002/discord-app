package com.example.discordclonebackend.security;

import com.example.discordclonebackend.dto.JwtToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtil {

    private HttpCookie createTokenCookie(String token, Long duration, String tokenCookieName) {
        return ResponseCookie.from(tokenCookieName, token)
                .httpOnly(true)
                .maxAge(duration)
                .path("/")
//                .sameSite("None")
                .build();
    }

    private HttpCookie deleteTokenCookie(String tokenCookieName) {
        return ResponseCookie.from(tokenCookieName, "")
                .httpOnly(true)
                .maxAge(0)
                .path("/")
//                .sameSite("None")
                .build();
    }

    public void addTokenCookieToHeader(HttpHeaders httpHeaders, JwtToken jwtToken, String tokenCookieName) {
        httpHeaders.add(HttpHeaders.SET_COOKIE, createTokenCookie(jwtToken.getToken(), jwtToken.getDuration(), tokenCookieName).toString());
    }

    public void deleteTokenCookieFromHeader(HttpHeaders httpHeaders, String tokenCookieName) {
        httpHeaders.add(HttpHeaders.SET_COOKIE, deleteTokenCookie(tokenCookieName).toString());
    }
}
