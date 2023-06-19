/** @type {import('tailwindcss').Config} */
import colors from "tailwindcss/colors";

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
        main_dark: "#282c35",
        header: "#d23669",
        header_dark: "#ffa7c4",
        content: "#222222",
        content_dark: "rgba(0,0,100,0.88)",
      },
      maxWidth: {
        pageMax: "40rem", // 640px
      },
    },
  },
  plugins: [],
};
