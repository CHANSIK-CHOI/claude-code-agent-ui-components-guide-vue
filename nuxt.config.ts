export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  telemetry: false,

  devServer: {
    port: 5000,
  },

  modules: ['radix-vue/nuxt'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
      extensions: ['.vue'],
    },
  ],

  build: {
    transpile: ['@vuepic/vue-datepicker'],
  },

  css: [
    '@vuepic/vue-datepicker/dist/main.css',
    '~/assets/scss/global.scss',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: '@use "~/assets/scss/abstracts/_variables.scss" as *;',
        },
      },
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
