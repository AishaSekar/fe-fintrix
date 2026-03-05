import axios from 'axios';

// Konfigurasi base URL API
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Buat instance axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Timeout 10 detik
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
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

// Interceptor untuk handle response error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle network error
    if (!error.response) {
      console.error('Network Error:', error);
      return Promise.reject({
        response: {
          data: {
            message: 'Koneksi ke server gagal. Pastikan backend sedang berjalan.'
          }
        }
      });
    }

    // Handle 401 Unauthorized (token expired atau invalid)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// ==================== AUTH SERVICES ====================
export const authService = {
  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get('/auth/me');
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await api.put('/auth/profile', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/auth/change-password', passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// ==================== TRANSACTION SERVICES ====================
export const transactionService = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/transactions', { params });
      return response;
    } catch (error) {
      throw error;
    }
  },

  getOne: async (id) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  create: async (data) => {
    try {
      const response = await api.post('/transactions', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/transactions/${id}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/transactions/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  getSummary: async (period = 'month') => {
    try {
      const response = await api.get('/transactions/summary', { 
        params: { period } 
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// ==================== STORAGE SERVICES ====================
export const storageService = {
  setAuthData: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  clearAuthData: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default api;