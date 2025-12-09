package com.codetogether.backend.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public class RoomResponse {
    private UUID id;
    private String name;
    private LocalDateTime createdAt;
    private String createdByUsername;
    private UUID createdById;

    public RoomResponse() {
    }

    public RoomResponse(UUID id, String name, LocalDateTime createdAt, String createdByUsername, UUID createdById) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt;
        this.createdByUsername = createdByUsername;
        this.createdById = createdById;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getCreatedByUsername() {
        return createdByUsername;
    }

    public void setCreatedByUsername(String createdByUsername) {
        this.createdByUsername = createdByUsername;
    }

    public UUID getCreatedById() {
        return createdById;
    }

    public void setCreatedById(UUID createdById) {
        this.createdById = createdById;
    }
}
