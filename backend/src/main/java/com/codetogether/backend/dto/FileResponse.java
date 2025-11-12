package com.codetogether.backend.dto;

import java.time.Instant;
import java.util.UUID;

public record FileResponse(
        UUID id,
        UUID folderId,
        String name,
        String content,
        Instant createdAt,
        Instant updatedAt) {
}
