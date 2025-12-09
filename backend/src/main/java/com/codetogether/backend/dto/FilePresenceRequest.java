package com.codetogether.backend.dto;

import lombok.Data;

@Data
public class FilePresenceRequest {
    private String roomId;
    private String fileId;
    private String username; // Or userId, helpful for tracking who is editing
}
