package com.codetogether.backend.dto;

import java.util.UUID;

public record FileRequest(
        String name,
        UUID folderId,
        String content) {
}
