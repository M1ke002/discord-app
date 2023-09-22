package com.example.discordclonebackend.service;

import com.example.discordclonebackend.dto.ServerDto;
import com.example.discordclonebackend.dto.request.ServerRequest;

import java.util.List;

public interface ServerService {
    public String createServer(ServerRequest serverRequest);

    public Boolean deleteServer(Long serverId);

    public ServerDto getServerById(Long serverId);

    public List<ServerDto> getAllServers(Long userId);
}
