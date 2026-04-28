# ButtonLink — 구현 메모

- **파일 경로**: components/atoms/ButtonLink.vue
- **계층**: atoms
- **구현 완료일**: 2026-04-28
- **비표준 구현**:
  - `<component :is="tag">` 동적 태그 패턴 사용 (to+!disabled → NuxtLink, 그 외 → `<a>`)
  - `defineOptions({ inheritAttrs: false })` + `useAttrs()` + `linkAttrs` computed로 attrs 수동 위임 (`v-bind="$attrs"` 직접 사용 불가 — disabled 시 href 제거 로직 필요)
  - `resolveComponent('NuxtLink')` — Nuxt auto-import 대상이므로 명시적 import 불필요 (computed/useAttrs/resolveComponent 모두 auto-import)
  - `target="_blank"` 시 rel에 noopener noreferrer 자동 보완 (computedRel)
  - `<a>`는 네이티브 disabled 없음 → `aria-disabled="true"` + `tabindex="-1"` + `pointer-events: none` + `handleClick` early return 이중 차단
  - click 핸들러 `handleClick`: disabled 시 early return 후 `emit('click', e)` — `<a>` 태그 disabled 이중 차단용
  - Button과 SCSS mixin 공유 (`assets/scss/components/_button-base.scss`)
  - composable 공유 (`components/atoms/useButtonVariant.ts`)
  - 타입 공유 (`components/types.ts` — ButtonShape, ButtonColor, ButtonSize)
  - `ButtonColor` 타입에 `'gray'` 포함 — spec + 가이드 페이지 모두 반영 완료
- **개발자 핸드오프**: 없음 (순수 UI 컴포넌트)
- **가이드 페이지**: `pages/guide/button-link/index.vue` + `button-link.scss`
  - 섹션 구성: ① Shape×Color(gray) / ② Disabled / ③ NuxtLink vs href / ④ target="_blank" / ⑤ API 문서
