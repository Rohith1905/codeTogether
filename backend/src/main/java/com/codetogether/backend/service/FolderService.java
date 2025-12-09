package com.codetogether.backend.service;

import com.codetogether.backend.dto.FolderRequest;
import com.codetogether.backend.dto.FolderResponse;
import java.util.List;
import java.util.UUID;

public interface FolderService {
    FolderResponse createFolder(FolderRequest request);

    List<FolderResponse> listFoldersByRoom(UUID roomId);

    FolderResponse renameFolder(UUID folderId, String newName);

    void deleteFolder(UUID folderId);
}
