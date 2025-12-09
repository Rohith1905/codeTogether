package com.codetogether.backend.dto;

import java.time.Instant;
import java.util.UUID;

public record FolderResponse(
        UUID id,
        UUID roomId,
        String name,
        Instant createdAt,
        Instant updatedAt) {
}
