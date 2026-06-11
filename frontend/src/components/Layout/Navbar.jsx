import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────
   Nyawit Hunter — Navbar
   Aesthetic: Cinematic agri-tech | Emerald + Amber
───────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "Beranda", to: "/" },
  { label: "Fitur", href: "#fitur" },
  { label: "Tentang", href: "#tentang" },
];

/* Palm-leaf icon */
const PalmIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M12 2C8.5 2 5 5.5 5 9c0 2.5 1.5 4.5 3 6l1 5h6l1-5c1.5-1.5 3-3.5 3-6 0-3.5-3.5-7-7-7z"
      fill="#042B21"
    />
    <circle cx="12" cy="9" r="2.5" fill="#042B21" opacity="0.55" />
  </svg>
);

/* Animated hamburger → X */
const Hamburger = ({ open, onClick }) => (
  <button
    onClick={onClick}
    aria-label="Toggle navigation"
    className={`w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 flex-shrink-0 cursor-pointer ${
      open 
        ? "bg-emerald-500/10 border-emerald-500/25" 
        : "bg-transparent border-emerald-500/20"
    }`}
  >
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <line
        x1="2" y1={open ? "9" : "4"} x2="16" y2={open ? "9" : "4"}
        stroke="white" strokeWidth="1.8" strokeLinecap="round"
        className="transition-all duration-300 origin-center"
        style={{
          transform: open ? "rotate(45deg)" : "rotate(0)",
          transformOrigin: "9px 9px",
        }}
      />
      <line
        x1="2" y1="9" x2="16" y2="9"
        stroke="white" strokeWidth="1.8" strokeLinecap="round"
        className="transition-opacity duration-200"
        style={{ opacity: open ? 0 : 1 }}
      />
      <line
        x1="2" y1={open ? "9" : "14"} x2="16" y2={open ? "9" : "14"}
        stroke="white" strokeWidth="1.8" strokeLinecap="round"
        className="transition-all duration-300 origin-center"
        style={{
          transform: open ? "rotate(-45deg)" : "rotate(0)",
          transformOrigin: "9px 9px",
        }}
      />
    </svg>
  </button>
);

const Navbar = ({ isScrolled, isNavOpen, toggleNav }) => {
  const [activeMenu, setActiveMenu] = useState("Beranda");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
  }, []);

  const scrolled = isScrolled;

  return (
    <>
      {/* ── Minimal Custom Animations ── */}
      <style>{`
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mobileMenuIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-nav-slide {
          animation: navSlideDown 0.5s ease both;
        }
        .animate-mobile-menu {
          animation: mobileMenuIn 0.3s cubic-bezier(0.34,1.3,0.64,1) both;
        }
      `}</style>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          mounted ? "animate-nav-slide" : ""
        } ${
          scrolled
            ? "bg-emerald-950/90 backdrop-blur-xl border-b border-emerald-500/10 shadow-lg shadow-black/25 py-2"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

          {/* ── Logo ── */}
          <Link
            to="/"
            onClick={() => setActiveMenu("Beranda")}
            className="flex items-center gap-3 no-underline group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 group-hover:shadow-amber-500/50 flex-shrink-0"
              style={{ boxShadow: "0 4px 16px rgba(245,158,11,0.3), inset 0 1px 0 rgba(255,255,255,0.2)" }}
            >
              <PalmIcon />
            </div>

            <div className="flex flex-col leading-none">
              <span className="text-xl font-extrabold tracking-tight text-white">
                Nyawit<span className="text-amber-500">Hunter</span>
              </span>
              <span className="text-[9px] font-semibold tracking-[0.22em] text-emerald-200/45 uppercase mt-0.5 hidden sm:block">
                Distribution System
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav Links ── */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((item) => {
              const isActive = activeMenu === item.label;
              const Tag = item.to ? Link : "a";

              return (
                <Tag
                  key={item.label}
                  to={item.to}
                  href={item.href}
                  onClick={() => setActiveMenu(item.label)}
                  className={`relative text-[13.5px] font-semibold tracking-[0.01em] no-underline px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "text-amber-500 bg-amber-500/10"
                      : "text-white/65 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-500" />
                  )}
                </Tag>
              );
            })}

            <div className="w-px h-5 bg-white/10 mx-2" />

            <Link to="/login" className="no-underline">
              <button className="flex items-center gap-2 px-5 py-2 rounded-full border-none cursor-pointer bg-gradient-to-r from-amber-500 to-amber-400 text-emerald-950 font-extrabold text-[13px] tracking-[0.01em] transition-all duration-300 ease-out shadow-md shadow-amber-500/25 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/40 active:scale-95 whitespace-nowrap"
                style={{ boxShadow: "0 3px 14px rgba(245,158,11,0.25), inset 0 1px 0 rgba(255,255,255,0.25)" }}
              >
                Masuk Sistem
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>
          </div>

          {/* ── Hamburger (Mobile) ── */}
          <div className="lg:hidden">
            <Hamburger open={isNavOpen} onClick={toggleNav} />
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {isNavOpen && (
          <div className="mx-4 mt-3 mb-4 rounded-2xl overflow-hidden bg-emerald-950/95 border border-emerald-500/15 backdrop-blur-xl shadow-2xl shadow-black/40 animate-mobile-menu lg:hidden">
            {/* Gradient accent bar */}
            <div className="h-0.5 bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-500 bg-[length:200%_100%]" />

            <div className="p-4">
              <div className="flex flex-col gap-1 mb-3">
                {[
                  { label: "Beranda", to: "/", icon: "🌿" },
                  { label: "Fitur", href: "#fitur", icon: "⚡" },
                  { label: "Tentang", href: "#tentang", icon: "ℹ️" },
                ].map((item) => {
                  const isActive = activeMenu === item.label;
                  const Tag = item.to ? Link : "a";
                  return (
                    <Tag
                      key={item.label}
                      to={item.to}
                      href={item.href}
                      onClick={() => {
                        setActiveMenu(item.label);
                        toggleNav();
                      }}
                      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold no-underline transition-all duration-200 border cursor-pointer ${
                        isActive
                          ? "text-amber-500 bg-amber-500/8 border-amber-500/20"
                          : "text-white/70 hover:text-white hover:bg-white/5 border-transparent"
                      }`}
                    >
                      <span className="text-base leading-none">{item.icon}</span>
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
                      )}
                    </Tag>
                  );
                })}
              </div>

              <div className="h-px bg-white/5 my-3" />

              <Link to="/login" onClick={toggleNav} className="no-underline block">
                <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-none cursor-pointer bg-gradient-to-r from-amber-500 to-amber-400 text-emerald-950 font-extrabold text-sm tracking-[0.01em] shadow-md shadow-amber-500/30 transition-all duration-300 active:scale-[0.98]">
                  Masuk Sistem
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
