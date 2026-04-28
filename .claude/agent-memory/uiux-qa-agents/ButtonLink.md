# ButtonLink — QA 검수 메모

- **검수일**: 2026-04-28
- **검수 결과**: PASS
- **루프 횟수**: 2회 (1회차 WARN 2건 발견 → publisher 수정 → 2회차 전항목 PASS)
- **발견한 BLOCKER 요약**: 없음
- **재발 방지 메모**:
  - `resolveComponent("NuxtLink")`는 `<script setup>` 최상위에서 상수로 저장 후 `computed` 안에서 참조하는 패턴이 SSR 안전. `computed` 내부 직접 호출 금지.
  - `useTemplateRef` 관련 콘솔 에러는 Vue 3.4.19 환경에서 Nuxt 프레임워크가 발생시키는 것으로 ButtonLink 컴포넌트와 무관. 모든 가이드 페이지에서 동일하게 발생. Nuxt 버전 업그레이드 시 자연 해소 예상.
  - `<a>` disabled 처리: `aria-disabled="true"` + `tabindex="-1"` + `pointer-events: none` 3중 조합 + 핸들러 early return — 모두 정상 적용 확인.
  - `target="_blank"` → `rel="noopener noreferrer"` 자동 보완 로직 정상 동작 확인.
  - `ButtonColor` 등 공유 타입에 값이 추가될 경우 spec · 가이드 페이지 Props 테이블 · 가이드 예시 섹션 3곳을 모두 동시에 갱신해야 함.
