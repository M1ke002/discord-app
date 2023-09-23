package com.example.discordclonebackend.service;

import com.example.discordclonebackend.dto.ChannelDto;
import com.example.discordclonebackend.dto.request.ChannelRequest;

public interface ChannelService {
    public ChannelDto getChannelById(Long channelId);

    public Boolean deleteChannel(Long channelId, Long userId, Long serverId);

    public ChannelDto createChannel(ChannelRequest channelRequest);

    public ChannelDto editChannel(Long channelId, ChannelRequest channelRequest);
}
