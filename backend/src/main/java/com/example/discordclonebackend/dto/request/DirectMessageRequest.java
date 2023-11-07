package com.example.discordclonebackend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DirectMessageRequest {
    private Long userId1;
    private Long userId2;
    private Long senderId; //user id of the sender, either userId1 or userId2
    private String content;
    private String fileUrl; //optional
    private String fileKey; //optional
    private Long replyToMessageId; //optional
}
