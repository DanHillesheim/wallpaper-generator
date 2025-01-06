/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#175ddc',
        'secondary': '#1A41AC',
        'tertiary': '#020F66',
        'teal': '#2CDDE9',
        'melon': '#FF4E63',
        'yellow': '#FFBF00',
        'purple': '#9D26FF',
      },
    },
  },
  plugins: [],
}
