/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Define your custom palette here
        primary: {
          light: '#2C3E50',
          dark: '#5DADE2',
        },
        secondary: {
          light: '#5DADE2',
          dark: '#F7DC6F',
        },
        accent: {
          light: '#F4D03F',
          dark: '#48C9B0',
        },
        background: {
          light: '#F8F9F9',
          dark: '#121212',
        },
        surface: {
          light: '#FFFFFF',
          dark: '#1E1E1E',
        },
        text: {
          light: '#2E2E2E',
          dark: '#FFFFFF',
          mutedLight: '#7B7B7B',
          mutedDark: '#B0B0B0',
        },
        border: {
          light: '#D5D8DC',
          dark: '#2C2C2C',
        },
        success: {
          light: '#27AE60',
          dark: '#58D68D',
        },
        error: {
          light: '#E74C3C',
          dark: '#EC7063',
        },
      },
    },
  },
  plugins: [],
}