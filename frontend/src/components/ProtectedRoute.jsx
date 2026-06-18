// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  // Tunggu sampai proses validasi token selesai
  if (loading) {
    return (
      <div className="min-h-screen bg-rose-950 flex items-center justify-center text-white font-bold">
        Memvalidasi Sesi Token Aurora...
      </div>
    );
  }

  // Jika tidak ada user/token, tendang balik ke halaman Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Jika role user tidak ada di dalam daftar role yang diizinkan, kembalikan ke landing page/dashboard
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;