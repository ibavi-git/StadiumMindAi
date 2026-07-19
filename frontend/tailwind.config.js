/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // FIFA Brand Colors
        'fifa-blue': '#003DA5',
        'fifa-blue-dark': '#002878',
        'fifa-blue-light': '#1a5cbf',
        'fifa-green': '#00A550',
        'fifa-green-dark': '#007a3a',
        // Dashboard Background
        'dash-bg': '#080C18',
        'dash-card': '#0F1628',
        'dash-card-hover': '#161E35',
        'dash-border': '#1E2D4A',
        'dash-border-light': '#2A3F62',
        // Status Colors
        'status-critical': '#EF4444',
        'status-high': '#F97316',
        'status-moderate': '#EAB308',
        'status-low': '#22C55E',
        'status-restricted': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-hero': 'linear-gradient(135deg, #080C18 0%, #0a1628 50%, #0c1f3d 100%)',
        'gradient-card': 'linear-gradient(135deg, rgba(15,22,40,0.9) 0%, rgba(22,30,53,0.8) 100%)',
        'gradient-fifa': 'linear-gradient(135deg, #003DA5 0%, #001f6b 100%)',
        'gradient-green': 'linear-gradient(135deg, #00A550 0%, #007a3a 100%)',
        'gradient-critical': 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)',
        'gradient-high': 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.05) 100%)',
      },
      boxShadow: {
        'glass': '0 4px 24px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'glass-hover': '0 8px 32px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
        'glow-blue': '0 0 20px rgba(0, 61, 165, 0.4)',
        'glow-green': '0 0 20px rgba(0, 165, 80, 0.4)',
        'glow-critical': '0 0 20px rgba(239, 68, 68, 0.3)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
      backdropBlur: {
        'xs': '2px',
        'glass': '16px',
        'heavy': '32px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-critical': 'pulseCritical 1.5s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseCritical: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.4)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 0 8px rgba(239, 68, 68, 0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      transitionTimingFunction: {
        'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
