package com.example.discordclonebackend.controller;

import com.corundumstudio.socketio.SocketIOServer;
import com.example.discordclonebackend.dto.ChannelMessageDto;
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

//    @Autowired
//    private SocketIOServer socketIOServer;

    @Autowired
    private DirectMessageService directMessageService;

    //example request: http://localhost:8080/api/v1/direct-messages?page=0&limit=20&direction=forward&userId1=1&userId2=2
    @GetMapping("")
    public ResponseEntity<?> getDirectMessages(
            @RequestParam("cursor") Long cursor,
            @RequestParam("limit") Integer limit,
            @RequestParam("direction") String direction, //can be "forward" or "backward" or "around"
            @RequestParam("userId1") Long userId1,
            @RequestParam("userId2") Long userId2) {
        if (limit == null) {
            limit = 20;
        }
        DirectMessageResponse directMessageResponse = directMessageService.getMessages(cursor, limit, direction, userId1, userId2);
        if (directMessageResponse == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Message retrieval failed"));
        }
        return ResponseEntity.ok(directMessageResponse);
    }

    //example request: http://localhost:8080/api/v1/direct-messages/1
    @GetMapping("/{messageId}")
    public ResponseEntity<?> getMessageById(@PathVariable("messageId") Long messageId) {
        DirectMessageDto directMessageDto = directMessageService.getMessageById(messageId);
        if (directMessageDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Message not found"));
        }
        return ResponseEntity.ok(directMessageDto);
    }

    //example request: http://localhost:8080/api/v1/messages/count?fromMessageId=1&toMessageId=2&userId1=1&userId2=2
    @GetMapping("/count")
    public ResponseEntity<?> getMessagesCount(
            @RequestParam("fromMessageId") Long fromMessageId,
            @RequestParam("toMessageId") Long toMessageId,
            @RequestParam("userId1") Long userId1,
            @RequestParam("userId2") Long userId2) {
        Long count = directMessageService.getMessagesCount(fromMessageId, toMessageId, userId1, userId2);
        if (count == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Message count retrieval failed"));
        }
        return ResponseEntity.ok(new StringResponse(count.toString()));
    };

    @PostMapping("")
    public ResponseEntity<?> createDirectMessage(@RequestBody DirectMessageRequest directMessageRequest) {
        DirectMessageDto directMessageDto = directMessageService.createMessage(directMessageRequest);
        if (directMessageDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Message creation failed"));
        }
        String event1 = "chat:" + directMessageRequest.getUserId1() + "-" + directMessageRequest.getUserId2() + ":new-message";
        String event2 = "chat:" + directMessageRequest.getUserId2() + "-" + directMessageRequest.getUserId1() + ":new-message";
//        socketIOServer.getBroadcastOperations().sendEvent(event1, directMessageDto);
//        socketIOServer.getBroadcastOperations().sendEvent(event2, directMessageDto);
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
//        socketIOServer.getBroadcastOperations().sendEvent(event1, directMessageDto);
//        socketIOServer.getBroadcastOperations().sendEvent(event2, directMessageDto);
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
//        socketIOServer.getBroadcastOperations().sendEvent(event1, directMessageId);
//        socketIOServer.getBroadcastOperations().sendEvent(event2, directMessageId);
        return ResponseEntity.ok(new StringResponse("Message deleted"));
    }
}
