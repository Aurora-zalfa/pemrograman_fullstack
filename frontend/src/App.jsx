import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import heroImg from "./assets/hero.png"; 
import "./App.css";

// Import halaman-halaman dari folder project kamu
import Login from "./pages/Login";
import Dashboard from "./components/Dashboard/Dashboard"; 

/**
 * ========================================================
 * 1. KOMPONEN LANDING PAGE
 * ========================================================
 * Menyimpan seluruh kode UI Landing Page lama kamu agar terisolasi.
 */
const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Efek untuk menangani logika scroll pada navbar
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

  // Efek untuk menutup nav mobile saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      const navContent = document.getElementById("nav-content");
      const navToggle = document.getElementById("nav-toggle");
      if (
        navContent &&
        !navContent.contains(e.target) &&
        navToggle &&
        !navToggle.contains(e.target)
      ) {
        setIsNavOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  return (
    <div className="App">
      {/* Nav */}
      <nav
        id="header"
        className={`fixed w-full z-30 top-0 text-white transition-all duration-300 ${
          isScrolled ? "bg-white shadow" : "bg-transparent"
        }`}
      >
        <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
          <div className="pl-4 flex items-center">
            <Link
              className={`toggleColour no-underline hover:no-underline font-bold text-2xl lg:text-4xl flex items-center gap-2 ${
                isScrolled ? "text-gray-800" : "text-white"
              }`}
              to="/"
            >
              <svg
                className="h-8 fill-current inline"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512.005 512.005"
              >
                <rect fill="#2a2a31" x="16.539" y="425.626" width="479.767" height="50.502" />
                <path
                  className="plane-take-off"
                  d=" M 510.7 189.151 C 505.271 168.95 484.565 156.956 464.365 162.385 L 330.156 198.367 L 155.924 35.878 L 107.19 49.008 L 211.729 230.183 L 86.232 263.767 L 36.614 224.754 L 0 234.603 L 45.957 314.27 L 65.274 347.727 L 105.802 336.869 L 240.011 300.886 L 349.726 271.469 L 483.935 235.486 C 504.134 230.057 516.129 209.352 510.7 189.151 Z "
                />
              </svg>
              MONITORING SAWIT
            </Link>
          </div>

          <div className="block lg:hidden pr-4">
            <button
              id="nav-toggle"
              onClick={toggleNav}
              className="flex items-center p-1 text-pink-800 hover:text-gray-900 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out"
            >
              <svg
                className="fill-current h-6 w-6"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Menu</title>
                <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
              </svg>
            </button>
          </div>

          <div
            id="nav-content"
            className={`w-full flex-grow lg:flex lg:items-center lg:w-auto mt-2 lg:mt-0 bg-white lg:bg-transparent text-black p-4 lg:p-0 z-20 ${
              isNavOpen ? "block" : "hidden"
            }`}
          >
            <ul className="list-reset lg:flex justify-end flex-1 items-center">
              <li className="mr-3">
                <Link className="inline-block py-2 px-4 text-black font-bold no-underline" to="/">Home</Link>
              </li>
              <li className="mr-3">
                <a className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4" href="#fitur">Fitur</a>
              </li>
              <li className="mr-3">
                <a className="inline-block text-black no-underline hover:text-gray-800 hover:text-underline py-2 px-4" href="#tentang">Tentang</a>
              </li>
            </ul>
            
            {/* Navigasi Link Tombol Login menggunakan React Router */}
            <Link to="/login">
              <button
                id="navAction"
                className={`mx-auto lg:mx-0 hover:underline font-bold rounded-full mt-4 lg:mt-0 py-3 px-8 shadow opacity-75 focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out ${
                  isScrolled
                    ? "bg-green-700 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                Masuk Sistem
              </button>
            </Link>
          </div>
        </div>
        <hr className="border-b border-gray-100 opacity-25 my-0 py-0" />
      </nav>

      {/* Hero Content Section */}
      <div className="pt-24 min-h-screen flex items-center">
        <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
          <div className="flex flex-col w-full md:w-2/5 justify-center items-start text-center md:text-left">
            <p className="uppercase tracking-loose w-full text-green-200 font-semibold mb-2">
              SISTEM MANAJEMEN DISTRIBUSI TBS
            </p>
            <h1 className="my-4 text-5xl font-bold leading-tight text-white">
              Monitoring Produksi & Pengiriman Kelapa Sawit Digital
            </h1>
            <p className="leading-normal text-2xl mb-8 text-gray-100">
              Kelompok Aurora - Solusi Real-Time Transparansi Data Kebun Sawit Hingga Pabrik Pengolahan.
            </p>
            <Link to="/login">
              <button className="mx-auto lg:mx-0 hover:underline bg-white text-green-900 font-bold rounded-full my-2 py-4 px-8 shadow-lg focus:outline-none focus:shadow-outline transform transition hover:scale-105 duration-300 ease-in-out">
                Mulai Monitoring
              </button>
            </Link>
          </div>
          <div className="w-full md:w-3/5 py-6 text-center">
            <img className="w-full md:w-4/5 z-50 mx-auto" src={heroImg} alt="Hero" />
          </div>
        </div>
      </div>

      {/* Wave SVG Divider */}
      <div className="relative -mt-12 lg:-mt-24">
        <svg viewBox="0 0 1428 174" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g transform="translate(-2.000000, 44.000000)" fill="#FFFFFF" fillRule="nonzero">
              <path d="M0,0 C90.7283404,0.927527913 147.912752,27.187927 291.910178,59.9119003 C387.908462,81.7278826 543.605069,89.334785 759,82.7326078 C469.336065,156.254352 216.336065,153.6679 0,74.9732496" opacity="0.100000001"></path>
              <path
                d="M100,104.708498 C277.413333,72.2345949 426.147877,52.5246657 546.203633,45.5787101 C666.259389,38.6327546 810.524845,41.7979068 979,55.0741668 C931.069965,56.122511 810.303266,74.8455141 616.699903,111.243176 C423.096539,147.640838 250.863238,145.462612 100,104.708498 Z"
                opacity="0.100000001"
              ></path>
              <path d="M1046,51.6521276 C1130.83045,29.328812 1279.08318,17.607883 1439,40.1656806 L1439,120 C1271.17211,77.9435312 1140.17211,55.1609071 1046,51.6521276 Z" id="Path-4" opacity="0.200000003"></path>
            </g>
            <g transform="translate(-4.000000, 76.000000)" fill="#FFFFFF" fillRule="nonzero">
              <path
                d="M0.457,34.035 C57.086,53.198 98.208,65.809 123.822,71.865 C181.454,85.495 234.295,90.29 272.033,93.459 C311.355,96.759 396.635,95.801 461.025,91.663 C486.76,90.01 518.727,86.372 556.926,80.752 C595.747,74.596 622.372,70.008 636.799,66.991 C663.913,61.324 712.501,49.503 727.605,46.128 C780.47,34.317 818.839,22.532 856.324,15.904 C922.689,4.169 955.676,2.522 1011.185,0.432 C1060.705,1.477 1097.39,3.129 1121.236,5.387 C1161.703,9.219 1208.621,17.821 1235.4,22.304 C1285.855,30.748 1354.351,47.432 1440.886,72.354 L1441.191,104.352 L1.121,104.031 L0.457,34.035 Z"
              ></path>
            </g>
          </g>
        </svg>
      </div>

      {/* Footer */}
      <footer className="bg-white pt-10">
        <div className="container mx-auto px-8 text-center py-6">
          <p className="text-gray-500 text-sm">
            &copy; 2026 Kelompok Aurora - Pemrograman Fullstack Semester 4. All rights reserved.
          </p>
          <a href="https://www.freepik.com/free-photos-vectors/background" className="text-xs text-gray-400 hover:underline mt-2 inline-block">
            Background vector created by freepik - www.freepik.com
          </a>
        </div>
      </footer>
    </div>
  );
};

/**
 * ========================================================
 * 2. KOMPONEN ROUTER UTAMA (APP)
 * ========================================================
 * Bertindak sebagai pengatur jalur navigasi antaran halaman.
 */
function App() {
  return (
    <Router>
      <Routes>
        {/* Jalur Halaman Utama (/) -> Memanggil Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Jalur Halaman Login (/login) -> Memanggil Form Login Sprint 8 */}
        <Route path="/login" element={<Login />} />
        
        {/* Jalur Dashboard (/dashboard) -> Memanggil Dashboard Zainab */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;