/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'uhi-red': '#ef4444',
        'uhi-orange': '#f97316',
        'uhi-yellow': '#eab308',
        'uhi-green': '#22c55e',
        'uhi-blue': '#3b82f6',
      }
    },
  },
  plugins: [],
}
