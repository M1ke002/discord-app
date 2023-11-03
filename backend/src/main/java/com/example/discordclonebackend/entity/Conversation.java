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
@Table(
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user1_id", "user2_id"})
        }
)
public class Conversation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "user1_id",
            referencedColumnName = "id"
    )
    private User user1;
    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "user2_id",
            referencedColumnName = "id"
    )
    private User user2;
    @OneToMany(
            cascade = CascadeType.ALL,
            mappedBy = "conversation",
            fetch = FetchType.LAZY
    )
    private List<DirectMessage> messages = new ArrayList<>();
    @CreationTimestamp
    private Date createdAt;
    private Date updatedAt;
}
