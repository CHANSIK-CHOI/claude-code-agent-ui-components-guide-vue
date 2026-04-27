---
name: Checkbox 컴포넌트 기획 메모
description: Checkbox 명세 주요 결정 및 구현 과정 설계 변경 이력 요약
type: project
---

# Checkbox — 기획 메모

- **계층**: atoms
- **작성일**: 2026-04-27
- **주요 결정**:
  - Base만 (Wrapper 없음)
  - Radix Vue `CheckboxRoot` 래핑. `CheckboxIndicator`는 미사용
  - 아이콘 항상 렌더 + CSS 색상 제어 방식으로 상태 표현 (box/check 두 타입 공통)
  - controlled 바인딩: `v-model:checked + writable computed` 조합 불안정 → `:checked` + `@update:checked` 명시적 분리로 확정
  - 슬롯 감지: `$slots.default?.().length` (함수 호출 후 VNode 길이 판별)
  - box 미체크 상태에도 회색 아이콘(`$text-300`) 표시 — Figma 노드 `40004010:2292` 확인된 디자인 의도

- **설계 변경 이력**:
  - 초기 명세: `CheckboxIndicator` 사용, 체크 시에만 DOM 렌더
  - 최종 구현: `CheckboxIndicator` 제거, 아이콘 항상 DOM에 존재하며 CSS 색상으로 상태 구분
  - box 미체크 "아이콘 숨김" → "회색 아이콘 표시"로 변경 (Figma 반영)

- **미확정 항목**: 없음
