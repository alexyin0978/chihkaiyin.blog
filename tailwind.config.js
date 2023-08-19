/** @type {import('tailwindcss').Config} */

const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        main: colors.white,
        main_dark: "#121212",
        header: "#d23669",
        header_dark: "#E3D888",
        content: "#222222",
        content_dark: "#e8ddb5",
      },
      maxWidth: {
        pageMax: "40rem", // 640px
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
