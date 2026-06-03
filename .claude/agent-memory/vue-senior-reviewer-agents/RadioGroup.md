# RadioGroup — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-13
- **리뷰 결과**: PASS
- **루프 횟수**: 1회
- **반복 발견 패턴**: 없음
- **특이 사항**:
  - uncontrolled 패턴(`:default-value` + `@update:model-value`) — Radix Vue controlled 모드 화살표 키 타이밍 버그 우회. 정당한 대응, Vue 관용구 적합.
  - watch(`props.modelValue`) 가 `internalValue`를 갱신하지만 Radix 내부 상태에는 영향 없음 (uncontrolled 한계). 실질 무효 코드 — 제거 또는 주석 교정 WARN.
  - `EXCLUDED_KEYS`에 `'onUpdate:modelValue'` 포함 — 중복 발화 방지 의도이나 주석 누락 WARN.
  - `Math.random()` ID 생성 — SSR hydration mismatch 위험 WARN (CSR 전용이면 INFO).
  - `$color-primary-hover` 토큰을 checked 기본 색상으로 사용 — spec은 `$color-primary` 지정, 값이 같다면 교체 권고 INFO.
- **rules 보강 제안**: 없음
