// src/App.jsx
import { useState } from 'react';
import axiosInstance from './config/axios';
import UploadDistribusi from './components/UploadDistribusi';  // ← TAMBAH INI!

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/auth/login', {
        username: 'admin',
        password: 'admin123',
      });

      console.log('✅ Login Response:', response.data);
      
      const jwtToken = response.data.data.token;
      localStorage.setItem('token', jwtToken);
      setIsLoggedIn(true);
      alert('✅ Login berhasil!');
    } catch (error) {
      console.error('❌ Login Error:', error);
      alert('❌ Login gagal: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    alert('👋 Logout berhasil!');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🌴 Sistem Monitoring Distribusi Sawit</h1>
      
      {!isLoggedIn ? (
        <button onClick={handleLogin} style={{ padding: '10px 20px' }}>
          🔐 Login
        </button>
      ) : (
        <div>
          <p>✅ Logged in as Admin</p>
          <button onClick={handleLogout} style={{ padding: '10px 20px', marginBottom: '20px' }}>
            🚪 Logout
          </button>
          
          {/* Tampilkan Form Upload */}
          <UploadDistribusi />
        </div>
      )}
    </div>
  );
}

export default App;