// nuxt-svgo / vite-svg-loader 쿼리 import 타입 선언
// - `?component` : SVGO 적용된 Vue 컴포넌트 (fill/stroke → currentColor 변환)
// - `?skipsvgo`  : SVGO 건너뛴 Vue 컴포넌트 (색상 고정)
// - bare/`?url`  : URL 문자열 (defaultImport: 'url' — nuxt.config.ts)
declare module "*.svg?component" {
  import type { DefineComponent, SVGAttributes } from "vue";
  const component: DefineComponent<SVGAttributes>;
  export default component;
}

declare module "*.svg?skipsvgo" {
  import type { DefineComponent, SVGAttributes } from "vue";
  const component: DefineComponent<SVGAttributes>;
  export default component;
}

declare module "*.svg?url" {
  const url: string;
  export default url;
}

declare module "*.svg" {
  const url: string;
  export default url;
}
