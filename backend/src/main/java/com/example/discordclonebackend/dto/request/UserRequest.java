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
    private String fileName;
    private String fileUrl;
    private String fileKey;
    private String currPassword;
    private String newPassword;
}
