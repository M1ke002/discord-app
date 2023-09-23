package com.example.discordclonebackend.repository;

import com.example.discordclonebackend.entity.Server;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServerRepository extends JpaRepository<Server, Long> {
    public Server findByIdAndInviteCode(Long serverId, String inviteCode);
}
