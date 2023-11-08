package com.example.discordclonebackend.dto.response;

import com.example.discordclonebackend.dto.FileDto;
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
    private FileDto file;
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
}
