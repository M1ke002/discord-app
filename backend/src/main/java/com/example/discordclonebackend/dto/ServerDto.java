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
    private String imageUrl;
    private String imageKey;
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

    public ServerDto(Long id, String name, String imageUrl) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
    }

    public ServerDto(Long id, String name, String imageUrl, Long ownerId) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
        this.ownerId = ownerId;
    }
}
