import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

const STORAGE_KEY = "fintrix_dummy_user";
const TOKEN_KEY = "fintrix_dummy_token";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    const name = email.split("@")[0];
    const userData = {
      id: "dummy-" + Date.now(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email,
    };
    localStorage.setItem(TOKEN_KEY, "dummy-token");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    setUser(userData);
    return { success: true, data: userData };
  };

  const register = async (userData) => {
    setError(null);
    const { name, email } = userData;
    const dummyUser = { id: "dummy-" + Date.now(), name, email };
    localStorage.setItem(TOKEN_KEY, "dummy-token");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dummyUser));
    setUser(dummyUser);
    return { success: true, data: dummyUser };
  };

  const logout = async () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    setError(null);
    const updated = { ...user, ...profileData };
    setUser(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return { success: true, data: updated };
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

