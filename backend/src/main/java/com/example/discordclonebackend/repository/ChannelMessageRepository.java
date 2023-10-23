package com.example.discordclonebackend.repository;

import com.example.discordclonebackend.entity.ChannelMessage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChannelMessageRepository extends JpaRepository<ChannelMessage, Long> {
    Page<ChannelMessage> findAllByChannelId(Long channelId, Pageable pageable);
}
