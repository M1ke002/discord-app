package com.example.discordclonebackend.dto.response;

import com.example.discordclonebackend.dto.DirectMessageDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DirectMessageResponse {
    private List<DirectMessageDto> messages = new ArrayList<>();
    private Integer nextPage;

    public DirectMessageResponse(Integer nextPage) {
        this.nextPage = nextPage;
    }
}
