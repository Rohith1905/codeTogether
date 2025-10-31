package com.codetogether.backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomPresenceRequest {
    private String roomId;
    private String username;
    private String timestamp; // Optional, can ignore
}
