/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/**/components/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        '120': '30rem',
        '144': '36rem',
        '152': '38rem',
        '168': '42rem',
        '172': '48rem',
        '180': '54rem',
        '186': '62rem',
      },
    },
  },
  plugins: [],
}

