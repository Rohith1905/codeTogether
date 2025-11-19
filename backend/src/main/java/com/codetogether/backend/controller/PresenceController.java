package com.codetogether.backend.controller;

import com.codetogether.backend.dto.SimpleUser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@Slf4j
public class PresenceController {

    private final SimpMessagingTemplate messagingTemplate;

    // roomId -> Set<SimpleUser>
    private final Map<String, Set<SimpleUser>> roomOnlineUsers = new ConcurrentHashMap<>();

    @MessageMapping("/presence.join")
    public void handleJoin(@Payload Map<String, String> payload) {
        String roomId = payload.get("roomId");
        String userId = payload.get("userId");
        String name = payload.get("name");

        if (roomId == null || userId == null || name == null)
            return;

        SimpleUser user = new SimpleUser(userId, name);
        roomOnlineUsers.computeIfAbsent(roomId, k -> ConcurrentHashMap.newKeySet()).add(user);

        broadcastPresence(roomId);
        broadcastJoin(roomId, name);
    }

    // Improved handleLeave to capture name
    @MessageMapping("/presence.leave")
    public void handleLeave(@Payload Map<String, String> payload) {
        String roomId = payload.get("roomId");
        String userId = payload.get("userId");

        if (roomId == null || userId == null)
            return;

        Set<SimpleUser> users = roomOnlineUsers.get(roomId);
        if (users != null) {
            // Find user to get name
            String name = users.stream()
                    .filter(u -> u.getUserId().equals(userId))
                    .findFirst()
                    .map(SimpleUser::getName)
                    .orElse("A user");

            boolean removed = users.removeIf(u -> u.getUserId().equals(userId));
            if (users.isEmpty()) {
                roomOnlineUsers.remove(roomId);
            }

            if (removed) {
                broadcastPresence(roomId);
                broadcastLeave(roomId, name);
            }
        }
    }

    private void broadcastJoin(String roomId, String username) {
        Map<String, Object> message = Map.of(
                "type", "presence.event",
                "event", "joined",
                "message", username + " has joined");
        messagingTemplate.convertAndSend((String) ("/topic/room." + roomId + ".presence"), message);
    }

    private void broadcastLeave(String roomId, String username) {
        Map<String, Object> message = Map.of(
                "type", "presence.event",
                "event", "left",
                "message", username + " has left");
        messagingTemplate.convertAndSend((String) ("/topic/room." + roomId + ".presence"), message);
    }

    private void broadcastPresence(String roomId) {
        Set<SimpleUser> users = roomOnlineUsers.get(roomId);
        if (users == null)
            return;

        // Topic: /topic/room.{roomId}.presence
        // Event logic: The frontend expects "presence.users".
        // We'll wrap it: { type: "presence.users", users: [...] }

        Map<String, Object> message = Map.of(
                "type", "presence.users",
                "users", users);

        messagingTemplate.convertAndSend((String) ("/topic/room." + roomId + ".presence"), message);
    }
}
