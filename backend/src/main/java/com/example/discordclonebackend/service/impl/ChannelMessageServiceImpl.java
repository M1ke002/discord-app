package com.example.discordclonebackend.service.impl;

import com.example.discordclonebackend.dto.ChannelMessageDto;
import com.example.discordclonebackend.dto.ServerMemberDto;
import com.example.discordclonebackend.dto.request.ChannelMessageRequest;
import com.example.discordclonebackend.dto.response.ChannelMessageResponse;
import com.example.discordclonebackend.entity.Channel;
import com.example.discordclonebackend.entity.ChannelMessage;
import com.example.discordclonebackend.entity.User;
import com.example.discordclonebackend.entity.UserServerMapping;
import com.example.discordclonebackend.repository.*;
import com.example.discordclonebackend.service.ChannelMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChannelMessageServiceImpl implements ChannelMessageService {

    private final static Integer PAGE_SIZE = 10;

    @Autowired
    private ChannelMessageRepository channelMessageRepository;

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServerRepository serverRepository;

    @Autowired
    private UserServerMappingRepository userServerMappingRepository;

    @Override
    public ChannelMessageResponse getMessages(Integer page, Long channelId, Long serverId) {
        //check if server exists
        if (!serverRepository.existsById(serverId)) {
            System.out.println("Server doesn't exist");
            return null;
        }

        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("createdAt").descending());
        Page<ChannelMessage> channelMessagesPage = channelMessageRepository.findAllByChannelId(channelId, pageable);
        List<ChannelMessageDto> channelMessageDtos = channelMessagesPage.stream().map(channelMessage -> {
            ChannelMessageDto channelMessageDto = new ChannelMessageDto();
            channelMessageDto.setId(channelMessage.getId());
            channelMessageDto.setChannelId(channelMessage.getChannel().getId());
            User sender = channelMessage.getUser();
            UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(sender.getId(), serverId);
            channelMessageDto.setSender(new ServerMemberDto(
                    sender.getId(),
                    sender.getUsername(),
                    sender.getNickname(),
                    sender.getAvatarUrl(),
                    userServerMapping != null ? userServerMapping.getRole() : null,
                    sender.getCreatedAt(),
                    sender.getUpdatedAt()
            ));
            channelMessageDto.setFileUrl(channelMessage.getFileUrl());
            channelMessageDto.setContent(channelMessage.getContent());
            channelMessageDto.setReplyToMessageId(channelMessage.getReplyToMessage() != null ? channelMessage.getReplyToMessage().getId() : null);
            channelMessageDto.setCreatedAt(channelMessage.getCreatedAt());
            channelMessageDto.setDeleted(channelMessage.isDeleted());
            return channelMessageDto;
        }).collect(Collectors.toList());
        ChannelMessageResponse channelMessageResponse = new ChannelMessageResponse();
        channelMessageResponse.setMessages(channelMessageDtos);
        //check if there is a next page
        if (channelMessagesPage.hasNext()) {
            channelMessageResponse.setNextPage(page + 1);
        } else {
            channelMessageResponse.setNextPage(null);
        }

        return channelMessageResponse;
    }

    @Override
    public ChannelMessageDto createMessage(ChannelMessageRequest channelMessageRequest) {
        //check if server exists
        if (!serverRepository.existsById(channelMessageRequest.getServerId())) {
            System.out.println("Server doesn't exist");
            return null;
        }

        //check if channel exists
        Channel channel = channelRepository.findById(channelMessageRequest.getChannelId()).orElse(null);
        if (channel == null) {
            System.out.println("Channel does not exist");
            return null;
        }

        //check if user exists
        User user = userRepository.findById(channelMessageRequest.getUserId()).orElse(null);
        if (user == null) {
            System.out.println("User does not exist");
            return null;
        }

        UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(user.getId(), channelMessageRequest.getServerId());

        ChannelMessage channelMessage = new ChannelMessage();
        channelMessage.setContent(channelMessageRequest.getContent());
        channelMessage.setFileUrl(channelMessageRequest.getFileUrl());
        channelMessage.setReplyToMessage(channelMessageRequest.getReplyToMessageId() != null ? channelMessageRepository.findById(channelMessageRequest.getReplyToMessageId()).orElse(null) : null);
        channelMessage.setChannel(channel);
        channelMessage.setUser(user);
        channelMessage = channelMessageRepository.save(channelMessage);
        ChannelMessageDto channelMessageDto = new ChannelMessageDto();
        channelMessageDto.setId(channelMessage.getId());
        channelMessageDto.setChannelId(channelMessage.getChannel().getId());
        channelMessageDto.setSender(
                new ServerMemberDto(
                        user.getId(),
                        user.getUsername(),
                        user.getNickname(),
                        user.getAvatarUrl(),
                        userServerMapping != null ? userServerMapping.getRole() : null,
                        user.getCreatedAt(),
                        user.getUpdatedAt()
                )
        );
        channelMessageDto.setContent(channelMessage.getContent());
        channelMessageDto.setFileUrl(channelMessage.getFileUrl());
        channelMessageDto.setReplyToMessageId(channelMessage.getReplyToMessage() != null ? channelMessage.getReplyToMessage().getId() : null);
        channelMessageDto.setDeleted(channelMessage.isDeleted());
        channelMessageDto.setCreatedAt(channelMessage.getCreatedAt());
        return channelMessageDto;
    }

    @Override
    public ChannelMessageDto updateMessage(Long messageId, ChannelMessageRequest channelMessageRequest) {
        //check if message exists
        ChannelMessage channelMessage = channelMessageRepository.findById(messageId).orElse(null);
        if (channelMessage == null || channelMessage.isDeleted()) {
            System.out.println("Message does not exist");
            return null;
        }

        UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(channelMessageRequest.getUserId(), channelMessageRequest.getServerId());
        if (userServerMapping == null) {
            System.out.println("Cannot find user's role in server");
            return null;
        }

        //update message content
        channelMessage.setContent(channelMessageRequest.getContent());
        channelMessage.setFileUrl(channelMessageRequest.getFileUrl());
        channelMessage = channelMessageRepository.save(channelMessage);
        ChannelMessageDto channelMessageDto = new ChannelMessageDto();
        channelMessageDto.setId(channelMessage.getId());
        channelMessageDto.setChannelId(channelMessage.getChannel().getId());
        User sender = channelMessage.getUser();
        channelMessageDto.setSender(
                new ServerMemberDto(
                        sender.getId(),
                        sender.getUsername(),
                        sender.getNickname(),
                        sender.getAvatarUrl(),
                        userServerMapping.getRole(),
                        sender.getCreatedAt(),
                        sender.getUpdatedAt()
                )
        );
        channelMessageDto.setContent(channelMessage.getContent());
        channelMessageDto.setFileUrl(channelMessage.getFileUrl());
        channelMessageDto.setReplyToMessageId(channelMessage.getReplyToMessage() != null ? channelMessage.getReplyToMessage().getId() : null);
        channelMessageDto.setDeleted(channelMessage.isDeleted());
        channelMessageDto.setCreatedAt(channelMessage.getCreatedAt());
        return channelMessageDto;

    }

    @Override
    public Boolean deleteMessage(Long messageId) {
        //check if message exists
        ChannelMessage channelMessage = channelMessageRepository.findById(messageId).orElse(null);
        if (channelMessage == null || channelMessage.isDeleted()) {
            System.out.println("Message does not exist");
            return false;
        }
        //delete message
        channelMessage.setDeleted(true);
        channelMessageRepository.save(channelMessage);
        return true;
    }
}
