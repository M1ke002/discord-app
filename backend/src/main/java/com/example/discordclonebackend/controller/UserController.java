package com.example.discordclonebackend.controller;

import com.example.discordclonebackend.dto.UserDto;
import com.example.discordclonebackend.dto.request.UserRequest;
import com.example.discordclonebackend.dto.response.StringResponse;
import com.example.discordclonebackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable("userId") Long userId) {
        UserDto userDto = userService.getUserById(userId);
        if (userDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("User not found"));
        }
        return ResponseEntity.ok(userDto);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable("userId") Long userId, @RequestBody UserRequest userRequest) {
        UserDto userDto = userService.updateUser(userId, userRequest);
        if (userDto == null) {
            return ResponseEntity.badRequest().body(new StringResponse("User update failed"));
        }
        return ResponseEntity.ok(userDto);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable("userId") Long userId) {
        Boolean isDeleted = userService.deleteUser(userId);
        if (!isDeleted) {
            return ResponseEntity.badRequest().body(new StringResponse("User deletion failed"));
        }
        return ResponseEntity.ok(new StringResponse("User deleted successfully"));
    }

    @PutMapping("changePassword")
    public ResponseEntity<?> changePassword(@RequestBody UserRequest userRequest) {
        Boolean isChanged = userService.changePassword(userRequest);
        if (!isChanged) {
            return ResponseEntity.badRequest().body(new StringResponse("Password change failed"));
        }
        return ResponseEntity.ok(new StringResponse("Password changed successfully"));
    }
}
