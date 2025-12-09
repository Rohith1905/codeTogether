package com.codetogether.backend.dto;

import java.util.UUID;

public record FolderRequest(
        String name,
        UUID roomId) {
}
