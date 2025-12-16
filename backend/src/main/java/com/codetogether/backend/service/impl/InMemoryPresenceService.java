package com.codetogether.backend.service.impl;

import com.codetogether.backend.dto.RoomPresence;
import com.codetogether.backend.dto.UserPresence;
import com.codetogether.backend.service.PresenceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory implementation of PresenceService using ConcurrentHashMap.
 * This implementation is thread-safe and can be easily replaced with Redis
 * later.
 * 
 * To switch to Redis:
 * 1. Create RedisPresenceService implementing PresenceService
 * 2. Use Redis Sets for storing online users per room
 * 3. Use Redis Hashes for storing user metadata (joinedAt, lastSeen)
 * 4. Replace @Service annotation or use @Profile to switch implementations
 */
@Service
public class InMemoryPresenceService implements PresenceService {

    private static final Logger logger = LoggerFactory.getLogger(InMemoryPresenceService.class);

    // Map<RoomId, Map<Username, UserPresence>>
    private final Map<UUID, Map<String, UserPresence>> roomPresence = new ConcurrentHashMap<>();

    @Override
    public void userJoinedRoom(UUID roomId, String username) {
        logger.debug("User {} joined room {}", username, roomId);

        roomPresence.computeIfAbsent(roomId, k -> new ConcurrentHashMap<>())
                .put(username, new UserPresence(username, LocalDateTime.now(), LocalDateTime.now()));
    }

    @Override
    public void userLeftRoom(UUID roomId, String username) {
        logger.debug("User {} left room {}", username, roomId);

        Map<String, UserPresence> users = roomPresence.get(roomId);
        if (users != null) {
            users.remove(username);

            // Clean up empty rooms
            if (users.isEmpty()) {
                roomPresence.remove(roomId);
            }
        }
    }

    @Override
    public void updateLastSeen(UUID roomId, String username) {
        Map<String, UserPresence> users = roomPresence.get(roomId);
        if (users != null && users.containsKey(username)) {
            UserPresence current = users.get(username);
            users.put(username, new UserPresence(
                    username,
                    current.joinedAt(),
                    LocalDateTime.now()));
        }
    }

    @Override
    public Set<UserPresence> getOnlineUsers(UUID roomId) {
        Map<String, UserPresence> users = roomPresence.get(roomId);
        return users != null ? new HashSet<>(users.values()) : Collections.emptySet();
    }

    @Override
    public RoomPresence getRoomPresence(UUID roomId) {
        Set<UserPresence> onlineUsers = getOnlineUsers(roomId);
        return new RoomPresence(roomId, onlineUsers, onlineUsers.size());
    }

    @Override
    public boolean isUserOnline(UUID roomId, String username) {
        Map<String, UserPresence> users = roomPresence.get(roomId);
        return users != null && users.containsKey(username);
    }

    @Override
    public void clearRoom(UUID roomId) {
        logger.debug("Clearing presence for room {}", roomId);
        roomPresence.remove(roomId);
    }
}
