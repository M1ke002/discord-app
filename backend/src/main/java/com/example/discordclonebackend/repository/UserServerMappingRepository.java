package com.example.discordclonebackend.repository;

import com.example.discordclonebackend.entity.UserServerMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface UserServerMappingRepository extends JpaRepository<UserServerMapping, Long> {
    public List<UserServerMapping> findAllByUserId(Long userId);


    public UserServerMapping findByUserIdAndServerId(Long userId, Long serverId);

    public void deleteAllByUserId(Long userId);
}
