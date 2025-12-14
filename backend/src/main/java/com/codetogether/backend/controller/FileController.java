package com.codetogether.backend.controller;

import com.codetogether.backend.dto.FileRequest;
import com.codetogether.backend.dto.FileResponse;
import com.codetogether.backend.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class FileController {

    private final FileService fileService;

    @PostMapping
    public ResponseEntity<FileResponse> createFile(@RequestBody FileRequest request) {
        return new ResponseEntity<>(fileService.createFile(request), HttpStatus.CREATED);
    }

    @GetMapping("/folder/{folderId}")
    public ResponseEntity<List<FileResponse>> listFiles(@PathVariable UUID folderId) {
        return ResponseEntity.ok(fileService.listFilesByFolder(folderId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FileResponse> getFile(@PathVariable UUID id) {
        return ResponseEntity.ok(fileService.getFile(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FileResponse> renameFile(@PathVariable UUID id, @RequestBody FileRequest request) {
        return ResponseEntity.ok(fileService.renameFile(id, request.name()));
    }

    @PutMapping("/{id}/content")
    public ResponseEntity<FileResponse> updateFileContent(@PathVariable UUID id, @RequestBody FileRequest request) {
        return ResponseEntity.ok(fileService.updateFileContent(id, request.content()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable UUID id) {
        fileService.deleteFile(id);
        return ResponseEntity.noContent().build();
    }
}
