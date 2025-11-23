package com.codetogether.backend.repository;

import com.codetogether.backend.model.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FileRepository extends JpaRepository<File, UUID> {
    List<File> findAllByFolderIdOrderByCreatedAtAsc(UUID folderId);

    Optional<File> findByFolderIdAndName(UUID folderId, String name);

    void deleteByFolderId(UUID folderId);
}
