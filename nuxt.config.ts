import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const rootDir = fileURLToPath(new URL('./', import.meta.url))
const scssVariablesPath = join(rootDir, 'assets/scss/abstracts/_variables.scss').replace(/\\/g, '/')

export default defineNuxtConfig({
  alias: {
    '@nd': rootDir,
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
          additionalData: `@use "${scssVariablesPath}" as *;`,
        },
      },
    },
  },

  nitro: {
    preset: 'vercel-static',
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },
})
