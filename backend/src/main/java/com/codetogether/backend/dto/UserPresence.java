package com.codetogether.backend.dto;

import java.time.LocalDateTime;

public record UserPresence(
        String username,
        LocalDateTime joinedAt,
        LocalDateTime lastSeen) {
}
