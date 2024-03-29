package com.example.discordclonebackend.controller;

import com.example.discordclonebackend.dto.JwtToken;
import com.example.discordclonebackend.dto.request.RefreshTokenRequest;
import com.example.discordclonebackend.dto.response.AuthResponse;
import com.example.discordclonebackend.dto.request.LoginRequest;
import com.example.discordclonebackend.dto.request.RegisterRequest;
import com.example.discordclonebackend.dto.response.RefreshTokenResponse;
import com.example.discordclonebackend.dto.response.StringResponse;
import com.example.discordclonebackend.security.CustomUserDetails;
import com.example.discordclonebackend.security.JwtUtils;
import com.example.discordclonebackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
//@CrossOrigin(origins = "{http://localhost:3000, http://localhost:3000/**}", allowCredentials = "true")
public class AuthController {

    @Value("${jwt.accessTokenCookieName}")
    private String accessTokenCookieName;

    @Value("${jwt.refreshTokenCookieName}")
    private String refreshTokenCookieName;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication  = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
//        System.out.println("Successfully authenticated. Security context contains: " +
//                SecurityContextHolder.getContext().getAuthentication().getPrincipal().toString());
        //authentication.getPrincipal() returns the logged in user details object
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal(); //change to custom user details
//        System.out.println("User = " + userDetails);
        //generate jwt token
        JwtToken accessToken = jwtUtils.generateToken(authentication, "accessToken");
        JwtToken refreshToken = jwtUtils.generateToken(authentication, "refreshToken");
        System.out.println("accessToken = " + accessToken);
        System.out.println("refreshToken = " + refreshToken);
        return ResponseEntity.ok(
                new AuthResponse(
                        userDetails.getId(),
                        userDetails.getUsername(),
                        userDetails.getNickname(),
                        userDetails.getFile(),
                        accessToken.getToken(),
                        refreshToken.getToken(),
                        "Bearer"
                )
        );
    }

    @PostMapping("/register")
    public ResponseEntity<StringResponse> register(@RequestBody RegisterRequest registerRequest) {
        if (userService.existsByUsername(registerRequest.getUsername()))
            return ResponseEntity.badRequest().body(new StringResponse("Username is already taken"));
        String result = userService.register(registerRequest);
        return ResponseEntity.ok(new StringResponse(result));
    }

    @PostMapping("/refreshToken")
    public ResponseEntity<?> getRefreshToken(
            @RequestBody RefreshTokenRequest refreshTokenRequest) {
        String refreshToken = refreshTokenRequest.getRefreshToken();
        //check if the refresh token is valid and not expired
        if (jwtUtils.validateToken(refreshToken)) {
            //get the username from the refresh token
            String username = jwtUtils.getUsernameFromJwtToken(refreshToken);
            //get the user details from the username associated with the refresh token
            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    username, null, null
            );
            //generate new access token
            JwtToken newAccessToken = jwtUtils.generateToken(authentication, "accessToken");
            JwtToken newRefreshToken = jwtUtils.generateToken(authentication, "refreshToken");
//            return ResponseEntity.ok(new RefreshTokenResponse(accessToken, refreshToken));
            return ResponseEntity.ok(
                    new RefreshTokenResponse(
                            newAccessToken.getToken(),
                            newRefreshToken.getToken(),
                            "Bearer"
                    )
            );
        }
        return ResponseEntity.badRequest().body(new StringResponse("Invalid refresh token"));
    }

    @GetMapping("/test")
    public ResponseEntity<StringResponse> test() {
        return ResponseEntity.ok(new StringResponse("Test successful"));
    }
}
