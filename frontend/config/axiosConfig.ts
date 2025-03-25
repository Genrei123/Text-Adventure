import axios from 'axios';

const backendURL = (import.meta.env.VITE_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
const instance = axios.create({
  baseURL: backendURL,
  headers: {
    'Content-Type': 'application/json',
  }
});

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_SDXL_ENV || "http://localhost:3000" || import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
    // Include Authorization header if needed
  }
});

// Add an interceptor to log requests (for debugging)
axiosInstance.interceptors.request.use(
  (config) => {
    console.log("Request:", config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login for specific authentication-related errors
    if (error.response?.status === 401 &&
      !error.config.url.includes('/auth/') &&
      !error.config.url.includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Add request interceptor to add token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // For debugging
    console.log(`${config.method?.toUpperCase()} request to ${config.url}`, {
      headers: config.headers,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Authentication expired. Redirecting to login...");
      // Optional: Clear localStorage and redirect to login
      // localStorage.removeItem('token');
      // localStorage.removeItem('userData');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default instance;