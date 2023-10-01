package com.example.discordclonebackend.service;

import com.example.discordclonebackend.dto.UserDto;
import com.example.discordclonebackend.dto.request.RegisterRequest;
import com.example.discordclonebackend.dto.request.UserRequest;

public interface UserService {
    public boolean existsByUsername(String username);

    public String register(RegisterRequest registerRequest);

    public UserDto getUserById(Long userId);

    public UserDto updateUser(Long userId, UserRequest userRequest);

    public Boolean deleteUser(Long userId);

    public Boolean changePassword(UserRequest userRequest);
}
