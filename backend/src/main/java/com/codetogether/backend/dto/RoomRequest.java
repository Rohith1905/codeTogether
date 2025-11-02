package com.codetogether.backend.dto;

public class RoomRequest {
    private String name;

    public RoomRequest() {
    }

    public RoomRequest(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
