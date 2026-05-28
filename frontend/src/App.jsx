import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom"; // Selesai diperbaiki: Menambahkan Link di sini
import "./App.css";

// Import halaman hasil pemisahan & komponen lain
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard/Dashboard"; 
import FormManifest from "./components/formManifest";
import TabelDistribusi from './components/TabelDistribusi';

// Selesai diperbaiki: Mengamankan import aset gambar agar tidak memicu error 'not defined'
import reactLogo from "./assets/react.svg"; // Sesuaikan ekstensi jika .png atau .svg
import heroImg from "./assets/buah_sawit.png"; // Jalur gambar pendukung herosection
import buahSawitImg from "./assets/buah_sawit.png"; 

/**
 * ========================================================
 * 1. KOMPONEN PROTECTED ROUTE 
 * ========================================================
 */
const ProtectedRoute = ({ children, isAuthenticated, userRole, allowedRoles }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Selesai diperbaiki: Fungsi duplikat "const LandingPage = () => { ... }" 
// yang tabrakan di file ini sudah dihapus sepenuhnya karena kodenya sudah aman 
// berada di dalam file eksternal terpisah yaitu "src/pages/LandingPage.jsx"!

/**
 * ========================================================
 * 2. KOMPONEN ROUTER UTAMA (APP)
 * ========================================================
 */
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("user_role"); 

    if (token && role) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user_role", role); 
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_role");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-rose-950 flex items-center justify-center text-white font-bold">
        Memvalidasi Sesi Token Aurora...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Rute Halaman Depan Umum */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        
        {/* Rute Area Dashboard Utama */}
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute 
              isAuthenticated={isAuthenticated} 
              userRole={userRole}
              allowedRoles={["manajer", "petugas"]} 
            >
              <Dashboard userRole={userRole} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />

        {/* Catatan Sprint 10: Rute /manifest eksternal ini nanti akan dihapus oleh Silvi */}
        {/* karena form transaksi ini dipindahkan langsung menjadi interior menu Sidebar Dashboard Admin */}
        <Route 
          path="/manifest" 
          element={
            <div className="min-h-screen bg-gradient-to-r from-pink-500 via-red-400 to-yellow-500 py-12">
              <FormManifest />
              <div className="my-10"></div>
              <TabelDistribusi />
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;