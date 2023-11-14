package com.example.discordclonebackend.repository;

import com.example.discordclonebackend.entity.DirectMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface DirectMessageRepository extends JpaRepository<DirectMessage, Long> {
    Page<DirectMessage> findAllByConversationIdAndCreatedAtBefore(Long conversationId, Date createdAt, Pageable pageable);
    Page<DirectMessage> findAllByConversationId(Long conversationId, Pageable pageable);
    @Query("SELECT COUNT(dm) FROM DirectMessage dm WHERE dm.conversation.id = :conversationId AND dm.createdAt >= :fromMessageCreatedDate AND dm.createdAt < :toMessageCreatedDate")
    Long countMessagesBetweenCreatedAt(Date fromMessageCreatedDate, Date toMessageCreatedDate, Long conversationId);
}
