// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Update paths as needed
  ],
  theme: {
    extend: {
      fontFamily: {
        'cinzel': ['"Cinzel Decorative"', 'serif'],
        'playfair': ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
};
