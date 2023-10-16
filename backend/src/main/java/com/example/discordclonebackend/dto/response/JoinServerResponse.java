package com.example.discordclonebackend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JoinServerResponse {
    private boolean success;
    private String message;
    private Long serverId;
}
