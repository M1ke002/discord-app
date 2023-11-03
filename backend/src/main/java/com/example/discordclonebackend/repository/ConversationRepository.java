package com.example.discordclonebackend.repository;

import com.example.discordclonebackend.dto.ConversationDto;
import com.example.discordclonebackend.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    public Conversation findByUser1IdAndUser2Id(Long userId1, Long userId2);

    public List<Conversation> findAllByUser1IdOrUser2Id(Long userId1, Long userId2);
}
