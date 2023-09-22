package com.example.discordclonebackend.repository;

import com.example.discordclonebackend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    public Optional<User> findByUsername(String username);

//    public Optional<User> findById(Long id);

    public Boolean existsByUsername(String username);
}
