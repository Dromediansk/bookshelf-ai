/** @type {import('tailwindcss').Config} */
import colors from "./src/utils/colors";

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./App.tsx",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors,
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
