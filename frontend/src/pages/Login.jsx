import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { setToken } from '../utils/auth';
import axios from '../utils/axios';
import heroImg from "../assets/hero.png"; 

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ 
    username: '', // Sesuai kolom DB
    password: '', // Sesuai kolom DB
    role: 'petugas' // Sesuai kolom DB
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLoginMode) {
        // LOGIN MODE
        const response = await axios.post('/auth/login', {
          username: formData.username,
          password: formData.password
        });
        
        // PERBAIKAN DI SINI: Menyesuaikan dengan struktur respon backend kamu
        // Backend mengirim: response.data.data.token & response.data.data.user.role
        if (response.data && response.data.success) {
          const token = response.data.data.token;
          const role = response.data.data.user?.role;

          if (token && role) {
            onLoginSuccess(token, role);
            alert(`Login Berhasil! Selamat datang ${formData.username}.`);
            navigate('/dashboard'); 
          } else {
            alert('Gagal memuat token atau hak akses dari data user.');
          }
        } else {
          alert(response.data?.message || 'Login gagal, periksa kembali akun Anda.');
        }
        
      } else {
        // REGISTER MODE
        await axios.post('/auth/register', {
          username: formData.username,
          password: formData.password,
          role: formData.role
        });
        
        alert('Registrasi Berhasil! Silakan masuk menggunakan akun baru Anda.');
        setFormData(prev => ({ ...prev, password: '' }));
        setIsLoginMode(true); 
      }
    } catch (error) {
      console.error("API Error Log:", error);
      const pesanError = error.response?.data?.message || 'Gagal memproses permintaan ke server backend.';
      alert('Terjadi kesalahan sistem: ' + pesanError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row min-h-[550px] transition-all duration-500 transform hover:scale-[1.01]">
        
        {/* SISI KIRI */}
        <div className="md:w-1/2 bg-gradient-to-b from-emerald-800 to-green-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-700 rounded-full opacity-30 blur-2xl"></div>
          <div className="absolute -bottom-20 -right-10 w-60 h-60 bg-green-600 rounded-full opacity-20 blur-3xl"></div>

          <div className="relative z-10">
            <h3 className="text-xl font-bold tracking-wider text-green-300">MONITORING SAWIT</h3>
          </div>

          <div className="relative z-10 my-auto text-center md:text-left">
            <img src={heroImg} alt="Sawit Asset" className="w-48 md:w-64 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-2">
              {isLoginMode ? "Selamat Datang Kembali!" : "Bergabung Bersama Kami"}
            </h2>
            <p className="text-sm text-green-100 opacity-90">
              {isLoginMode 
                ? "Silakan masuk untuk memantau data distribusi dan berat TBS kelapa sawit secara real-time."
                : "Daftarkan akun kelompok untuk mulai mengelola sistem distribusi digital."}
            </p>
          </div>

          <div className="relative z-10 text-xs text-green-300 text-center md:text-left">
            &copy; 2026 Kelompok Aurora &middot; v1.0
          </div>
        </div>

        {/* SISI KANAN */}
        <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-gray-50">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-gray-800 mb-1">
              {isLoginMode ? "Sign In" : "Sign Up"}
            </h2>
            <p className="text-sm text-gray-500">
              {isLoginMode ? "Akses ke dalam panel monitoring sawit" : "Lengkapi data untuk membuat akun baru"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* USERNAME */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1 tracking-wider">Username Akun</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <i className="fas fa-user-circle text-xs"></i>
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Contoh: bos_muda atau aurora"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <i className="fas fa-lock text-xs"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            {/* DROPDOWN ROLE */}
            {!isLoginMode && (
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1 tracking-wider">Jabatan / Otoritas Akses</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-sm shadow-sm text-gray-700 font-medium"
                >
                  <option value="petugas">Petugas Lapangan (Akses Input & Validasi)</option>
                  <option value="manajer">Manajer (Otoritas Pemantau Statistik)</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-800 hover:to-emerald-700 text-white font-bold rounded-xl shadow-md transform active:scale-[0.98] transition-all text-sm tracking-wide mt-2 disabled:opacity-50"
            >
              {loading ? 'Mohon Tunggu...' : (isLoginMode ? "Masuk ke Dashboard" : "Daftarkan Akun")}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500">
              {isLoginMode ? "Belum memiliki otoritas akun?" : "Sudah terdaftar sebagai admin?"}{" "}
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-green-700 font-bold hover:underline ml-1 focus:outline-none"
              >
                {isLoginMode ? "Buat Akun Baru" : "Login Sekarang"}
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;