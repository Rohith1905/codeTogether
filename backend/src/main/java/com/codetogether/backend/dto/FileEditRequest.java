package com.codetogether.backend.dto;

import lombok.Data;

@Data
public class FileEditRequest {
    private String roomId;
    private String fileId;
    private String content; // Full content or patch, simplier to use content for now
    // Could add patch/delta support later
}
