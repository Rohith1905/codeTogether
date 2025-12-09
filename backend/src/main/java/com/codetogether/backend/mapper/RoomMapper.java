package com.codetogether.backend.mapper;

import com.codetogether.backend.dto.RoomDto;
import com.codetogether.backend.model.Room;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoomMapper {
    RoomDto toDto(Room room);

    Room toEntity(RoomDto roomDto);
}
