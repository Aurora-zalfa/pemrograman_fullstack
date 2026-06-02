import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/* ─────────────────────────────────────────────
   Nyawit Hunter — Navbar
   Aesthetic: Cinematic agri-tech | Emerald + Amber
   Font: Sora
───────────────────────────────────────────── */

const NAV_LINKS = [
  { label: "Beranda",  to: "/"              },
  { label: "Fitur",    href: "#fitur"       },
  { label: "Tentang",  href: "#tentang"     },
];

/* Palm-leaf icon */
const PalmIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    style={{
      width: 40, height: 40,
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: "10px",
      border: "1px solid rgba(16,185,129,0.25)",
      background: open ? "rgba(16,185,129,0.12)" : "transparent",
      cursor: "pointer",
      transition: "all 0.3s ease",
      flexShrink: 0,
    }}
  >
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <line
        x1="2" y1={open ? "9" : "4"} x2="16" y2={open ? "9" : "4"}
        stroke="white" strokeWidth="1.8" strokeLinecap="round"
        style={{
          transform: open ? "rotate(45deg)" : "rotate(0)",
          transformOrigin: "9px 9px",
          transition: "all 0.3s ease",
        }}
      />
      <line
        x1="2" y1="9" x2="16" y2="9"
        stroke="white" strokeWidth="1.8" strokeLinecap="round"
        style={{ opacity: open ? 0 : 1, transition: "opacity 0.2s ease" }}
      />
      <line
        x1="2" y1={open ? "9" : "14"} x2="16" y2={open ? "9" : "14"}
        stroke="white" strokeWidth="1.8" strokeLinecap="round"
        style={{
          transform: open ? "rotate(-45deg)" : "rotate(0)",
          transformOrigin: "9px 9px",
          transition: "all 0.3s ease",
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
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&display=swap');

        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mobileMenuOpen {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .nav-link-item {
          position: relative;
          font-family: 'Sora', system-ui, sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          letter-spacing: 0.01em;
          text-decoration: none;
          padding: 7px 16px;
          border-radius: 100px;
          transition: color 0.25s ease, background 0.25s ease;
          color: rgba(255,255,255,0.65);
          white-space: nowrap;
          cursor: pointer;
        }
        .nav-link-item:hover {
          color: #ffffff;
          background: rgba(255,255,255,0.06);
        }
        .nav-link-item.active {
          color: #F59E0B;
          background: rgba(245,158,11,0.1);
        }
        .nav-link-item.active::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #F59E0B;
        }

        .cta-nav:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(245,158,11,0.4);
        }
        .cta-nav:active { transform: scale(0.97); }

        .mobile-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          border-radius: 12px;
          font-family: 'Sora', system-ui, sans-serif;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          color: rgba(255,255,255,0.7);
          transition: all 0.2s ease;
          border: 1px solid transparent;
          cursor: pointer;
        }
        .mobile-link:hover {
          color: white;
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.08);
        }
        .mobile-link.active {
          color: #F59E0B;
          background: rgba(245,158,11,0.08);
          border-color: rgba(245,158,11,0.2);
        }
      `}</style>

      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 50,
          fontFamily: "'Sora', system-ui, sans-serif",
          transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
          animation: mounted ? "navSlideDown 0.5s ease both" : "none",
          ...(scrolled
            ? {
                background: "rgba(4,43,33,0.92)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(16,185,129,0.12)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                padding: "8px 0",
              }
            : {
                background: "transparent",
                padding: "16px 0",
              }),
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >

          {/* ── Logo ── */}
          <Link
            to="/"
            onClick={() => setActiveMenu("Beranda")}
            style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}
          >
            <div
              style={{
                width: 40, height: 40,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 16px rgba(245,158,11,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                flexShrink: 0,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "scale(1.08) rotate(-4deg)";
                e.currentTarget.style.boxShadow = "0 6px 24px rgba(245,158,11,0.45)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                e.currentTarget.style.boxShadow = "0 4px 16px rgba(245,158,11,0.3), inset 0 1px 0 rgba(255,255,255,0.2)";
              }}
            >
              <PalmIcon />
            </div>

            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontSize: "20px", fontWeight: 800, letterSpacing: "-0.02em", color: "#ffffff" }}>
                Nyawit<span style={{ color: "#F59E0B" }}>Hunter</span>
              </span>
              <span
                style={{
                  fontSize: "9px", fontWeight: 600, letterSpacing: "0.22em",
                  color: "rgba(167,243,208,0.45)", textTransform: "uppercase",
                  marginTop: "2px", display: "none",
                }}
                className="hidden-mobile-brand"
              >
                <br></br>
                Distribution System
              </span>
            </div>
          </Link>

          {/* ── Desktop nav links ── */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }} className="desktop-nav">
            <style>{`
              @media (max-width: 1023px) { .desktop-nav { display: none !important; } }
              @media (min-width: 640px)  { .hidden-mobile-brand { display: block !important; } }
            `}</style>

            {NAV_LINKS.map((item) => {
              const isActive = activeMenu === item.label;
              const Tag = item.to ? Link : "a";

              return (
                <Tag
                  key={item.label}
                  to={item.to}
                  href={item.href}
                  onClick={() => setActiveMenu(item.label)}
                  className={`nav-link-item${isActive ? " active" : ""}`}
                >
                  {item.label}
                </Tag>
              );
            })}

            <div style={{ width: "1px", height: "20px", background: "rgba(255,255,255,0.1)", margin: "0 8px" }} />

            <Link to="/login" style={{ textDecoration: "none" }}>
              <button
                className="cta-nav"
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "9px 22px", borderRadius: "100px", border: "none", cursor: "pointer",
                  background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
                  color: "#042B21", fontFamily: "inherit", fontSize: "13px",
                  fontWeight: 800, letterSpacing: "0.01em",
                  transition: "all 0.3s cubic-bezier(.34,1.56,.64,1)",
                  boxShadow: "0 3px 14px rgba(245,158,11,0.25), inset 0 1px 0 rgba(255,255,255,0.25)",
                  whiteSpace: "nowrap",
                }}
              >
                Masuk Sistem
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>
          </div>

          {/* ── Hamburger ── */}
          <div style={{ display: "none" }} className="mobile-hamburger">
            <style>{`@media (max-width: 1023px) { .mobile-hamburger { display: block !important; } }`}</style>
            <Hamburger open={isNavOpen} onClick={toggleNav} />
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {isNavOpen && (
          <div
            style={{
              margin: "12px 16px 16px", borderRadius: "18px", overflow: "hidden",
              background: "rgba(4,43,33,0.97)", border: "1px solid rgba(16,185,129,0.18)",
              backdropFilter: "blur(20px)", boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
              animation: "mobileMenuOpen 0.3s cubic-bezier(0.34,1.3,0.64,1) both",
            }}
          >
            <div style={{ height: "2px", background: "linear-gradient(90deg, #10B981, #F59E0B, #10B981)", backgroundSize: "200% 100%" }} />

            <div style={{ padding: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "12px" }}>
                {[
                  { label: "Beranda",  to: "/",        icon: "🌿" },
                  { label: "Fitur",    href: "#fitur",  icon: "⚡" },
                  { label: "Tentang",  href: "#tentang",icon: "ℹ️" },
                ].map((item) => {
                  const isActive = activeMenu === item.label;
                  const Tag = item.to ? Link : "a";
                  return (
                    <Tag
                      key={item.label}
                      to={item.to}
                      href={item.href}
                      onClick={() => { setActiveMenu(item.label); toggleNav(); }}
                      className={`mobile-link${isActive ? " active" : ""}`}
                    >
                      <span style={{ fontSize: "16px", lineHeight: 1 }}>{item.icon}</span>
                      <span>{item.label}</span>
                      {isActive && (
                        <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#F59E0B", flexShrink: 0 }} />
                      )}
                    </Tag>
                  );
                })}
              </div>

              <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "4px 0 12px" }} />

              <Link to="/login" onClick={toggleNav} style={{ textDecoration: "none", display: "block" }}>
                <button
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    padding: "13px", borderRadius: "12px", border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg, #F59E0B, #FBBF24)", color: "#042B21",
                    fontFamily: "inherit", fontSize: "14px", fontWeight: 800, letterSpacing: "0.01em",
                    boxShadow: "0 4px 20px rgba(245,158,11,0.3)",
                  }}
                >
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