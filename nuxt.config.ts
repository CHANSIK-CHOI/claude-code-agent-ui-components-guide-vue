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
    `${rootDir}/assets/scss/global.scss`,
    `${rootDir}/assets/scss/components/table.scss`,
  ],

  vite: {
    server: {
      watch: {
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.nuxt/**",
          "**/.output/**",
          "**/dist/**",
          "**/*.log",
        ],
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
          additionalData: `@use "${scssVariablesPath}" as *; @use "${scssMixinsPath}" as *;`,
        },
      },
    },
    build: {
      rollupOptions: {
        // radix-vue 1.9.17이 Vue 3.5+ API인 useId를 import하지만 프로젝트는 Vue 3.4.19 고정.
        // Vue 3.4는 useId를 export하지 않아 "useId is not exported by vue" 빌드 경고가 발생한다.
        // radix-vue는 내부적으로 자체 폴백을 사용하므로 런타임 영향이 없어 경고만 억제한다.
        onwarn(warning, defaultHandler) {
          if (
            warning.message.includes("useId") &&
            warning.message.includes("vue")
          )
            return;
          defaultHandler(warning);
        },
        output: {
          // 단일 1MB+ 청크를 무거운 vendor 단위로 분리해 초기 로드·캐시 효율을 개선한다.
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes("radix-vue")) return "radix-vue";
            if (id.includes("vant") || id.includes("@vant")) return "vant";
          },
        },
      },
    },
  },

  nitro: {
    // 최상위 compatibilityDate는 Nuxt 3.10.3 타입(InputConfig)에 없어 TS2353을 유발하므로
    // NitroConfig가 지원하는 nitro 섹션에 둔다(미지정 시 nitro가 fallback 경고 출력).
    compatibilityDate: "2026-06-06",
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
