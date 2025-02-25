// axiosConfig.ts
import axios from 'axios';

const backendURL = (import.meta.env.VITE_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

const instance = axios.create({
    baseURL: backendURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Add a request interceptor to automatically add the token
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default instance;