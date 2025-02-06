import axios from 'axios';

// Remove any trailing slashes from the URL
const backendURL = (import.meta.env.VITE_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

const instance = axios.create({
    baseURL: backendURL,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default instance;