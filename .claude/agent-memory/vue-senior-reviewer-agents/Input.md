# Input — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-29
- **리뷰 결과**: PASS
- **루프 횟수**: 3회차 (1차 FAIL → 2차 PASS → 3차 PASS)
- **반복 발견 패턴**: `props.` 접두사 과잉(template에서 props.xxx 직접 참조) / `withDefaults` boolean 불필요 선언 — 3회 연속 미수정, INFO 수준 유지. 이번 변경분 `hideClear: false`도 동일 패턴 추가됨.
- **rules 보강 제안**: 없음

## 이번 변경 사항 검토 (PASS)

### 신규 변경분 모두 정상

| 변경 항목 | 검토 결과 |
|-----------|---------|
| `hideClear` prop 추가 | 정상 — spec §2-1 요구사항 충족 |
| `suffix` named slot 추가 | 정상 — `$slots.suffix` 체크 패턴 적절, spec §2-2 충족 |
| `clear` emit 추가 | 정상 — `defineEmits<{ clear: [] }>()` 타입 시그니처 포함 |
| `showClear` computed | 정상 — 4개 조건 spec §5와 일치, computed 관용구 적절 |
| `handleClear` 함수 | 정상 — update:modelValue 먼저 → clear emit 순서 자연스럽고 props mutation 없음 |
| border → `.input` 컨테이너 이동 | 정상 — `focus-within` + `<input>` outline:none 조합 자연스러움 |
| SVG `?skipsvgo` import | 정상 — 프로젝트 정책 준수 |
| `v-bind="$attrs"` 위치 | 정상 — `<input>` 첫 번째 속성 위치 유지 |

### 지속 미수정 INFO (기능 버그 없음)

1. template에서 `props.xxx` 접두사 과잉 — `:type="props.type"` 등 6곳. Vue 관용구는 접두사 없이 바로 참조
2. `withDefaults` boolean 불필요 선언 — `error: false`, `disabled: false`, `readonly: false`, `hideClear: false`. `modelValue: ''`, `type: 'text'`만 의미 있는 기본값
3. `$slots.suffix` 빈 슬롯 엣지 케이스 — Wrapper 전용 사용 패턴상 실질 위험 낮음, INFO

## 이전 BLOCKER 해소 상태 유지 확인

- 2차 리뷰에서 해소된 `v-bind="$attrs"` 순서 위반 — `<input>` 첫 속성 위치 유지 확인됨
