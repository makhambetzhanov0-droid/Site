/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#08080f',
        'accent': {
          from: '#14b8a6',
          to: '#06b6d4',
        }
      }
    },
  },
  plugins: [],
}
