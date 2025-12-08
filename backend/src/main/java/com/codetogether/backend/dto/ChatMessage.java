package com.codetogether.backend.dto;

import java.util.UUID;

/**
 * Message class for broadcasting chat messages in real-time.
 * Used for team communication within a collaborative room.
 */
public record ChatMessage(
        String userId,
        String username,
        UUID roomId,
        String content,
        String type, // CHAT, JOIN, LEAVE
        Long timestamp) {
    public ChatMessage(String userId, String username, UUID roomId, String content, String type) {
        this(userId, username, roomId, content, type, System.currentTimeMillis());
    }
}
