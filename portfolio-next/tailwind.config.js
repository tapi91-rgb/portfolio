/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b0f14',
        surface: '#10161c',
        text: '#e7eef5',
        muted: '#9fb0c1',
        accent: '#45caff',
        accent2: '#a27bff'
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.35)',
        strong: '0 28px 60px rgba(0,0,0,0.55)'
      }
    }
  },
  plugins: []
};