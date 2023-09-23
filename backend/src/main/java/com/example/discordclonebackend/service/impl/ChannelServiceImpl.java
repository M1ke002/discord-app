package com.example.discordclonebackend.service.impl;

import com.example.discordclonebackend.dto.ChannelDto;
import com.example.discordclonebackend.dto.request.ChannelRequest;
import com.example.discordclonebackend.entity.*;
import com.example.discordclonebackend.repository.CategoryRepository;
import com.example.discordclonebackend.repository.ChannelRepository;
import com.example.discordclonebackend.repository.ServerRepository;
import com.example.discordclonebackend.repository.UserServerMappingRepository;
import com.example.discordclonebackend.service.ChannelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChannelServiceImpl implements ChannelService {

    @Autowired
    ChannelRepository channelRepository;

    @Autowired
    UserServerMappingRepository userServerMappingRepository;

    @Autowired
    ServerRepository serverRepository;

    @Autowired
    CategoryRepository categoryRepository;
    @Override
    public ChannelDto getChannelById(Long channelId) {
        Channel channel = channelRepository.findById(channelId).orElse(null);
        if (channel == null) {
            return null;
        }
        return new ChannelDto(
                channel.getId(),
                channel.getName(),
                channel.getServer().getId(),
                channel.getCategory().getId(),
                channel.getType(),
                channel.getCreatedAt(),
                channel.getUpdatedAt()
        );
    }

    @Override
    public Boolean deleteChannel(Long channelId, Long userId, Long serverId) {
        //check if user is ADMIN or MODERATOR of the server
        UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(userId, serverId);
        if (userServerMapping == null) {
            System.out.println("User is not a member of the server");
            return false;
        }
        if (!userServerMapping.getRole().equals(UserRole.MODERATOR) && !userServerMapping.getRole().equals(UserRole.ADMIN)) {
            System.out.println("User is not an ADMIN or MODERATOR of the server");
            return false;
        }
        Channel channel = channelRepository.findById(channelId).orElse(null);
        if (channel == null) {
            System.out.println("Channel does not exist");
            return false;
        }
        channelRepository.delete(channel);
        return true;
    }

    @Override
    public ChannelDto createChannel(ChannelRequest channelRequest) {
        //channel name cannot be "general"
        if (channelRequest.getName().equals("general")) {
            System.out.println("Channel name cannot be \"general\"");
            return null;
        }
        //check if user is ADMIN or MODERATOR of the server
        UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(
                channelRequest.getUserId(),
                channelRequest.getServerId());
        if (userServerMapping == null) {
            System.out.println("User is not a member of the server");
            return null;
        }
        if (!userServerMapping.getRole().equals(UserRole.MODERATOR) && !userServerMapping.getRole().equals(UserRole.ADMIN)) {
            System.out.println("User is not an ADMIN or MODERATOR of the server");
            return null;
        }
        //get server
        Server server = serverRepository.findById(channelRequest.getServerId()).orElse(null);
        if (server == null) {
            System.out.println("Server does not exist");
            return null;
        }
        //get category (can be optional). Only access database if categoryId is not null
        Category category = null;
        if (channelRequest.getCategoryId() != null) {
            category = categoryRepository.findById(channelRequest.getCategoryId()).orElse(null);
            if (category == null) {
                System.out.println("Category does not exist");
                return null;
            }
        }
        //create channel
        Channel channel = new Channel(
                channelRequest.getName(),
                server,
                category,
                ChannelType.valueOf(channelRequest.getType())
        );
        channelRepository.save(channel);
        return new ChannelDto(
                channel.getId(),
                channel.getName(),
                server.getId(),
                category != null ? category.getId() : null,
                channel.getType(),
                channel.getCreatedAt(),
                channel.getUpdatedAt()
        );
    }

    @Override
    public ChannelDto editChannel(Long channelId, ChannelRequest channelRequest) {
        //allow update channel name, type, category
        if (channelRequest.getName().equals("general")) {
            System.out.println("Channel name cannot be \"general\"");
            return null;
        }
        //check if user is ADMIN or MODERATOR of the server
        UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(
                channelRequest.getUserId(),
                channelRequest.getServerId());
        if (userServerMapping == null) {
            System.out.println("User is not a member of the server");
            return null;
        }
        if (!userServerMapping.getRole().equals(UserRole.MODERATOR) && !userServerMapping.getRole().equals(UserRole.ADMIN)) {
            System.out.println("User is not an ADMIN or MODERATOR of the server");
            return null;
        }
        //get channel
        Channel channel = channelRepository.findById(channelId).orElse(null);
        if (channel == null) {
            System.out.println("Channel does not exist");
            return null;
        }
        //get category (can be optional). Only access database if categoryId is not null
        Category category = null;
        if (channelRequest.getCategoryId() != null) {
            category = categoryRepository.findById(channelRequest.getCategoryId()).orElse(null);
            if (category == null) {
                System.out.println("Category does not exist");
                return null;
            }
        }
        //update channel
        channel.setName(channelRequest.getName());
        channel.setType(ChannelType.valueOf(channelRequest.getType()));
        channel.setCategory(category);
        channelRepository.save(channel);
        return new ChannelDto(
                channel.getId(),
                channel.getName(),
                channel.getServer().getId(),
                category != null ? category.getId() : null,
                channel.getType(),
                channel.getCreatedAt(),
                channel.getUpdatedAt()
        );
    }
}
