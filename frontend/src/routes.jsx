// src/routes.js
import React from "react";
import { Navigate } from "react-router-dom";

// Import Halaman dan Komponen dari App.jsx asli kamu
import LandingPage from "./pages/LandingPage";
import Login from './components/Login/Login';
import Dashboard from "./components/Dashboard/Dashboard"; 
import FormManifest from "./components/Transaksi/formManifest";
import TabelDistribusi from "./components/Transaksi/TabelDistribusi";

/**
 * Komponen Guard untuk memproteksi halaman internal (Protected Route)
 */
export const ProtectedRoute = ({ children, isAuthenticated, userRole, allowedRoles }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

/**
 * Definisikan Konfigurasi Centralized Routing
 * Memisahkan tegas antara Public dan Protected lewat properti 'isProtected'
 */
export const getAppRoutes = (handleLoginSuccess, handleLogout, isAuthenticated, userRole) => [
  // ==========================================
  // 1. PUBLIC ROUTES (Bisa diakses tanpa login)
  // ==========================================
  {
    path: "/",
    element: <LandingPage />,
    isProtected: false,
  },
  {
    path: "/login",
    element: <Login onLoginSuccess={handleLoginSuccess} />,
    isProtected: false,
  },

  // ==========================================
  // 2. PROTECTED ROUTES (Wajib login & cek role)
  // ==========================================
  {
    path: "/dashboard/*",
    element: <Dashboard userRole={userRole} onLogout={handleLogout} />,
    isProtected: true,
    allowedRoles: ["manajer", "petugas"],
  },
  {
    path: "/manifest",
    element: (
      <div className="min-h-screen bg-gradient-to-r from-pink-500 via-red-400 to-yellow-500">
        <FormManifest />
        <div className="my-10"></div>
        <TabelDistribusi />
      </div>
    ),
    isProtected: true, // Diubah menjadi true karena manifes data internal TBS
    allowedRoles: ["manajer", "petugas"], 
  },

  // ==========================================
  // 3. FALLBACK ROUTE (Jika rute acak/tidak ditemukan)
  // ==========================================
  {
    path: "*",
    element: <Navigate to="/" replace />,
    isProtected: false,
  },
];