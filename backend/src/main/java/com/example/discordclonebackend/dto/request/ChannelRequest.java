package com.example.discordclonebackend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChannelRequest {
    private Long userId;
    private Long serverId;
    private Long categoryId;
    private String name;
    private String type;
}
