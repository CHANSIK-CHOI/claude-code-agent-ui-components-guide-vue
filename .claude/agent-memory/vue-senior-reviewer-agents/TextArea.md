# TextArea — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-11
- **리뷰 결과**: PASS
- **루프 횟수**: 1회
- **반복 발견 패턴**: 없음
- **주요 확인 항목**:
  - `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` `<textarea>` 핵심 요소에 올바르게 배치, 순서 준수
  - `currentLength`, `textareaId` 모두 computed로 처리 (watch 없음)
  - `update:modelValue` emit 타입 시그니처 완전, `:value` 단방향 바인딩 올바름
  - `Math.random()` 기반 `_uid` — Vue 3.4 고정 환경에서 `useId()` 미사용 대안으로 적절. SSR hydration mismatch 가능성 있으나 현 용도 범위에서 허용
  - 이번 변경(`--error modifier` 카운터 색상 추가): `.#{$b}--error { .#{$b}__counter { } }` 패턴이 `rules/style.md` modifier/element 규칙 정확히 준수. `v-if="props.maxLength"` 조건부 렌더링으로 maxLength 없을 때 카운터 DOM 미존재 — 의도적 구조, 충돌 없음
- **rules 보강 제안**: 없음
