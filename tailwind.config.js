/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Fira Code"', '"Courier New"', 'Courier', 'monospace'],
        sans: ['"Segoe UI"', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
        serif: ['"Songti SC"', '"SimSun"', '"STSong"', 'serif'],
      },
      colors: {
        cyber: {
          950: '#070b12',
          900: '#0c1322',
          850: '#111a2e',
          800: '#17233d',
          700: '#1e3052',
          600: '#2b4474',
          500: '#3b5e9e',
          400: '#587ec6',
          300: '#8ca8df',
          200: '#c0d0f1',
          100: '#e5edfb',
        },
        terminal: {
          green: '#00ff66',
          dimGreen: '#00aa44',
          amber: '#ffb000',
          dimAmber: '#aa7500',
          cyan: '#00e5ff',
          bg: '#050a08',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flicker': 'flicker 0.15s infinite',
        'scanline': 'scanline 8s linear infinite',
        'fade-in': 'fadeIn 0.18s ease-out forwards',
        'float-up': 'floatUp 0.8s ease-out forwards',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '0.98' },
          '50%': { opacity: '1' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        floatUp: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-24px)' },
        }
      }
    },
  },
  plugins: [],
}
