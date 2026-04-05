export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0B0F1A',
          surface: '#0F1520',
          sidebar: '#0D1220',
          card: 'rgba(255, 255, 255, 0.04)',
          border: 'rgba(255, 255, 255, 0.07)',
        },
        accent: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: 'rgba(245, 158, 11, 0.12)',
          border: 'rgba(245, 158, 11, 0.2)',
          glow: 'rgba(245, 158, 11, 0.08)',
        },
        success: {
          DEFAULT: '#4ADE80',
          light: 'rgba(74, 222, 128, 0.12)',
        },
        danger: {
          DEFAULT: '#EF4444',
        },
        text: {
          primary: '#E8EDF5',
          secondary: 'rgba(232, 237, 245, 0.5)',
          muted: 'rgba(232, 237, 245, 0.35)',
          dim: 'rgba(232, 237, 245, 0.25)',
        },
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        sans: ['DM Sans', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
