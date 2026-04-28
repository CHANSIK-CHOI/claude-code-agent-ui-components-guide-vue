# Icon — 기획 메모

- **계층**: 독립 폴더 (`components/icons/`) — Atomic Design 계층 외부
- **작성일**: 2026-04-28
- **주요 결정**:
  - SVG 추가 방식: paths 문자열 직접 embed → `vite-svg-loader`로 SVG 파일 import 방식으로 변경
  - `makeIcon()` 시그니처: `(name, defaultSize, svgPaths: string)` → `(name, defaultSize, SvgComponent: Component)`
  - SVG 파일 위치: `assets/icons/` (파일명 kebab-case)
  - import 쿼리: `?component` (일반), `?component&skipsvgo` (SVGO 예외)
  - SVGO `convertColors: true` 전역 설정 — fill/stroke 색상값 자동 currentColor 변환
  - `index.vue` → `index.ts` 파일 변경 (.vue 불필요)
- **네이밍 규칙**: 모든 아이콘 컴포넌트는 반드시 `Icon` 접미사 필수 — 일반 HTML 요소 및 Radix Vue 서브 컴포넌트와 이름 충돌 방지 (예: `<Tooltip>` 금지 → `<TooltipIcon>` 사용)
- **예외 케이스 (skipsvgo 적용)**:
  - PlayIcon: `<filter>` drop-shadow + `fill="white"` 포함 → `?component&skipsvgo` 사용, 흰색 fill은 디자인 의도이므로 변환 안 함
  - TooltipIcon: 배경 fill 없이 라인(stroke)만 있는 구조 → SVGO `convertColors`가 배경을 검정으로 만드는 문제 → `?component&skipsvgo` 사용, stroke는 `currentColor`로 직접 수정
  - CircularNoteIcon: 동일 이유 → `?component&skipsvgo` 사용
- **미확정 항목**: 없음
