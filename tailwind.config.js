/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#fef7f0',
          100: '#fdeee0',
          200: '#fad9c1',
          300: '#f6be97',
          400: '#f1996b',
          500: '#ed7a4a',
          600: '#e05d2f',
          700: '#ba4925',
          800: '#943c24',
          900: '#773422',
        },
      },
    },
  },
  plugins: [],
};