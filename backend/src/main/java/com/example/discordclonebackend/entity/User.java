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
    @OneToOne(
            fetch = FetchType.EAGER,
            cascade = CascadeType.ALL
    )
    @JoinColumn(
            name = "file_id",
            referencedColumnName = "id"
    )
    private File file;
    @OneToMany(
            cascade = CascadeType.ALL,
            mappedBy = "user"
    )
    private List<UserServerMapping> userServerMappings = new ArrayList<>();
    @CreationTimestamp
    private Date createdAt;
    private Date updatedAt;
}

