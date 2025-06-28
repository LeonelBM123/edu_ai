/*npm install -D @tailwindcss/postcss*/

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#006BA6',
        secondary: '#0496FF',
        accent: '#FFBF47',
        danger: '#D81159',
        highlight: '#8F2D56',
        dark: '#102542',
        warning: '#F87060',
        soft: '#CDD7D6',
        beige: '#B3A394',
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
