/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        cream: "#F9F7F2",
        sand: "#E6D2B5",
        gold: "#CFA670",
        terracotta: "#A47C3B",
        charcoal: "#1A1A1A",
      },

      fontFamily: {
        oswald: ["Oswald", "sans-serif"],
        playfair: ["Playfair Display", "serif"],
      },

      backgroundImage: {
        "gold-gradient":
          "linear-gradient(90deg,#A47C3B,#CFA670,#8C6A30)",
      },
    },
  },

  plugins: [],
};
