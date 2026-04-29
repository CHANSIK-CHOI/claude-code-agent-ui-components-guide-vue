# Select — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-04-29
- **리뷰 결과**: PASS
- **루프 횟수**: 1회
- **반복 발견 패턴**: 없음

## 주요 발견 사항 요약

| 등급 | 내용 |
|------|------|
| WARN | proxyValue get에서 `modelValue ?? ''` — Radix SelectRoot에 undefined 대신 '' 전달 시 미선택 상태 인식 오류 가능성 |
| WARN | SelectRoot 바인딩 순서 — `v-bind="rootAttrs"` 이후 `v-model`, `:disabled` 혼재, 일관성 부족 |
| WARN | v-for 안 `variant === 'filter'` 조건 반복 평가 — `isFilter` computed 추출 권고 |
| WARN | SCSS filter trigger `height` 중복 선언 (`height: auto` → `height: 3rem` 덮어씀) |
| WARN | `outline: none` 기본 상태 선언 — `:focus-visible` 대체 스타일은 있으나 a11y.md 문면과 충돌 |
| WARN | `$z-sticky`(200) 사용 — 드롭다운 의미상 `$z-dropdown`(100)이 올바름, 가이드 페이지 stacking context 우회용 임시 적용 |
| INFO | `useId()` — Nuxt 3.10 제공 composable (Vue core와 구분 필요, 주석 명시됨) |
| INFO | `open-change` 이벤트명 — spec 확정 사항, Vue 관용 `update:open` 참고만 |
| INFO | `:deep()` 안 `&[data-*]` 중첩 — Vue scoped 컴파일 정상 처리, 패턴 적절 |

## rules 보강 제안

- `rules/components.md` — Radix Vue 래핑 시 v-model과 v-bind 순서 예시 명시 권고 (현재는 `$attrs` 순서 규칙만 있고 v-model 위치에 대한 언급 없음)
- `rules/style.md` — Portal 마운트 컴포넌트의 z-index 처리 정책 추가 권고 (가이드 페이지 stacking context 문제를 임시로 z-index 올려 해결하는 패턴이 반복될 수 있음)
