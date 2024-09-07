/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0857a0",
        "primary-hover": "#0969c3",
        secondary: "#053866",
        "secodary-hover": "#07467e",
      },
    },
  },
  plugins: [],
};
