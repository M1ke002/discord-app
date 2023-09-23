package com.example.discordclonebackend.dto;

import com.example.discordclonebackend.entity.ChannelType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChannelDto {
    private Long id;
    private String name;
    private Long serverId;
    private Long categoryId;
    private ChannelType type;
    private Date createdAt;
    private Date updatedAt;
}
