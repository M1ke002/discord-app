package com.example.discordclonebackend.dto.request;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServerRequest {
    private Long userId;
    private Long serverId;
    private String serverName;
    private String fileName;
    private String fileUrl;
    private String fileKey;
}
