import React, { createContext, useState, useContext, useEffect } from "react";
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
  useEffect(() => {
    axios.defaults.baseURL = API_URL;
    axios.defaults.withCredentials = true; // Penting untuk mengirim cookie/session

    const token = localStorage.getItem("fintrix_token");
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("fintrix_token");
      if (!token) {
        setLoading(false);
        return;
      }
      // Panggil endpoint /auth/status yang sudah kamu buat di Backend
      const response = await axios.get("/auth/status");
      setUser(response.data.user);
    } catch (err) {
      logout(); // Jika token expired atau salah, paksa logout
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await axios.post("/auth/login", { email, password });
      
      const { token, ...userData } = response.data;
      localStorage.setItem("fintrix_token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      
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
      
      // Data berhasil disimpan di backend.
      // Kita hapus kode auto-login agar user harus ke halaman login dulu.
      // const { token, ...data } = response.data;
      // localStorage.setItem("fintrix_token", token);
      // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // setUser(data);
      
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    localStorage.removeItem("fintrix_token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // Tambahkan fungsi Google Login
  const googleLogin = () => {
    // Redirect langsung ke endpoint Passport Google di Backend
    window.location.href = `${API_URL}/auth/google`;
  };

  const value = {
    user, loading, error, register, login, logout, googleLogin,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};