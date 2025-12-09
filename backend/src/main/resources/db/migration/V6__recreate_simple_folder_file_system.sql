-- V6: Recreate Simple Folder/File System
-- Goal: Replace complex node hierarchy with simple 2-level Folder->Files structure per Room

-- 1. Drop old tables if they exist
DROP TABLE IF EXISTS file_versions CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS nodes CASCADE;
DROP TYPE IF EXISTS node_type;

-- 2. Create Folders table
CREATE TABLE folders (
    id UUID PRIMARY KEY,
    room_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_folders_room FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT uq_folders_room_name UNIQUE (room_id, name)
);

-- 3. Create Files table
CREATE TABLE files (
    id UUID PRIMARY KEY,
    folder_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_files_folder FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE CASCADE,
    CONSTRAINT uq_files_folder_name UNIQUE (folder_id, name)
);

CREATE INDEX idx_folders_room_id ON folders(room_id);
CREATE INDEX idx_files_folder_id ON files(folder_id);
