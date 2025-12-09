import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Use relative path to leverage Vite proxy
// This avoids CORS issues by routing requests through the frontend dev server
const baseURL = '/api';

// Create axios instance
const axiosClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor - Add JWT token to requests
axiosClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors globally
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle 401 Unauthorized - Auto logout
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }

        // Handle 403 Forbidden
        if (error.response?.status === 403) {
            console.error('Access forbidden');
        }

        // Handle 500 Internal Server Error
        if (error.response?.status === 500) {
            console.error('Server error occurred');
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
