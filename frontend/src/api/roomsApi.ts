import axiosClient from './axiosClient';

export interface Room {
    id: string;
    name: string;
    createdAt: string;
    createdByUsername: string;
    createdById: string;
}

export interface CreateRoomRequest {
    name: string;
}

export const roomsApi = {
    getAllRooms: async (): Promise<Room[]> => {
        const response = await axiosClient.get<Room[]>('/rooms');
        return response.data;
    },

    createRoom: async (data: CreateRoomRequest): Promise<Room> => {
        const response = await axiosClient.post<Room>('/rooms', data);
        return response.data;
    },

    getRoom: async (id: string): Promise<Room> => {
        const response = await axiosClient.get<Room>(`/rooms/${id}`);
        return response.data;
    },
};
