-- V2: Create rooms table
-- Description: Stores collaboration room information

DROP TABLE IF EXISTS rooms CASCADE;

CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    created_by UUID,
    last_active TIMESTAMP,
    participants TEXT,
    settings JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_rooms_created_by FOREIGN KEY (created_by) 
        REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX idx_rooms_created_by ON rooms(created_by);
CREATE INDEX idx_rooms_last_active ON rooms(last_active);
CREATE INDEX idx_rooms_settings ON rooms USING GIN(settings);

-- Add comments for documentation
COMMENT ON TABLE rooms IS 'Stores collaboration room information';
COMMENT ON COLUMN rooms.id IS 'Unique identifier for the room';
COMMENT ON COLUMN rooms.name IS 'Display name of the room';
COMMENT ON COLUMN rooms.created_by IS 'User who created the room';
COMMENT ON COLUMN rooms.last_active IS 'Last activity timestamp';
COMMENT ON COLUMN rooms.participants IS 'List of participant usernames';
COMMENT ON COLUMN rooms.settings IS 'Room configuration stored as JSON';
