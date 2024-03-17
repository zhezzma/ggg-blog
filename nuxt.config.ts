// https://nuxt.com/docs/api/configuration/nuxt-config
import { createResolver, logger, defineNuxtModule } from '@nuxt/kit'
const { resolve } = createResolver(import.meta.url)

export default defineNuxtConfig({
  devtools: { enabled: true },
  colorMode: {
    preference: 'system', // default value of $colorMode.preference
    fallback: 'dark', // fallback value if not system preference found
    classSuffix: '',
    storageKey: 'nuxt-color-mode'
  },
  modules: [
    //"~/modules/nuxt-content-ymind",
    "@nuxt/content",
    "@nuxt/test-utils/module",
    "@nuxt/ui",
    "@nuxt/fonts",
    '@nuxt/image',
    '@nuxtjs/color-mode',
    "@vueuse/nuxt",
  ],
  // Vuetify's global styles
  css: ["~/assets/css/main.css"],
  content: {
    documentDriven: false,
    experimental: {
      search: true
    }
  },
  components: [
    { path: resolve('./components'), global: true },
    { path: resolve('./components/content'), global: true }
  ],
   // or sourcemap: true
   sourcemap: {
    server: true,
    client: true
  }
});
