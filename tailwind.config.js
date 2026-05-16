/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#1A1A2E',
        surface: '#16213E'
      },
      fontFamily: {
        naskh: ['var(--font-noto-naskh-arabic)', 'serif']
      }
    }
  },
  plugins: []
};
