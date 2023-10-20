package com.example.discordclonebackend.repository;

import com.example.discordclonebackend.entity.ChannelMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChannelMessageRepository extends JpaRepository<ChannelMessage, Long> {
}
