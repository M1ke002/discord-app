package com.example.discordclonebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChannelMessageDto {
    private Long id;
    private String content;
    private String fileUrl;
    private Long userId;
    private Long channelId;
    private Long replyToMessageId;
    private boolean isDeleted;
    private Date createdAt;
    private Date updatedAt;
}
