/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef8ff',
          100: '#dcf1ff',
          200: '#b0dfff',
          300: '#7ccaff',
          400: '#43b0fa',
          500: '#3990D7',
          600: '#1e70b8',
          700: '#185a94',
          800: '#174b7a',
          900: '#173f62',
          950: '#102840',
        },
      },
    },
  },
  plugins: [],
};
