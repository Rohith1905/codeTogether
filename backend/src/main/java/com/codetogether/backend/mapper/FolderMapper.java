package com.codetogether.backend.mapper;

import com.codetogether.backend.dto.FolderResponse;
import com.codetogether.backend.model.Folder;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FolderMapper {
    FolderResponse toResponse(Folder folder);
}
