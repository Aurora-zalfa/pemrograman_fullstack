import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/axios';
import heroImg from "../../assets/hero.png";

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    role: 'petugas'
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
        const response = await axios.post('/api/auth/login', {  
          username: formData.username,
          password: formData.password
        });
        
        if (response.data && response.data.success) {
          const token = response.data.data.token;
          const role = response.data.data.user?.role;
          const userId = response.data.data.user?.idusers;  

          if (token && role) {
            if (userId) {
              localStorage.setItem('userId', userId);
            }
            localStorage.setItem('token', token);
            localStorage.setItem('user_role', role); 
            
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
        await axios.post('/api/auth/register', {  
          username: formData.username,
          password: formData.password,
          role: formData.role
        });
        
        alert('Registrasi Berhasil! Silakan login menggunakan akun baru Anda.'); 
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
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950">
      
      {/* Background Decorations */}
      <div className="absolute -top-[10%] -right-[5%] w-[30rem] h-[30rem] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-[10%] -left-[5%] w-[25rem] h-[25rem] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-emerald-800/30 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row min-h-[550px] transition-all duration-500">
        
        {/* LEFT SIDE - BRANDING */}
        <div className="md:w-1/2 bg-emerald-900 p-8 md:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative blobs */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -right-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>

          {/* Top label */}
          <div className="relative z-10">
            <span className="inline-block text-[10px] font-bold tracking-[0.25em] uppercase text-emerald-200/60 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              Nyawit Hunter
            </span>
          </div>

          {/* Hero content */}
          <div className="relative z-10 my-auto text-center md:text-left">
            <img src={heroImg} alt="Sawit Asset" className="w-40 md:w-52 mx-auto mb-8 drop-shadow-2xl" />
            <h2 className="text-2xl md:text-3xl font-black leading-tight mb-3 text-white">
              {isLoginMode ? "Selamat Datang Kembali" : "Bergabung Bersama Kami"}
            </h2>
            <p className="text-sm text-emerald-100/70 leading-relaxed">
              {isLoginMode 
                ? "Login untuk memantau data distribusi dan berat TBS kelapa sawit secara real-time."
                : "Daftarkan akun untuk mulai mengelola sistem distribusi digital terintegrasi."}
            </p>
          </div>

          {/* Bottom info */}
          <div className="relative z-10 text-[10px] text-emerald-300/40 text-center md:text-left tracking-wider uppercase font-semibold">
            &copy; 2026 Nyawit Hunter &middot; v1.0
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-slate-50">
          
          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black text-emerald-900 mb-1">
              {isLoginMode ? "Login" : "Daftar"}
            </h2>
            <p className="text-sm text-emerald-900/50">
              {isLoginMode ? "Akses panel monitoring distribusi sawit" : "Lengkapi data untuk membuat akun baru"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* USERNAME */}
            <div>
              <label className="block text-[11px] font-bold text-emerald-900/60 uppercase mb-1.5 tracking-wider">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Masukkan username"
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-emerald-900/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all shadow-sm text-emerald-900 placeholder-emerald-900/30 font-medium"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-[11px] font-bold text-emerald-900/60 uppercase mb-1.5 tracking-wider">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Masukkan password"
                  className="w-full pl-10 pr-4 py-3 bg-white border-2 border-emerald-900/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm transition-all shadow-sm text-emerald-900 placeholder-emerald-900/30 font-medium"
                  required
                />
              </div>
            </div>

            {/* ROLE DROPDOWN - Register only */}
            {!isLoginMode && (
              <div>
                <label className="block text-[11px] font-bold text-emerald-900/60 uppercase mb-1.5 tracking-wider">
                  Jabatan / Otoritas
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-500">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </span>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-white border-2 border-emerald-900/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm shadow-sm text-emerald-900 font-medium cursor-pointer appearance-none"
                  >
                    <option value="petugas">Petugas Lapangan (Input & Validasi)</option>
                    <option value="manajer">Manajer (Pemantau Statistik)</option>
                  </select>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 font-bold rounded-xl shadow-lg shadow-amber-500/30 transform active:scale-[0.98] transition-all text-sm tracking-wide mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-400 text-emerald-900"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memproses...
                </>
              ) : (
                isLoginMode ? (
                  <>
                    Login ke Dashboard
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                ) : (
                  <>
                    Daftarkan Akun
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="8.5" cy="7" r="4" />
                      <line x1="20" y1="8" x2="20" y2="14" />
                      <line x1="23" y1="11" x2="17" y2="11" />
                    </svg>
                  </>
                )
              )}
            </button>
          </form>

          {/* TOGGLE LOGIN/REGISTER */}
          <div className="mt-8 text-center">
            <p className="text-sm text-emerald-900/50">
              {isLoginMode ? "Belum memiliki akun?" : "Sudah terdaftar?"}{" "}
              <button
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-emerald-500 font-bold hover:text-amber-500 transition-colors focus:outline-none underline decoration-emerald-500/30 hover:decoration-amber-500 underline-offset-4"
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
