export interface FolderResponse {
    id: string;
    roomId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface FileResponse {
    id: string;
    folderId: string;
    name: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

export interface FolderRequest {
    name: string;
    roomId: string; // Needed for creation
}
