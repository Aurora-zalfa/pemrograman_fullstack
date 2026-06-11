import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import heroImg from "../../assets/hero.png";

/* ─────────────────────────────────────────────
   Nyawit Hunter — Hero Section
   Palette: Emerald 900 | Amber 500 | Emerald 500
   Aesthetic: Cinematic / Editorial — luxury agri-tech
───────────────────────────────────────────── */

const STATS = [
  { value: "Real-Time", label: "Data Sync", icon: "⚡" },
  { value: "99.9%", label: "Akurasi", icon: "🎯" },
  { value: "Multi-Site", label: "Kebun & Pabrik", icon: "🌿" },
];

/* Floating particle dots */
const Particles = () => (
  <svg
    className="absolute inset-0 w-full h-full pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {[
      { cx: "8%", cy: "18%", r: 1.5, op: 0.4 },
      { cx: "15%", cy: "65%", r: 2, op: 0.3 },
      { cx: "22%", cy: "40%", r: 1, op: 0.5 },
      { cx: "72%", cy: "12%", r: 2, op: 0.35 },
      { cx: "85%", cy: "30%", r: 1.5, op: 0.4 },
      { cx: "91%", cy: "72%", r: 1, op: 0.3 },
      { cx: "48%", cy: "85%", r: 2, op: 0.25 },
      { cx: "33%", cy: "92%", r: 1.5, op: 0.3 },
      { cx: "62%", cy: "55%", r: 1, op: 0.2 },
    ].map((p, i) => (
      <circle key={i} cx={p.cx} cy={p.cy} r={p.r} fill="#10B981" opacity={p.op} />
    ))}
  </svg>
);

const Header = () => {
  const lineRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (lineRef.current) {
        lineRef.current.style.transform = `translateY(${window.scrollY * 0.12}px)`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950">
      
      {/* ── Custom Animations (Scoped via inline style tag - minimal) ── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0px) rotate(-1deg); }
          50% { transform: translateY(-14px) rotate(1deg); }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes scanLine {
          0% { top: 0%; opacity: 0.6; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes rotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .hero-fade-1 { animation: fadeUp 0.7s ease both 0.1s; }
        .hero-fade-2 { animation: fadeUp 0.7s ease both 0.25s; }
        .hero-fade-3 { animation: fadeUp 0.7s ease both 0.4s; }
        .hero-fade-4 { animation: fadeUp 0.7s ease both 0.55s; }
        .hero-fade-5 { animation: fadeUp 0.7s ease both 0.7s; }
        .hero-img { animation: fadeUp 0.9s ease both 0.3s, floatY 8s ease-in-out 1s infinite; }

        .shimmer-text {
          background: linear-gradient(90deg, #F59E0B 0%, #FDE68A 40%, #F59E0B 60%, #FBBF24 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3.5s linear infinite;
        }

        .ring-rotate {
          animation: rotateSlow 20s linear infinite;
          transform-origin: center;
        }

        .img-scan::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(16,185,129,0.6), transparent);
          animation: scanLine 3s ease-in-out infinite;
          z-index: 5;
        }
      `}</style>

      {/* ── Background Layers ── */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />
      <Particles />

      {/* Large ambient orbs */}
      <div className="absolute pointer-events-none -top-[15%] -right-[10%] w-[55rem] h-[55rem] bg-[radial-gradient(circle,rgba(245,158,11,0.07)_0%,transparent_65%)]" />
      <div className="absolute pointer-events-none -bottom-[20%] -left-[12%] w-[50rem] h-[50rem] bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,transparent_65%)]" />

      {/* Vertical accent line */}
      <div
        ref={lineRef}
        className="absolute hidden lg:block pointer-events-none left-1/2 top-[5%] w-px h-[35%]"
        style={{
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
        className="absolute top-0 right-0 pointer-events-none w-0 h-0 border-solid border-r-[220px] border-b-[220px] border-transparent border-b-amber-500/5"
      />

      {/* ── Main content ── */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-8 py-20 lg:py-24 max-w-7xl">

        {/* ═══════════ LEFT COLUMN ═══════════ */}
        <div className="flex flex-col w-full lg:w-[52%] items-center lg:items-start text-center lg:text-left space-y-6 lg:space-y-7">

          {/* Status badge */}
          <div className="hero-fade-1 inline-flex items-center gap-3 rounded-full border border-emerald-500/20 bg-emerald-500/10 backdrop-blur-sm px-4 sm:px-5 py-2 transition-all duration-300 hover:bg-emerald-500/20 cursor-default">
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 animate-ping opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-[10px] font-bold tracking-[0.18em] text-emerald-300 uppercase whitespace-nowrap">
              Sistem Manajemen Distribusi TBS
            </span>
          </div>

          {/* Main headline */}
          <div className="hero-fade-2 space-y-2">
            <p className="text-[clamp(13px,1.2vw,15px)] text-emerald-200/55 tracking-[0.12em] uppercase font-normal">
              Platform Digital Perkebunan Kelapa Sawit
            </p>

            <h1 className="text-[clamp(2.6rem,5.5vw,4.4rem)] font-extrabold leading-[1.08] tracking-[-0.025em] text-white">
              Monitoring
              <br />
              Produksi &amp;
              <br />
              <span className="shimmer-text">Pengiriman Sawit</span>
              <br />
              <span className="text-[clamp(1.8rem,3.8vw,3rem)] font-light tracking-[0.02em] text-white">
                secara Digital
              </span>
            </h1>
          </div>

          {/* Overline separator */}
          <div className="hero-fade-3 hidden lg:flex items-center gap-4 w-full max-w-[480px]">
            <div className="flex-1 h-px bg-gradient-to-r from-emerald-500/40 to-transparent" />
            <span className="text-[11px] text-emerald-300/50 tracking-[0.15em] whitespace-nowrap">BY NYAWIT HUNTER</span>
          </div>

          {/* Subtext */}
          <p className="hero-fade-3 text-[clamp(0.95rem,1.4vw,1.1rem)] text-emerald-100/70 leading-relaxed max-w-[460px] font-normal">
            Solusi <strong className="text-amber-500 font-bold">real-time</strong> untuk transparansi data dari kebun sawit hingga pabrik. Lebih efisien, akurat, dan terpercaya di setiap titik distribusi.
          </p>

          {/* Stats row */}
          <div className="hero-fade-4 flex flex-wrap gap-6 sm:gap-10 lg:gap-12 pt-1 justify-center lg:justify-start">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-3 cursor-default group">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-lg transition-transform duration-300 ease-out group-hover:scale-125 group-hover:-rotate-6">
                    {s.icon}
                  </span>
                </div>
                <div>
                  <p className="text-[clamp(0.95rem,1.3vw,1.15rem)] font-extrabold text-amber-500 tracking-[-0.01em] leading-tight m-0">
                    {s.value}
                  </p>
                  <p className="text-[10px] text-emerald-300/65 uppercase tracking-[0.14em] font-semibold m-0">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hero-fade-5 flex flex-col sm:flex-row gap-4 pt-3 w-full sm:w-auto">
            <Link to="/login" className="no-underline w-full sm:w-auto">
              <button className="relative overflow-hidden flex items-center justify-center gap-2.5 w-full sm:w-auto px-8 sm:px-9 py-3.5 rounded-full border-none cursor-pointer bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 bg-[length:200%_auto] text-emerald-950 font-extrabold text-[0.95rem] tracking-[0.01em] transition-all duration-300 ease-out shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:shadow-2xl hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-95 whitespace-nowrap"
                style={{ boxShadow: "0 4px 24px rgba(245,158,11,0.25), inset 0 1px 0 rgba(255,255,255,0.3)" }}
              >
                <span>Mulai Monitoring</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>

            <a href="#fitur" className="no-underline w-full sm:w-auto">
              <button className="flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 rounded-full border-2 border-emerald-500/35 bg-transparent text-emerald-400 font-semibold text-[0.9rem] tracking-[0.01em] transition-all duration-300 ease-out hover:bg-emerald-500/10 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap">
                <span>Jelajahi Fitur</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </a>
          </div>
        </div>

        {/* ═══════════ RIGHT COLUMN — Image ═══════════ */}
        <div className="w-full lg:w-[48%] flex justify-center items-center mt-8 lg:mt-0">
          <div className="relative w-full max-w-[560px]">

            {/* Rotating ring decoration */}
            <div className="absolute -inset-[10%] border border-dashed border-emerald-500/12 rounded-full pointer-events-none">
              <div className="ring-rotate absolute top-[10%] -left-[3%] w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
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
                className="absolute pointer-events-none"
                style={{
                  top: pos.top,
                  left: pos.left,
                  right: pos.right,
                  bottom: pos.bottom,
                  transform: `rotate(${pos.rotate})`,
                }}
              >
                <path d="M2 18 L2 2 L18 2" stroke="#F59E0B" strokeWidth="2" fill="none" strokeLinecap="square" opacity="0.7" />
              </svg>
            ))}

            {/* Glow behind image */}
            <div className="absolute -inset-[6%] rounded-3xl bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.14)_0%,transparent_70%)] blur-lg pointer-events-none" />

            {/* Image frame */}
            <div className="img-scan relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl shadow-black/40"
              style={{ boxShadow: "0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(16,185,129,0.08)" }}
            >
              {/* Top chrome bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-black/30 border-b border-white/5">
                {["#FF5F57","#FEBC2E","#28C840"].map((c) => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full opacity-80 flex-shrink-0" style={{ background: c }} />
                ))}
                <div className="flex-1 h-1.5 mx-2 rounded bg-white/10" />
                <span className="text-[9px] text-emerald-200/40 tracking-[0.12em] font-semibold">LIVE</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
              </div>

              {/* Actual image */}
              <div className="hero-img block">
                <img
                  src={heroImg}
                  alt="Nyawit Hunter Dashboard Preview"
                  className="w-full h-auto block"
                />
              </div>

              {/* Bottom gradient overlay */}
              <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-emerald-950/60 to-transparent pointer-events-none" />
            </div>

            {/* Live tracking badge */}
            <div 
              className="absolute -bottom-[18px] -right-[14px] bg-gradient-to-br from-amber-500 to-amber-400 text-emerald-950 rounded-2xl px-4 py-2.5 font-extrabold text-xs tracking-[0.04em] shadow-lg shadow-amber-500/40 z-20 flex items-center gap-1.5 animate-[floatY_4s_ease-in-out_infinite]"
            >
              <span>🚀</span>
              <span>Live Tracking</span>
            </div>

            {/* Mini data chip — top left */}
            <div 
              className="absolute top-[42px] -left-[20px] bg-emerald-900/95 border border-emerald-500/25 rounded-xl px-3.5 py-2 backdrop-blur-md z-20 flex items-center gap-2 opacity-0 animate-[floatY_6s_ease-in-out_1.5s_infinite]"
              style={{ animation: "slideRight 0.8s ease both 0.8s, floatY 6s ease-in-out 1.5s infinite" }}
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981]" />
              <div>
                <p className="text-[10px] text-emerald-300/60 font-semibold tracking-[0.1em] m-0">TONASE HARI INI</p>
                <p className="text-sm text-amber-500 font-extrabold m-0">128.4 ton</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-emerald-950/40 to-transparent pointer-events-none" />
    </section>
  );
};

export default Header;
