import { fileURLToPath } from "node:url";
import { join } from "node:path";

const rootDir = fileURLToPath(new URL("./", import.meta.url));
const scssVariablesPath = join(
  rootDir,
  "assets/scss/abstracts/_variables.scss",
).replace(/\\/g, "/");
const scssMixinsPath = join(
  rootDir,
  "assets/scss/abstracts/_mixins.scss",
).replace(/\\/g, "/");

export default defineNuxtConfig({
  alias: {
    "@nd": rootDir,
  },
  compatibilityDate: "2024-04-03",
  telemetry: false,

  devServer: {
    port: 5000,
  },

  modules: [
    "radix-vue/nuxt",
    [
      "nuxt-svgo",
      {
        defaultImport: "component",
        svgoConfig: {
          plugins: [
            {
              name: "convertColors",
              params: { currentColor: true },
            },
          ],
        },
      },
    ],
  ],

  components: [
    {
      path: "@nd/components",
      pathPrefix: false,
      extensions: [".vue"],
    },
  ],

  css: [
    "@nd/assets/scss/global.scss",
    "@nd/assets/scss/components/table.scss",
    "swiper/css",
    "swiper/css/navigation",
    "swiper/css/thumbs",
    "swiper/css/effect-fade",
    "swiper/css/pagination",
  ],

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "${scssVariablesPath}" as *; @use "${scssMixinsPath}" as *;`,
        },
      },
    },
  },

  nitro: {
    preset: "github-pages",
  },

  app: {
    baseURL: "/claude-code-agent-ui-components-guide-vue/",
  },

  ssr: false,

  typescript: {
    strict: true,
    typeCheck: false,
  },
});
