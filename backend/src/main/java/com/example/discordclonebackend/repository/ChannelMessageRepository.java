package com.example.discordclonebackend.repository;

import com.example.discordclonebackend.entity.ChannelMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChannelMessageRepository extends JpaRepository<ChannelMessage, Long> {
    Page<ChannelMessage> findAllByChannelId(Long channelId, Pageable pageable);
    Page<ChannelMessage> findAllByChannelIdAndCreatedAtBefore(Long channelId, Date createdAt, Pageable pageable);
    @Query("SELECT COUNT(cm) FROM ChannelMessage cm WHERE cm.channel.id = :channelId AND cm.createdAt >= :fromMessageCreatedDate AND cm.createdAt < :toMessageCreatedDate")
    Long countMessagesBetweenCreatedAt(Date fromMessageCreatedDate, Date toMessageCreatedDate, Long channelId);


    //search messages based on content, user, whether message has a file. The content, user and hasFile parameters are optional
    @Query(
            "SELECT cm FROM ChannelMessage cm WHERE " +
                    "(:userId IS NULL OR cm.user.id = :userId) AND " +
                    "(:hasFile IS NULL OR cm.file IS NOT NULL) AND " +
                    "(:content IS NULL OR cm.content LIKE %:content%) AND " +
                    "cm.channel.server.id = :serverId"
    )
    Page<ChannelMessage> searchMessages(Long userId, Boolean hasFile, String content, Long serverId, Pageable pageable);
}
