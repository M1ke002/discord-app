package com.example.discordclonebackend.repository;

import com.example.discordclonebackend.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    public Category findByNameAndServerId(String name, Long serverId);
}
