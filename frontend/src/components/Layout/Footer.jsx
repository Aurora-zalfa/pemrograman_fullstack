import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#064E3B] text-white">
      
      {/* === Decorative Top Wave === */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none -translate-y-[99%]">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-14 text-[#064E3B] fill-current"
        >
          <path d="M0,80 C200,0 400,120 600,60 C800,0 1000,120 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* === Top Accent Line === */}
      <div className="h-1 bg-gradient-to-r from-[#F59E0B] via-[#10B981] to-transparent opacity-50" />

      {/* === Main Content === */}
      <div className="container mx-auto px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* === Column 1: Brand === */}
          <div className="space-y-5 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-[#F59E0B] rounded-xl blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <svg 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M12 2C8.5 2 5 5.5 5 9c0 2.5 1.5 4.5 3 6l1 5h6l1-5c1.5-1.5 3-3.5 3-6 0-3.5-3.5-7-7-7z" 
                      fill="#064E3B"
                    />
                    <circle cx="12" cy="9" r="2.5" fill="#064E3B" opacity="0.6"/>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-xl lg:text-2xl font-black tracking-wide leading-tight">
                  Nyawit<span className="text-[#F59E0B]">Hunter</span>
                </h3>
                <p className="text-[10px] text-[#6EE7B7]/50 uppercase tracking-[0.15em] font-semibold">
                  Distribution System
                </p>
              </div>
            </div>
            
            <p className="text-[#A7F3D0]/80 text-sm leading-relaxed max-w-xs">
              Sistem manajemen distribusi Tandan Buah Segar (TBS) berbasis web untuk perkebunan kelapa sawit modern, efisien, dan terpercaya.
            </p>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { name: "React", color: "hover:border-[#61DAFB]/40 hover:text-[#61DAFB]" },
                { name: "Node.js", color: "hover:border-[#339933]/40 hover:text-[#339933]" },
                { name: "Tailwind", color: "hover:border-[#06B6D4]/40 hover:text-[#06B6D4]" },
              ].map((tech) => (
                <span
                  key={tech.name}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-white/5 text-[#A7F3D0]/70 border border-white/10 transition-all duration-300 cursor-default ${tech.color}`}
                >
                  {tech.name}
                </span>
              ))}
            </div>

            {/* Social Links (placeholder) */}
            <div className="flex gap-3 pt-1">
              {["github", "gitlab", "globe"].map((icon) => (
                <a
                  key={icon}
                  href="#"
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#A7F3D0]/50 hover:text-[#10B981] hover:bg-white/10 hover:border-[#10B981]/30 transition-all duration-300 no-underline"
                  aria-label={icon}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12 24 5.37 18.63 0 12 0z"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* === Column 2: Navigasi === */}
          <div className="space-y-5">
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
                Navigasi
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Beranda", to: "/" },
                  { label: "Fitur Sistem", href: "#fitur" },
                  { label: "Tentang Kami", href: "#tentang" },
                  { label: "Masuk Sistem", to: "/login" },
                ].map((item) =>
                  item.to ? (
                    <li key={item.label}>
                      <Link
                        to={item.to}
                        className="group flex items-center gap-2 text-[#D1FAE5]/70 hover:text-[#10B981] text-sm transition-all duration-300 no-underline hover:translate-x-1"
                      >
                        <span className="text-base group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ) : (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="group flex items-center gap-2 text-[#D1FAE5]/70 hover:text-[#10B981] text-sm transition-all duration-300 no-underline hover:translate-x-1"
                      >
                        <span className="text-base group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </span>
                        <span>{item.label}</span>
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
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                Proyek
              </h4>
              <ul className="space-y-4">
                {[
                  { label: "Mata Kuliah", value: "Pemrograman Fullstack", icon: "📚" },
                  { label: "Tahun Akademik", value: "2026", icon: "📅" },
                  { label: "Fokus", value: "Agribisnis Digital", icon: "🌿" },
                ].map((item) => (
                  <li key={item.label} className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">{item.icon}</span>
                    <div className="space-y-0.5">
                      <p className="text-[#6EE7B7]/50 text-[10px] uppercase tracking-wider font-semibold">
                        {item.label}
                      </p>
                      <p className="text-[#D1FAE5] text-sm font-medium">
                        {item.value}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* === Column 4: Tim Kami === */}
          <div className="space-y-5">
            <div>
              <h4 className="text-white font-bold text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B] animate-pulse" />
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
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#10B981]/20 to-[#F59E0B]/20 border border-[#10B981]/20 flex items-center justify-center text-xs font-bold text-[#10B981] group-hover:bg-[#10B981]/30 group-hover:border-[#10B981]/40 transition-all duration-300 flex-shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[#D1FAE5] text-sm leading-tight group-hover:text-white transition-colors duration-300">
                        {member.name}
                      </p>
                      <p className="text-[#6EE7B7]/40 text-[10px] tracking-wider">
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
        <div className="container mx-auto px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-[#A7F3D0]/50 text-xs">
            &copy; {currentYear}{" "}
            <span className="text-[#F59E0B] font-bold hover:text-[#FBBF24] transition-colors duration-300">
              Nyawit Hunter
            </span>
            {" "}— Pemrograman Fullstack. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <p className="text-[#A7F3D0]/30 text-[11px] flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-[#10B981]/50" />
              React
              <span className="w-1 h-1 rounded-full bg-[#10B981]/50" />
              Node.js
              <span className="w-1 h-1 rounded-full bg-[#10B981]/50" />
              Tailwind CSS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;