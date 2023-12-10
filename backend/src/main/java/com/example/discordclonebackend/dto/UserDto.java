package com.example.discordclonebackend.dto;

import com.example.discordclonebackend.entity.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String username;
    private String nickname;
    private FileDto file;
    private UserRole role;
    private List<ServerDto> servers;
    private Date createdAt;
    private Date updatedAt;

    public UserDto(Long id, String username, String nickname, FileDto file, Date createdAt, Date updatedAt) {
        this.id = id;
        this.username = username;
        this.nickname = nickname;
        this.file = file;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UserDto(Long id, String username, String nickname, FileDto file, List<ServerDto> serverDtos, Date createdAt, Date updatedAt) {
        this.id = id;
        this.username = username;
        this.nickname = nickname;
        this.file = file;
        this.servers = serverDtos;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UserDto(Long id, String username, String nickname, FileDto file, UserRole role, Date createdAt, Date updatedAt) {
        this.id = id;
        this.username = username;
        this.nickname = nickname;
        this.file = file;
        this.role = role;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
