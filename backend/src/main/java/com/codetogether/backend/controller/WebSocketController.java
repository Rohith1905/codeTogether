package com.codetogether.backend.controller;

import com.codetogether.backend.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * WebSocket controller for handling real-time collaboration messages.
 * Manages code changes, cursor positions, and chat messages within rooms.
 */
@Controller
public class WebSocketController {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    /**
     * Handle code change events in a room.
     * Receives code changes from a user and broadcasts to all users in the room.
     * 
     * Endpoint: /app/room/{roomId}/code
     * Broadcast to: /topic/room/{roomId}/code
     * 
     * @param roomId  the room ID
     * @param message the code change message containing file changes
     * @return CodeSyncResponse to broadcast to all clients
     */
    @MessageMapping("/room/{roomId}/code")
    @SendTo("/topic/room/{roomId}/code")
    public CodeSyncResponse handleCodeChange(
            @DestinationVariable UUID roomId,
            @Payload CodeChangeMessage message,
            SimpMessageHeaderAccessor headerAccessor) {

        logger.debug("Code change received for room: {}, file: {}, user: {}",
                roomId, message.fileId(), message.userId());

        // Transform to response with server timestamp
        return new CodeSyncResponse(
                message.fileId(),
                message.content(),
                message.userId(),
                LocalDateTime.now(),
                message.cursorPos());
    }

    /**
     * Handle cursor position updates in a room.
     * Receives cursor position from a user and broadcasts to all users in the room.
     * 
     * Endpoint: /app/room/{roomId}/cursor
     * Broadcast to: /topic/room/{roomId}/cursor
     * 
     * @param roomId  the room ID
     * @param message the cursor message with position and user info
     * @return CursorMessage to broadcast to all clients except sender
     */
    @MessageMapping("/room/{roomId}/cursor")
    @SendTo("/topic/room/{roomId}/cursor")
    public CursorMessage handleCursorPosition(
            @DestinationVariable UUID roomId,
            @Payload CursorMessage message,
            SimpMessageHeaderAccessor headerAccessor) {

        logger.trace("Cursor update for room: {}, file: {}, user: {}, pos: {}:{}",
                roomId, message.fileId(), message.username(),
                message.cursorPosition().line(), message.cursorPosition().column());

        // Return message with server timestamp
        return new CursorMessage(
                message.roomId(),
                message.fileId(),
                message.username(),
                message.cursorPosition(),
                System.currentTimeMillis());
    }

    /**
     * Handle chat messages in a room.
     * Receives chat message from a user and broadcasts to all users in the room.
     * 
     * Endpoint: /app/room/{roomId}/chat
     * Broadcast to: /topic/room/{roomId}/chat
     * 
     * @param roomId  the room ID
     * @param message the chat message
     * @return ChatMessage to broadcast to all clients
     */
    @MessageMapping("/room/{roomId}/chat")
    @SendTo("/topic/room/{roomId}/chat")
    public ChatMessage handleChatMessage(
            @DestinationVariable UUID roomId,
            @Payload ChatMessage message,
            SimpMessageHeaderAccessor headerAccessor) {

        logger.debug("Chat message received for room: {}, user: {}",
                roomId, message.username());

        return message;
    }
}
