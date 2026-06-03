# Checkbox — QA 검수 메모

- **검수일**: 2026-05-14
- **검수 결과**: PASS
- **루프 횟수**: 1회
- **발견한 BLOCKER 요약**: 없음
- **재발 방지 메모**:
  - `class` 위임 분리 패턴 정상 확인: `rootAttrs`에서 `id`와 `class` 동시 제외 → label에 `:class="$attrs.class"` 바인딩. button[role=checkbox]의 classList에는 `checkbox__control`만 존재하고 외부 class 전달되지 않음.
  - Radix Vue CheckboxRoot `disabled` 시 네이티브 `disabled` 속성 + `data-disabled=""` 자동 부여 (aria-disabled는 별도 추가 불필요 — a11y.md 정책 일치).
  - Context7 Radix Vue 라이브러리 코드 스니펫 부족(5개) → node_modules/radix-vue/dist/Checkbox/CheckboxRoot.d.ts 정적 분석으로 대체 검증 가능.
  - 가이드 페이지에서 `boxChecked` ref를 ① 개요 / ② type Variant(레이블 없는 버전) / ④ 레이블 조합에서 공유하므로 한 섹션 클릭이 다른 섹션 상태에도 영향줌 — 검수 이슈 아님(WARN 수준 가이드 UX 이슈).
