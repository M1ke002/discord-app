package com.example.discordclonebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DirectMessageDto {
    private Long id;
    private String content;
    private String fileUrl;
    private UserDto sender;
    private DirectMessageDto replyToMessage;
    private boolean hasReplyMessage;
    private boolean newConversation = false;
    private Date createdAt;
    private Date updatedAt;

    //this constructor is used for the replyToMessage property since we don't need all the properties of the DirectMessageDto
    public DirectMessageDto(Long id, String content, String fileUrl, UserDto sender) {
        this.id = id;
        this.content = content;
        this.fileUrl = fileUrl;
        this.sender = sender;
    }
}
