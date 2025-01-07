module.exports = {
content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        green: {
          900: '#2C5F2D',
          700: '#4C7C5A',
          500: '#6B9B77',
        },
        amber: {
          50: '#F2E7C9',
          500: '#D4A017',
          600: '#B8860B',
        },
        beige: {
          100: '#F5F5DC',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Lato', 'sans-serif'],
      },
      boxShadow: {
        custom: '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
