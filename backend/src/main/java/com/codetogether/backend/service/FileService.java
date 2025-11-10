package com.codetogether.backend.service;

import com.codetogether.backend.dto.FileRequest;
import com.codetogether.backend.dto.FileResponse;
import java.util.List;
import java.util.UUID;

public interface FileService {
    FileResponse createFile(FileRequest request);

    List<FileResponse> listFilesByFolder(UUID folderId);

    FileResponse getFile(UUID fileId);

    FileResponse renameFile(UUID fileId, String newName);

    FileResponse updateFileContent(UUID fileId, String content);

    void deleteFile(UUID fileId);
}
