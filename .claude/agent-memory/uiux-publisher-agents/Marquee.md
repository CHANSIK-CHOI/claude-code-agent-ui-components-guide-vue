# Marquee — 구현 메모

- **파일 경로**: components/molecules/Marquee.vue
- **계층**: molecules
- **구현 완료일**: 2026-06-01
- **비표준 구현**:
  - `defineComponent` + render function 패턴 (`<script setup>` 예외) — default slot VNode를 타입 판별·래핑해야 하므로 정당한 예외. 컴포넌트 상단 주석으로 "slot VNode 직접 조작·타입 판별" 예외 사유 명시.
  - `inheritAttrs: false`를 `defineComponent({ inheritAttrs: false })` 옵션에 직접 지정 (`defineOptions` 매크로는 `<script setup>` 전용이므로 사용 불가)
  - `resolveComponent('ClientOnly')` 사용 — render function에서 Nuxt 전역 컴포넌트 참조
  - `FreeMode` import: `from 'swiper'` (MainStory.vue 실증 경로 동일)
  - `Swiper`, `SwiperSlide` import: `from 'swiper/vue'`
  - prefers-reduced-motion: `window.matchMedia` 초기값 체크 + change 리스너로 rAF 시작 여부 결정 (WCAG 2.2.2)
  - $attrs는 render function에서 Swiper에 먼저 전개 후 swiperProps를 뒤에 병합 (명시 props 우선권 확보)
  - slot VNode 수(`slides.length`)를 `loopAdditionalSlides`에 자동 할당
- **개발자 핸드오프**: 없음 (전부 퍼블리셔 제어)

## 하이브리드 래핑 로직 (2026-06-01 spec 변경 반영)

`map` 콜백에서 `vnode.type === SwiperSlide` 판별:
- `true` (이미 SwiperSlide) → `vnode.key != null ? vnode : cloneVNode(vnode, { key: idx })` — 재래핑 금지, key 없을 때만 보강
- `false` (일반 VNode) → `h(SwiperSlide, { key }, { default: () => [vnode] })` — 기존 자동 래핑 경로

**`cloneVNode` vs `h(vnode, ...)`**: 기존 VNode에 key만 주입할 때는 반드시 `cloneVNode(vnode, { key: idx })`를 사용한다.
`h(vnode, ...)` 형태는 VNode를 타입 인자로 받지 않아 잘못된 사용이다. `cloneVNode`는 `vue`에서 import.
