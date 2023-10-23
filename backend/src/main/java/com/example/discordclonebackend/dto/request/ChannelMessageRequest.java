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

    public ChannelMessageRequest(String content, Long channelId, Long userId) {
        this.content = content;
        this.channelId = channelId;
        this.userId = userId;
    }

    public ChannelMessageRequest(String content, String fileUrl, Long channelId, Long userId) {
        this.content = content;
        this.fileUrl = fileUrl;
        this.channelId = channelId;
        this.userId = userId;
    }

    public ChannelMessageRequest(String content, Long channelId, Long userId, Long replyToMessageId) {
        this.content = content;
        this.channelId = channelId;
        this.userId = userId;
        this.replyToMessageId = replyToMessageId;
    }

}
