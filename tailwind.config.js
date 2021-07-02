module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Montserrat', 'sans-serif'],
      serif: ['Arvo', 'serif'],
    },
    colors: {
      "primary-color": "var(--color-primary)",
      "secondary-color": "var(--color-primary)",
      "text-color": "var(--color-text)"
    },
    extend: {
      transitionProperty: {
        'width': 'width',
        'height': 'height'
      },
    },
  },
  variants: {
    extend: {
      scale: ['group-hover'],
    },
  },
  plugins: [],
}