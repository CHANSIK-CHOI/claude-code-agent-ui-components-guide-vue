# Icon — 구현 메모

- **파일 경로**: components/icons/Icon.vue, components/icons/index.ts
- **계층**: icons (Atomic Design 계층 외부 — 전용 폴더)
- **구현 완료일**: 2026-04-29
- **비표준 구현**:
  - `inline-flex` 예외 허용: Icon.vue의 `<span>`은 인라인 맥락 아이콘 래퍼이므로 명세에서 명시적으로 허용
  - `index.ts` 구조: `<script setup>` 없이 `defineComponent` + `makeIcon` 헬퍼로 named export. Nuxt auto-import 미지원 → 사용처에서 명시적 import 필요
  - `components/icons/` 폴더: Atomic Design 계층 외부, atoms 대신 전용 폴더 분리 (feedback_icon_folder_structure.md 참조)
  - vite-svg-loader 전환 완료: `makeIcon(name, defaultSize: IconPresetSize, SvgComponent: Component)` — SVG 파일을 import해 Component로 전달.
  - SVG import 구분: `?component` (SVGO 색상 자동 변환 — 일반), `?skipsvgo` (색상 고정 — Play/Grid/List/HeartFull/Heart/Cart/Tooltip/CircularNote 등)
  - Tooltip·CircularNote는 SVG 내부 fill 색상 문제로 `?skipsvgo` 사용
  - export 명칭: 모두 `Icon` suffix 추가 (예: `CloseIcon`, `HomeIcon`). 총 31종.
  - (참고) 배지(count) 포함 CartIcon 은 도메인 특화 요소로 프로젝트에서 제거됨 — 2026-06-03.
  - **IconSize 타입 분리 (2026-04-29)**: `components/types.ts`에 `IconPresetSize = 'xs'|'sm'|'md'|'lg'`와 `IconSize = IconPresetSize | number` 분리. `makeIcon()`의 `defaultSize`는 `IconPresetSize`만 허용. `number` size는 Icon.vue에서 inline style(`width`/`height` px)로 처리하고 CSS class 미적용. 기존 프리셋 문자열은 `icon--{size}` class로 처리.
  - Icon.vue의 `size` prop 처리: `typeof size === 'string'` → `:class="icon--${size}"`, `typeof size === 'number'` → `:style="{ width, height }"`. `sizeStyle` computed가 color와 커스텀 size를 함께 병합.
  - `makeIcon()`의 Vue props 타입: `[String, Number] as unknown as () => IconSize`로 선언 (Vue 런타임 prop 타입 배열 패턴).
- **개발자 핸드오프**: 없음 (UI 전용 컴포넌트)
