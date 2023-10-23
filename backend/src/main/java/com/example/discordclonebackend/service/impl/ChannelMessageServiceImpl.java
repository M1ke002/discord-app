package com.example.discordclonebackend.service.impl;

import com.example.discordclonebackend.dto.ChannelMessageDto;
import com.example.discordclonebackend.dto.request.ChannelMessageRequest;
import com.example.discordclonebackend.dto.response.ChannelMessageResponse;
import com.example.discordclonebackend.entity.ChannelMessage;
import com.example.discordclonebackend.repository.ChannelMessageRepository;
import com.example.discordclonebackend.repository.ChannelRepository;
import com.example.discordclonebackend.repository.UserRepository;
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

    private final static Integer PAGE_SIZE = 5;

    @Autowired
    private ChannelMessageRepository channelMessageRepository;

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ChannelMessageResponse getMessages(Integer page, Long channelId) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("createdAt").descending());
        Page<ChannelMessage> channelMessagesPage = channelMessageRepository.findAllByChannelId(channelId, pageable);
        List<ChannelMessageDto> channelMessageDtos = channelMessagesPage.stream().map(channelMessage -> {
            ChannelMessageDto channelMessageDto = new ChannelMessageDto();
            channelMessageDto.setId(channelMessage.getId());
            channelMessageDto.setChannelId(channelMessage.getChannel().getId());
            channelMessageDto.setUserId(channelMessage.getUser().getId());
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
        //check if channel exists
        if (!channelRepository.existsById(channelMessageRequest.getChannelId())) {
            System.out.println("Channel does not exist");
            return null;
        }
        //check if user exists
        if (!userRepository.existsById(channelMessageRequest.getUserId())) {
            System.out.println("User does not exist");
            return null;
        }
        ChannelMessage channelMessage = new ChannelMessage();
        channelMessage.setContent(channelMessageRequest.getContent());
        channelMessage.setFileUrl(channelMessageRequest.getFileUrl());
        channelMessage.setReplyToMessage(channelMessageRequest.getReplyToMessageId() != null ? channelMessageRepository.findById(channelMessageRequest.getReplyToMessageId()).orElse(null) : null);
        channelMessage.setChannel(channelRepository.findById(channelMessageRequest.getChannelId()).orElse(null));
        channelMessage.setUser(userRepository.findById(channelMessageRequest.getUserId()).orElse(null));
        channelMessage = channelMessageRepository.save(channelMessage);
        ChannelMessageDto channelMessageDto = new ChannelMessageDto();
        channelMessageDto.setId(channelMessage.getId());
        channelMessageDto.setChannelId(channelMessage.getChannel().getId());
        channelMessageDto.setUserId(channelMessage.getUser().getId());
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
        //update message content
        channelMessage.setContent(channelMessageRequest.getContent());
        channelMessage.setFileUrl(channelMessageRequest.getFileUrl());
        channelMessage = channelMessageRepository.save(channelMessage);
        ChannelMessageDto channelMessageDto = new ChannelMessageDto();
        channelMessageDto.setId(channelMessage.getId());
        channelMessageDto.setChannelId(channelMessage.getChannel().getId());
        channelMessageDto.setUserId(channelMessage.getUser().getId());
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
