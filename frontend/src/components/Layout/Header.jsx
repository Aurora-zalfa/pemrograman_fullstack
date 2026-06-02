import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import heroImg from "../../assets/hero.png";

/* ─────────────────────────────────────────────
   Nyawit Hunter — Hero Section
   Palette: Emerald #064E3B | Amber #F59E0B | Mint #10B981
   Aesthetic: Cinematic / Editorial — luxury agri-tech
───────────────────────────────────────────── */

const STATS = [
  { value: "Real-Time", label: "Data Sync", icon: "⚡" },
  { value: "99.9%",     label: "Akurasi",   icon: "🎯" },
  { value: "Multi-Site",label: "Kebun & Pabrik", icon: "🌿" },
];

/* Floating particle dots */
const Particles = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {[
      { cx: "8%",  cy: "18%", r: 1.5, op: 0.4 },
      { cx: "15%", cy: "65%", r: 2,   op: 0.3 },
      { cx: "22%", cy: "40%", r: 1,   op: 0.5 },
      { cx: "72%", cy: "12%", r: 2,   op: 0.35 },
      { cx: "85%", cy: "30%", r: 1.5, op: 0.4 },
      { cx: "91%", cy: "72%", r: 1,   op: 0.3 },
      { cx: "48%", cy: "85%", r: 2,   op: 0.25 },
      { cx: "33%", cy: "92%", r: 1.5, op: 0.3 },
      { cx: "62%", cy: "55%", r: 1,   op: 0.2 },
    ].map((p, i) => (
      <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="#10B981" opacity={p.op} />
    ))}
  </svg>
);

const Header = () => {
  const lineRef = useRef(null);

  useEffect(() => {
    /* Subtle parallax on the decorative vertical line */
    const onScroll = () => {
      if (lineRef.current) {
        lineRef.current.style.transform = `translateY(${window.scrollY * 0.12}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #042B21 0%, #064E3B 45%, #053D2F 100%)",
        fontFamily: "'Sora', 'Plus Jakarta Sans', system-ui, sans-serif",
      }}
    >
      {/* ── Google Font Import (Sora) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50%       { transform: translateY(-14px) rotate(1deg); }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50%       { transform: scale(1.6); opacity: 0; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scanLine {
          0%   { top: 0%; opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .hero-fade-1 { animation: fadeUp 0.7s ease both 0.1s; }
        .hero-fade-2 { animation: fadeUp 0.7s ease both 0.25s; }
        .hero-fade-3 { animation: fadeUp 0.7s ease both 0.4s; }
        .hero-fade-4 { animation: fadeUp 0.7s ease both 0.55s; }
        .hero-fade-5 { animation: fadeUp 0.7s ease both 0.7s; }
        .hero-img    { animation: fadeUp 0.9s ease both 0.3s, floatY 8s ease-in-out 1s infinite; }

        .badge-pill:hover { background: rgba(16,185,129,0.18) !important; }
        .cta-primary:hover { box-shadow: 0 0 40px rgba(245,158,11,0.45), 0 8px 32px rgba(0,0,0,0.3); transform: translateY(-3px) scale(1.03); }
        .cta-primary:active { transform: translateY(0) scale(0.98); }
        .cta-secondary:hover { background: rgba(16,185,129,0.12) !important; transform: translateY(-2px); }
        .stat-item:hover .stat-icon { transform: scale(1.3) rotate(-8deg); }

        .shimmer-text {
          background: linear-gradient(90deg, #F59E0B 0%, #FDE68A 40%, #F59E0B 60%, #FBBF24 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3.5s linear infinite;
        }

        .img-scan::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(16,185,129,0.6), transparent);
          animation: scanLine 3s ease-in-out infinite;
        }

        .noise-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          mix-blend-mode: overlay;
        }

        .ring-rotate {
          animation: rotateSlow 20s linear infinite;
          transform-origin: center;
        }
      `}</style>

      {/* ── Background Layers ── */}
      <div className="noise-bg absolute inset-0 pointer-events-none" />
      <Particles />

      {/* Large ambient orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-15%", right: "-10%",
          width: "55rem", height: "55rem",
          background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-20%", left: "-12%",
          width: "50rem", height: "50rem",
          background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 65%)",
        }}
      />

      {/* Vertical accent line */}
      <div
        ref={lineRef}
        className="absolute hidden lg:block pointer-events-none"
        style={{
          left: "50%",
          top: "5%",
          width: "1px",
          height: "35%",
          background: "linear-gradient(to bottom, transparent, rgba(16,185,129,0.25), transparent)",
        }}
      />

      {/* Fine grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16,185,129,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Diagonal corner accent */}
      <div
        className="absolute top-0 right-0 pointer-events-none"
        style={{
          width: 0, height: 0,
          borderStyle: "solid",
          borderWidth: "0 220px 220px 0",
          borderColor: "transparent rgba(245,158,11,0.05) transparent transparent",
        }}
      />

      {/* ── Main content ── */}
      <div
        className="relative z-10 w-full px-6 mx-auto flex flex-col lg:flex-row items-center gap-14 lg:gap-8 py-24"
        style={{ maxWidth: "1280px" }}
      >

        {/* ═══════════ LEFT COLUMN ═══════════ */}
        <div className="flex flex-col w-full lg:w-[52%] items-center lg:items-start text-center lg:text-left space-y-7">

          {/* Status badge */}
          <div
            className="badge-pill hero-fade-1 inline-flex items-center gap-3 rounded-full border px-5 py-2 cursor-default transition-all duration-300"
            style={{
              background: "rgba(16,185,129,0.08)",
              borderColor: "rgba(16,185,129,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span
                className="absolute inline-flex h-full w-full rounded-full bg-emerald-400"
                style={{ animation: "pulseDot 1.8s ease-in-out infinite" }}
              />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "#6EE7B7",
                textTransform: "uppercase",
              }}
            >
              Sistem Manajemen Distribusi TBS
            </span>
          </div>

          {/* Main headline */}
          <div className="hero-fade-2 space-y-2">
            <p
              style={{
                fontSize: "clamp(13px, 1.2vw, 15px)",
                fontWeight: 400,
                color: "rgba(167,243,208,0.55)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Platform Digital Perkebunan Kelapa Sawit
            </p>

            <h1
              style={{
                fontSize: "clamp(2.6rem, 5.5vw, 4.4rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
              }}
            >
              <span style={{ color: "#ffffff" }}>Monitoring</span>
              <br />
              <span style={{ color: "#ffffff" }}>Produksi &amp;</span>
              <br />
              <span className="shimmer-text">Pengiriman Sawit</span>
              <br />
              <span
                style={{
                  color: "#ffffff",
                  fontSize: "clamp(1.8rem, 3.8vw, 3rem)",
                  fontWeight: 300,
                  letterSpacing: "0.02em",
                }}
              >
                secara Digital
              </span>
            </h1>
          </div>

          {/* Overline separator */}
          <div
            className="hero-fade-3 hidden lg:flex items-center gap-4 w-full"
            style={{ maxWidth: "480px" }}
          >
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(16,185,129,0.4), transparent)" }} />
            <span style={{ fontSize: "11px", color: "rgba(110,231,183,0.5)", letterSpacing: "0.15em" }}>BY NYAWIT HUNTER</span>
          </div>

          {/* Subtext */}
          <p
            className="hero-fade-3"
            style={{
              fontSize: "clamp(0.95rem, 1.4vw, 1.1rem)",
              color: "rgba(209,250,229,0.72)",
              lineHeight: 1.75,
              maxWidth: "460px",
              fontWeight: 400,
            }}
          >
            Solusi <strong style={{ color: "#F59E0B", fontWeight: 700 }}>real-time</strong> untuk transparansi data dari kebun sawit hingga pabrik. Lebih efisien, akurat, dan terpercaya di setiap titik distribusi.
          </p>

          {/* Stats row */}
          <div className="hero-fade-4 flex flex-wrap gap-8 sm:gap-12 pt-1">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="stat-item flex items-center gap-3 cursor-default"
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-xl"
                  style={{
                    width: 40, height: 40,
                    background: "rgba(16,185,129,0.1)",
                    border: "1px solid rgba(16,185,129,0.2)",
                  }}
                >
                  <span
                    className="stat-icon"
                    style={{ fontSize: "18px", transition: "transform 0.35s cubic-bezier(.34,1.56,.64,1)" }}
                  >
                    {s.icon}
                  </span>
                </div>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "clamp(0.95rem, 1.3vw, 1.15rem)",
                      fontWeight: 800,
                      color: "#F59E0B",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                    }}
                  >
                    {s.value}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "10px",
                      color: "rgba(110,231,183,0.65)",
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      fontWeight: 600,
                    }}
                  >
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div
            className="hero-fade-5 flex flex-col sm:flex-row gap-4 pt-3 w-full sm:w-auto"
          >
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button
                className="cta-primary"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  width: "100%",
                  padding: "14px 36px",
                  borderRadius: "100px",
                  border: "none",
                  cursor: "pointer",
                  background: "linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #F59E0B 100%)",
                  backgroundSize: "200% auto",
                  color: "#042B21",
                  fontFamily: "inherit",
                  fontSize: "0.95rem",
                  fontWeight: 800,
                  letterSpacing: "0.01em",
                  transition: "all 0.35s cubic-bezier(.34,1.56,.64,1)",
                  boxShadow: "0 4px 24px rgba(245,158,11,0.25), inset 0 1px 0 rgba(255,255,255,0.3)",
                  whiteSpace: "nowrap",
                }}
              >
                <span>Mulai Monitoring</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>

            <a href="#fitur" style={{ textDecoration: "none" }}>
              <button
                className="cta-secondary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "14px 28px",
                  borderRadius: "100px",
                  border: "1.5px solid rgba(16,185,129,0.35)",
                  cursor: "pointer",
                  background: "transparent",
                  color: "#34D399",
                  fontFamily: "inherit",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  letterSpacing: "0.01em",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                }}
              >
                <span>Jelajahi Fitur</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </a>
          </div>
        </div>

        {/* ═══════════ RIGHT COLUMN — Image ═══════════ */}
        <div className="w-full lg:w-[48%] flex justify-center items-center">
          <div style={{ position: "relative", width: "100%", maxWidth: "560px" }}>

            {/* Rotating ring decoration */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: "-10%",
                border: "1px dashed rgba(16,185,129,0.12)",
                borderRadius: "50%",
              }}
            >
              <div
                className="ring-rotate absolute"
                style={{
                  top: "10%", left: "-3%",
                  width: "10px", height: "10px",
                  borderRadius: "50%",
                  background: "#10B981",
                  opacity: 0.5,
                }}
              />
            </div>

            {/* Corner brackets */}
            {[
              { top: -10, left: -10, rotate: "0deg" },
              { top: -10, right: -10, rotate: "90deg" },
              { bottom: -10, right: -10, rotate: "180deg" },
              { bottom: -10, left: -10, rotate: "270deg" },
            ].map((pos, i) => (
              <svg
                key={i}
                width="20" height="20"
                viewBox="0 0 20 20"
                style={{
                  position: "absolute",
                  ...pos,
                  transform: `rotate(${pos.rotate})`,
                  pointerEvents: "none",
                }}
              >
                <path d="M2 18 L2 2 L18 2" stroke="#F59E0B" strokeWidth="2" fill="none" strokeLinecap="square" opacity="0.7" />
              </svg>
            ))}

            {/* Glow behind image */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: "-6%",
                background: "radial-gradient(ellipse at center, rgba(16,185,129,0.14) 0%, transparent 70%)",
                borderRadius: "24px",
                filter: "blur(8px)",
              }}
            />

            {/* Image frame */}
            <div
              className="img-scan relative overflow-hidden"
              style={{
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(4px)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(16,185,129,0.08)",
              }}
            >
              {/* Top chrome bar */}
              <div
                style={{
                  padding: "10px 16px",
                  background: "rgba(0,0,0,0.3)",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {["#FF5F57","#FEBC2E","#28C840"].map((c) => (
                  <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />
                ))}
                <div
                  style={{
                    flex: 1, height: "6px",
                    margin: "0 8px",
                    borderRadius: "4px",
                    background: "rgba(255,255,255,0.08)",
                  }}
                />
                <div
                  style={{
                    fontSize: "9px",
                    color: "rgba(167,243,208,0.4)",
                    letterSpacing: "0.12em",
                    fontWeight: 600,
                  }}
                >
                  LIVE
                </div>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
              </div>

              {/* Actual image */}
              <div className="hero-img" style={{ display: "block" }}>
                <img
                  src={heroImg}
                  alt="Nyawit Hunter Dashboard Preview"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>

              {/* Bottom gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0, left: 0, right: 0,
                  height: "30%",
                  background: "linear-gradient(to top, rgba(4,43,33,0.6), transparent)",
                  pointerEvents: "none",
                }}
              />
            </div>

            {/* Live tracking badge */}
            <div
              style={{
                position: "absolute",
                bottom: "-18px",
                right: "-14px",
                background: "linear-gradient(135deg, #F59E0B, #FBBF24)",
                color: "#042B21",
                borderRadius: "14px",
                padding: "10px 18px",
                fontWeight: 800,
                fontSize: "12px",
                letterSpacing: "0.04em",
                boxShadow: "0 8px 24px rgba(245,158,11,0.4)",
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                animation: "floatY 4s ease-in-out infinite",
              }}
            >
              <span>🚀</span>
              <span>Live Tracking</span>
            </div>

            {/* Mini data chip — top left */}
            <div
              style={{
                position: "absolute",
                top: "42px",
                left: "-20px",
                background: "rgba(6,78,59,0.95)",
                border: "1px solid rgba(16,185,129,0.25)",
                borderRadius: "12px",
                padding: "8px 14px",
                backdropFilter: "blur(12px)",
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                animation: "slideRight 0.8s ease both 0.8s, floatY 6s ease-in-out 1.5s infinite",
                opacity: 0,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
              <div>
                <p style={{ margin: 0, fontSize: "10px", color: "rgba(110,231,183,0.6)", fontWeight: 600, letterSpacing: "0.1em" }}>TONASE HARI INI</p>
                <p style={{ margin: 0, fontSize: "14px", color: "#F59E0B", fontWeight: 800 }}>128.4 ton</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom fade ── */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: "100px",
          background: "linear-gradient(to top, rgba(4,43,33,0.4), transparent)",
        }}
      />
    </section>
  );
};

export default Header;