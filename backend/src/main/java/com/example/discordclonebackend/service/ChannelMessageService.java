package com.example.discordclonebackend.service;

import com.example.discordclonebackend.dto.ChannelMessageDto;
import com.example.discordclonebackend.dto.request.ChannelMessageRequest;
import com.example.discordclonebackend.dto.response.ChannelMessageResponse;

import java.util.List;

public interface ChannelMessageService {
    public ChannelMessageResponse getMessages(Integer page, Long channelId, Long serverId);

    public ChannelMessageDto createMessage(ChannelMessageRequest channelMessageRequest);

    public ChannelMessageDto updateMessage(Long messageId, ChannelMessageRequest channelMessageRequest);

    public Boolean deleteMessage(Long messageId, Long userId, Long serverId);
}
