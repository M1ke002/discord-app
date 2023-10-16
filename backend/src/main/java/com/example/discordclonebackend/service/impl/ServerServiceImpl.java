package com.example.discordclonebackend.service.impl;

import com.example.discordclonebackend.dto.CategoryDto;
import com.example.discordclonebackend.dto.ChannelDto;
import com.example.discordclonebackend.dto.ServerDto;
import com.example.discordclonebackend.dto.ServerMemberDto;
import com.example.discordclonebackend.dto.request.ServerRequest;
import com.example.discordclonebackend.dto.response.JoinServerResponse;
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
        server.setImageKey(serverRequest.getImageKey());
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
        serverDto.setImageKey(server.getImageKey());
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
                    ServerMemberDto serverMemberDto = new ServerMemberDto();
                    serverMemberDto.setId(userServerMapping1.getUser().getId());
                    serverMemberDto.setUsername(userServerMapping1.getUser().getUsername());
                    serverMemberDto.setNickname(userServerMapping1.getUser().getNickname());
                    serverMemberDto.setRole(userServerMapping1.getRole());
                    serverMemberDto.setAvatarUrl(userServerMapping1.getUser().getAvatarUrl());
                    serverMemberDto.setCreatedAt(userServerMapping1.getUser().getCreatedAt());
                    serverMemberDto.setUpdatedAt(userServerMapping1.getUser().getUpdatedAt());
                    return serverMemberDto;
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
        serverDto.setImageKey(server.getImageKey());
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
                    ServerMemberDto serverMemberDto = new ServerMemberDto();
                    serverMemberDto.setId(userServerMapping.getUser().getId());
                    serverMemberDto.setUsername(userServerMapping.getUser().getUsername());
                    serverMemberDto.setNickname(userServerMapping.getUser().getNickname());
                    serverMemberDto.setRole(userServerMapping.getRole());
                    serverMemberDto.setAvatarUrl(userServerMapping.getUser().getAvatarUrl());
                    serverMemberDto.setCreatedAt(userServerMapping.getUser().getCreatedAt());
                    serverMemberDto.setUpdatedAt(userServerMapping.getUser().getUpdatedAt());
                    return serverMemberDto;
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
    public JoinServerResponse joinServer(String inviteCode, Long userId) {
        //check if user exists
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            System.out.println("User not found");
            return new JoinServerResponse(false, "Invalid userId", null);
        }
        //check if server exists and invite code is valid
        Server server = serverRepository.findByInviteCode(inviteCode);
        if (server == null) {
            System.out.println("Invite code is invalid");
            return new JoinServerResponse(false, "Invalid invite code", null);
        }
        //check if user is already a member of the server
        UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(userId, server.getId());
        if (userServerMapping != null) {
            System.out.println("User is already a member of the server");
            return new JoinServerResponse(false, "User is already a member of the server", server.getId());
        }
        //create user server mapping
        UserServerMapping newUserServerMapping = new UserServerMapping(
                user,
                server
        );
        userServerMappingRepository.save(newUserServerMapping);
        return new JoinServerResponse(true, "Joined server successfully", server.getId());
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
        server.setImageKey(serverRequest.getImageKey());
        serverRepository.save(server);
        return true;
    }

    @Override
    public Boolean kickUserFromServer(Long serverId, Long userId, Long adminId) {
        //check if admin is the admin of the server
        UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(adminId, serverId);
        if (userServerMapping == null) {
            System.out.println("Invalid Admin Id");
            return false;
        }
        if (!userServerMapping.getRole().equals(UserRole.MODERATOR) && !userServerMapping.getRole().equals(UserRole.ADMIN)) {
            System.out.println("User is not an ADMIN or MODERATOR of the server");
            return null;
        }
        //check if user to be kicked is a member of the server
        userServerMapping = userServerMappingRepository.findByUserIdAndServerId(userId, serverId);
        if (userServerMapping == null) {
            System.out.println("User is not a member of the server");
            return false;
        }
        //check if user to be kicked is an admin
        if (userServerMapping.getRole().equals(UserRole.ADMIN)) {
            System.out.println("Cannot kick an admin");
            return false;
        }
        userServerMappingRepository.delete(userServerMapping);
        return true;
    }

    @Override
    public Boolean changeUserRole(Long serverId, Long userId, Long adminId, String role) {
        //check if admin is the admin of the server
        UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(adminId, serverId);
        if (userServerMapping == null) {
            System.out.println("Invalid Admin Id");
            return false;
        }
        if (!userServerMapping.getRole().equals(UserRole.MODERATOR) && !userServerMapping.getRole().equals(UserRole.ADMIN)) {
            System.out.println("User is not an ADMIN or MODERATOR of the server");
            return null;
        }
        //check if user to change role is a member of the server
        userServerMapping = userServerMappingRepository.findByUserIdAndServerId(userId, serverId);
        if (userServerMapping == null) {
            System.out.println("User is not a member of the server");
            return false;
        }
        //check if user to change role is an admin
        if (userServerMapping.getRole().equals(UserRole.ADMIN)) {
            System.out.println("Cannot change the role of an admin");
            return false;
        }
        //check if role is valid
        try {
            UserRole userRole = UserRole.valueOf(role);
            if (userRole.equals(UserRole.ADMIN)) {
                System.out.println("Cannot change the role to admin");
                return false;
            }
            userServerMapping.setRole(userRole);
            userServerMappingRepository.save(userServerMapping);
            return true;
        } catch (IllegalArgumentException e) {
            System.out.println("Invalid role");
            return false;
        }
    }
}
