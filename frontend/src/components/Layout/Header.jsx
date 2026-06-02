import React from "react";
import { Link } from "react-router-dom";
import heroImg from "../../assets/hero.png";

const Header = () => {
  return (
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
  );
};

export default Header;