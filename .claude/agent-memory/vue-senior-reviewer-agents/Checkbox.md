# Checkbox — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-14
- **리뷰 결과**: PASS (BLOCKER 0 / WARN 3 / INFO 2)
- **루프 횟수**: 1회
- **반복 발견 패턴**:
  - `useId()` Vue 3.5+ API 사용 (버전 핀 위반) — RadioGroup에서도 Math.random() ID 생성이 WARN으로 지적된 바 있음. 프로젝트 전체 일관된 대체 전략 필요
  - 단순 pass-through computed(`proxyValue = computed(() => props.modelValue)`) — Input/InputSearch의 writable computed 패턴을 오해한 불필요한 래핑
- **rules 보강 제안**:
  - `rules/components.md`에 "Vue 3.5+ API 사용 금지 목록(`useId`, `useTemplateRef`) + 프로젝트 내 ID 생성 표준 패턴" 예시 추가 권고
  - Radix Vue 래핑 복합 컴포넌트에서 `$attrs.class` → 특정 요소로 분리 바인딩하는 패턴은 정합한 사례로 확인됨. 별도 규칙 추가 불필요

## 검토 포인트 기록

- `$attrs.class` → `<label>` + `rootAttrs`에서 `class` 필터링 패턴: **정합** (attrs 수동 분배 — 복합 컴포넌트 전용 패턴)
- `defineOptions({ inheritAttrs: false })` + `useAttrs()` 조합: **정합**
- `onCheckedChange`에서 `val === true` 체크로 `'indeterminate'` 방어: **적절** (Radix Vue CheckboxRoot의 indeterminate 상태를 false로 처리하는 명시적 의도)
- `:deep()` 사용: Radix Vue 내부 `<button>`에 Vue scoped attribute가 전달되지 않는 구조적 이유로 **정합**
