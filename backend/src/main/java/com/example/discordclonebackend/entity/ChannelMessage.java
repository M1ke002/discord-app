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
public class ChannelMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    private String fileUrl;
    private String fileKey;
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
    private boolean hasReplyMessage;
    //list of replies to this message
    @OneToMany(
            mappedBy = "replyToMessage",
            fetch = FetchType.LAZY
    )
    private List<ChannelMessage> replies = new ArrayList<>();
    @CreationTimestamp
    private Date createdAt;
    private Date updatedAt;

    @PreRemove
    private void removeMessageFromReplies() {
        for (ChannelMessage reply : replies) {
            reply.setReplyToMessage(null);
        }
    }

}
