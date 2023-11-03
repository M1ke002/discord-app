package com.example.discordclonebackend.controller;

import com.corundumstudio.socketio.SocketIOServer;
import com.example.discordclonebackend.dto.DirectMessageDto;
import com.example.discordclonebackend.dto.request.DirectMessageRequest;
import com.example.discordclonebackend.dto.response.DirectMessageResponse;
import com.example.discordclonebackend.dto.response.StringResponse;
import com.example.discordclonebackend.service.DirectMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/direct-messages")
public class DirectMessageController {

    @Autowired
    private SocketIOServer socketIOServer;

    @Autowired
    private DirectMessageService directMessageService;

    //example request: http://localhost:8080/api/v1/direct-messages?page=0&userId1=1&userId2=2
    @GetMapping("")
    public ResponseEntity<?> getDirectMessages(@RequestParam("page") Integer page, @RequestParam("userId1") Long userId1, @RequestParam("userId2") Long userId2) {
        DirectMessageResponse directMessageResponse = directMessageService.getMessages(page, userId1, userId2);
        if (directMessageResponse == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Message retrieval failed"));
        }
        return ResponseEntity.ok(directMessageResponse);
    }

    @PostMapping("")
    public ResponseEntity<?> createDirectMessage(@RequestBody DirectMessageRequest directMessageRequest) {
        DirectMessageDto directMessageDto = directMessageService.createMessage(directMessageRequest);
        if (directMessageDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Message creation failed"));
        }
        String event1 = "chat:" + directMessageRequest.getUserId1() + "-" + directMessageRequest.getUserId2() + ":new-message";
        String event2 = "chat:" + directMessageRequest.getUserId2() + "-" + directMessageRequest.getUserId1() + ":new-message";
        socketIOServer.getBroadcastOperations().sendEvent(event1, directMessageDto);
        socketIOServer.getBroadcastOperations().sendEvent(event2, directMessageDto);
        return ResponseEntity.ok(directMessageDto);
    }

    @PutMapping("/{directMessageId}")
    public ResponseEntity<?> updateDirectMessage(@PathVariable("directMessageId") Long directMessageId, @RequestBody DirectMessageRequest directMessageRequest) {
        DirectMessageDto directMessageDto = directMessageService.updateMessage(directMessageId, directMessageRequest);
        if (directMessageDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Message update failed"));
        }
        String event1 = "chat:" + directMessageRequest.getUserId1() + "-" + directMessageRequest.getUserId2() + ":update-message";
        String event2 = "chat:" + directMessageRequest.getUserId2() + "-" + directMessageRequest.getUserId1() + ":update-message";
        socketIOServer.getBroadcastOperations().sendEvent(event1, directMessageDto);
        socketIOServer.getBroadcastOperations().sendEvent(event2, directMessageDto);
        return ResponseEntity.ok(directMessageDto);
    }

    @DeleteMapping("/{directMessageId}")
    public ResponseEntity<?> deleteDirectMessage(
            @PathVariable("directMessageId") Long directMessageId,
            @RequestParam("userId") Long userId,
            @RequestParam("otherUserId") Long otherUserId) {
        Boolean isDeleted = directMessageService.deleteMessage(directMessageId, userId, otherUserId);
        if (!isDeleted) {
            return ResponseEntity.badRequest().body(new StringResponse("Message deletion failed"));
        }
        String event1 = "chat:" + userId + "-" + otherUserId + ":delete-message";
        String event2 = "chat:" + otherUserId + "-" + userId + ":delete-message";
        socketIOServer.getBroadcastOperations().sendEvent(event1, directMessageId);
        socketIOServer.getBroadcastOperations().sendEvent(event2, directMessageId);
        return ResponseEntity.ok(new StringResponse("Message deleted"));
    }
}