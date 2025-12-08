package com.codetogether.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Message class for broadcasting code changes in real-time.
 * Used when a user edits code in a collaborative session.
 */
public record CodeChangeMessage(
        UUID roomId,
        UUID fileId,
        String content,
        CursorPosition cursorPos,
        LocalDateTime timestamp,
        String userId) {
    public CodeChangeMessage(UUID roomId, UUID fileId, String content, CursorPosition cursorPos, String userId) {
        this(roomId, fileId, content, cursorPos, LocalDateTime.now(), userId);
    }
}
