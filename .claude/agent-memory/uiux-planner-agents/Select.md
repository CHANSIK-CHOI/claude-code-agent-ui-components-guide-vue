---
name: Select 기획 메모
description: Select 컴포넌트 명세 작성 시 주요 결정사항과 미확정 항목 기록
type: project
---

# Select — 기획 메모

- **계층**: atoms
- **작성일**: 2026-04-26
- **주요 결정**:
  - Base만 구성 (Wrapper 없음). 멀티셀렉트/검색형은 별도 컴포넌트로 분리 예정
  - Radix Vue 래핑 패턴 적용 — SelectRoot / SelectTrigger / SelectContent 등 전체 구성요소 사용
  - Trigger 외형은 Input.vue와 동일한 토큰 사용 (border, height, padding, radius 동일)
  - 드롭다운 패널도 Input과 동일한 border/radius 적용 (별도 box-shadow 없음)
  - 선택 항목 강조: 체크마크 아이콘(SelectItemIndicator) 미사용 확정 — 배경색(`$bg-disabled`, #f5f5f5)만으로 구분
  - 드롭다운 패널 max-height: `50rem` 확정. 초과 시 내부 스크롤 + SelectScrollUpButton / SelectScrollDownButton 표시
  - 아이템 그룹화(SelectGroup / SelectLabel): 미구현 확정. 추후 필요 시 별도 확장 예정
  - disabled 아이템 시각 표현: Trigger disabled 상태와 동일 — 배경 `$bg-disabled`, 텍스트 `$text-disabled`, 커서 `not-allowed`
  - Chevron 아이콘: SVG 경로 자체는 위를 향하는 형태(∧). stroke 색상 `#666666` → `$text-secondary`. 닫힌 상태 `rotate(180deg)`, 열린 상태 `rotate(0deg)`. 크기는 부모 요소가 제어
  - 아이템 높이: 44px / 아이템 좌우 패딩: 12px
  - 드롭다운 패널은 Portal로 body에 렌더링 (`$z-dropdown` 레이어)
- **미확정 항목**: 없음 (2026-04-26 기준 전항목 확정)

**Why:** Figma 노드 40004346:13465 조회 결과, 열린 드롭다운 패널이 Input 컨테이너 형태와 동일한 border/radius로 표현됨. 나머지 미확정 항목은 2026-04-26 사용자 확인으로 모두 확정.
**How to apply:** 명세 모든 항목 확정 완료. 구현 단계에서 별도 디자인 재확인 불필요.
