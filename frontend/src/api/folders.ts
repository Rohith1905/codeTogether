import axiosClient from './axiosClient';
import { FolderResponse } from '../utils/types';

export const foldersApi = {
    getFolders: async (roomId: string): Promise<FolderResponse[]> => {
        const response = await axiosClient.get<FolderResponse[]>(`/folders?roomId=${roomId}`);
        return response.data;
    },

    createFolder: async (roomId: string, name: string): Promise<FolderResponse> => {
        const response = await axiosClient.post<FolderResponse>('/folders', { roomId, name });
        return response.data;
    },

    renameFolder: async (id: string, name: string): Promise<FolderResponse> => {
        const response = await axiosClient.put<FolderResponse>(`/folders/${id}`, { name, roomId: '' }); // roomId ignored by backend for rename
        return response.data;
    },

    deleteFolder: async (id: string): Promise<void> => {
        await axiosClient.delete(`/folders/${id}`);
    }
};
