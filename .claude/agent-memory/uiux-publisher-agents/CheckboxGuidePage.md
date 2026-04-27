---
name: CheckboxGuidePage
description: Checkbox 가이드 페이지 구현 메모 — 6섹션, GuideSidebar ATOMS 그룹 추가, inline-flex 예외 확정
type: project
---

# CheckboxGuidePage — 구현 메모

- **파일 경로**: pages/guide/checkbox/index.vue, pages/guide/checkbox/checkboxGuidePage.scss
- **계층**: guide
- **구현 완료일**: 2026-04-27
- **비표준 구현**:
  - `.CheckboxRoot__wrapper`에 `display: inline-flex` 적용 — Checkbox/Radio는 style.md `inline-flex 금지` 규칙 예외로 확정. 콘텐츠 너비만큼만 차지해야 하기 때문.
- **가이드 섹션**: ① 개요 / ② type Variant (box·check, 레이블 없는 버전·있는 버전) / ③ 상태(State) / ④ 레이블 조합 / ⑤ 실사용 예시(v-model) / ⑥ Props 테이블
- **delegationNote**: 단순 컴포넌트 버전 — CheckboxRoot 버튼 요소에 $attrs 위임
- **radixNote**: 추가됨 (Radix Vue CheckboxRoot 기반)
- **GuideSidebar**: ATOMS 그룹에 `{ label: 'Checkbox', to: '/guide/checkbox' }` 추가

**Why:** Checkbox/Radio는 폼 내 인라인 배치가 기본 사용 패턴이어서 `width: 100%` 강제 시 레이아웃이 깨짐. `inline-flex` 예외를 팀 결정으로 확정.
**How to apply:** Radio 컴포넌트 구현 시 동일하게 `inline-flex` 예외 적용.
