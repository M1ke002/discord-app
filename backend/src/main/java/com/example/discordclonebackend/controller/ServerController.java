package com.example.discordclonebackend.controller;

import com.example.discordclonebackend.dto.ServerDto;
import com.example.discordclonebackend.dto.request.ServerRequest;
import com.example.discordclonebackend.service.ServerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/servers")
@CrossOrigin("*")
public class ServerController {

    @Autowired
    private ServerService serverService;

    //an example request: http://localhost:8080/api/v1/servers?userId=1
    @GetMapping("")
    public ResponseEntity<?> getAllServers(@RequestParam("userId") Long userId) {
        List<ServerDto> serverDtos = serverService.getAllServers(userId);
        return ResponseEntity.ok(serverDtos);
    }

    //TODO: require user id as input to check if user is a member of the server
    @GetMapping("/{serverId}")
    public ResponseEntity<?> getServerById(@PathVariable("serverId") Long serverId) {
        ServerDto serverDto = serverService.getServerById(serverId);
        if (serverDto == null) {
            return ResponseEntity.badRequest().body("Server not found");
        }
        return ResponseEntity.ok(serverDto);
    }

    @PostMapping("")
    public ResponseEntity<?> createServer(@RequestBody ServerRequest serverRequest) {
        String result = serverService.createServer(serverRequest);
        if (result == null) {
            return ResponseEntity.badRequest().body("Server creation failed");
        }
        return ResponseEntity.ok("Server created successfully");
    }

    @DeleteMapping("/{serverId}")
    public ResponseEntity<?> deleteServer(@PathVariable("serverId") Long serverId) {
        Boolean isDeleted = serverService.deleteServer(serverId);
        if (!isDeleted) {
            return ResponseEntity.badRequest().body("Server deletion failed");
        }
        return ResponseEntity.ok("Server deleted successfully");
    }
}
