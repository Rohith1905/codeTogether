package com.codetogether.backend.service.impl;

import com.codetogether.backend.dto.RoomRequest;
import com.codetogether.backend.dto.RoomResponse;
import com.codetogether.backend.model.Room;
import com.codetogether.backend.model.User;
import com.codetogether.backend.repository.RoomRepository;
import com.codetogether.backend.repository.UserRepository;
import com.codetogether.backend.service.RoomService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    public RoomServiceImpl(RoomRepository roomRepository, UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
    }

    @Override
    public RoomResponse createRoom(RoomRequest roomRequest, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Room room = new Room();
        room.setName(roomRequest.getName());
        room.setCreatedBy(user);

        Room savedRoom = roomRepository.save(room);
        return mapToResponse(savedRoom);
    }

    @Override
    @Transactional(readOnly = true)
    public RoomResponse getRoom(UUID id) {
        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        return mapToResponse(room);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> getMyRooms(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return roomRepository.findByCreatedBy_Id(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteRoom(UUID id) {
        roomRepository.deleteById(id);
    }

    private RoomResponse mapToResponse(Room room) {
        return new RoomResponse(
                room.getId(),
                room.getName(),
                room.getCreatedAt(),
                room.getCreatedBy() != null ? room.getCreatedBy().getUsername() : null,
                room.getCreatedBy() != null ? room.getCreatedBy().getId() : null);
    }
}
