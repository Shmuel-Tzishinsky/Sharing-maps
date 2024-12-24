const colors = require("tailwindcss/colors");
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      primary: colors.sky[700],
      secondary: colors.slate[600],
      dark: colors.slate[900],
      light: colors.slate[200],
      white: colors.slate[50],
      error: colors.red[700],
    },
    extend: {
      fontSize: {
        base: ["18px", "24px"],
      },
      fontFamily: {
        sans: ["var(--font-catamaran)", ...fontFamily.sans],
      },
      boxShadow: {
        custom: "0 0 7px -3px black",
      },
    },
  },
  plugins: [],
};
