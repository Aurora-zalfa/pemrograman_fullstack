import React from "react";
import { Link } from "react-router-dom";
import reactLogo from "../../assets/react.png";

const Navbar = ({ isScrolled, isNavOpen, toggleNav }) => {
  return (
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
              isScrolled ? "text-amber-990" : "text-white border-white/20"
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
  );
};

export default Navbar;