package com.codetogether.backend.service.impl;

import com.codetogether.backend.dto.FileRequest;
import com.codetogether.backend.dto.FileResponse;
import com.codetogether.backend.mapper.FileMapper;
import com.codetogether.backend.model.File;
import com.codetogether.backend.model.Folder;
import com.codetogether.backend.repository.FileRepository;
import com.codetogether.backend.repository.FolderRepository;
import com.codetogether.backend.service.FileService;
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
public class FileServiceImpl implements FileService {

    private final FileRepository fileRepository;
    private final FolderRepository folderRepository; // To get RoomID for broadcast
    private final FileMapper fileMapper;
    private final SimpMessagingTemplate messagingTemplate;

    @Override
    public FileResponse createFile(FileRequest request) {
        if (fileRepository.findByFolderIdAndName(request.folderId(), request.name()).isPresent()) {
            throw new IllegalArgumentException("File with name " + request.name() + " already exists in this folder.");
        }

        File file = File.builder()
                .folderId(request.folderId())
                .name(request.name())
                .content(request.content())
                .build();

        file = fileRepository.save(file);
        FileResponse response = fileMapper.toResponse(file);

        broadcast(request.folderId(), "file-created", response);
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<FileResponse> listFilesByFolder(UUID folderId) {
        return fileRepository.findAllByFolderIdOrderByCreatedAtAsc(folderId).stream()
                .map(fileMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public FileResponse getFile(UUID fileId) {
        return fileRepository.findById(fileId)
                .map(fileMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("File not found"));
    }

    @Override
    public FileResponse renameFile(UUID fileId, String newName) {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        fileRepository.findByFolderIdAndName(file.getFolderId(), newName)
                .ifPresent(existing -> {
                    if (!existing.getId().equals(fileId)) {
                        throw new IllegalArgumentException("File name already taken");
                    }
                });

        file.setName(newName);
        file = fileRepository.save(file);
        FileResponse response = fileMapper.toResponse(file);

        broadcast(file.getFolderId(), "file-renamed", response);
        return response;
    }

    @Override
    public FileResponse updateFileContent(UUID fileId, String content) {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        file.setContent(content);
        file = fileRepository.save(file);
        FileResponse response = fileMapper.toResponse(file);

        broadcast(file.getFolderId(), "file-updated", response);
        return response;
    }

    @Override
    public void deleteFile(UUID fileId) {
        File file = fileRepository.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));

        UUID folderId = file.getFolderId();
        fileRepository.delete(file);

        broadcast(folderId, "file-deleted", Map.of("id", fileId));
    }

    private void broadcast(UUID folderId, String type, Object payload) {
        // Need to find roomId from folder to broadcast to /topic/folder/{roomId}
        // In a real app we might cache this or store roomId on File too.
        // For now, we fetch the folder.
        Folder folder = folderRepository.findById(folderId).orElse(null);
        if (folder != null) {
            messagingTemplate.convertAndSend("/topic/folder/" + folder.getRoomId(),
                    (Object) Map.of("type", type, "payload", payload));
        }
    }
}
