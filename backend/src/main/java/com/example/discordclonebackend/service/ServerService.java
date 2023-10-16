package com.example.discordclonebackend.service;

import com.example.discordclonebackend.dto.ServerDto;
import com.example.discordclonebackend.dto.request.ServerRequest;
import com.example.discordclonebackend.dto.response.JoinServerResponse;

import java.util.List;

public interface ServerService {
    public ServerDto createServer(ServerRequest serverRequest);

    public Boolean deleteServer(Long serverId);

    public ServerDto getServerById(Long serverId);

    public List<ServerDto> getAllServers(Long userId);

    public String generateNewInviteCode(Long serverId);

    public Boolean leaveServer(Long serverId, Long userId);

    public JoinServerResponse joinServer(String inviteCode, Long userId);

    public Boolean updateServer(Long serverId, ServerRequest serverRequest);

    public Boolean kickUserFromServer(Long serverId, Long userId, Long adminId);

    public Boolean changeUserRole(Long serverId, Long userId, Long adminId, String role);
}
