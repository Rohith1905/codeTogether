package com.codetogether.backend.websocket;

import com.codetogether.backend.service.PresenceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

import java.util.UUID;

/**
 * WebSocket event listener for tracking user presence in rooms.
 * Handles connection, disconnection, and subscription events.
 */
@Component
public class WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    private final PresenceService presenceService;

    public WebSocketEventListener(PresenceService presenceService) {
        this.presenceService = presenceService;
    }

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        logger.debug("New WebSocket connection established");
        // Connection is established, but we track presence on room subscription
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String username = (String) headerAccessor.getSessionAttributes().get("username");
        String roomIdStr = (String) headerAccessor.getSessionAttributes().get("roomId");

        if (username != null && roomIdStr != null) {
            try {
                UUID roomId = UUID.fromString(roomIdStr);
                presenceService.userLeftRoom(roomId, username);
                logger.info("User {} disconnected from room {}", username, roomId);
            } catch (IllegalArgumentException e) {
                logger.error("Invalid roomId format: {}", roomIdStr);
            }
        }
    }

    @EventListener
    public void handleSessionSubscribeEvent(SessionSubscribeEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String destination = headerAccessor.getDestination();

        // Track presence when user subscribes to a room topic
        // Expected format: /topic/room/{roomId}/...
        if (destination != null && destination.startsWith("/topic/room/")) {
            String[] parts = destination.split("/");
            if (parts.length >= 4) {
                try {
                    UUID roomId = UUID.fromString(parts[3]);
                    String username = (String) headerAccessor.getSessionAttributes().get("username");

                    if (username != null) {
                        // Store roomId in session for disconnect handling
                        headerAccessor.getSessionAttributes().put("roomId", roomId.toString());

                        presenceService.userJoinedRoom(roomId, username);
                        logger.info("User {} joined room {}", username, roomId);
                    }
                } catch (IllegalArgumentException e) {
                    logger.error("Invalid roomId in destination: {}", destination);
                }
            }
        }
    }
}
