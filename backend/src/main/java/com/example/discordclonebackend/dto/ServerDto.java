package com.example.discordclonebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServerDto {
    private Long id;
    private String name;
    private FileDto file;
    private String inviteCode;
    private Long ownerId;
    private Date createdAt;
    private Date updatedAt;
    //need a list of users
    private List<ServerMemberDto> users;
    //list of channels
    private List<ChannelDto> channels;
    //list of categories
    private List<CategoryDto> categories;

    public ServerDto(Long id, String name, FileDto file) {
        this.id = id;
        this.name = name;
        this.file = file;
    }

    public ServerDto(Long id, String name, FileDto file, Long ownerId) {
        this.id = id;
        this.name = name;
        this.file = file;
        this.ownerId = ownerId;
    }
}
