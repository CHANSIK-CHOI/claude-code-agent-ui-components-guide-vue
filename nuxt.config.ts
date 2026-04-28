import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  alias: {
    '@nd': fileURLToPath(new URL('./', import.meta.url)),
  },
  compatibilityDate: '2024-04-03',
  telemetry: false,

  devServer: {
    port: 5000,
  },

  modules: [
    'radix-vue/nuxt',
    ['nuxt-svgo', {
      defaultImport: 'component',
      svgoConfig: {
        plugins: [
          {
            name: 'convertColors',
            params: { currentColor: true },
          },
        ],
      },
    }],
  ],

  components: [
    {
      path: '@nd/components',
      pathPrefix: false,
      extensions: ['.vue'],
    },
  ],

  build: {
    transpile: ['@vuepic/vue-datepicker'],
  },

  css: [
    '@vuepic/vue-datepicker/dist/main.css',
    '@nd/assets/scss/global.scss',
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: '@use "@nd/assets/scss/abstracts/_variables.scss" as *;',
        },
      },
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
