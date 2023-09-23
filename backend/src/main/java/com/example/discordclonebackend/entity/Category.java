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
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    //remove CascadeType.ALL because it will delete all channels in the category when the category is deleted
    //instead, we only want the channel's category_id to be set to null
    @OneToMany(
//            cascade = CascadeType.ALL,
            mappedBy = "category"
    )
    private List<Channel> channels = new ArrayList<>();
    @ManyToOne(
//            cascade = CascadeType.ALL,
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "server_id",
            referencedColumnName = "id"
    )
    private Server server;
    @CreationTimestamp
    private Date createdAt;
    private Date updatedAt;

    public Category(String name, Server server) {
        this.name = name;
        this.server = server;
    }

    @PreRemove
    private void removeCategoryFromChannels() {
        for (Channel channel : channels) {
            channel.setCategory(null);
        }
    }
}
