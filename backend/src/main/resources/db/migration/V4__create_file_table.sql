-- V4: Create files table
-- Description: Stores file content and metadata

DROP TABLE IF EXISTS files CASCADE;

CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID NOT NULL UNIQUE,
    file_name VARCHAR(255) NOT NULL,
    language VARCHAR(50),
    content TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_files_node FOREIGN KEY (node_id) 
        REFERENCES nodes(id) ON DELETE CASCADE,
    CONSTRAINT chk_files_version_positive CHECK (version > 0)
);

-- Create indexes for performance
CREATE INDEX idx_files_node_id ON files(node_id);
CREATE INDEX idx_files_language ON files(language);
CREATE INDEX idx_files_last_updated ON files(last_updated);

-- Add comments for documentation
COMMENT ON TABLE files IS 'Stores file content and metadata';
COMMENT ON COLUMN files.id IS 'Unique identifier for the file';
COMMENT ON COLUMN files.node_id IS 'Reference to the node representing this file';
COMMENT ON COLUMN files.file_name IS 'Name of the file';
COMMENT ON COLUMN files.language IS 'Programming language for syntax highlighting';
COMMENT ON COLUMN files.content IS 'Current file content';
COMMENT ON COLUMN files.version IS 'Current version number';
COMMENT ON COLUMN files.last_updated IS 'Last modification timestamp';
