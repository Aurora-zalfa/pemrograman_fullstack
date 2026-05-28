import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Import halaman hasil pemisahan & komponen lain
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard/Dashboard"; 
import FormManifest from "./components/formManifest";
import TabelDistribusi from './components/TabelDistribusi';

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

/**
 * ========================================================
 * KOMPONEN LANDING PAGE 
 * ========================================================
 */
const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="App font-sans antialiased text-white min-h-screen">
      
      <nav
        id="header"
        className={`fixed w-full z-30 top-0 transition-all duration-300 py-3 ${
          isScrolled ? "bg-white shadow-lg text-gray-800" : "bg-transparent text-white"
        }`}
      >
        <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 px-6">
          <div className="flex items-center">
            <Link
              className={`no-underline hover:no-underline font-black text-2xl lg:text-3xl flex items-center gap-3 tracking-wide ${
                isScrolled ? "text-amber-950" : "text-white"
              }`}
              to="/"
            >
              <div className="p-1 rounded-lg flex items-center justify-center bg-white/20 backdrop-blur-sm shadow-sm">
                <img 
                  src={reactLogo} 
                  alt="PalmTrack Logo" 
                  className="h-8 w-8 object-contain"
                />
              </div>
              <span>
                PalmTrack <span className={isScrolled ? "text-orange-600" : "text-amber-400"}>Project</span>
              </span>
            </Link>
          </div>

          <div className="block lg:hidden pr-4">
            <button
              id="nav-toggle"
              onClick={toggleNav}
              className={`flex items-center p-2 rounded-xl border focus:outline-none transition-all duration-300 ${
                isScrolled ? "text-amber-900 border-gray-200" : "text-white border-white/20"
              }`}
            >
              <svg className="fill-current h-5 w-5" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>

          <div
            id="nav-content"
            className={`w-full flex-grow lg:flex lg:items-center lg:w-auto mt-3 lg:mt-0 p-4 lg:p-0 z-20 transition-all duration-300 ${
              isNavOpen 
                ? "block bg-white text-gray-800 shadow-xl rounded-xl" 
                : "hidden lg:block bg-transparent"
            }`}
          >
            <ul className="list-reset lg:flex justify-end flex-1 items-center gap-2 font-semibold">
              <li>
                <Link className={`inline-block py-2 px-4 no-underline ${isScrolled || isNavOpen ? "text-orange-600" : "text-amber-300"}`} to="/">Home</Link>
              </li>
              <li>
                <a className={`inline-block no-underline hover:text-orange-500 py-2 px-4 transition-colors ${isScrolled || isNavOpen ? "text-gray-600" : "text-white/90"}`} href="#fitur">Fitur</a>
              </li>
              <li>
                <a className={`inline-block no-underline hover:text-orange-500 py-2 px-4 transition-colors ${isScrolled || isNavOpen ? "text-gray-600" : "text-white/90"}`} href="#tentang">Tentang</a>
              </li>
            </ul>
            
            <Link to="/login" className="mt-4 lg:mt-0 block lg:inline-block lg:ml-4">
              <button
                id="navAction"
                className="w-full lg:w-auto font-bold rounded-full py-3 px-8 shadow-md transform transition hover:scale-105 duration-300 bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:from-emerald-700 hover:to-green-600"
              >
                Masuk Sistem
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="pt-28 min-h-screen flex items-center bg-gradient-to-br from-rose-950 via-orange-800 to-amber-600 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[25rem] h-[25rem] bg-rose-900/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="container px-6 mx-auto flex flex-col lg:flex-row items-center max-w-7xl relative z-10 gap-12">
          <div className="flex flex-col w-full lg:w-1/2 justify-center items-center lg:items-start text-center lg:text-left space-y-6">
            <div className="inline-block bg-white/10 border border-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold text-amber-200 tracking-widest uppercase shadow-sm">
              SISTEM MANAJEMEN DISTRIBUSI TBS
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-white drop-shadow-sm">
              Monitoring Produksi & <br />
              <span className="text-amber-300">Pengiriman Kelapa Sawit</span> Digital
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-orange-100/90 max-w-lg leading-relaxed">
              Kelompok Aurora - Solusi Real-Time Transparansi Data Kebun Sawit Hingga Pabrik Pengolahan.
            </p>
            <div className="pt-2 w-full sm:w-auto">
              <Link to="/login">
                <button className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-500 text-white font-black rounded-full py-4 px-10 shadow-xl transform transition hover:scale-105 hover:-translate-y-0.5 duration-300 hover:shadow-2xl">
                  Mulai Monitoring
                </button>
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center items-center">
            <div className="relative w-full max-w-lg p-4">
              <img 
                className="w-full h-auto z-10 transform transition duration-500 hover:scale-[1.02] drop-shadow-2xl" 
                src={heroImg} 
                alt="Hero Illustration" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* WAVE SVG DIVIDER */}
      <div className="relative -mt-16 lg:-mt-24 z-20 pointer-events-none">
        <svg viewBox="0 0 1428 174" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-2.000000, 44.000000)" fill="#f9fafb" fillRule="nonzero">
              <path d="M0,0 C90.7283404,0.927527913 147.912752,27.187927 291.910178,59.9119003 C387.908462,81.7278826 543.605069,89.334785 759,82.7326078 C469.336065,156.254352 216.336065,153.6679 0,74.9732496" opacity="0.05"></path>
              <path d="M100,104.708498 C277.413333,72.2345949 426.147877,52.5246657 546.203633,45.5787101 C666.259389,38.6327546 810.524845,41.7979068 979,55.0741668 C931.069965,56.122511 810.303266,74.8455141 616.699903,111.243176 C423.096539,147.640838 250.863238,145.462612 100,104.708498 Z" opacity="0.05"></path>
              <path d="M1046,51.6521276 C1130.83045,29.328812 1279.08318,17.607883 1439,40.1656806 L1439,120 C1271.17211,77.9435312 1140.17211,55.1609071 1046,51.6521276 Z" opacity="0.1"></path>
            </g>
            <g transform="translate(-4.000000, 76.000000)" fill="#f9fafb" fillRule="nonzero">
              <path d="M0.457,34.035 C57.086,53.198 98.208,65.809 123.822,71.865 C181.454,85.495 234.295,90.29 272.033,93.459 C311.355,96.759 396.635,95.801 461.025,91.663 C486.76,90.01 518.727,86.372 556.926,80.752 C595.747,74.596 622.372,70.008 636.799,66.991 C663.913,61.324 712.501,49.503 727.605,46.128 C780.47,34.317 818.839,22.532 856.324,15.904 C922.689,4.169 955.676,2.522 1011.185,0.432 C1060.705,1.477 1097.39,3.129 1121.236,5.387 C1161.703,9.219 1208.621,17.821 1235.4,22.304 C1285.855,30.748 1354.351,47.432 1440.886,72.354 L1441.191,104.352 L1.121,104.031 L0.457,34.035 Z"></path>
            </g>
          </g>
        </svg>
      </div>

      {/* FITUR */}
      <section id="fitur" className="bg-white border-b py-16 text-left">
        <div className="container mx-auto flex flex-wrap pt-4 pb-12">
          <h2 className="w-full my-2 text-4xl font-bold leading-tight text-center text-gray-800">
            Fitur Unggulan Sistem
          </h2>
          <div className="w-full mb-12">
            <div className="h-1 mx-auto bg-green-700 w-64 opacity-25 my-0 py-0 rounded-t"></div>
          </div>

          <div className="w-full md:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
            <div className="flex-1 bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition p-8 border border-gray-100">
              <div className="flex items-center justify-center bg-green-100 text-green-800 w-12 h-12 rounded-xl mb-4">
                <i className="fas fa-truck text-lg"></i>
              </div>
              <h3 className="font-bold text-xl text-gray-800 px-1 mb-2">Pelacakan Manifes Riil</h3>
              <p className="text-gray-600 text-sm px-1 leading-relaxed">
                Memantau secara berkala alur pengiriman Tandan Buah Segar (TBS) dari berbagai kebun asal menuju pabrik tujuan secara dinamis lewat label status otomatis.
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
            <div className="flex-1 bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition p-8 border border-gray-100">
              <div className="flex items-center justify-center bg-green-100 text-green-800 w-12 h-12 rounded-xl mb-4">
                <i className="fas fa-balance-scale text-lg"></i>
              </div>
              <h3 className="font-bold text-xl text-gray-800 px-1 mb-2">Akurasi Timbangan TBS</h3>
              <p className="text-gray-600 text-sm px-1 leading-relaxed">
                Pencatatan data tonase muatan bersih sawit yang presisi, terintegrasi otomatis ke sistem rekapitulasi database untuk mencegah manipulasi berat di lapangan.
              </p>
            </div>
          </div>

          <div className="w-full md:w-1/3 p-6 flex flex-col flex-grow flex-shrink">
            <div className="flex-1 bg-gray-50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition p-8 border border-gray-100">
              <div className="flex items-center justify-center bg-green-100 text-green-800 w-12 h-12 rounded-xl mb-4">
                <i className="fas fa-user-shield text-lg"></i>
              </div>
              <h3 className="font-bold text-xl text-gray-800 px-1 mb-2">Otorisasi Jabatan Aman</h3>
              <p className="text-gray-600 text-sm px-1 leading-relaxed">
                Pembatasan hak akses operasional yang ketat berbasis peran akun. Memisahkan fungsionalitas input Petugas Lapangan dengan pengawasan laporan Manajer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TENTANG */}
      <section id="tentang" className="py-20 bg-gray-50">
        <div className="container px-6 mx-auto">
          <div className="max-w-6xl p-10 mx-auto bg-white border border-gray-100 shadow-sm rounded-3xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-3/5 text-left">
                <h2 className="text-gray-800 text-3xl md:text-5xl font-bold leading-tight mb-6">
                  Digitalisasi Ekosistem Distribusi Sawit yang Transparan dan Terintegrasi
                </h2>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                  <span className="text-green-700 font-semibold">PalmTrack</span> adalah platform manajemen dan monitoring logistik kelapa sawit berbasis web yang dirancang khusus untuk mentransformasi pencatatan konvensional menjadi ekosistem digital yang minim risiko kesalahan data.
                </p>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed">
                  Dengan menjembatani aliran informasi dari sektor hulu (kebun kelapa sawit) hingga ke sektor hilir (pabrik pengolahan), aplikasi ini menyajikan visibilitas total terhadap pergerakan manifes truk dan akurasi data tonase secara <span className="text-green-700 font-semibold">real-time</span> demi meningkatkan efisiensi operasional harian perusahaan.
                </p>
              </div>
              
              <div className="w-full md:w-2/5 flex justify-center">
                <div className="relative w-full aspect-[4/3] md:aspect-square rounded-3xl overflow-hidden shadow-md flex flex-col items-center justify-center p-6 text-center">
                  <img 
                    src={buahSawitImg} 
                    alt="Buah Kelapa Sawit Segar" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-green-950/85 via-emerald-900/85 to-teal-950/80 mix-blend-multiply"></div>
                  <div className="relative z-10 flex flex-col items-center text-white">
                    <div className="mb-4">
                      <svg className="w-14 h-14 text-white drop-shadow-sm" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C11.5 2 11 2.5 11 3V7C11 7.5 11.5 8 12 8C15.3 8 18 10.7 18 14C18 14.5 18.5 15 19 15C19.5 15 20 14.5 20 14C20 9.6 16.4 6 12 6V3C12 2.5 11.5 2 12 2ZM12 6C11.5 6 11 6.5 11 7V11C11 11.5 11.5 12 12 12C13.1 12 14 12.9 14 14C14 14.5 14.5 15 15 15C15.5 15 16 14.5 16 14C16 11.8 14.2 10 12 10V7C12 6.5 11.5 6 12 6ZM4 14C4 18.4 7.6 22 12 22C12.5 22 13 21.5 13 21V17C13 16.5 12.5 16 12 16C8.7 16 6 13.3 6 10C6 9.5 5.5 9 5 9C4.5 9 4 9.5 4 10C4 11.3 4.5 12.7 5.4 13.6C4.5 14.7 4 16.1 4 14ZM8 14C8 16.2 9.8 18 12 18C12.5 18 13 17.5 13 17V13C13 12.5 12.5 12 12 12C10.9 12 10 11.1 10 10C10 9.5 9.5 9 9 9C8.5 9 8 9.5 8 10C8 11.3 8.5 12.7 9.4 13.6C8.5 14.7 8 16.1 8 14Z"/>
                      </svg>
                    </div>
                    <h3 className="text-white text-3xl font-bold tracking-wide drop-shadow-md mb-2">
                      PalmTrack Project
                    </h3>
                    <div className="h-0.5 w-16 bg-white/50 my-2 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-white pt-10">
        <div className="container mx-auto px-8 text-center py-6">
          <p className="text-gray-500 text-sm">
            &copy; 2026 Kelompok Aurora - Pemrograman Fullstack Semester 4. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route 
          path="/dashboard/*" 
          element={
            <ProtectedRoute 
              isAuthenticated={isAuthenticated} 
              userRole={userRole}
              allowedRoles={["admin", "manajer", "driver", "petugas"]} 
            >
              <Dashboard userRole={userRole} onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
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