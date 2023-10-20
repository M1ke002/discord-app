package com.example.discordclonebackend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class ChannelMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    private String fileUrl;
    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "user_id",
            referencedColumnName = "id"
    )
    private User user;
    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "channel_id",
            referencedColumnName = "id"
    )
    private Channel channel;
    @ManyToOne(
            fetch = FetchType.LAZY
    )
    @JoinColumn(
            name = "reply_to_id",
            referencedColumnName = "id"
    )
    private ChannelMessage replyToMessage;
    private boolean isDeleted = false;
    @CreationTimestamp
    private Date createdAt;
    private Date updatedAt;

}
