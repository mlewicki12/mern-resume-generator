
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    colors: {
      cream: '#F4F4F0',
      transparent: 'transparent',
      white: colors.white,
      black: colors.black,
      gray: colors.gray,
      red: colors.rose,
      blue: colors.cyan,
      green: colors.emerald
    },
    fontFamily: {
      'sans': ['Fredoka', 'Arial', 'sans-serif']
    },
    extend: {
      boxShadow: {
        'full': '0.25rem 0.25rem black'
      },
      minWidth: {
        '100': '100px'
      }
    },
  },
  plugins: [],
}
