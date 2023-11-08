package com.example.discordclonebackend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChannelMessageRequest {
    private String content;
    private String fileName;
    private String fileUrl;
    private String fileKey;
    private Long replyToMessageId; //optional
    private Long channelId;
    private Long userId;
    private Long serverId;
}
