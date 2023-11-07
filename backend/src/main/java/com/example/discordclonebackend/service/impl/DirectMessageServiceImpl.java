package com.example.discordclonebackend.service.impl;

import com.example.discordclonebackend.dto.DirectMessageDto;
import com.example.discordclonebackend.dto.UserDto;
import com.example.discordclonebackend.dto.request.DirectMessageRequest;
import com.example.discordclonebackend.dto.response.DirectMessageResponse;
import com.example.discordclonebackend.entity.Conversation;
import com.example.discordclonebackend.entity.DirectMessage;
import com.example.discordclonebackend.entity.User;
import com.example.discordclonebackend.repository.ConversationRepository;
import com.example.discordclonebackend.repository.DirectMessageRepository;
import com.example.discordclonebackend.repository.UserRepository;
import com.example.discordclonebackend.service.DirectMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DirectMessageServiceImpl implements DirectMessageService {

    private final static Integer PAGE_SIZE = 15;

    @Autowired
    private DirectMessageRepository directMessageRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public DirectMessageResponse getMessages(Integer page, Long userId1, Long userId2) {
        //check if users exist
        if (!userRepository.existsById(userId1) || !userRepository.existsById(userId2)) {
            System.out.println("User 1 or 2 not found");
            return null;
        }

        //check if a conversation exists between the two users
        Conversation conversation = conversationRepository.findByUser1IdAndUser2Id(userId1, userId2);
        if (conversation == null) {
            conversation = conversationRepository.findByUser1IdAndUser2Id(userId2, userId1);
        }
        //conversation still not found -> return empty array of messages
        if (conversation == null) {
            System.out.println("Conversation not found");
            return new DirectMessageResponse(null);
        }

        //get messages
        Pageable pageable = PageRequest.of(page, PAGE_SIZE, Sort.by("createdAt").descending());
        Page<DirectMessage> directMessagesPage = directMessageRepository.findAllByConversationId(conversation.getId(), pageable);
        List<DirectMessageDto> directMessageDtos = directMessagesPage.stream().map(directMessage -> {
            DirectMessageDto directMessageDto = new DirectMessageDto();
            directMessageDto.setId(directMessage.getId());
            directMessageDto.setContent(directMessage.getContent());
            directMessageDto.setFileUrl(directMessage.getFileUrl());
            directMessageDto.setFileKey(directMessage.getFileKey());
            User sender = directMessage.getUser();
            directMessageDto.setSender(new UserDto(
                    sender.getId(),
                    sender.getUsername(),
                    sender.getNickname(),
                    sender.getAvatarUrl(),
                    sender.getCreatedAt(),
                    sender.getUpdatedAt()
            ));

            //get the replyToMessage if it exists
            DirectMessage replyToMessage = directMessage.getReplyToMessage();
            if (replyToMessage != null) {
                User replyToMessageSender = replyToMessage.getUser();
                directMessageDto.setReplyToMessage(
                        new DirectMessageDto(
                                replyToMessage.getId(),
                                replyToMessage.getContent(),
                                replyToMessage.getFileUrl(),
                                replyToMessage.getFileKey(),
                                new UserDto(
                                        replyToMessageSender.getId(),
                                        replyToMessageSender.getUsername(),
                                        replyToMessageSender.getNickname(),
                                        replyToMessageSender.getAvatarUrl(),
                                        replyToMessageSender.getCreatedAt(),
                                        replyToMessageSender.getUpdatedAt()
                                )
                        )
                );
            } else {
                directMessageDto.setReplyToMessage(null);
            }
            directMessageDto.setHasReplyMessage(directMessage.isHasReplyMessage());
            directMessageDto.setCreatedAt(directMessage.getCreatedAt());
            directMessageDto.setUpdatedAt(directMessage.getUpdatedAt());
            return directMessageDto;
        }).collect(Collectors.toList());

        DirectMessageResponse directMessageResponse = new DirectMessageResponse();
        directMessageResponse.setMessages(directMessageDtos);
        if (directMessagesPage.hasNext()) {
            directMessageResponse.setNextPage(page + 1);
        } else {
            directMessageResponse.setNextPage(null);
        }
        return directMessageResponse;
    }

    @Override
    public DirectMessageDto createMessage(DirectMessageRequest directMessageRequest) {
        boolean isNewConversation = false;

        //can't send a message to yourself
        if (directMessageRequest.getUserId1().equals(directMessageRequest.getUserId2())) {
            System.out.println("Can't send a message to yourself");
            return null;
        }

        //check if the sender is one of the two users
        if (!directMessageRequest.getUserId1().equals(directMessageRequest.getSenderId()) && !directMessageRequest.getUserId2().equals(directMessageRequest.getSenderId())) {
            System.out.println("User is not authorized to send a message");
            return null;
        }

        //check if users exist
        User user1 = userRepository.findById(directMessageRequest.getUserId1()).orElse(null);
        User user2 = userRepository.findById(directMessageRequest.getUserId2()).orElse(null);
        if (user1 == null || user2 == null) {
            System.out.println("User 1 or 2 not found");
            return null;
        }

        User sender = user1.getId().equals(directMessageRequest.getSenderId()) ? user1 : user2;

        //check if a conversation exists between the two users
        Conversation conversation = conversationRepository.findByUser1IdAndUser2Id(directMessageRequest.getUserId1(), directMessageRequest.getUserId2());
        if (conversation == null) {
            conversation = conversationRepository.findByUser1IdAndUser2Id(directMessageRequest.getUserId2(), directMessageRequest.getUserId1());
        }

        //conversation still not found -> create a new conversation
        if (conversation == null) {
            Conversation newConversation = new Conversation();
            newConversation.setUser1(user1);
            newConversation.setUser2(user2);
            conversation = conversationRepository.save(newConversation);
            isNewConversation = true;
        }

        //create the message
        DirectMessage directMessage = new DirectMessage();
        directMessage.setContent(directMessageRequest.getContent());
        directMessage.setFileUrl(directMessageRequest.getFileUrl());
        directMessage.setFileKey(directMessageRequest.getFileKey());
        directMessage.setConversation(conversation);
        directMessage.setUser(sender);

        DirectMessage replyToMessage = directMessageRequest.getReplyToMessageId() != null ? directMessageRepository.findById(directMessageRequest.getReplyToMessageId()).orElse(null) : null;
        directMessage.setReplyToMessage(replyToMessage);
        directMessage.setHasReplyMessage(replyToMessage != null);
        directMessage = directMessageRepository.save(directMessage);

        DirectMessageDto directMessageDto = new DirectMessageDto();
        directMessageDto.setId(directMessage.getId());
        directMessageDto.setContent(directMessage.getContent());
        directMessageDto.setFileUrl(directMessage.getFileUrl());
        directMessageDto.setFileKey(directMessage.getFileKey());
        directMessageDto.setSender(new UserDto(
                sender.getId(),
                sender.getUsername(),
                sender.getNickname(),
                sender.getAvatarUrl(),
                sender.getCreatedAt(),
                sender.getUpdatedAt()
        ));

        //get the replyToMessage if it exists
        if (replyToMessage != null) {
            User replyToMessageSender = replyToMessage.getUser();
            directMessageDto.setReplyToMessage(
                    new DirectMessageDto(
                            replyToMessage.getId(),
                            replyToMessage.getContent(),
                            replyToMessage.getFileUrl(),
                            replyToMessage.getFileKey(),
                            new UserDto(
                                    replyToMessageSender.getId(),
                                    replyToMessageSender.getUsername(),
                                    replyToMessageSender.getNickname(),
                                    replyToMessageSender.getAvatarUrl(),
                                    replyToMessageSender.getCreatedAt(),
                                    replyToMessageSender.getUpdatedAt()
                            )
                    )
            );
        } else {
            directMessageDto.setReplyToMessage(null);
        }
        directMessageDto.setHasReplyMessage(directMessage.isHasReplyMessage());
        directMessageDto.setNewConversation(isNewConversation);
        directMessageDto.setCreatedAt(directMessage.getCreatedAt());
        directMessageDto.setUpdatedAt(directMessage.getUpdatedAt());
        return directMessageDto;
    }

    @Override
    public DirectMessageDto updateMessage(Long directMessageId, DirectMessageRequest directMessageRequest) {
        //check if the message exists
        DirectMessage directMessage = directMessageRepository.findById(directMessageId).orElse(null);
        if (directMessage == null) {
            System.out.println("Message not found");
            return null;
        }

        //check if the sender is authorized to update the message
        if (!directMessage.getUser().getId().equals(directMessageRequest.getSenderId())) {
            System.out.println("User is not authorized to update this message");
            return null;
        }

        //update the message
        directMessage.setContent(directMessageRequest.getContent());
        directMessage.setUpdatedAt(new Date());
        directMessage = directMessageRepository.save(directMessage);

        DirectMessageDto directMessageDto = new DirectMessageDto();
        directMessageDto.setId(directMessage.getId());
        directMessageDto.setContent(directMessage.getContent());
        directMessageDto.setFileUrl(directMessage.getFileUrl());
        directMessageDto.setFileKey(directMessage.getFileKey());
        User sender = directMessage.getUser();
        directMessageDto.setSender(new UserDto(
                sender.getId(),
                sender.getUsername(),
                sender.getNickname(),
                sender.getAvatarUrl(),
                sender.getCreatedAt(),
                sender.getUpdatedAt()
        ));

        //get the replyToMessage if it exists
        DirectMessage replyToMessage = directMessage.getReplyToMessage();
        if (replyToMessage != null) {
            User replyToMessageSender = replyToMessage.getUser();
            directMessageDto.setReplyToMessage(
                    new DirectMessageDto(
                            replyToMessage.getId(),
                            replyToMessage.getContent(),
                            replyToMessage.getFileUrl(),
                            replyToMessage.getFileKey(),
                            new UserDto(
                                    replyToMessageSender.getId(),
                                    replyToMessageSender.getUsername(),
                                    replyToMessageSender.getNickname(),
                                    replyToMessageSender.getAvatarUrl(),
                                    replyToMessageSender.getCreatedAt(),
                                    replyToMessageSender.getUpdatedAt()
                            )
                    )
            );
        } else {
            directMessageDto.setReplyToMessage(null);
        }
        directMessageDto.setHasReplyMessage(directMessage.isHasReplyMessage());
        directMessageDto.setCreatedAt(directMessage.getCreatedAt());
        directMessageDto.setUpdatedAt(directMessage.getUpdatedAt());
        return directMessageDto;
    }

    @Override
    public Boolean deleteMessage(Long directMessageId, Long userId, Long otherUserId) {
        //check if the message exists
        DirectMessage directMessage = directMessageRepository.findById(directMessageId).orElse(null);
        if (directMessage == null) {
            System.out.println("Message not found");
            return false;
        }

        //check if the sender is authorized to delete the message
        if (!directMessage.getUser().getId().equals(userId)) {
            System.out.println("User is not authorized to delete this message");
            return false;
        }

        //check if a conversation exists between the two users
        Conversation conversation = conversationRepository.findByUser1IdAndUser2Id(userId, otherUserId);
        if (conversation == null) {
            conversation = conversationRepository.findByUser1IdAndUser2Id(otherUserId, userId);
        }

        if (conversation == null) {
            System.out.println("Conversation not found");
            return false;
        }

        //check if the message belongs to the conversation
        if (!directMessage.getConversation().getId().equals(conversation.getId())) {
            System.out.println("Message does not belong to the conversation");
            return false;
        }

        //delete the message
        directMessageRepository.delete(directMessage);
        return true;
    }
}
