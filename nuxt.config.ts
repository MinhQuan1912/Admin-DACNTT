// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss"],

  css: ["~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      apiBase: "http://localhost:8080/api",
    },
  },

  app: {
    head: {
      title: "Admin",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },
});
