package com.codetogether.backend.service;

import com.codetogether.backend.dto.RoomRequest;
import com.codetogether.backend.dto.RoomResponse;

import java.util.List;
import java.util.UUID;

public interface RoomService {
    RoomResponse createRoom(RoomRequest roomRequest, String username);

    RoomResponse getRoom(UUID id);

    List<RoomResponse> getMyRooms(String username);

    // Keeping for compatibility with potential admin features or existing code
    List<RoomResponse> getAllRooms();

    void deleteRoom(UUID id);
}
