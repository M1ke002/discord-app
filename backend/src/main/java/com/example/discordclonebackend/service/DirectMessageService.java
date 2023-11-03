package com.example.discordclonebackend.service;

import com.example.discordclonebackend.dto.DirectMessageDto;
import com.example.discordclonebackend.dto.request.DirectMessageRequest;
import com.example.discordclonebackend.dto.response.DirectMessageResponse;

public interface DirectMessageService {
    public DirectMessageResponse getMessages(Integer page, Long userId1, Long userId2);

    public DirectMessageDto createMessage(DirectMessageRequest directMessageRequest);

    public DirectMessageDto updateMessage(Long directMessageId, DirectMessageRequest directMessageRequest);

    public Boolean deleteMessage(Long directMessageId, Long userId, Long otherUserId);
}
