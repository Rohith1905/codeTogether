package com.codetogether.backend.controller;

import com.codetogether.backend.dto.FolderRequest;
import com.codetogether.backend.dto.FolderResponse;
import com.codetogether.backend.service.FolderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/folders")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class FolderController {

    private final FolderService folderService;

    @PostMapping
    public ResponseEntity<FolderResponse> createFolder(@RequestBody FolderRequest request) {
        return new ResponseEntity<>(folderService.createFolder(request), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FolderResponse>> listFoldersByRoom(@RequestParam UUID roomId) {
        return ResponseEntity.ok(folderService.listFoldersByRoom(roomId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FolderResponse> renameFolder(@PathVariable UUID id, @RequestBody FolderRequest request) {
        // We use request.name() for the new name
        return ResponseEntity.ok(folderService.renameFolder(id, request.name()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFolder(@PathVariable UUID id) {
        folderService.deleteFolder(id);
        return ResponseEntity.noContent().build();
    }
}
