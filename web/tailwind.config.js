/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      borderWidth: {
        3: '3px',
      },
      borderColor: {
        green: '#00FF00', // Change this to your desired shade of green
      },

      backgroundColor: {
        'main-color': '#905FF4',
      },
      textColor: {
        'text-main-color': '#905FF4',

        'light-color': '#C1C1C1',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};
