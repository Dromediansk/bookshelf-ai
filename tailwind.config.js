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
          DEFAULT: colors.emerald[600],
          pressed: colors.emerald[700],
          subtle: colors.emerald[50],
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
          bg: colors.green[100],
          border: colors.green[200],
          text: colors.green[900],
        },
        info: {
          bg: colors.blue[100],
          border: colors.blue[200],
          text: colors.blue[900],
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
        sans: ["Montserrat_400Regular", "System"],
        sansMedium: ["Montserrat_500Medium", "System"],
        sansSemibold: ["Montserrat_600SemiBold", "System"],
        sansBold: ["Montserrat_700Bold", "System"],
      },
    },
  },
  plugins: [],
};
