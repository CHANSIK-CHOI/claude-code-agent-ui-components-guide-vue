---
name: InputAuth
description: 본인인증용 타이머 내장 Input Wrapper 컴포넌트 — atoms 계층, suffix 슬롯 활용, active prop 제어
metadata:
  type: component
  layer: atoms
  baseComponent: Input
---

# InputAuth — 기획 메모

- **계층**: atoms
- **작성일**: 2026-05-29
- **주요 결정**:
  - Base + Wrapper 분리 (Base = Input.vue, Wrapper = InputAuth.vue)
  - Input의 `#suffix` 슬롯에 MM:SS 카운트다운 타이머 텍스트 삽입
  - `active` prop(false→true 전환 시 리셋+재시작), `autoStart` prop(마운트 즉시 시작) 지원
  - 타이머 상태: `running` / `expired` 2가지만 (expiring 미사용 — 사용자 확인)
  - 이벤트: `timer-start` / `timer-end` 2개만 (timer-tick 미포함 — 사용자 확인)
  - 언마운트 시 타이머 정리 필수 (메모리 누수 방지)
  - expired 상태에서 타이머 텍스트 렌더링 없음 (suffix 슬롯 비어있음)
  - 타이머 텍스트에 `aria-live="off"` 권장 (매 초 낭독 방지)
- **미확정 항목**: 타이머 텍스트 색상·폰트 크기 — Figma 인증 후 갱신 필요
