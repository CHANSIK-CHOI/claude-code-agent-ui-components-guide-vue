# ButtonLink — 구현 메모

- **파일 경로**: components/atoms/ButtonLink.vue
- **계층**: atoms
- **구현 완료일**: 2026-04-25
- **비표준 구현**:
  - `<component :is="tag">` 동적 태그 패턴 사용 (to+!disabled → NuxtLink, 그 외 → `<a>`)
  - `defineOptions({ inheritAttrs: false })` + `useAttrs()` + `linkAttrs` computed로 attrs 수동 위임 (`v-bind="$attrs"` 직접 사용 불가 — disabled 시 href 제거 로직 필요)
  - `resolveComponent('NuxtLink')` 명시적 import 필요 (Nuxt auto-import 미적용)
  - `target="_blank"` 시 rel에 noopener noreferrer 자동 보완 (computedRel)
  - `<a>`는 네이티브 disabled 없음 → `aria-disabled="true"` + `tabindex="-1"` 조합
  - Button과 SCSS mixin 공유 (`assets/scss/components/_button-base.scss`)
  - composable 공유 (`components/atoms/useButtonVariant.ts`)
  - 타입 공유 (`components/types.ts` — ButtonShape, ButtonColor, ButtonSize)
- **개발자 핸드오프**: 없음 (순수 UI 컴포넌트)
- **가이드 페이지**: `pages/guide/button-link/index.vue` + `button-link.scss`
