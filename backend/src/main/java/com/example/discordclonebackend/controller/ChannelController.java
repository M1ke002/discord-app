package com.example.discordclonebackend.controller;

import com.example.discordclonebackend.dto.ChannelDto;
import com.example.discordclonebackend.dto.request.ChannelRequest;
import com.example.discordclonebackend.dto.response.StringResponse;
import com.example.discordclonebackend.service.ChannelService;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/channels")
public class ChannelController {

    @Autowired
    private ChannelService channelService;

    @GetMapping("/{channelId}") //TESTED
    public ResponseEntity<?> getChannelById(@PathVariable("channelId") Long channelId) {
        ChannelDto channelDto = channelService.getChannelById(channelId);
        if (channelDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Channel not found"));
        }
        return ResponseEntity.ok(channelDto);
    }

    @PostMapping("") //TESTED
    public ResponseEntity<?> createChannel(@RequestBody ChannelRequest channelRequest) {
        ChannelDto channelDto = channelService.createChannel(channelRequest);
        if (channelDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Channel creation failed"));
        }
        return ResponseEntity.ok(channelDto);
    }

    @PutMapping("/{channelId}") //TESTED
    public ResponseEntity<?> editChannel(@PathVariable("channelId") Long channelId, @RequestBody ChannelRequest channelRequest) {
        ChannelDto channelDto = channelService.editChannel(channelId, channelRequest);
        if (channelDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Channel edit failed"));
        }
        return ResponseEntity.ok(channelDto);
    }

    //example request: http://localhost:8080/api/v1/channels/1?userId=1&serverId=1
    @DeleteMapping("/{channelId}") //TESTED
    public ResponseEntity<?> deleteChannel(
            @PathVariable("channelId") Long channelId,
            @RequestParam("userId") Long userId,
            @RequestParam("serverId") Long serverId) {
        Boolean isDeleted = channelService.deleteChannel(channelId, userId, serverId);
        if (!isDeleted) {
            return ResponseEntity.badRequest().body(new StringResponse("Channel deletion failed"));
        }
        return ResponseEntity.ok(new StringResponse("Channel deleted successfully"));
    }
}
