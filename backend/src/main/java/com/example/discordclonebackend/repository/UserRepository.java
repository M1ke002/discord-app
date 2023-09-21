package com.example.discordclonebackend.repository;

import com.example.discordclonebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    public Optional<User> findByUsername(String username);
    public Boolean existsByUsername(String username);
}
