const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
      serif: ['Arvo', 'serif'],
    },
    colors: {
      gray: colors.gray,
    },
    extend: {
      transitionProperty: {
        'width': 'width',
        'height': 'height'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}