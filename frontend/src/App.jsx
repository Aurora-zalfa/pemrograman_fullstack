// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Impor Provider Global State
import { AuthProvider } from "./context/AuthContext";
// Impor ProtectedRoute yang baru dibuat
import ProtectedRoute from "./components/ProtectedRoute";

// Impor fungsi pembaca rute dari file routes milikmu
import { getAppRoutes } from "./routes";

function App() {
  // Panggil konfigurasi rute dasar
  // Catatan: Karena fungsi login/logout sudah pakai Context, 
  // parameter di fungsi getAppRoutes bisa dikosongkan/disesuaikan dengan file routes.js kamu
  const routes = getAppRoutes();

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {routes.map((route, index) => (
            <Route 
              key={index}
              path={route.path}
              element={
                route.isProtected ? (
                  <ProtectedRoute allowedRoles={route.allowedRoles}>
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
    </AuthProvider>
  );
}

export default App;