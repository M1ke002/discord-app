package com.example.discordclonebackend.repository;

import com.example.discordclonebackend.entity.DirectMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DirectMessageRepository extends JpaRepository<DirectMessage, Long> {
}
