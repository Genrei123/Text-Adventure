import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL; // Use the environment variable

export const createSession = async (email: string) => {
  try {
    const response = await axios.post(`${API_URL}/sessions/createSession`, { email });
    return response.data;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
};

export const clearSession = async (sessionId: string, visitedPages: string[]) => {
  try {
    const response = await axios.post(`${API_URL}/sessions/clearSession`, { sessionId, visitedPages });
    return response.data;
  } catch (error) {
    console.error('Error clearing session:', error);
    throw error;
  }
};