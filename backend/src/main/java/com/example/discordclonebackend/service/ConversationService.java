package com.example.discordclonebackend.service;

import com.example.discordclonebackend.dto.ConversationDto;

import java.util.List;

public interface ConversationService {
    public List<ConversationDto> getConversationsForUser(Long userId);
}
