/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx,css}',
    './src/**/*.{js,jsx,ts,tsx,css}',
    './components/**/*.{js,jsx,ts,tsx,css}',
    './screens/**/*.{js,jsx,ts,tsx,css}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  presets: [require('nativewind/preset')],
};
