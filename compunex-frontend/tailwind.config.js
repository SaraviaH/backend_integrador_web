/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#2456C6',
          'primary-hover': '#1B429B',
          'primary-light': '#EEF4FF',
          secondary: '#142238',
          'secondary-hover': '#0E1726',
          bg: '#F5F7FA',
          surface: '#FFFFFF',
          border: '#E2E8F0',
          text: '#1E293B',
          'text-muted': '#64748B',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
        slate: {
          150: '#F1F5F9',
          250: '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        '2xs': '0 1px 1px 0 rgba(15, 23, 42, 0.04)',
        xs: '0 1px 2px 0 rgba(15, 23, 42, 0.05)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        dropdown: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 180ms ease-out',
        'shake': 'shake 240ms ease-in-out',
        'slide-in': 'slide-in 220ms ease-out',
      },
    },
  },
  plugins: [],
}
