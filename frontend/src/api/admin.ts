import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const fetchDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/api/metrics`);
  return response.data;
};

export const fetchPlayers = async (params: {
  search?: string;
  status?: string;
  subscription?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: string;
  limit?: string;
}) => {
  const response = await axios.get(`${API_URL}/api/players`, { params });
  return response.data;
};

export const fetchGamesCount = async () => {
  const response = await axios.get(`${API_URL}/api/metrics/games`);
  return response.data;
};

export const fetchRecentGames = async () => {
  const response = await axios.get(`${API_URL}/api/games/recent`);
  return response.data;
};

export const fetchAllGames = async () => {
  const response = await axios.get(`${API_URL}/api/games/all`);
  return response.data;
};