package com.example.discordclonebackend.dto;

import com.example.discordclonebackend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServerMemberDto {
    private Long id;
    private String username;
    private String nickname;
    private String avatarUrl;
    private UserRole role;
    private Date createdAt;
    private Date updatedAt;
}
