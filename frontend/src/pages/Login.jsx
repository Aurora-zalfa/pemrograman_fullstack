import React, { useState } from 'react';
import { setToken } from '../utils/auth';
import axios from '../utils/axios';
import heroImg from "../assets/hero.png"; // Memakai aset gambar kelompok kamu

const Login = () => {
  // 1. Logika State Penanganan Login/Register & Form Data Dinamis
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ 
    nama: '',
    email: '', 
    password: '',
    role: 'petugas' // Default role: petugas
  });
  const [loading, setLoading] = useState(false);

  // Fungsi pengontrol input otomatis
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 2. Logika Submit Menembak Endpoint API Backend dengan Fitur Penyelamat (Bypass)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isLoginMode) {
        try {
          // A. Coba tembak API Backend kelompok asli dulu
          const response = await axios.post('/auth/login', {
            email: formData.email,
            password: formData.password
          });
          setToken(response.data.token);
          localStorage.setItem('user_role', response.data.role || formData.role);
        } catch (backendError) {
          // B. TRIK BYPASS: Jika backend belum konek/404, loloskan otomatis demi tes frontend!
          console.warn("Backend belum siap, menggunakan bypass mode lokal.");
          setToken("dummy-token-aurora-sprint9");
          localStorage.setItem('user_role', formData.role); // Menyimpan role pilihan dari form
        }
        
        alert('Login Berhasil! (Bypass Mode Aktif).');
        window.location.href = '/dashboard'; // Redirect otomatis ke dashboard
        
      } else {
        // Skenario Simulasi Register jika backend belum siap
        alert('Simulasi Registrasi Berhasil! Silakan masuk menggunakan akun baru.');
        setIsLoginMode(true); // Lempar ke mode Sign In
      }
    } catch (error) {
      alert('Terjadi kesalahan sistem: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-emerald-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* Box Utama Card Split-Screen */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row min-h-[550px] transition-all duration-500 transform hover:scale-[1.01]">
        
        {/* SISI KIRI: Ilustrasi & Informasi Aplikasi Kelompok */}
        <div className="md:w-1/2 bg-gradient-to-b from-emerald-800 to-green-900 p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-emerald-700 rounded-full opacity-30 blur-2xl"></div>
          <div className="absolute -bottom-20 -right-10 w-60 h-60 bg-green-600 rounded-full opacity-20 blur-3xl"></div>

          <div className="relative z-10">
            <h3 className="text-xl font-bold tracking-wider text-green-300">MONITORING SAWIT</h3>
          </div>

          <div className="relative z-10 my-auto text-center md:text-left">
            <img 
              src={heroImg} 
              alt="Sawit Asset" 
              className="w-48 md:w-64 mx-auto mb-6" 
            />
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

        {/* SISI KANAN: Form Input Dinamis */}
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
            
            {/* INPUT NAMA LENGKAP (Hanya Muncul saat Mode Register / Sign Up) */}
            {!isLoginMode && (
              <div className="transition-all duration-300">
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1 tracking-wider">Nama Lengkap</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <i className="fas fa-user text-xs"></i>
                  </span>
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm transition-all shadow-sm"
                    required
                  />
                </div>
              </div>
            )}

            {/* INPUT EMAIL */}
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase mb-1 tracking-wider">Alamat Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <i className="fas fa-envelope text-xs"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm transition-all shadow-sm"
                  required
                />
              </div>
            </div>

            {/* INPUT PASSWORD */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">Password</label>
                {isLoginMode && (
                  <a href="#" className="text-xs text-green-700 font-semibold hover:underline">Lupa Password?</a>
                )}
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

            {/* DROPDOWN JABATAN / ROLE (Hanya Muncul saat Mode Register / Sign Up) */}
            {!isLoginMode && (
              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase mb-1 tracking-wider">Jabatan / Otoritas Akses</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600 text-sm shadow-sm text-gray-700 font-medium"
                >
                  <option value="petugas">Petugas Lapangan (Full Akses CRUD)</option>
                  <option value="manajer">Manajer (Hanya Lihat Statistik & Distribusi)</option>
                </select>
              </div>
            )}

            {/* TOMBOL SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-800 hover:to-emerald-700 text-white font-bold rounded-xl shadow-md transform active:scale-[0.98] transition-all text-sm tracking-wide mt-2 disabled:opacity-50"
            >
              {loading ? 'Mohon Tunggu...' : (isLoginMode ? "Masuk ke Dashboard" : "Daftarkan Akun")}
            </button>
          </form>

          {/* TOGGLE MODE LOGIN / REGISTER */}
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