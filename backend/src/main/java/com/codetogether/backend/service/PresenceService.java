package com.codetogether.backend.service;

import com.codetogether.backend.dto.RoomPresence;
import com.codetogether.backend.dto.UserPresence;

import java.util.Set;
import java.util.UUID;

/**
 * Service for tracking user presence in rooms.
 * Currently uses in-memory storage (ConcurrentHashMap).
 * Designed to be easily switchable to Redis in the future.
 */
public interface PresenceService {

    /**
     * Add a user to a room's presence list
     */
    void userJoinedRoom(UUID roomId, String username);

    /**
     * Remove a user from a room's presence list
     */
    void userLeftRoom(UUID roomId, String username);

    /**
     * Update user's last seen timestamp
     */
    void updateLastSeen(UUID roomId, String username);

    /**
     * Get all online users in a room
     */
    Set<UserPresence> getOnlineUsers(UUID roomId);

    /**
     * Get room presence information
     */
    RoomPresence getRoomPresence(UUID roomId);

    /**
     * Check if a user is online in a room
     */
    boolean isUserOnline(UUID roomId, String username);

    /**
     * Remove all users from a room (cleanup)
     */
    void clearRoom(UUID roomId);
}
