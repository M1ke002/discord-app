package com.example.discordclonebackend.service;

import com.example.discordclonebackend.dto.request.RegisterRequest;

public interface UserService {
    public boolean existsByUsername(String username);

    public String register(RegisterRequest registerRequest);
}
