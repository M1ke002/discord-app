package com.example.discordclonebackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileDto {
    private String fileName;
    private String fileUrl;
    private String fileKey;
}
