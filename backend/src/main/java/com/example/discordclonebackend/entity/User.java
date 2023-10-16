package com.example.discordclonebackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String password;
    private String nickname;
    private String avatarUrl;
    private String imageKey;
    @OneToMany(
            cascade = CascadeType.ALL,
            mappedBy = "user"
    )
    private List<UserServerMapping> userServerMappings = new ArrayList<>();
    @CreationTimestamp
    private Date createdAt;
    private Date updatedAt;
}

