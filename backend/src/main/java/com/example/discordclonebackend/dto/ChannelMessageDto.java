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
    private FileDto file;
    private UserDto sender;
    private Long channelId;
    private ChannelMessageDto replyToMessage;
    private boolean hasReplyMessage;
    private Date createdAt;
    private Date updatedAt;

    //this constructor is used for the replyToMessage property since we don't need all the properties of the ChannelMessageDto
    public ChannelMessageDto(Long id, String content, FileDto file, Long channelId, UserDto sender) {
        this.id = id;
        this.content = content;
        this.file = file;
        this.channelId = channelId;
        this.sender = sender;
    }
}
