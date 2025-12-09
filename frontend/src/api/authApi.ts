import axiosClient from './axiosClient';

export interface LoginRequest {
    username: string;
    password: string;
}

export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    accessToken: string;
    userId: string;
    username: string;
    email: string;
}

export const authApi = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await axiosClient.post<AuthResponse>('/auth/login', credentials);
        return response.data;
    },

    register: async (userData: RegisterRequest): Promise<AuthResponse> => {
        const response = await axiosClient.post<AuthResponse>('/auth/register', userData);
        return response.data;
    },

    logout: async (): Promise<void> => {
        // Clear local storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await axiosClient.post<AuthResponse>('/auth/refresh', { refreshToken });
        return response.data;
    },
};
