# OptionButtonGroup — QA 검수 메모

- **검수일**: 2026-05-29
- **검수 결과**: PASS
- **루프 횟수**: 4차 재검수 (subLabel 신규 추가 항목 중점 검증)
- **발견한 BLOCKER 요약**: 없음

## 이번(4차) 검수 — subLabel 신규 추가 항목 검증

### 검증 항목: subLabel 렌더링

- `$font-size-caption1` 적용 확인 (정적 분석)
- 슬롯 미사용 조건부 렌더링: `v-if="!$slots.content && !$slots['selected-content']"` 분기 확인
- 선택 시 `$text-white` 색상 전환: `:deep(.#{$b}__item--selected .#{$b}__subLabel)` SCSS 확인
- rowColumns 렌더 분기에도 동일 subLabel 구현 확인
- Playwright ⑩ 섹션: label + subLabel 이중 렌더링, 선택 후 v-model 반영 모두 정상

### Context7 검증

- RadioGroupRoot(modelValue/disabled/name/required/@update:modelValue), RadioGroupItem(value/disabled/aria-label), CheckboxRoot(checked/disabled/name/value/@update:checked) — 모두 문서 일치
- Alpha 컴포넌트 사용 없음 (RadioGroup/Checkbox 모두 Stable)

### 이월 WARN

- 가이드 SCSS `__demo`: `display: flex; flex-direction: column; gap: $spacing-sm` — `rules/style.md` 위반 (WARN)
- 화살표 키 Radix 타이밍 버그: Radix Vue 1.9.17 내부 이슈. 클릭 선택 정상이므로 기능 차단 없음 (WARN 이월)

## 재발 방지 메모

- subLabel: spec §7 동작 규칙대로 슬롯 미사용 시에만 렌더링 — `$slots['selected-content']`도 조건에 포함 필수
- rowColumns 분기에서도 동일하게 subLabel 구현해야 함 — 분기 누락 주의
- CSP 에러(카카오 SDK)는 전역 공통 에러로 컴포넌트 무관
