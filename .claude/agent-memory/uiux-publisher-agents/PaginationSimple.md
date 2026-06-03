# PaginationSimple — 구현 메모

- **파일 경로**: components/molecules/PaginationSimple.vue
- **계층**: molecules
- **구현 완료일**: 2026-05-11 (가이드 페이지 현행화: 2026-05-11)
- **비표준 구현**:
  - Radix Vue 미사용 — 자체 마크업으로 구현 (Alpha 의존 최소화)
  - `v-bind="$attrs"` 루트 `<div>`에 위임 (단순 컴포넌트이므로 최상위 요소가 인터랙티브 요소 아님)
  - `aria-live="polite"` + `aria-atomic="true"`를 페이지 텍스트 span에 적용해 스크린리더 페이지 변경 알림
  - isFirstPage / isLastPage computed로 버튼 disabled 처리 + 핸들러 early return 이중 차단
  - SVG import: `@nd/assets/icons/chevronLeft.svg?component`, `@nd/assets/icons/chevronRight.svg?component`
  - 버튼 테두리: `1px solid $line-200` (`#dddddd` — Gray_Line2 정확 일치)
  - 버튼 아이콘 색상: `$text-500` (`#777777` — Figma `#808080` 근사, $text-400 `#838b92`보다 명도 차이 적음)
  - 컴포넌트 flex gap: `0.6rem` (6px)
- **개발자 핸드오프**:
  - `page` prop — 현재 페이지 (API 연동 필요)
  - `totalPages` prop — 전체 페이지 수 (API 연동 필요)
  - `@update:page` emit — 페이지 변경 시 개발자가 수신해 API 재호출
