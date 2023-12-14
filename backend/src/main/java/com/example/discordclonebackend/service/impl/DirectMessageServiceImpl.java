package com.example.discordclonebackend.service.impl;

import com.example.discordclonebackend.dto.DirectMessageDto;
import com.example.discordclonebackend.dto.FileDto;
import com.example.discordclonebackend.dto.UserDto;
import com.example.discordclonebackend.dto.request.DirectMessageRequest;
import com.example.discordclonebackend.dto.response.DirectMessageResponse;
import com.example.discordclonebackend.entity.Conversation;
import com.example.discordclonebackend.entity.DirectMessage;
import com.example.discordclonebackend.entity.File;
import com.example.discordclonebackend.entity.User;
import com.example.discordclonebackend.repository.ConversationRepository;
import com.example.discordclonebackend.repository.DirectMessageRepository;
import com.example.discordclonebackend.repository.FileRepository;
import com.example.discordclonebackend.repository.UserRepository;
import com.example.discordclonebackend.service.DirectMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DirectMessageServiceImpl implements DirectMessageService {

    @Autowired
    private DirectMessageRepository directMessageRepository;

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public DirectMessageResponse getMessages(Long cursor, Integer limit, String direction, Long userId1, Long userId2) {
        if (!direction.equals("forward") && !direction.equals("backward") && !direction.equals("around")) {
            System.out.println("Invalid direction");
            return null;
        }

        //check if users exist
        if (!userRepository.existsById(userId1) || !userRepository.existsById(userId2)) {
            System.out.println("User 1 or 2 not found");
            return null;
        }

        if (cursor == null) {
            System.out.println("Cursor is null");
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
            return new DirectMessageResponse(null, null);
        }

        //get messages
        Page<DirectMessage> directMessagesPage = null;
        DirectMessageResponse directMessageResponse = new DirectMessageResponse();

        if (cursor == 0) {
            Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
            directMessagesPage = directMessageRepository.findAllByConversationId(conversation.getId(), pageable);
            directMessageResponse.setPreviousCursor(null);
            if (directMessagesPage.hasNext()) {
                //set the next cursor to the last message's id of the current page
                directMessageResponse.setNextCursor(directMessagesPage.getContent().get(directMessagesPage.getContent().size() - 1).getId());
            } else {
                directMessageResponse.setNextCursor(null);
            }
        } else {
            //get all the messages before the cursor message
            DirectMessage cursorMessage = directMessageRepository.findById(cursor).orElse(null);
            if (cursorMessage == null) {
                System.out.println("Cursor message not found");
                return null;
            }

            if (direction.equals("forward")) {
                Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
                //forward means get older messages
                directMessagesPage = directMessageRepository.findAllByConversationIdAndCreatedAtBefore(conversation.getId(), cursorMessage.getCreatedAt(), pageable);
                //set the previous cursor to the first message's id of the current page
                directMessageResponse.setPreviousCursor(directMessagesPage.getContent().get(0).getId());
                if (directMessagesPage.hasNext()) {
                    //set the next cursor to the last message's id of the current page
                    directMessageResponse.setNextCursor(directMessagesPage.getContent().get(directMessagesPage.getContent().size() - 1).getId());
                } else {
                    directMessageResponse.setNextCursor(null);
                }
            } else if (direction.equals("backward")) {
                Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").ascending());
                //backward means get newer messages
                directMessagesPage = directMessageRepository.findAllByConversationIdAndCreatedAtAfter(conversation.getId(), cursorMessage.getCreatedAt(), pageable);
                //set the next cursor to the first message's id of the current page
                directMessageResponse.setNextCursor(directMessagesPage.getContent().get(0).getId());
                if (directMessagesPage.hasNext()) {
                    //set the previous cursor to the last message's id of the current page (the newest message)
                    directMessageResponse.setPreviousCursor(directMessagesPage.getContent().get(directMessagesPage.getContent().size() - 1).getId());
                } else {
                    directMessageResponse.setPreviousCursor(null);
                }
                //reverse the order of the messages in the page so that the newest message is at the beginning
                List<DirectMessage> reversedMessages = new ArrayList<>(directMessagesPage.getContent());
                Collections.reverse(reversedMessages);
                directMessagesPage = new PageImpl<>(reversedMessages);

            } else {
                //around means get older and newer messages around the cursor message
                //first get the older messages
                Pageable pageable = PageRequest.of(0, limit/2, Sort.by("createdAt").descending());
                Page<DirectMessage> directMessagesPageBefore = directMessageRepository.findAllByConversationIdAndCreatedAtBefore(conversation.getId(), cursorMessage.getCreatedAt(), pageable);
                if (directMessagesPageBefore.hasNext()) {
                    //set the next cursor to the last message's id of the current page
                    directMessageResponse.setNextCursor(directMessagesPageBefore.getContent().get(directMessagesPageBefore.getContent().size() - 1).getId());
                } else {
                    directMessageResponse.setNextCursor(null);
                }

                //get the newer messages
                pageable = PageRequest.of(0, limit/2, Sort.by("createdAt").ascending());
                Page<DirectMessage> directMessagesPageAfter = directMessageRepository.findAllByConversationIdAndCreatedAtAfter(conversation.getId(), cursorMessage.getCreatedAt(), pageable);
                if (directMessagesPageAfter.hasNext()) {
                    //set the previous cursor to the last message's id of the current page (the newest message)
                    directMessageResponse.setPreviousCursor(directMessagesPageAfter.getContent().get(directMessagesPageAfter.getContent().size() - 1).getId());
                } else {
                    directMessageResponse.setPreviousCursor(null);
                }
                //reverse the order of the messages in the page so that the newest message is at the beginning
                List<DirectMessage> reversedMessages = new ArrayList<>(directMessagesPageAfter.getContent());
                Collections.reverse(reversedMessages);
                directMessagesPageAfter = new PageImpl<>(reversedMessages);

                //combine the older, cursor message and newer messages into a single page in descending createdAt order (newest message first)
                List<DirectMessage> directMessages = new ArrayList<>();
                directMessages.addAll(directMessagesPageAfter.getContent());
                directMessages.add(cursorMessage);
                directMessages.addAll(directMessagesPageBefore.getContent());
                directMessagesPage = new PageImpl<>(directMessages);
            }
        }

        List<DirectMessageDto> directMessageDtos = directMessagesPage.stream().map(directMessage -> {
            DirectMessageDto directMessageDto = new DirectMessageDto();
            directMessageDto.setId(directMessage.getId());
            directMessageDto.setContent(directMessage.getContent());
            directMessageDto.setFile(
                    directMessage.getFile() != null ? new FileDto(
                            directMessage.getFile().getFileName(),
                            directMessage.getFile().getFileUrl(),
                            directMessage.getFile().getFileKey()
                    ) : null
            );
            User sender = directMessage.getUser();
            directMessageDto.setSender(new UserDto(
                    sender.getId(),
                    sender.getUsername(),
                    sender.getNickname(),
                    sender.getFile() != null ? new FileDto(
                            sender.getFile().getFileName(),
                            sender.getFile().getFileUrl(),
                            sender.getFile().getFileKey()
                    ) : null,
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
                                replyToMessage.getFile() != null ? new FileDto(
                                        replyToMessage.getFile().getFileName(),
                                        replyToMessage.getFile().getFileUrl(),
                                        replyToMessage.getFile().getFileKey()
                                ) : null,
                                new UserDto(
                                        replyToMessageSender.getId(),
                                        replyToMessageSender.getUsername(),
                                        replyToMessageSender.getNickname(),
                                        replyToMessageSender.getFile() != null ? new FileDto(
                                                replyToMessageSender.getFile().getFileName(),
                                                replyToMessageSender.getFile().getFileUrl(),
                                                replyToMessageSender.getFile().getFileKey()
                                        ) : null,
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

        directMessageResponse.setMessages(directMessageDtos);

        return directMessageResponse;
    }

    @Override
    public DirectMessageDto getMessageById(Long messageId) {
        //get the message
        DirectMessage directMessage = directMessageRepository.findById(messageId).orElse(null);
        if (directMessage == null) {
            System.out.println("Message not found");
            return null;
        }

        DirectMessageDto directMessageDto = new DirectMessageDto();
        directMessageDto.setId(directMessage.getId());
        directMessageDto.setContent(directMessage.getContent());
        directMessageDto.setFile(
                directMessage.getFile() != null ? new FileDto(
                        directMessage.getFile().getFileName(),
                        directMessage.getFile().getFileUrl(),
                        directMessage.getFile().getFileKey()
                ) : null
        );
        User sender = directMessage.getUser();
        directMessageDto.setSender(new UserDto(
                sender.getId(),
                sender.getUsername(),
                sender.getNickname(),
                sender.getFile() != null ? new FileDto(
                        sender.getFile().getFileName(),
                        sender.getFile().getFileUrl(),
                        sender.getFile().getFileKey()
                ) : null,
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
                            replyToMessage.getFile() != null ? new FileDto(
                                    replyToMessage.getFile().getFileName(),
                                    replyToMessage.getFile().getFileUrl(),
                                    replyToMessage.getFile().getFileKey()
                            ) : null,
                            new UserDto(
                                    replyToMessageSender.getId(),
                                    replyToMessageSender.getUsername(),
                                    replyToMessageSender.getNickname(),
                                    replyToMessageSender.getFile() != null ? new FileDto(
                                            replyToMessageSender.getFile().getFileName(),
                                            replyToMessageSender.getFile().getFileUrl(),
                                            replyToMessageSender.getFile().getFileKey()
                                    ) : null,
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
    public Long getMessagesCount(Long fromMessageId, Long toMessageId, Long userId1, Long userId2) {
        //check if a conversation exists between the two users
        Conversation conversation = conversationRepository.findByUser1IdAndUser2Id(userId1, userId2);
        if (conversation == null) {
            conversation = conversationRepository.findByUser1IdAndUser2Id(userId2, userId1);
        }

        //conversation still not found -> return null
        if (conversation == null) {
            System.out.println("Conversation not found");
            return null;
        }

        //check if fromMessage exists
        DirectMessage fromMessage = directMessageRepository.findById(fromMessageId).orElse(null);
        if (fromMessage == null) {
            System.out.println("From message not found");
            return null;
        }

        //check if toMessage exists
        DirectMessage toMessage = directMessageRepository.findById(toMessageId).orElse(null);
        if (toMessage == null) {
            System.out.println("To message not found");
            return null;
        }

        //get the number of messages between fromMessageId's createdAt and toMessageId's createdAt, which belong to the conversation
        Long count = directMessageRepository.countMessagesBetweenCreatedAt(fromMessage.getCreatedAt(), toMessage.getCreatedAt(), conversation.getId());
        if (count == null) {
            System.out.println("Message count retrieval failed");
            return null;
        }
        return count;
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

        //check if the message has a file
        if (directMessageRequest.getFileUrl() != null) {
            //create the file
            File file = new File();
            file.setFileName(directMessageRequest.getFileName());
            file.setFileUrl(directMessageRequest.getFileUrl());
            file.setFileKey(directMessageRequest.getFileKey());

            file = fileRepository.save(file);

            directMessage.setFile(file);
        } else {
            directMessage.setFile(null);
        }

        directMessage.setConversation(conversation);
        directMessage.setUser(sender);

        DirectMessage replyToMessage = directMessageRequest.getReplyToMessageId() != null ? directMessageRepository.findById(directMessageRequest.getReplyToMessageId()).orElse(null) : null;
        directMessage.setReplyToMessage(replyToMessage);
        directMessage.setHasReplyMessage(replyToMessage != null);
        directMessage = directMessageRepository.save(directMessage);

        DirectMessageDto directMessageDto = new DirectMessageDto();
        directMessageDto.setId(directMessage.getId());
        directMessageDto.setContent(directMessage.getContent());
        directMessageDto.setFile(
                directMessage.getFile() != null ? new FileDto(
                        directMessage.getFile().getFileName(),
                        directMessage.getFile().getFileUrl(),
                        directMessage.getFile().getFileKey()
                ) : null
        );
        directMessageDto.setSender(new UserDto(
                sender.getId(),
                sender.getUsername(),
                sender.getNickname(),
                sender.getFile() != null ? new FileDto(
                        sender.getFile().getFileName(),
                        sender.getFile().getFileUrl(),
                        sender.getFile().getFileKey()
                ) : null,
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
                            replyToMessage.getFile() != null ? new FileDto(
                                    replyToMessage.getFile().getFileName(),
                                    replyToMessage.getFile().getFileUrl(),
                                    replyToMessage.getFile().getFileKey()
                            ) : null,
                            new UserDto(
                                    replyToMessageSender.getId(),
                                    replyToMessageSender.getUsername(),
                                    replyToMessageSender.getNickname(),
                                    replyToMessageSender.getFile() != null ? new FileDto(
                                            replyToMessageSender.getFile().getFileName(),
                                            replyToMessageSender.getFile().getFileUrl(),
                                            replyToMessageSender.getFile().getFileKey()
                                    ) : null,
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
        directMessageDto.setFile(
                directMessage.getFile() != null ? new FileDto(
                        directMessage.getFile().getFileName(),
                        directMessage.getFile().getFileUrl(),
                        directMessage.getFile().getFileKey()
                ) : null
        );
        User sender = directMessage.getUser();
        directMessageDto.setSender(new UserDto(
                sender.getId(),
                sender.getUsername(),
                sender.getNickname(),
                sender.getFile() != null ? new FileDto(
                        sender.getFile().getFileName(),
                        sender.getFile().getFileUrl(),
                        sender.getFile().getFileKey()
                ) : null,
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
                            replyToMessage.getFile() != null ? new FileDto(
                                    replyToMessage.getFile().getFileName(),
                                    replyToMessage.getFile().getFileUrl(),
                                    replyToMessage.getFile().getFileKey()
                            ) : null,
                            new UserDto(
                                    replyToMessageSender.getId(),
                                    replyToMessageSender.getUsername(),
                                    replyToMessageSender.getNickname(),
                                    replyToMessageSender.getFile() != null ? new FileDto(
                                            replyToMessageSender.getFile().getFileName(),
                                            replyToMessageSender.getFile().getFileUrl(),
                                            replyToMessageSender.getFile().getFileKey()
                                    ) : null,
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
