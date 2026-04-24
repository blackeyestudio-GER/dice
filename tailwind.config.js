import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    colors: {
      moonstone: '#3AA1BD',
      'dim-gray': '#869698',
      'eerie-black': '#1C1E1E',
      night: '#111212',
      'dark-slate-gray': '#1E4545',
      'twitch-purple': '#9146FF',
      ...colors,
    },
    extend: {},
  },
  plugins: [],
};
