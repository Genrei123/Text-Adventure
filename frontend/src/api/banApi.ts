import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
});

export const fetchBans = async () => {
    const response = await api.get('/api/bans'); // Now proxied through Vite
    return response.data;
};

export const addCommentToBan = async (banId, comment) => {
    const response = await api.put(`/bans/${banId}`, { comment });
    return response.data;
};

export const createBan = async (banData) => {
    const response = await api.post('/bans', banData);
    return response.data;
};

export const deleteBan = async (banId) => {
    const response = await api.delete(`/bans/${banId}`);
    return response.data;
};

// New function to search users
export const searchUsers = async (term) => {
    const response = await api.get(`/users/search?term=${term}`);
    return response.data;
};