/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./App.tsx",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: colors.indigo[600],
          pressed: colors.indigo[700],
          subtle: colors.indigo[50],
        },
        surface: {
          DEFAULT: colors.white,
          muted: colors.slate[50],
        },
        text: {
          DEFAULT: colors.slate[900],
          muted: colors.slate[600],
          subtle: colors.slate[500],
          inverse: colors.white,
        },
        border: {
          DEFAULT: colors.slate[200],
          strong: colors.slate[300],
        },
        success: {
          bg: colors.emerald[100],
          border: colors.emerald[200],
          text: colors.emerald[900],
        },
        info: {
          bg: colors.sky[100],
          border: colors.sky[200],
          text: colors.sky[900],
        },
        warning: {
          bg: colors.amber[100],
          border: colors.amber[200],
          text: colors.amber[900],
        },
        danger: {
          bg: colors.rose[100],
          border: colors.rose[200],
          text: colors.rose[900],
        },
      },
      spacing: {
        screen: "20px",
        card: "16px",
        field: "12px",
        button: "16px",
      },
      borderRadius: {
        card: "16px",
        control: "12px",
      },
      fontFamily: {
        sans: ["Inter_400Regular", "System"],
        sansMedium: ["Inter_500Medium", "System"],
        sansSemibold: ["Inter_600SemiBold", "System"],
        sansBold: ["Inter_700Bold", "System"],
      },
    },
  },
  plugins: [],
};
