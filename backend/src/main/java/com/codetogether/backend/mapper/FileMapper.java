package com.codetogether.backend.mapper;

import com.codetogether.backend.dto.FileResponse;
import com.codetogether.backend.model.File;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface FileMapper {
    FileResponse toResponse(File file);
}
