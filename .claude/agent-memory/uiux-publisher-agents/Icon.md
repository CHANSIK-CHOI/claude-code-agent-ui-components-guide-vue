# Icon — 구현 메모

- **파일 경로**: components/icons/Icon.vue, components/icons/index.ts
- **계층**: icons (Atomic Design 계층 외부 — 전용 폴더)
- **구현 완료일**: 2026-04-28
- **비표준 구현**:
  - `inline-flex` 예외 허용: Icon.vue의 `<span>`은 인라인 맥락 아이콘 래퍼이므로 명세에서 명시적으로 허용
  - `index.ts` 구조: `<script setup>` 없이 `defineComponent` + `makeIcon`/`makeLegacyIcon` 헬퍼로 named export. Nuxt auto-import 미지원 → 사용처에서 명시적 import 필요
  - CartIcon 전역 CSS: scoped 미사용 블록에서 SCSS 변수 자동 주입 미작동으로 `assets/scss/global.scss`에 raw hex 사용 (명세 승인 사항)
  - `components/icons/` 폴더: Atomic Design 계층 외부, atoms 대신 전용 폴더 분리 (feedback_icon_folder_structure.md 참조)
  - vite-svg-loader 전환 완료 (2026-04-28): `makeIcon(name, size, SvgComponent: Component)` — SVG 파일을 import해 Component로 전달. `makeLegacyIcon` 완전 제거.
  - SVG import 구분: `?component` (SVGO 색상 자동 변환 — 일반 12종), `?skipsvgo` (색상 고정 — Play/Grid/List/HeartFull/Heart/Cart/Tooltip/CircularNote 8종)
  - Tooltip·CircularNote는 SVG 내부 fill 색상이 있어 `?component`(SVGO convertColors)를 적용하면 검정색 배경 버그 발생 → `?skipsvgo`로 변경 (2026-04-28)
  - export 명칭: 모두 `Icon` suffix 추가 (예: `CloseIcon`, `HomeIcon`, `CartIcon`). 총 31종.
  - CartIcon은 배지(count) 처리를 위해 `defineComponent` 직접 정의, 내부 SVG는 `h(CartSvg as Component)` 사용.
- **개발자 핸드오프**: 없음 (UI 전용 컴포넌트)
