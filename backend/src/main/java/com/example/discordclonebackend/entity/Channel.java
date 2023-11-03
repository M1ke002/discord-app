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
public class Channel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @ManyToOne(
//            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "server_id",
            referencedColumnName = "id"
    )
    private Server server;
    @ManyToOne(
//            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "category_id",
            referencedColumnName = "id"
    )
    private Category category;
    @Enumerated(EnumType.STRING)
    private ChannelType type = ChannelType.TEXT;
    @OneToMany(
            cascade = CascadeType.ALL,
            mappedBy = "channel",
            fetch = FetchType.LAZY
    )
    private List<ChannelMessage> messages = new ArrayList<>();
    @CreationTimestamp
    private Date createdAt;
    private Date updatedAt;

    public Channel(String name, Server server, Category category) {
        this.name = name;
        this.server = server;
        this.category = category;
    }

    public Channel(String name, Server server, Category category, ChannelType type) {
        this.name = name;
        this.server = server;
        this.category = category;
        this.type = type;
    }
}
