package com.example.discordclonebackend.controller;

import com.example.discordclonebackend.dto.ServerDto;
import com.example.discordclonebackend.dto.request.ChangeRoleRequest;
import com.example.discordclonebackend.dto.request.ServerRequest;
import com.example.discordclonebackend.dto.response.StringResponse;
import com.example.discordclonebackend.service.ServerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/servers")
@CrossOrigin("*")
public class ServerController {

    //TODO: implement role change

    @Autowired
    private ServerService serverService;

    //an example request: http://localhost:8080/api/v1/servers?userId=1
    @GetMapping("") //TESTED
    public ResponseEntity<?> getAllServers(@RequestParam("userId") Long userId) {
        List<ServerDto> serverDtos = serverService.getAllServers(userId);
        return ResponseEntity.ok(serverDtos);
    }

    //TODO: require user id as input to check if user is a member of the server
    @GetMapping("/{serverId}") //TESTED
    public ResponseEntity<?> getServerById(@PathVariable("serverId") Long serverId) {
        ServerDto serverDto = serverService.getServerById(serverId);
        if (serverDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Server not found"));
        }
        return ResponseEntity.ok(serverDto);
    }

    @PostMapping("") //TESTED
    public ResponseEntity<?> createServer(@RequestBody ServerRequest serverRequest) {
        ServerDto serverDto = serverService.createServer(serverRequest);
        if (serverDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Server creation failed"));
        }
        return ResponseEntity.ok(serverDto);
    }

    @PutMapping("/{serverId}") //TESTED
    public ResponseEntity<?> updateServer(@PathVariable("serverId") Long serverId, @RequestBody ServerRequest serverRequest) {
        Boolean isUpdated = serverService.updateServer(serverId, serverRequest);
        if (!isUpdated) {
            return ResponseEntity.badRequest().body(new StringResponse("Server update failed"));
        }
        return ResponseEntity.ok(new StringResponse("Server updated successfully"));
    }

    @DeleteMapping("/{serverId}") //TESTED
    public ResponseEntity<?> deleteServer(@PathVariable("serverId") Long serverId) {
        Boolean isDeleted = serverService.deleteServer(serverId);
        if (!isDeleted) {
            return ResponseEntity.badRequest().body(new StringResponse("Server deletion failed"));
        }
        return ResponseEntity.ok(new StringResponse("Server deleted successfully"));
    }

    @PutMapping("/{serverId}/invite-code") //TESTED
    public ResponseEntity<?> generateNewInviteCode(@PathVariable("serverId") Long serverId) {
        String inviteCode = serverService.generateNewInviteCode(serverId);
        if (inviteCode == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Generating invite code failed"));
        }
        return ResponseEntity.ok(new StringResponse(inviteCode));
    }

    @PutMapping("/{serverId}/leave") //TESTED
    public ResponseEntity<?> leaveServer(@PathVariable("serverId") Long serverId, @RequestParam("userId") Long userId) {
        Boolean isLeft = serverService.leaveServer(serverId, userId);
        if (!isLeft) {
            return ResponseEntity.badRequest().body(new StringResponse("Leaving server failed"));
        }
        return ResponseEntity.ok(new StringResponse("Left server successfully"));
    }

    //example request: http://localhost:8080/api/v1/servers/1/join/123456?userId=1
    @PutMapping("/{serverId}/join/{inviteCode}") //TESTED
    public ResponseEntity<?> joinServer(
            @PathVariable("serverId") Long serverId,
            @PathVariable("inviteCode") String inviteCode,
            @RequestParam("userId") Long userId) {
        Boolean isJoined = serverService.joinServer(serverId, inviteCode, userId);
        if (!isJoined) {
            return ResponseEntity.badRequest().body(new StringResponse("Joining server failed"));
        }
        return ResponseEntity.ok(new StringResponse("Joined server successfully"));
    }

    @DeleteMapping("/{serverId}/kick/{userId}")
    public ResponseEntity<?> kickUserFromServer(
            @PathVariable("serverId") Long serverId,
            @PathVariable("userId") Long userId,
            @RequestParam("adminId") Long adminId) {
        Boolean isKicked = serverService.kickUserFromServer(serverId, userId, adminId);
        if (!isKicked) {
            return ResponseEntity.badRequest().body(new StringResponse("Kicking user from server failed"));
        }
        return ResponseEntity.ok(new StringResponse("Kicked user from server successfully"));
    }

    //example request: http://localhost:8080/api/v1/servers/1/change-role/2?adminId=1
    @PutMapping("/{serverId}/change-role/{userId}")
    public ResponseEntity<?> changeUserRole(
            @PathVariable("serverId") Long serverId,
            @PathVariable("userId") Long userId,
            @RequestParam("adminId") Long adminId,
            @RequestBody ChangeRoleRequest changeRoleRequest) {
        Boolean isChanged = serverService.changeUserRole(serverId, userId, adminId, changeRoleRequest.getRole());
        if (!isChanged) {
            return ResponseEntity.badRequest().body(new StringResponse("Changing user role failed"));
        }
        return ResponseEntity.ok(new StringResponse("Changed user role successfully"));
    }
}
