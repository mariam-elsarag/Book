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
        "primary-400": "#61c2b8",
        "primary-300": "#87d2c8",
        "primary-200": "#b0e1dc",
        "primary-100": "#d1edea",
        secondary: "#eb862a",
        teritary: "#abbdd3",
        grey: "#B5BCC5",
        "light-gray": "#E3E8EF",
        "natural-light": "#99A4B7",
        "natural-dark": "#111729",
        "body-bg": "#FAFBFC",
        error: "#b50808",
      },
    },
  },
  plugins: [],
};
