import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Interceptor: otomatis sertakan token di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fintrix_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Transaction API ──────────────────────────────────────────────────────────

export const transactionApi = {
  getAll: async (params = {}) => {
    const response = await api.get('/transactions', { params });
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/transactions', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/transactions/stats');
    return response.data;
  }
};

export default api;
