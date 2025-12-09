package com.codetogether.backend.service.impl;

import com.codetogether.backend.dto.FolderRequest;
import com.codetogether.backend.dto.FolderResponse;
import com.codetogether.backend.mapper.FolderMapper;
import com.codetogether.backend.model.Folder;
import com.codetogether.backend.repository.FolderRepository;
import com.codetogether.backend.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class FolderServiceImpl implements FolderService {

    private final FolderRepository folderRepository;
    private final FolderMapper folderMapper;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public FolderResponse createFolder(FolderRequest request) {
        if (folderRepository.findByRoomIdAndName(request.roomId(), request.name()).isPresent()) {
            throw new IllegalArgumentException("Folder with name " + request.name() + " already exists in this room.");
        }

        Folder folder = Folder.builder()
                .roomId(request.roomId())
                .name(request.name())
                .build();

        folder = folderRepository.save(folder);
        FolderResponse response = folderMapper.toResponse(folder);

        broadcast(request.roomId(), "folder-created", response);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FolderResponse> listFoldersByRoom(UUID roomId) {
        return folderRepository.findAllByRoomIdOrderByCreatedAtAsc(roomId).stream()
                .map(folderMapper::toResponse)
                .toList();
    }

    @Override
    public FolderResponse renameFolder(UUID folderId, String newName) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        // Check uniqueness (ignoring self)
        folderRepository.findByRoomIdAndName(folder.getRoomId(), newName)
                .ifPresent(existing -> {
                    if (!existing.getId().equals(folderId)) {
                        throw new IllegalArgumentException("Folder name already taken");
                    }
                });

        folder.setName(newName);
        folder = folderRepository.save(folder);
        FolderResponse response = folderMapper.toResponse(folder);

        broadcast(folder.getRoomId(), "folder-renamed", response);
        return response;
    }

    @Override
    public void deleteFolder(UUID folderId) {
        Folder folder = folderRepository.findById(folderId)
                .orElseThrow(() -> new RuntimeException("Folder not found"));

        UUID roomId = folder.getRoomId();
        // Since we defined ON DELETE CASCADE in DB and FetchType.LAZY implicitly,
        // JPA standard delete should work. We rely on DB cascade for performance or
        // implicit JPA cascade.
        // Given simple prompt, repository.delete is fine.
        folderRepository.delete(folder);

        broadcast(roomId, "folder-deleted", Map.of("id", folderId));
    }

    private void broadcast(UUID roomId, String type, Object payload) {
        messagingTemplate.convertAndSend("/topic/folder/" + roomId, (Object) Map.of("type", type, "payload", payload));
    }
}
