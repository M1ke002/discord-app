package com.example.discordclonebackend.service;

import com.example.discordclonebackend.dto.ChannelMessageDto;
import com.example.discordclonebackend.dto.request.ChannelMessageRequest;
import com.example.discordclonebackend.dto.response.ChannelMessageResponse;
import com.example.discordclonebackend.dto.response.SearchChannelMessageResponse;

import java.util.List;

public interface ChannelMessageService {
    public ChannelMessageResponse getMessages(Long cursor, Integer limit, String direction, Long channelId, Long serverId);

    public Long getMessagesCount(Long fromMessageId, Long toMessageId, Long channelId);

    public ChannelMessageDto createMessage(ChannelMessageRequest channelMessageRequest);

    public ChannelMessageDto updateMessage(Long messageId, ChannelMessageRequest channelMessageRequest);

    public Boolean deleteMessage(Long messageId, Long userId, Long serverId);

    public SearchChannelMessageResponse searchMessages(Integer page, Long userId, Boolean hasFile, String content, Long serverId);
}
