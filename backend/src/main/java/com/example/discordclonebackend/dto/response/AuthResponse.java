package com.example.discordclonebackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
//TODO: remove unnecessary fields like nickname, avatarUrl?
public class AuthResponse {
    private Long userId;
    private String username;
    private String nickname;
    private String avatarUrl;
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
}
