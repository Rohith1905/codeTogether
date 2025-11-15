package com.codetogether.backend.repository;

import com.codetogether.backend.model.Folder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FolderRepository extends JpaRepository<Folder, UUID> {
    List<Folder> findAllByRoomIdOrderByCreatedAtAsc(UUID roomId);

    Optional<Folder> findByRoomIdAndName(UUID roomId, String name);
}
