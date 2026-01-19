// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Try this specific formatting:
        logo: ['"Montserrat"', 'sans-serif'], 
        body: ['"Roboto"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};