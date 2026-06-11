/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Biar tetap bisa pakai warna custom kalau perlu
        emerald: {
          950: '#042B21', // lebih gelap dari default Tailwind
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease both',
        'fade-up-1': 'fadeUp 0.7s ease both 0.1s',
        'fade-up-2': 'fadeUp 0.7s ease both 0.25s',
        'fade-up-3': 'fadeUp 0.7s ease both 0.4s',
        'fade-up-4': 'fadeUp 0.7s ease both 0.55s',
        'fade-up-5': 'fadeUp 0.7s ease both 0.7s',
        'float-y': 'floatY 8s ease-in-out 1s infinite',
        'float-y-fast': 'floatY 4s ease-in-out infinite',
        'shimmer': 'shimmer 3.5s linear infinite',
        'scan-line': 'scanLine 3s ease-in-out infinite',
        'rotate-slow': 'rotateSlow 20s linear infinite',
        'pulse-dot': 'pulseDot 1.8s ease-in-out infinite',
        'mobile-menu': 'mobileMenuIn 0.3s cubic-bezier(0.34,1.3,0.64,1) both',
        'nav-slide': 'navSlideDown 0.5s ease both',
        'slide-right': 'slideRight 0.8s ease both 0.8s',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(28px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-1deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        scanLine: {
          '0%': { top: '0%', opacity: '0.6' },
          '100%': { top: '100%', opacity: '0' },
        },
        rotateSlow: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        pulseDot: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
          '50%': { transform: 'scale(1.6)', opacity: '0' },
        },
        mobileMenuIn: {
          from: { opacity: '0', transform: 'translateY(-8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        navSlideDown: {
          from: { opacity: '0', transform: 'translateY(-12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideRight: {
          from: { opacity: '0', transform: 'translateX(-20px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'shimmer-text': 'linear-gradient(90deg, #F59E0B 0%, #FDE68A 40%, #F59E0B 60%, #FBBF24 100%)',
      },
      boxShadow: {
        'glow-amber': '0 4px 24px rgba(245,158,11,0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
        'glow-amber-sm': '0 3px 14px rgba(245,158,11,0.25), inset 0 1px 0 rgba(255,255,255,0.25)',
        'glow-emerald': '0 8px 32px rgba(0,0,0,0.25)',
      },
    },
  },
  plugins: [],
};
