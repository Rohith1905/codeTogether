package com.codetogether.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record CodeSyncResponse(
        UUID fileId,
        String content,
        String user,
        LocalDateTime timestamp,
        CursorPosition cursorPos) {
}
