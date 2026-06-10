import React, { useState, useEffect } from "react";
import buahSawitImg from '../assets/buah_sawit.png';

// Import komponen layout hasil pecahan
import Navbar from "../components/Layout/Navbar";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

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

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    // PERBAIKAN: Mengubah text-white global menjadi text-slate-800 agar teks card di bawah tidak dipaksa putih
    <div className="App font-sans antialiased text-slate-800 min-h-screen bg-[#F8FAFC]">
      
      {/* 1. Menggunakan Navbar Pemisahan */}
      <Navbar isScrolled={isScrolled} isNavOpen={isNavOpen} toggleNav={toggleNav} />

      {/* 2. Menggunakan Header (Hero Section) Pemisahan */}
      <Header />

      {/* WAVE DIVIDER */}
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

      {/* SEKSI FITUR UTAMA */}
      <section id="fitur" className="relative py-24 overflow-hidden bg-[#F8FAFC]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-[50rem] bg-[#10B981]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container px-6 mx-auto relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-16">
            <span className="inline-block text-[#10B981] font-bold text-xs tracking-[0.2em] uppercase mb-3 bg-[#10B981]/10 px-4 py-1.5 rounded-full">
              Fitur Unggulan
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#064E3B] leading-tight">
              Solusi Cerdas untuk{" "}
              <span className="relative">
                <span className="text-[#F59E0B]">Distribusi Sawit</span>
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-[#F59E0B]/30" viewBox="0 0 100 6" preserveAspectRatio="none">
                  <path d="M0,3 Q50,0 100,3" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
              </span>
            </h2>
            <p className="text-gray-500 text-base mt-4 max-w-xl mx-auto">
              Tiga pilar utama yang menjadikan sistem kami andalan perkebunan modern.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            
            {/* Card 1 */}
            <div className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-[#10B981] to-[#064E3B] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#064E3B] to-[#10B981] flex items-center justify-center mb-6 shadow-lg shadow-[#064E3B]/10 group-hover:shadow-[#10B981]/20 group-hover:scale-110 transition-all duration-500">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              
              <h3 className="text-lg font-bold text-[#064E3B] mb-3 group-hover:text-[#10B981] transition-colors duration-300">
                Pelacakan Manifes Riil
              </h3>
              {/* PERBAIKAN: Menggunakan warna abu-abu solid Tailwind agar terlihat jelas di semua laptop */}
              <p className="text-gray-600 text-sm leading-relaxed">
                Memantau secara berkala alur pengiriman Tandan Buah Segar (TBS) dari berbagai kebun asal menuju pabrik tujuan secara dinamis lewat label status otomatis.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-[#F59E0B] to-[#10B981] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center mb-6 shadow-lg shadow-[#F59E0B]/10 group-hover:shadow-[#F59E0B]/20 group-hover:scale-110 transition-all duration-500">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  <polyline points="8 2 12 6 16 2" />
                  <polyline points="8 22 12 18 16 22" />
                </svg>
              </div>
              
              <h3 className="text-lg font-bold text-[#064E3B] mb-3 group-hover:text-[#F59E0B] transition-colors duration-300">
                Akurasi Timbangan TBS
              </h3>
              {/* PERBAIKAN: Menggunakan warna abu-abu solid Tailwind */}
              <p className="text-gray-600 text-sm leading-relaxed">
                Pencatatan data tonase muatan bersih sawit yang presisi, terintegrasi otomatis ke sistem rekapitulasi database untuk mencegah manipulasi berat di lapangan.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1">
              <div className="absolute top-0 left-8 right-8 h-0.5 bg-gradient-to-r from-[#064E3B] to-[#F59E0B] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#064E3B] to-[#043A2C] flex items-center justify-center mb-6 shadow-lg shadow-[#064E3B]/10 group-hover:shadow-[#064E3B]/20 group-hover:scale-110 transition-all duration-500">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              
              <h3 className="text-lg font-bold text-[#064E3B] mb-3 group-hover:text-[#064E3B] transition-colors duration-300">
                Otorisasi Jabatan Aman
              </h3>
              {/* PERBAIKAN: Menggunakan warna abu-abu solid Tailwind */}
              <p className="text-gray-600 text-sm leading-relaxed">
                Pembatasan hak akses operasional yang ketat berbasis peran akun. Memisahkan fungsionalitas input Petugas Lapangan dengan pengawasan laporan Manajer.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SEKSI TENTANG SISTEM */}
      <section id="tentang" className="py-20 bg-gray-50">
        <div className="container px-6 mx-auto">
          <div className="max-w-6xl p-10 mx-auto bg-white border border-gray-100 shadow-sm rounded-3xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-full md:w-3/5 text-left">
                <h2 className="text-gray-800 text-3xl md:text-5xl font-bold leading-tight mb-6">
                  Digitalisasi Ekosistem Distribusi Sawit yang Transparan dan Terintegrasi
                </h2>
                <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-6">
                  <span className="text-green-700 font-semibold">PalmTrack</span> adalah platform manajemen and monitoring logistik kelapa sawit berbasis web yang dirancang khusus untuk mentransformasi pencatatan konvensional menjadi ekosistem digital yang minim risiko kesalahan data.
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

      {/* 3. Menggunakan Footer Pemisahan */}
      <Footer />
    </div>
  );
};

export default LandingPage;