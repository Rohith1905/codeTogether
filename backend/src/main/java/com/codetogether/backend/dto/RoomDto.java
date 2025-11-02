package com.codetogether.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record RoomDto(UUID id, LocalDateTime createdAt, LocalDateTime updatedAt) {
}
