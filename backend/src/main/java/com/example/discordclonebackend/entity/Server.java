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
public class Server {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String imageUrl;
    private String inviteCode;
    @CreationTimestamp
    private Date createdAt;
    private Date updatedAt;
    @OneToMany(
            cascade = CascadeType.ALL,
            mappedBy = "server",
            fetch = FetchType.EAGER
    )
    private List<UserServerMapping> userServerMappings = new ArrayList<>();
    @OneToMany(
            cascade = CascadeType.ALL,
            mappedBy = "server",
            fetch = FetchType.EAGER
    )
    private List<Channel> channels;
    @OneToMany(
            cascade = CascadeType.ALL,
            mappedBy = "server",
            fetch = FetchType.EAGER
    )
    private List<Category> categories;
    //server owner
    @ManyToOne(
            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "owner_id",
            referencedColumnName = "id"
    )
    private User owner;
}
