package com.example.discordclonebackend.dto;

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
}
