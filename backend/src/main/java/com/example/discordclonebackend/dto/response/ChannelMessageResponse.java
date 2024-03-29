package com.example.discordclonebackend.dto.response;

import com.example.discordclonebackend.dto.ChannelMessageDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChannelMessageResponse {
    private List<ChannelMessageDto> messages = new ArrayList<>();;
    private Long nextCursor;
    private Long previousCursor;

    public ChannelMessageResponse(Long nextCursor, Long previousCursor) {
        this.nextCursor = nextCursor;
        this.previousCursor = previousCursor;
    }


}
