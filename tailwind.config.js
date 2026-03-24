/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0D0F14',
          surface: '#141720',
          elevated: '#1C2030',
        },
        border: '#2A2E3D',
        primary: {
          DEFAULT: '#4F8EF7',
          hover: '#6AA3FF',
          muted: '#1A2A4A',
        },
        accent: {
          DEFAULT: '#F5A623',
          hover: '#FFB940',
          muted: '#3D2A00',
        },
        success: '#22C55E',
        warning: '#EAB308',
        danger: '#EF4444',
        trophy: '#A855F7',
        text: {
          primary: '#F0F2F8',
          secondary: '#8B92A8',
          muted: '#4A5068',
        }
      },
      fontFamily: {
        display: ['Clash Display', 'Cabinet Grotesk', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      borderRadius: {
        'sm': '6px',
        'md': '12px',
        'lg': '20px',
        'xl': '28px',
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.2s ease-out forwards',
        'fill-progress': 'fill-progress 0.8s ease-out forwards',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fill-progress': {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        }
      }
    },
  },
  plugins: [],
}
