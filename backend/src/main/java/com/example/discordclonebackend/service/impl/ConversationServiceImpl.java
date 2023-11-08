package com.example.discordclonebackend.service.impl;

import com.example.discordclonebackend.dto.ConversationDto;
import com.example.discordclonebackend.dto.FileDto;
import com.example.discordclonebackend.dto.UserDto;
import com.example.discordclonebackend.entity.Conversation;
import com.example.discordclonebackend.entity.User;
import com.example.discordclonebackend.repository.ConversationRepository;
import com.example.discordclonebackend.repository.UserRepository;
import com.example.discordclonebackend.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ConversationServiceImpl implements ConversationService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    ConversationRepository conversationRepository;

    @Override
    public List<ConversationDto> getConversationsForUser(Long userId) {
        //check if user exists
        if (!userRepository.existsById(userId)) {
            System.out.println("User does not exist");
            return null;
        }

        //get all conversations for user (user can be user1 or user2)
        List<Conversation> conversations = conversationRepository.findAllByUser1IdOrUser2Id(userId, userId);
        List<ConversationDto> conversationDtos = conversations.stream().map(conversation -> {
            ConversationDto conversationDto = new ConversationDto();
            conversationDto.setId(conversation.getId());
            conversationDto.setUser1Id(conversation.getUser1().getId());
            conversationDto.setUser2Id(conversation.getUser2().getId());

            User otherUser = conversation.getUser1().getId().equals(userId) ? conversation.getUser2() : conversation.getUser1();
            conversationDto.setOtherUser(
                    new UserDto(
                            otherUser.getId(),
                            otherUser.getUsername(),
                            otherUser.getNickname(),
                            otherUser.getFile() != null ? new FileDto(
                                    otherUser.getFile().getFileName(),
                                    otherUser.getFile().getFileUrl(),
                                    otherUser.getFile().getFileKey()
                            ) : null,
                            otherUser.getCreatedAt(),
                            otherUser.getUpdatedAt()
                    )
            );
            return conversationDto;
        }).toList();

        return conversationDtos;
    }
}
