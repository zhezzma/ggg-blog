// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver, logger, defineNuxtModule } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  devtools: { enabled: true },
  colorMode: {
    preference: "light",
  },
  modules: [
    "~/modules/nuxt-content-ymind",
    "@nuxt/content",
    "@nuxt/test-utils/module",
    "@nuxt/ui",
    "@nuxt/fonts",
    '@nuxt/image',
    "@vueuse/nuxt",
  ],
  // Vuetify's global styles
  css: ["~/assets/css/main.css"],
  content: {
    documentDriven: false,
    highlight: {
      theme: {
        // Default theme (same as single string)
        default: 'github-light',
        // Theme used if `html.dark`
        dark: 'github-dark',
        // Theme used if `html.sepia`
        sepia: 'monokai'
      }
    }
  },
  components: [
    { path: resolve('./components'), global: true },
    { path: resolve('./components/content'), global: true }
  ],
});
