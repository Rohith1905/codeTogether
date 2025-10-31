package com.codetogether.backend.dto;

import java.util.Set;
import java.util.UUID;

public record RoomPresence(
        UUID roomId,
        Set<UserPresence> onlineUsers,
        int totalOnline) {
}
