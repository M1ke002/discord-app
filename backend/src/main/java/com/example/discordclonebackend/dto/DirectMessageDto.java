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
    private FileDto file;
    private UserDto sender;
    private DirectMessageDto replyToMessage;
    private boolean hasReplyMessage;
    private boolean newConversation = false;
    private Date createdAt;
    private Date updatedAt;

    //this constructor is used for the replyToMessage property since we don't need all the properties of the DirectMessageDto
    public DirectMessageDto(Long id, String content, FileDto file, UserDto sender) {
        this.id = id;
        this.content = content;
        this.file = file;
        this.sender = sender;
    }
}
