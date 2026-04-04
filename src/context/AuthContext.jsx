import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext();

// Mengambil URL dari file .env
const API_URL = import.meta.env.VITE_API_URL;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Konfigurasi Axios Global
  const setupAxios = useCallback((token) => {
    axios.defaults.baseURL = API_URL;
    axios.defaults.withCredentials = true;
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("fintrix_token");
    setupAxios(token);
    checkAuthStatus();
  }, []);

  // Axios interceptor untuk auto-refresh token jika expired
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem("fintrix_refresh_token");
          if (refreshToken) {
            try {
              const res = await axios.post("/auth/refresh-token", { refreshToken });
              const { token: newToken, refreshToken: newRefresh } = res.data;
              localStorage.setItem("fintrix_token", newToken);
              localStorage.setItem("fintrix_refresh_token", newRefresh);
              setupAxios(newToken);
              originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
              return axios(originalRequest);
            } catch {
              // Refresh gagal → paksa logout
              _clearAuth();
              window.location.href = "/login";
            }
          } else {
            _clearAuth();
            window.location.href = "/login";
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, [setupAxios]);

  // Internal helper: bersihkan semua auth state tanpa memanggil API
  const _clearAuth = () => {
    localStorage.removeItem("fintrix_token");
    localStorage.removeItem("fintrix_refresh_token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("fintrix_token");
      if (!token) {
        setLoading(false);
        return;
      }
      const response = await axios.get("/auth/status");
      setUser(response.data.user);
    } catch (err) {
      _clearAuth();
    } finally {
      setLoading(false);
    }
  };

  // ── Auth ──────────────────────────────────────────────────────────────────

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post("/auth/login", { email, password });
      const { token, refreshToken, ...userData } = response.data;
      localStorage.setItem("fintrix_token", token);
      if (refreshToken) localStorage.setItem("fintrix_refresh_token", refreshToken);
      setupAxios(token);
      setUser(userData);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      await axios.post("/auth/register", userData);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      // Kirim ke backend untuk hapus refresh token dari DB
      await axios.post("/auth/logout");
    } catch {
      // Tetap lanjut logout walau request gagal
    } finally {
      _clearAuth();
    }
  };

  const googleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      await axios.post("/auth/forgot-password", { email });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send reset email";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const resetPassword = async (token, password) => {
    try {
      setError(null);
      await axios.post(`/auth/reset-password/${token}`, { password });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to reset password";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  // ── User Profile ──────────────────────────────────────────────────────────

  const getProfile = async () => {
    try {
      const response = await axios.get("/users/profile");
      setUser(response.data);
      return { success: true, data: response.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch profile";
      return { success: false, error: msg };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await axios.put("/users/profile", profileData);
      setUser((prev) => ({ ...prev, ...response.data }));
      return { success: true, data: response.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update profile";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const deleteAccount = async () => {
    try {
      await axios.delete("/users/profile");
      _clearAuth();
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to delete account";
      return { success: false, error: msg };
    }
  };

  // ── Stats ─────────────────────────────────────────────────────────────────

  const getUserStats = async () => {
    try {
      const response = await axios.get("/users/stats");
      return { success: true, data: response.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch stats";
      return { success: false, error: msg };
    }
  };

  // ── 2FA ───────────────────────────────────────────────────────────────────

  const enableTwoFactor = async () => {
    try {
      const response = await axios.post("/users/enable-2fa");
      setUser((prev) => ({ ...prev, twoFactorEnabled: true }));
      return { success: true, data: response.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to enable 2FA";
      return { success: false, error: msg };
    }
  };

  const disableTwoFactor = async () => {
    try {
      const response = await axios.post("/users/disable-2fa");
      setUser((prev) => ({ ...prev, twoFactorEnabled: false }));
      return { success: true, data: response.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to disable 2FA";
      return { success: false, error: msg };
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    // Auth
    login,
    register,
    logout,
    googleLogin,
    forgotPassword,
    resetPassword,
    // Profile
    getProfile,
    updateProfile,
    deleteAccount,
    // Stats
    getUserStats,
    // 2FA
    enableTwoFactor,
    disableTwoFactor,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};