import axios from 'axios';

const backendURL = import.meta.env.VITE_SITE_URL || 'localhost:3000';
const instance = axios.create({
    baseURL: backendURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default instance;