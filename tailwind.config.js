// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'mobile-base': '0.8rem', // Tamaño para móvil
        'desktop-base': '1rem', // Tamaño para escritorio
        'mobile-xl': '1.125rem', // text-lg
        'desktop-2xl': '1.5rem', // text-2xl
      },
    },
  },
  plugins: [],
}