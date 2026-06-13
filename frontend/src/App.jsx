// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Import fungsi router dan guard dari file terpisah yang baru dibuat
import { getAppRoutes, ProtectedRoute } from "./routes";

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

  // Ambil data array konfigurasi rute dari src/routes.js
  const routes = getAppRoutes(handleLoginSuccess, handleLogout, isAuthenticated, userRole);

  return (
    <Router>
      <Routes>
        {routes.map((route, index) => (
          <Route 
            key={index}
            path={route.path}
            element={
              route.isProtected ? (
                <ProtectedRoute
                  isAuthenticated={isAuthenticated}
                  userRole={userRole}
                  allowedRoles={route.allowedRoles}
                >
                  {route.element}
                </ProtectedRoute>
              ) : (
                route.element
              )
            }
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;