package com.example.discordclonebackend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChannelMessageRequest {
    private String content;
    private String fileUrl; //optional
    private Long replyToMessageId; //optional
    private Long channelId;
    private Long userId;
    private Long serverId;
}