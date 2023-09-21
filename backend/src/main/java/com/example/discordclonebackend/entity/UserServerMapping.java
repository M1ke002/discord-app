package com.example.discordclonebackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

//1 user to many user server mappings -> one to many
//1 server to many user server mappings -> one to many

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class UserServerMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "user_id",
            referencedColumnName = "id"
    )
    private User user;
    @ManyToOne(
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "server_id",
            referencedColumnName = "id"
    )
    private Server server;
    @Enumerated(EnumType.STRING)
    private UserRole role = UserRole.MEMBER;
    @CreationTimestamp
    private Date createdAt;
    private Date updatedAt;
}
