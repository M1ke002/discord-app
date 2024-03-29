package com.example.discordclonebackend.controller;

import com.corundumstudio.socketio.SocketIOServer;
import com.example.discordclonebackend.dto.ChannelMessageDto;
import com.example.discordclonebackend.dto.request.ChannelMessageRequest;
import com.example.discordclonebackend.dto.response.ChannelMessageResponse;
import com.example.discordclonebackend.dto.response.SearchChannelMessageResponse;
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

//    @Autowired
//    private SocketIOServer socketIOServer;

    //example request: http://localhost:8080/api/v1/channelMessages?cursor=123&limit=20&direction=forward&channelId=1&serverId=1
    @GetMapping("")
    public ResponseEntity<?> getMessages(
            @RequestParam("cursor") Long cursor,
            @RequestParam("limit") Integer limit,
            @RequestParam("direction") String direction, //can be "forward" or "backward" or "around"
            @RequestParam("channelId") Long channelId,
            @RequestParam("serverId") Long serverId) {
        if (limit == null) {
            limit = 30;
        }
        ChannelMessageResponse channelMessageResponse = channelMessageService.getMessages(cursor, limit, direction, channelId, serverId);
        if (channelMessageResponse == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Message retrieval failed"));
        }
        return ResponseEntity.ok(channelMessageResponse);
    }

    //example request: http://localhost:8080/api/v1/channelMessages/1?serverId=1
    @GetMapping("/{messageId}")
    public ResponseEntity<?> getMessageById(
            @PathVariable("messageId") Long messageId,
            @RequestParam("serverId") Long serverId) {
        ChannelMessageDto channelMessageDto = channelMessageService.getMessageById(messageId, serverId);
        if (channelMessageDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Message not found"));
        }
        return ResponseEntity.ok(channelMessageDto);
    }

    //example request: http://localhost:8080/api/v1/messages/count?fromMessageId=1&toMessageId=2&channelId=1
    @GetMapping("/count")
    public ResponseEntity<?> getMessagesCount(
            @RequestParam("fromMessageId") Long fromMessageId,
            @RequestParam("toMessageId") Long toMessageId,
            @RequestParam("channelId") Long channelId) {
        Long count = channelMessageService.getMessagesCount(fromMessageId, toMessageId, channelId);
        if (count == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Message count retrieval failed"));
        }
        return ResponseEntity.ok(new StringResponse(count.toString()));
    }

    //sample request: http://localhost:8080/api/v1/messages/search?page=0&userId=1&hasFile=true&content=hello&serverId=1
    @GetMapping("/search")
    public ResponseEntity<?> searchMessages(
            @RequestParam("page") Integer page,
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "hasFile", required = false) Boolean hasFile,
            @RequestParam(value = "content", required = false) String content,
            @RequestParam("serverId") Long serverId
    ) {
        SearchChannelMessageResponse searchChannelMessageResponse = channelMessageService.searchMessages(page, userId, hasFile, content, serverId);
        return ResponseEntity.ok(searchChannelMessageResponse);
    }

    @GetMapping("test")
    public ResponseEntity<?> test() {
//        socketIOServer.getBroadcastOperations().sendEvent("testSocket", new StringResponse("test"));
        return ResponseEntity.ok(new StringResponse("test"));
    }

    @PostMapping("")
    public ResponseEntity<?> createMessage(@RequestBody ChannelMessageRequest channelMessageRequest) {
        ChannelMessageDto createdChannelMessageDto = channelMessageService.createMessage(channelMessageRequest);
        if (createdChannelMessageDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Message creation failed"));
        }
        String event = "chat:" + channelMessageRequest.getChannelId() + ":new-message";
//        socketIOServer.getBroadcastOperations().sendEvent(event, createdChannelMessageDto);
        return ResponseEntity.ok(createdChannelMessageDto);
    }

    @PutMapping("/{messageId}")
    public ResponseEntity<?> updateMessage(@PathVariable("messageId") Long messageId, @RequestBody ChannelMessageRequest channelMessageRequest) {
        ChannelMessageDto updatedChannelMessageDto = channelMessageService.updateMessage(messageId, channelMessageRequest);
        if (updatedChannelMessageDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("Message update failed"));
        }
        String event = "chat:" + channelMessageRequest.getChannelId() + ":update-message";
//        socketIOServer.getBroadcastOperations().sendEvent(event, updatedChannelMessageDto);
        return ResponseEntity.ok(updatedChannelMessageDto);
    }

    //example request: http://localhost:8080/api/v1/messages/1?userId=1&channelId=1&serverId=1
    @DeleteMapping("/{messageId}")
    public ResponseEntity<?> deleteMessage(
            @PathVariable("messageId") Long messageId,
            @RequestParam("userId") Long userId,
            @RequestParam("channelId") Long channelId,
            @RequestParam("serverId") Long serverId) {
        Boolean isDeleted = channelMessageService.deleteMessage(messageId, userId, serverId);
        if (!isDeleted) {
            return ResponseEntity.badRequest().body(new StringResponse("Message deletion failed"));
        }
        String event = "chat:" + channelId + ":delete-message";
//        socketIOServer.getBroadcastOperations().sendEvent(event, messageId);
        return ResponseEntity.ok(new StringResponse("Message deleted successfully"));
    }
}
