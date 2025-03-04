/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neonBlue: "#12C2E9",
        neonPurple: "#C471ED",
        neonRed: "#F64F59",
        lightGray: "#EBEDF2",
        mediumGray: "#D2D4D9",
        deepBlack: "#0D0D0D",
      },
      fontFamily: {
        redhat: ["Red Hat Mono", "monospace"],
      },
      backgroundImage: {
        'neon-gradient': "linear-gradient(to right, #12C2E9, #C471ED, #F64F59)",
      },
      screens: {
        mm: "0px", // Minimum
        sm: "640px", // Mobile
        md: "768px", // Tablet
        lg: "1024px", // Laptop
        xl: "1280px", // Large screens
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
