package com.example.discordclonebackend.service.impl;

import com.example.discordclonebackend.dto.CategoryDto;
import com.example.discordclonebackend.dto.ChannelDto;
import com.example.discordclonebackend.dto.ServerDto;
import com.example.discordclonebackend.dto.UserDto;
import com.example.discordclonebackend.dto.request.ServerRequest;
import com.example.discordclonebackend.entity.*;
import com.example.discordclonebackend.repository.ServerRepository;
import com.example.discordclonebackend.repository.UserRepository;
import com.example.discordclonebackend.repository.UserServerMappingRepository;
import com.example.discordclonebackend.service.ServerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

//parent-child relationship: parent is one, child is many -> one-to-many
//The cascade setting on the Parent works when you create a List of children
//and set it into the Parent and then save the Parent. Then the save operation will cascade from the Parent to the children

//CascadeType.All should be used on @OneToMany (the parent side), avoid using on @ManyToOne (the child side)

@Service
public class ServerServiceImpl implements ServerService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServerRepository serverRepository;

    @Autowired
    private UserServerMappingRepository userServerMappingRepository;

    @Override
    public ServerDto createServer(ServerRequest serverRequest) {
        Server server = new Server();
        server.setName(serverRequest.getServerName());
        server.setImageUrl(serverRequest.getImageUrl());
        //create invite code using uuid
        server.setInviteCode(UUID.randomUUID().toString());
        //create 3 categories by default: text channels, voice channels, video channels
        Category textCategory = new Category("Text channels", server);
        Category voiceCategory = new Category("Voice channels", server);
        Category videoCategory = new Category("Video channels", server);
        //create 3 channels by default: general, video, voice
        Channel generalChannel = new Channel("general", server, textCategory, ChannelType.TEXT);
        Channel videoChannel = new Channel("video", server, videoCategory, ChannelType.VIDEO);
        Channel voiceChannel = new Channel("voice", server, voiceCategory, ChannelType.VOICE);

//        textCategory.getChannels().add(generalChannel);
//        voiceCategory.getChannels().add(voiceChannel);
//        videoCategory.getChannels().add(videoChannel);

        server.getChannels().add(generalChannel);
        server.getChannels().add(videoChannel);
        server.getChannels().add(voiceChannel);
        server.getCategories().add(textCategory);
        server.getCategories().add(voiceCategory);
        server.getCategories().add(videoCategory);

        //get user from user id
        User user = userRepository.findById(serverRequest.getUserId()).orElse(null);
        if (user == null) {
            System.out.println("User not found");
            return null;
        }
        //set user as server owner
        server.setOwner(user);

        //create user server mapping
        UserServerMapping userServerMapping = new UserServerMapping();
        userServerMapping.setUser(user);
        userServerMapping.setServer(server);
        userServerMapping.setRole(UserRole.ADMIN);

        server.getUserServerMappings().add(userServerMapping);

        server = serverRepository.save(server);

        ServerDto serverDto = new ServerDto();
        serverDto.setId(server.getId());
        serverDto.setName(server.getName());
        serverDto.setImageUrl(server.getImageUrl());
        serverDto.setInviteCode(server.getInviteCode());
        serverDto.setOwnerId(server.getOwner().getId());
        serverDto.setCreatedAt(server.getCreatedAt());
        serverDto.setUpdatedAt(server.getUpdatedAt());

        //get channel list, convert to channel dto list
        serverDto.setChannels(
                server.getChannels().stream().map(channel -> {
                    ChannelDto channelDto = new ChannelDto();
                    channelDto.setId(channel.getId());
                    channelDto.setName(channel.getName());
                    channelDto.setType(channel.getType());
                    channelDto.setCreatedAt(channel.getCreatedAt());
                    channelDto.setUpdatedAt(channel.getUpdatedAt());
                    channelDto.setServerId(channel.getServer().getId());
                    channelDto.setCategoryId(channel.getCategory().getId());
                    return channelDto;
                }).collect(Collectors.toList())
        );

        //get category list, convert to category dto list
        serverDto.setCategories(
                server.getCategories().stream().map(category -> {
                    CategoryDto categoryDto = new CategoryDto();
                    categoryDto.setId(category.getId());
                    categoryDto.setName(category.getName());
                    categoryDto.setCreatedAt(category.getCreatedAt());
                    categoryDto.setUpdatedAt(category.getUpdatedAt());
                    categoryDto.setServerId(category.getId());
                    return categoryDto;
                }).collect(Collectors.toList())
        );

        //get user list, convert to user dto list
        serverDto.setUsers(
                server.getUserServerMappings().stream().map(userServerMapping1 -> {
                    UserDto userDto = new UserDto();
                    userDto.setId(userServerMapping1.getUser().getId());
                    userDto.setUsername(userServerMapping1.getUser().getUsername());
                    userDto.setNickname(userServerMapping1.getUser().getNickname());
                    userDto.setRole(userServerMapping1.getRole());
                    userDto.setAvatarUrl(userServerMapping1.getUser().getAvatarUrl());
                    userDto.setCreatedAt(userServerMapping1.getUser().getCreatedAt());
                    userDto.setUpdatedAt(userServerMapping1.getUser().getUpdatedAt());
                    return userDto;
                }).collect(Collectors.toList())
        );

        return serverDto;
    }

    @Override
    public Boolean deleteServer(Long serverId) {
        Server server = serverRepository.findById(serverId).orElse(null);
        if (server == null) {
            System.out.println("Server not found");
            return false;
        }
        serverRepository.delete(server);
        return true;
    }

    @Override
    public ServerDto getServerById(Long serverId) {
        Server server = serverRepository.findById(serverId).orElse(null);
        if (server == null) {
            return null;
        }
        ServerDto serverDto = new ServerDto();

        serverDto.setId(server.getId());
        serverDto.setName(server.getName());
        serverDto.setImageUrl(server.getImageUrl());
        serverDto.setInviteCode(server.getInviteCode());
        serverDto.setOwnerId(server.getOwner().getId());
        serverDto.setCreatedAt(server.getCreatedAt());
        serverDto.setUpdatedAt(server.getUpdatedAt());

        //get channel list, convert to channel dto list
        serverDto.setChannels(
                server.getChannels().stream().map(channel -> {
                    ChannelDto channelDto = new ChannelDto();
                    channelDto.setId(channel.getId());
                    channelDto.setName(channel.getName());
                    channelDto.setType(channel.getType());
                    channelDto.setCreatedAt(channel.getCreatedAt());
                    channelDto.setUpdatedAt(channel.getUpdatedAt());
                    channelDto.setServerId(server.getId());
                    channelDto.setCategoryId(channel.getCategory() == null ? null : channel.getCategory().getId());
                    return channelDto;
                }).collect(Collectors.toList())
        );
        //get category list, convert to category dto list
        serverDto.setCategories(
                server.getCategories().stream().map(category -> {
                    CategoryDto categoryDto = new CategoryDto();
                    categoryDto.setId(category.getId());
                    categoryDto.setName(category.getName());
                    categoryDto.setCreatedAt(category.getCreatedAt());
                    categoryDto.setUpdatedAt(category.getUpdatedAt());
                    categoryDto.setServerId(server.getId());
                    return categoryDto;
                }).collect(Collectors.toList())
        );
        //get user list, convert to user dto list
        serverDto.setUsers(
                server.getUserServerMappings().stream().map(userServerMapping -> {
                    UserDto userDto = new UserDto();
                    userDto.setId(userServerMapping.getUser().getId());
                    userDto.setUsername(userServerMapping.getUser().getUsername());
                    userDto.setNickname(userServerMapping.getUser().getNickname());
                    userDto.setRole(userServerMapping.getRole());
                    userDto.setAvatarUrl(userServerMapping.getUser().getAvatarUrl());
                    userDto.setCreatedAt(userServerMapping.getUser().getCreatedAt());
                    userDto.setUpdatedAt(userServerMapping.getUser().getUpdatedAt());
                    return userDto;
                }).collect(Collectors.toList())
        );
        return serverDto;
    }

    @Override
    public List<ServerDto> getAllServers(Long userId) {
        //find all servers that the user is a member of
        List<UserServerMapping> userServerMappings = userServerMappingRepository.findAllByUserId(userId);
        List<Server> servers = userServerMappings.stream().map(
                userServerMapping -> userServerMapping.getServer())
                .toList();
        //convert to server dto list
        List<ServerDto> serverDtos = servers.stream().map(server -> {
            return new ServerDto(
                    server.getId(),
                    server.getName(),
                    server.getImageUrl()
            );
        }).toList();
        return serverDtos;
    }

    @Override
    public String generateNewInviteCode(Long serverId) {
        Server server = serverRepository.findById(serverId).orElse(null);
        if (server == null) {
            System.out.println("Server not found");
            return null;
        }
        //create invite code using uuid
        server.setInviteCode(UUID.randomUUID().toString());
        serverRepository.save(server);
        return server.getInviteCode();
    }

    @Override
    public Boolean leaveServer(Long serverId, Long userId) {
        UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(userId, serverId);
        if (userServerMapping == null) {
            System.out.println("User is not a member of the server");
            return false;
        }
        if (userServerMapping.getRole() == UserRole.ADMIN) {
            System.out.println("Cannot leave server as admin");
            return false;
        }
        userServerMappingRepository.delete(userServerMapping);
        return true;
    }

    @Override
    public Boolean joinServer(Long serverId, String inviteCode, Long userId) {
        //check if user exists
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            System.out.println("User not found");
            return false;
        }
        //check if server exists and invite code is valid
        Server server = serverRepository.findByIdAndInviteCode(serverId, inviteCode);
        if (server == null) {
            System.out.println("Server not found or invite code is invalid");
            return false;
        }
        //check if user is already a member of the server
        UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(userId, serverId);
        if (userServerMapping != null) {
            System.out.println("User is already a member of the server");
            return false;
        }
        //create user server mapping
        UserServerMapping newUserServerMapping = new UserServerMapping(
                user,
                server
        );
        userServerMappingRepository.save(newUserServerMapping);
        return true;
    }

    @Override
    public Boolean updateServer(Long serverId, ServerRequest serverRequest) {
        //find server by id
        Server server = serverRepository.findById(serverId).orElse(null);
        if (server == null) {
            return false;
        }
        //update server name and image URL
        server.setName(serverRequest.getServerName());
        server.setImageUrl(serverRequest.getImageUrl());
        serverRepository.save(server);
        return true;
    }
}
