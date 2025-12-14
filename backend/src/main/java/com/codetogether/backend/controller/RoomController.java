package com.codetogether.backend.controller;

import com.codetogether.backend.dto.RoomRequest;
import com.codetogether.backend.dto.RoomResponse;
import com.codetogether.backend.dto.RoomPresence;
import com.codetogether.backend.service.PresenceService;
import com.codetogether.backend.service.RoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
@PreAuthorize("isAuthenticated()")
public class RoomController {

    private final RoomService roomService;
    private final PresenceService presenceService;

    public RoomController(RoomService roomService, PresenceService presenceService) {
        this.roomService = roomService;
        this.presenceService = presenceService;
    }

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(@RequestBody RoomRequest roomRequest,
            Authentication authentication) {
        RoomResponse createdRoom = roomService.createRoom(roomRequest, authentication.getName());
        return new ResponseEntity<>(createdRoom, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getMyRooms(Authentication authentication) {
        List<RoomResponse> rooms = roomService.getMyRooms(authentication.getName());
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomResponse> getRoom(@PathVariable UUID id) {
        RoomResponse room = roomService.getRoom(id);
        return ResponseEntity.ok(room);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable UUID id) {
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/presence")
    public ResponseEntity<RoomPresence> getRoomPresence(@PathVariable UUID id) {
        RoomPresence presence = presenceService.getRoomPresence(id);
        return ResponseEntity.ok(presence);
    }
}
