import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const fetchMetrics = async () => {
  const response = await axios.get(`${API_URL}/api/metrics`);
  return response.data;
};

export const fetchGamesCount = async () => {
  const response = await axios.get(`${API_URL}/api/metrics/games`);
  return response.data;
};