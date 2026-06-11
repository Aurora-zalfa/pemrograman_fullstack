import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-emerald-900 text-white">
      
      {/* === Decorative Top Wave === */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-[99%]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-14 text-emerald-900 fill-current"
        >
          <path d="M0,80 C200,0 400,120 600,60 C800,0 1000,120 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* === Top Accent Line === */}
      <div className="h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-transparent opacity-50" />

      {/* === Main Content === */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          
          {/* === Column 1: Brand === */}
          <div className="space-y-5 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 group">
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-amber-500 rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path 
                      d="M12 2C8.5 2 5 5.5 5 9c0 2.5 1.5 4.5 3 6l1 5h6l1-5c1.5-1.5 3-3.5 3-6 0-3.5-3.5-7-7-7z" 
                      fill="#064E3B"
                    />
                    <circle cx="12" cy="9" r="2.5" fill="#064E3B" opacity="0.6"/>
                  </svg>
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-xl lg:text-2xl font-black tracking-wide leading-tight text-slate-50 truncate">
                  Nyawit<span className="text-amber-500">Hunter</span>
                </h3>
                <p className="text-[10px] text-emerald-300/50 uppercase tracking-[0.15em] font-semibold">
                  Distribution System
                </p>
              </div>
            </div>
            
            <p className="text-emerald-200/80 text-sm leading-relaxed max-w-xs">
              Sistem manajemen distribusi Tandan Buah Segar (TBS) berbasis web untuk perkebunan kelapa sawit modern, efisien, dan terpercaya.
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2">
              {["React", "Node.js", "Tailwind"].map((tech) => (
                <span
                  key={tech}
                  className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/5 text-emerald-200/70 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300 cursor-default whitespace-nowrap"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-1 flex-wrap">
              <a
                href="https://github.com/Aurora-zalfa/pemrograman_fullstack"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-200/50 hover:text-emerald-500 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/>
                </svg>
              </a>

              <a
                href="mailto:nyawithunter@gmail.com"
                className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-emerald-200/50 hover:text-emerald-500 hover:bg-white/10 hover:border-emerald-500/30 transition-all duration-300"
                aria-label="Gmail"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* === Column 2: Navigasi === */}
          <div className="space-y-5">
            <div>
              <h4 className="text-emerald-200 font-bold text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                Navigasi
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Beranda", to: "/" },
                  { label: "Fitur Sistem", href: "#fitur" },
                  { label: "Tentang Kami", href: "#tentang" },
                  { label: "Login", to: "/login" },
                ].map((item) =>
                  item.to ? (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="flex items-center gap-2 text-emerald-100/70 hover:text-emerald-500 text-sm transition-all duration-300 hover:translate-x-1 group"
                      >
                        <svg className="w-2.5 h-2.5 text-emerald-500/50 group-hover:text-emerald-500 transition-colors flex-shrink-0" fill="currentColor" viewBox="0 0 6 6">
                          <circle cx="3" cy="3" r="2" />
                        </svg>
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  ) : (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="flex items-center gap-2 text-emerald-100/70 hover:text-emerald-500 text-sm transition-all duration-300 hover:translate-x-1 group"
                      >
                        <svg className="w-2.5 h-2.5 text-emerald-500/50 group-hover:text-emerald-500 transition-colors flex-shrink-0" fill="currentColor" viewBox="0 0 6 6">
                          <circle cx="3" cy="3" r="2" />
                        </svg>
                        <span className="truncate">{item.label}</span>
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* === Column 3: Proyek === */}
          <div className="space-y-5">
            <div>
              <h4 className="text-emerald-200 font-bold text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                Proyek
              </h4>
              <ul className="space-y-4">
                {[
                  { label: "Mata Kuliah", value: "Pemrograman Fullstack" },
                  { label: "Tahun Akademik", value: "2026" },
                  { label: "Fokus", value: "Agribisnis Digital" },
                ].map((item) => (
                  <li key={item.label} className="space-y-0.5">
                    <p className="text-emerald-300/50 text-[10px] uppercase tracking-wider font-semibold">
                      {item.label}
                    </p>
                    <p className="text-emerald-100 text-sm font-medium break-words">
                      {item.value}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* === Column 4: Tim Kami === */}
          <div className="space-y-5">
            <div>
              <h4 className="text-emerald-200 font-bold text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
                Tim Kami
              </h4>
              <ul className="space-y-2">
                {[
                  { name: "Aurora Zalfa Hartono", nim: "0110224057" },
                  { name: "Zainab Aznur", nim: "0110224009" },
                  { name: "Yanti Elnaya Putri", nim: "0110224097" },
                  { name: "Silvia Zahrodiniah", nim: "0110224019" },
                  { name: "Rumaisha", nim: "0110224087" },
                ].map((member) => (
                  <li
                    key={member.nim}
                    className="group flex items-center gap-3 py-1.5"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500/20 to-amber-500/20 border border-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-500 group-hover:bg-emerald-500/30 group-hover:border-emerald-500/40 transition-all duration-300 flex-shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-emerald-100 text-sm leading-tight group-hover:text-slate-50 transition-colors duration-300 truncate">
                        {member.name}
                      </p>
                      <p className="text-emerald-300/40 text-[10px] tracking-wider">
                        {member.nim}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* === Bottom Bar === */}
      <div className="border-t border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-emerald-200/50 text-xs">
            &copy; {currentYear}{" "}
            <span className="text-amber-500 font-bold hover:text-amber-400 transition-colors duration-300">
              Nyawit Hunter
            </span>
            {" "}— Pemrograman Fullstack. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <p className="text-emerald-200/30 text-[11px] flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-emerald-500/50 flex-shrink-0" />
              React
              <span className="w-1 h-1 rounded-full bg-emerald-500/50 flex-shrink-0" />
              Node.js
              <span className="w-1 h-1 rounded-full bg-emerald-500/50 flex-shrink-0" />
              Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
