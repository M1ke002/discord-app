package com.example.discordclonebackend.controller;

import com.example.discordclonebackend.dto.ConversationDto;
import com.example.discordclonebackend.dto.response.StringResponse;
import com.example.discordclonebackend.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/conversations")
public class ConversationController {

    @Autowired
    private ConversationService conversationService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getConversationsForUser(@PathVariable("userId") Long userId) {
        List<ConversationDto> conversations = conversationService.getConversationsForUser(userId);
        if (conversations == null) {
            return ResponseEntity.badRequest().body(new StringResponse("User does not exist"));
        }
        return ResponseEntity.ok(conversations);
    }
}
