package com.codetogether.backend.dto;

import java.util.UUID;

public record CursorMessage(
        UUID roomId,
        UUID fileId,
        String username,
        CursorPosition cursorPosition,
        Long timestamp) {
    public CursorMessage(UUID roomId, UUID fileId, String username, CursorPosition cursorPosition) {
        this(roomId, fileId, username, cursorPosition, System.currentTimeMillis());
    }
}
