/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        "primary-600": "#0c6d63",
        "primary-500": "#12a493",

        "secondary-600": " #f5f3ef",
        "secondary-500": "#f4f3ef",
        "secondary-400": "#f3f2ee",
        "secondary-300": "#eceeeb",

        grey: "#a1a1a1",
        error: " #b50808",
        black: "#111729",
      },
    },
  },
  plugins: [],
};
