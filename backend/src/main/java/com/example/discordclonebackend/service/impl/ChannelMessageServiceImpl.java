package com.example.discordclonebackend.service.impl;

import com.example.discordclonebackend.dto.ChannelMessageDto;
import com.example.discordclonebackend.dto.FileDto;
import com.example.discordclonebackend.dto.ServerMemberDto;
import com.example.discordclonebackend.dto.UserDto;
import com.example.discordclonebackend.dto.request.ChannelMessageRequest;
import com.example.discordclonebackend.dto.response.ChannelMessageResponse;
import com.example.discordclonebackend.dto.response.SearchChannelMessageResponse;
import com.example.discordclonebackend.entity.*;
import com.example.discordclonebackend.repository.*;
import com.example.discordclonebackend.service.ChannelMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChannelMessageServiceImpl implements ChannelMessageService {

    @Autowired
    private ChannelMessageRepository channelMessageRepository;

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServerRepository serverRepository;

    @Autowired
    private UserServerMappingRepository userServerMappingRepository;

    @Override
    public ChannelMessageResponse getMessages(Long cursor, Integer limit, String direction, Long channelId, Long serverId) {
        if (!direction.equals("forward") && !direction.equals("backward") && !direction.equals("around")) {
            System.out.println("Invalid direction");
            return null;
        }

        //check if server exists
        if (!serverRepository.existsById(serverId)) {
            System.out.println("Server doesn't exist");
            return null;
        }

        if (cursor == null) {
            System.out.println("Cursor is null");
            return null;
        }

        Page<ChannelMessage> channelMessagesPage = null;
        ChannelMessageResponse channelMessageResponse = new ChannelMessageResponse();

        //nextCursor indicates whether there is an older (previous) message
        //previousCursor indicates whether there is a newer (next) message
        //if cursor is 0 then fetch the messages starting from the newest message, doesn't need to check direction
        if (cursor == 0) {
            Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
            channelMessagesPage = channelMessageRepository.findAllByChannelId(channelId, pageable);
            channelMessageResponse.setPreviousCursor(null);
            if (channelMessagesPage.hasNext()) {
                //set the next cursor to the last message's id of the current page
                channelMessageResponse.setNextCursor(channelMessagesPage.getContent().get(channelMessagesPage.getContent().size() - 1).getId());
            } else {
                channelMessageResponse.setNextCursor(null);
            }
        } else {
            //get all the messages before the cursor message
            ChannelMessage cursorMessage = channelMessageRepository.findById(cursor).orElse(null);
            //no messages found
            if (cursorMessage == null) {
                System.out.println("Cursor message doesn't exist");
                return null;
            }

            if (direction.equals("forward")) {
                Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
                //forward means get older messages
                channelMessagesPage = channelMessageRepository.findAllByChannelIdAndCreatedAtBefore(channelId, cursorMessage.getCreatedAt(), pageable);
                //set the previous cursor to the first message's id of the current page
                channelMessageResponse.setPreviousCursor(channelMessagesPage.getContent().get(0).getId());
                if (channelMessagesPage.hasNext()) {
                    //set the next cursor to the last message's id of the current page
                    channelMessageResponse.setNextCursor(channelMessagesPage.getContent().get(channelMessagesPage.getContent().size() - 1).getId());
                } else {
                    channelMessageResponse.setNextCursor(null);
                }
            } else if (direction.equals("backward")) {
                Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").ascending());
                //backward means get newer messages
                channelMessagesPage = channelMessageRepository.findAllByChannelIdAndCreatedAtAfter(channelId, cursorMessage.getCreatedAt(), pageable);
                //set the next cursor to the first message's id of the current page
                channelMessageResponse.setNextCursor(channelMessagesPage.getContent().get(0).getId());
                if (channelMessagesPage.hasNext()) {
                    //set the previous cursor to the last message's id of the current page (the newest message)
                    channelMessageResponse.setPreviousCursor(channelMessagesPage.getContent().get(channelMessagesPage.getContent().size() - 1).getId());
                } else {
                    channelMessageResponse.setPreviousCursor(null);
                }
                //reverse the order of the messages in the page so that the newest message is at the beginning
                List<ChannelMessage> reversedMessages = new ArrayList<>(channelMessagesPage.getContent());
                Collections.reverse(reversedMessages);
                channelMessagesPage = new PageImpl<>(reversedMessages);

            } else {
                //around means get older and newer messages around the cursor message
                //first get the older messages
                Pageable pageable = PageRequest.of(0, limit/2, Sort.by("createdAt").descending());
                Page<ChannelMessage> channelMessagesPageBefore = channelMessageRepository.findAllByChannelIdAndCreatedAtBefore(channelId, cursorMessage.getCreatedAt(), pageable);
                if (channelMessagesPageBefore.hasNext()) {
                    //set the next cursor to the last message's id of the current page
                    channelMessageResponse.setNextCursor(channelMessagesPageBefore.getContent().get(channelMessagesPageBefore.getContent().size() - 1).getId());
                } else {
                    channelMessageResponse.setNextCursor(null);
                }

                //get the newer messages
                pageable = PageRequest.of(0, limit/2, Sort.by("createdAt").ascending());
                Page<ChannelMessage> channelMessagesPageAfter = channelMessageRepository.findAllByChannelIdAndCreatedAtAfter(channelId, cursorMessage.getCreatedAt(), pageable);
                if (channelMessagesPageAfter.hasNext()) {
                    //set the previous cursor to the last message's id of the current page (the newest message)
                    channelMessageResponse.setPreviousCursor(channelMessagesPageAfter.getContent().get(channelMessagesPageAfter.getContent().size() - 1).getId());
                } else {
                    channelMessageResponse.setPreviousCursor(null);
                }
                //reverse the order of the messages in the page so that the newest message is at the beginning
                List<ChannelMessage> reversedMessages = new ArrayList<>(channelMessagesPageAfter.getContent());
                Collections.reverse(reversedMessages);
                channelMessagesPageAfter = new PageImpl<>(reversedMessages);

                //combine the older, cursor message and newer messages into a single page in descending createdAt order (newest message first)
                List<ChannelMessage> channelMessages = new ArrayList<>();
                channelMessages.addAll(channelMessagesPageAfter.getContent());
                channelMessages.add(cursorMessage);
                channelMessages.addAll(channelMessagesPageBefore.getContent());
                channelMessagesPage = new PageImpl<>(channelMessages);
            }
        }

        List<ChannelMessageDto> channelMessageDtos = channelMessagesPage.stream().map(channelMessage -> {
            ChannelMessageDto channelMessageDto = new ChannelMessageDto();
            channelMessageDto.setId(channelMessage.getId());
            channelMessageDto.setChannelId(channelMessage.getChannel().getId());
            User sender = channelMessage.getUser();
            UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(sender.getId(), serverId);
            channelMessageDto.setSender(new UserDto(
                    sender.getId(),
                    sender.getUsername(),
                    sender.getNickname(),
                    sender.getFile() != null ? new FileDto(
                            sender.getFile().getFileName(),
                            sender.getFile().getFileUrl(),
                            sender.getFile().getFileKey()
                    ) : null,
                    userServerMapping != null ? userServerMapping.getRole() : null,
                    sender.getCreatedAt(),
                    sender.getUpdatedAt()
            ));
            channelMessageDto.setFile(
                    channelMessage.getFile() != null ? new FileDto(
                            channelMessage.getFile().getFileName(),
                            channelMessage.getFile().getFileUrl(),
                            channelMessage.getFile().getFileKey()
                    ) : null
            );
            channelMessageDto.setContent(channelMessage.getContent());

            //get the replyToMessage if it exists
            ChannelMessage replyToMessage = channelMessage.getReplyToMessage();
            if (replyToMessage != null) {
                User replyToMessageSender = replyToMessage.getUser();
                UserServerMapping replyToMessageUserServerMapping = userServerMappingRepository.findByUserIdAndServerId(replyToMessageSender.getId(), serverId);
                channelMessageDto.setReplyToMessage(new ChannelMessageDto(
                        replyToMessage.getId(),
                        replyToMessage.getContent(),
                        replyToMessage.getFile() != null ? new FileDto(
                                replyToMessage.getFile().getFileName(),
                                replyToMessage.getFile().getFileUrl(),
                                replyToMessage.getFile().getFileKey()
                        ) : null,
                        replyToMessage.getChannel().getId(),
                        new UserDto(
                                replyToMessageSender.getId(),
                                replyToMessageSender.getUsername(),
                                replyToMessageSender.getNickname(),
                                replyToMessageSender.getFile() != null ? new FileDto(
                                        replyToMessageSender.getFile().getFileName(),
                                        replyToMessageSender.getFile().getFileUrl(),
                                        replyToMessageSender.getFile().getFileKey()
                                ) : null,
                                replyToMessageUserServerMapping != null ? replyToMessageUserServerMapping.getRole() : null,
                                replyToMessageSender.getCreatedAt(),
                                replyToMessageSender.getUpdatedAt()
                        )
                ));
            } else {
                channelMessageDto.setReplyToMessage(null);
            }
            channelMessageDto.setHasReplyMessage(channelMessage.isHasReplyMessage());
            channelMessageDto.setCreatedAt(channelMessage.getCreatedAt());
            channelMessageDto.setUpdatedAt(channelMessage.getUpdatedAt());
            return channelMessageDto;
        }).collect(Collectors.toList());

        channelMessageResponse.setMessages(channelMessageDtos);

        return channelMessageResponse;
    }

    @Override
    public Long getMessagesCount(Long fromMessageId, Long toMessageId, Long channelId) {
        //check if channel exists
        if (!channelRepository.existsById(channelId)) {
            System.out.println("Channel doesn't exist");
            return null;
        }

        //check if fromMessage exists
        ChannelMessage fromMessage = channelMessageRepository.findById(fromMessageId).orElse(null);
        if (fromMessage == null) {
            System.out.println("From message doesn't exist");
            return null;
        }

        //check if toMessage exists
        ChannelMessage toMessage = channelMessageRepository.findById(toMessageId).orElse(null);
        if (toMessage == null) {
            System.out.println("To message doesn't exist");
            return null;
        }

        //get the number of messages between fromMessageId's createdAt and toMessageId's createdAt, which belong to the channel
        Long count = channelMessageRepository.countMessagesBetweenCreatedAt(fromMessage.getCreatedAt(), toMessage.getCreatedAt(), channelId);
        if (count == null) {
            System.out.println("Message count retrieval failed");
            return null;
        }
        return count;
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

        //check if the message has a file
        if (channelMessageRequest.getFileUrl() != null) {
            //create a file object
            File file = new File();
            file.setFileName(channelMessageRequest.getFileName());
            file.setFileUrl(channelMessageRequest.getFileUrl());
            file.setFileKey(channelMessageRequest.getFileKey());

            file = fileRepository.save(file);

            channelMessage.setFile(file);
        } else {
            channelMessage.setFile(null);
        }

        ChannelMessage replyToMessage = channelMessageRequest.getReplyToMessageId() != null ? channelMessageRepository.findById(channelMessageRequest.getReplyToMessageId()).orElse(null) : null;
        channelMessage.setReplyToMessage(replyToMessage);
        channelMessage.setHasReplyMessage(replyToMessage != null);
        channelMessage.setChannel(channel);
        channelMessage.setUser(user);
        channelMessage = channelMessageRepository.save(channelMessage);
        ChannelMessageDto channelMessageDto = new ChannelMessageDto();
        channelMessageDto.setId(channelMessage.getId());
        channelMessageDto.setChannelId(channelMessage.getChannel().getId());
        channelMessageDto.setSender(
                new UserDto(
                        user.getId(),
                        user.getUsername(),
                        user.getNickname(),
                        user.getFile() != null ? new FileDto(
                                user.getFile().getFileName(),
                                user.getFile().getFileUrl(),
                                user.getFile().getFileKey()
                        ) : null,
                        userServerMapping != null ? userServerMapping.getRole() : null,
                        user.getCreatedAt(),
                        user.getUpdatedAt()
                )
        );
        channelMessageDto.setContent(channelMessage.getContent());
        channelMessageDto.setFile(
                channelMessage.getFile() != null ? new FileDto(
                        channelMessage.getFile().getFileName(),
                        channelMessage.getFile().getFileUrl(),
                        channelMessage.getFile().getFileKey()
                ) : null
        );

        //get the replyToMessage if it exists
        if (replyToMessage != null) {
            User replyToMessageSender = replyToMessage.getUser();
            UserServerMapping replyToMessageUserServerMapping = userServerMappingRepository.findByUserIdAndServerId(replyToMessageSender.getId(), channelMessageRequest.getServerId());
            channelMessageDto.setReplyToMessage(new ChannelMessageDto(
                    replyToMessage.getId(),
                    replyToMessage.getContent(),
                    replyToMessage.getFile() != null ? new FileDto(
                            replyToMessage.getFile().getFileName(),
                            replyToMessage.getFile().getFileUrl(),
                            replyToMessage.getFile().getFileKey()
                    ) : null,
                    replyToMessage.getChannel().getId(),
                    new UserDto(
                            replyToMessageSender.getId(),
                            replyToMessageSender.getUsername(),
                            replyToMessageSender.getNickname(),
                            replyToMessageSender.getFile() != null ? new FileDto(
                                    replyToMessageSender.getFile().getFileName(),
                                    replyToMessageSender.getFile().getFileUrl(),
                                    replyToMessageSender.getFile().getFileKey()
                            ) : null,
                            replyToMessageUserServerMapping != null ? replyToMessageUserServerMapping.getRole() : null,
                            replyToMessageSender.getCreatedAt(),
                            replyToMessageSender.getUpdatedAt()
                    )
            ));
        } else {
            channelMessageDto.setReplyToMessage(null);
        }
        channelMessageDto.setHasReplyMessage(channelMessage.isHasReplyMessage());
        channelMessageDto.setCreatedAt(channelMessage.getCreatedAt());
        return channelMessageDto;
    }

    @Override
    public ChannelMessageDto updateMessage(Long messageId, ChannelMessageRequest channelMessageRequest) {
        //check if message exists
        ChannelMessage channelMessage = channelMessageRepository.findById(messageId).orElse(null);
        if (channelMessage == null) {
            System.out.println("Message does not exist");
            return null;
        }

        UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(channelMessageRequest.getUserId(), channelMessageRequest.getServerId());
        if (userServerMapping == null) {
            System.out.println("Cannot find user's role in server");
            return null;
        }

        //check if user is the message's sender
        if (!channelMessage.getUser().getId().equals(channelMessageRequest.getUserId())) {
            System.out.println("User is not authorized to update this message");
            return null;
        }

        //update message content
        channelMessage.setContent(channelMessageRequest.getContent());
        channelMessage.setUpdatedAt(new Date());
        channelMessage = channelMessageRepository.save(channelMessage);
        ChannelMessageDto channelMessageDto = new ChannelMessageDto();
        channelMessageDto.setId(channelMessage.getId());
        channelMessageDto.setChannelId(channelMessage.getChannel().getId());
        User sender = channelMessage.getUser();
        channelMessageDto.setSender(
                new UserDto(
                        sender.getId(),
                        sender.getUsername(),
                        sender.getNickname(),
                        sender.getFile() != null ? new FileDto(
                                sender.getFile().getFileName(),
                                sender.getFile().getFileUrl(),
                                sender.getFile().getFileKey()
                        ) : null,
                        userServerMapping.getRole(),
                        sender.getCreatedAt(),
                        sender.getUpdatedAt()
                )
        );
        channelMessageDto.setContent(channelMessage.getContent());
        channelMessageDto.setFile(
                channelMessage.getFile() != null ? new FileDto(
                        channelMessage.getFile().getFileName(),
                        channelMessage.getFile().getFileUrl(),
                        channelMessage.getFile().getFileKey()
                ) : null
        );

        //get the replyToMessage if it exists
        ChannelMessage replyToMessage = channelMessage.getReplyToMessage();
        if (replyToMessage != null) {
            User replyToMessageSender = replyToMessage.getUser();
            UserServerMapping replyToMessageUserServerMapping = userServerMappingRepository.findByUserIdAndServerId(replyToMessageSender.getId(), channelMessageRequest.getServerId());
            channelMessageDto.setReplyToMessage(new ChannelMessageDto(
                    replyToMessage.getId(),
                    replyToMessage.getContent(),
                    replyToMessage.getFile() != null ? new FileDto(
                            replyToMessage.getFile().getFileName(),
                            replyToMessage.getFile().getFileUrl(),
                            replyToMessage.getFile().getFileKey()
                    ) : null,
                    replyToMessage.getChannel().getId(),
                    new UserDto(
                            replyToMessageSender.getId(),
                            replyToMessageSender.getUsername(),
                            replyToMessageSender.getNickname(),
                            replyToMessageSender.getFile() != null ? new FileDto(
                                    replyToMessageSender.getFile().getFileName(),
                                    replyToMessageSender.getFile().getFileUrl(),
                                    replyToMessageSender.getFile().getFileKey()
                            ) : null,
                            replyToMessageUserServerMapping != null ? replyToMessageUserServerMapping.getRole() : null,
                            replyToMessageSender.getCreatedAt(),
                            replyToMessageSender.getUpdatedAt()
                    )
            ));
        } else {
            channelMessageDto.setReplyToMessage(null);
        }
        channelMessageDto.setHasReplyMessage(channelMessage.isHasReplyMessage());
        channelMessageDto.setCreatedAt(channelMessage.getCreatedAt());
        channelMessageDto.setUpdatedAt(channelMessage.getUpdatedAt());
        return channelMessageDto;

    }

    @Override
    public Boolean deleteMessage(Long messageId, Long userId, Long serverId) {
        //check if message exists
        ChannelMessage channelMessage = channelMessageRepository.findById(messageId).orElse(null);
        if (channelMessage == null) {
            System.out.println("Message does not exist");
            return false;
        }

        UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(userId, serverId);
        if (userServerMapping == null) {
            System.out.println("Cannot find user's role in server");
            return false;
        }

        //check if user is the ADMIN, MODERATOR or the message's sender
        if (!userServerMapping.getRole().equals(UserRole.ADMIN) && !userServerMapping.getRole().equals(UserRole.MODERATOR) && !channelMessage.getUser().getId().equals(userId)) {
            System.out.println("User is not authorized to delete this message");
            return false;
        }

        //delete message
        channelMessageRepository.delete(channelMessage);
        return true;
    }

    @Override
    public SearchChannelMessageResponse searchMessages(Integer page, Long userId, Boolean hasFile, String content, Long serverId) {
        int messageLimit = 15;
        //check if server exists
        if (!serverRepository.existsById(serverId)) {
            System.out.println("Server doesn't exist");
            return null;
        }

        if (userId == null && hasFile == null && content == null) {
            System.out.println("No search parameters provided");
            return null;
        }

        Pageable pageable = PageRequest.of(page, messageLimit, Sort.by("createdAt").descending());
        Page<ChannelMessage> channelMessagesPage = channelMessageRepository.searchMessages(userId, hasFile, content, serverId, pageable);

        List<ChannelMessageDto> channelMessageDtos = channelMessagesPage.stream().map(channelMessage -> {
            ChannelMessageDto channelMessageDto = new ChannelMessageDto();
            channelMessageDto.setId(channelMessage.getId());
            channelMessageDto.setChannelId(channelMessage.getChannel().getId());
            User sender = channelMessage.getUser();
            UserServerMapping userServerMapping = userServerMappingRepository.findByUserIdAndServerId(sender.getId(), serverId);
            channelMessageDto.setSender(new UserDto(
                    sender.getId(),
                    sender.getUsername(),
                    sender.getNickname(),
                    sender.getFile() != null ? new FileDto(
                            sender.getFile().getFileName(),
                            sender.getFile().getFileUrl(),
                            sender.getFile().getFileKey()
                    ) : null,
                    userServerMapping != null ? userServerMapping.getRole() : null,
                    sender.getCreatedAt(),
                    sender.getUpdatedAt()
            ));
            channelMessageDto.setFile(
                    channelMessage.getFile() != null ? new FileDto(
                            channelMessage.getFile().getFileName(),
                            channelMessage.getFile().getFileUrl(),
                            channelMessage.getFile().getFileKey()
                    ) : null
            );
            channelMessageDto.setContent(channelMessage.getContent());

            //no need to get the replies
            channelMessageDto.setReplyToMessage(null);
            channelMessageDto.setHasReplyMessage(false);

            channelMessageDto.setCreatedAt(channelMessage.getCreatedAt());
            channelMessageDto.setUpdatedAt(channelMessage.getUpdatedAt());
            return channelMessageDto;
        }).collect(Collectors.toList());
        SearchChannelMessageResponse searchChannelMessageResponse = new SearchChannelMessageResponse();
        searchChannelMessageResponse.setMessages(channelMessageDtos);
        searchChannelMessageResponse.setTotalPages(channelMessagesPage.getTotalPages());
        searchChannelMessageResponse.setTotalMessages(channelMessagesPage.getTotalElements());

        return searchChannelMessageResponse;
    }
}
