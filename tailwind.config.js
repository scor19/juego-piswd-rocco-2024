/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
      serif: ["Merriweather", "serif"],
      mono: ["JetBrains Mono", "monospace"],
      display: ["Inter", "sans-serif"],
      body: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        primary: "#00A8E8", // Azul Neón
        dark: "#333333", // Gris Oscuro
        light: "#E5E5E5", // Gris Claro
      },
    },
  },
  plugins: [],
};
