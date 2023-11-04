/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pale: "#FAF7FF",
        jet: "#343434",
        jetlight: "#636363",
        fireorange: "#FF4500"
      }
    },
  },
  plugins: [],
}
