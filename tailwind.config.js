const { colors, fontFamily, fontSize, lineHeight, spacing, borderRadius, opacity, boxShadow } = require('./constants/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    colors,
    fontFamily,
    fontSize,
    lineHeight,
    spacing,
    borderRadius,
    opacity,
    boxShadow,
    extend: {
      // Any extensions to the theme can go here
    },
  },
  plugins: [],
}
