package com.example.discordclonebackend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRequest {
    private String username;
    private String nickname;
    private String avatarUrl;
    private String imageKey;
    private String currPassword;
    private String newPassword;
}
