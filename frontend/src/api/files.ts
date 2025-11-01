import axiosClient from './axiosClient';
import { FileResponse } from '../utils/types';

export const filesApi = {
    getFiles: async (folderId: string): Promise<FileResponse[]> => {
        const response = await axiosClient.get<FileResponse[]>(`/files/folder/${folderId}`);
        return response.data;
    },

    createFile: async (folderId: string, name: string, content: string = ''): Promise<FileResponse> => {
        const response = await axiosClient.post<FileResponse>('/files', { folderId, name, content });
        return response.data;
    },

    getFile: async (id: string): Promise<FileResponse> => {
        const response = await axiosClient.get<FileResponse>(`/files/${id}`);
        return response.data;
    },

    renameFile: async (id: string, name: string): Promise<FileResponse> => {
        const response = await axiosClient.put<FileResponse>(`/files/${id}`, { name, folderId: '', content: '' });
        return response.data;
    },

    updateFileContent: async (id: string, content: string): Promise<FileResponse> => {
        const response = await axiosClient.put<FileResponse>(`/files/${id}/content`, { content, name: '', folderId: '' });
        return response.data;
    },

    deleteFile: async (id: string): Promise<void> => {
        await axiosClient.delete(`/files/${id}`);
    }
};
