// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// 1. Membuat Context untuk Auth
export const AuthContext = createContext();

// 2. Membuat Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil data session saat aplikasi pertama kali dimuat
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('user_role');

    if (token && role) {
      setUser({ token, role });
    }
    setLoading(false);
  }, []);

  // Fungsi Login
  const login = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user_role', role);
    setUser({ token, role });
  };

  // Fungsi Logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};