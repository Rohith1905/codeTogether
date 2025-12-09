-- V3: Create nodes table
-- Description: Stores file/folder hierarchy within rooms

DROP TABLE IF EXISTS nodes CASCADE;
DROP TYPE IF EXISTS node_type CASCADE;

CREATE TYPE node_type AS ENUM ('FILE', 'FOLDER');

CREATE TABLE nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id UUID NOT NULL,
    parent_node_id UUID,
    name VARCHAR(255) NOT NULL,
    type node_type NOT NULL,
    path TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_nodes_room FOREIGN KEY (room_id) 
        REFERENCES rooms(id) ON DELETE CASCADE,
    CONSTRAINT fk_nodes_parent FOREIGN KEY (parent_node_id) 
        REFERENCES nodes(id) ON DELETE CASCADE,
    CONSTRAINT chk_nodes_path_not_empty CHECK (length(path) > 0)
);

-- Create indexes for performance
CREATE INDEX idx_nodes_room_id ON nodes(room_id);
CREATE INDEX idx_nodes_parent_id ON nodes(parent_node_id);
CREATE INDEX idx_nodes_type ON nodes(type);
CREATE INDEX idx_nodes_room_path ON nodes(room_id, path);
CREATE INDEX idx_nodes_metadata ON nodes USING GIN(metadata);

-- Add comments for documentation
COMMENT ON TABLE nodes IS 'Stores file/folder hierarchy within rooms';
COMMENT ON COLUMN nodes.id IS 'Unique identifier for the node';
COMMENT ON COLUMN nodes.room_id IS 'Room this node belongs to';
COMMENT ON COLUMN nodes.parent_node_id IS 'Parent node for hierarchy';
COMMENT ON COLUMN nodes.name IS 'Name of the file or folder';
COMMENT ON COLUMN nodes.type IS 'Type of node: FILE or FOLDER';
COMMENT ON COLUMN nodes.path IS 'Full path from root';
COMMENT ON COLUMN nodes.metadata IS 'Additional metadata stored as JSON';
