-- V5: Create file_versions table
-- Description: Stores version history of file content

DROP TABLE IF EXISTS file_versions CASCADE;

CREATE TABLE file_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL,
    content TEXT NOT NULL,
    saved_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    saved_by VARCHAR(255) NOT NULL,
    
    CONSTRAINT fk_file_versions_file FOREIGN KEY (file_id) 
        REFERENCES files(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_file_versions_file_id ON file_versions(file_id);
CREATE INDEX idx_file_versions_saved_at ON file_versions(saved_at DESC);
CREATE INDEX idx_file_versions_saved_by ON file_versions(saved_by);
CREATE INDEX idx_file_versions_file_saved_at ON file_versions(file_id, saved_at DESC);

-- Add comments for documentation
COMMENT ON TABLE file_versions IS 'Stores version history of file content';
COMMENT ON COLUMN file_versions.id IS 'Unique identifier for the version';
COMMENT ON COLUMN file_versions.file_id IS 'Reference to the file';
COMMENT ON COLUMN file_versions.content IS 'Content snapshot at this version';
COMMENT ON COLUMN file_versions.saved_at IS 'When this version was saved';
COMMENT ON COLUMN file_versions.saved_by IS 'Username who saved this version';
