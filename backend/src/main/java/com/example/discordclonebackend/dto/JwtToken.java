package com.example.discordclonebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtToken {
    private TokenType tokenType;
    private String token;
    private Long duration;
    public enum TokenType {
        ACCESS, REFRESH
    }
}
