export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL || '/',
    head: {
      htmlAttrs: { lang: 'de' },
      title: 'Streamer Würfel',
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Bungee:wght@400&family=Fredoka:wght@400;600&family=Rubik:wght@400;700;900&family=Space+Grotesk:wght@400;700&display=swap',
        },
      ],
    },
  },
  nitro: { preset: 'static' },
  css: ['~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss'],
});
