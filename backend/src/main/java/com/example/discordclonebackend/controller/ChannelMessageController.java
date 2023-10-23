package com.example.discordclonebackend.controller;

import com.corundumstudio.socketio.SocketIOServer;
import com.example.discordclonebackend.dto.ChannelMessageDto;
import com.example.discordclonebackend.dto.request.ChannelMessageRequest;
import com.example.discordclonebackend.dto.response.ChannelMessageResponse;
import com.example.discordclonebackend.dto.response.StringResponse;
import com.example.discordclonebackend.service.ChannelMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/messages")
public class ChannelMessageController {
    @Autowired
    private ChannelMessageService channelMessageService;

    @Autowired
    private SocketIOServer socketIOServer;

    //example request: http://localhost:8080/api/v1/messages?channelId=1&page=0
    @GetMapping("")
    public ResponseEntity<?> getMessages(@RequestParam("page") Integer page, @RequestParam("channelId") Long channelId) {
        ChannelMessageResponse channelMessageResponse = channelMessageService.getMessages(page, channelId);
        return ResponseEntity.ok(channelMessageResponse);
    }

    @GetMapping("test")
    public ResponseEntity<?> test() {
        socketIOServer.getBroadcastOperations().sendEvent("testSocket", new StringResponse("test"));
        return ResponseEntity.ok(new StringResponse("test"));
    }

    @PostMapping("")
    public ResponseEntity<?> createMessage(@RequestBody ChannelMessageRequest channelMessageRequest) {
        ChannelMessageDto createdChannelMessageDto = channelMessageService.createMessage(channelMessageRequest);
        if (createdChannelMessageDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Message creation failed"));
        }
        socketIOServer.getBroadcastOperations().sendEvent("newMessage", createdChannelMessageDto);
        return ResponseEntity.ok(createdChannelMessageDto);
    }

    @PutMapping("/{messageId}")
    public ResponseEntity<?> updateMessage(@PathVariable("messageId") Long messageId, @RequestBody ChannelMessageRequest channelMessageRequest) {
        ChannelMessageDto updatedChannelMessageDto = channelMessageService.updateMessage(messageId, channelMessageRequest);
        if (updatedChannelMessageDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Message update failed"));
        }
        socketIOServer.getBroadcastOperations().sendEvent("updateMessage", updatedChannelMessageDto);
        return ResponseEntity.ok(updatedChannelMessageDto);
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<?> deleteMessage(@PathVariable("messageId") Long messageId) {
        Boolean isDeleted = channelMessageService.deleteMessage(messageId);
        if (!isDeleted) {
            return ResponseEntity.badRequest().body(new StringResponse("Message deletion failed"));
        }
        socketIOServer.getBroadcastOperations().sendEvent("deleteMessage", messageId);
        return ResponseEntity.ok(new StringResponse("Message deleted successfully"));
    }
}
