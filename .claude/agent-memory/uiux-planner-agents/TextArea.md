---
name: TextArea 기획 메모
description: TextArea 컴포넌트의 계층·주요 결정·미확정 항목 요약 (팀 공유용)
type: project
---

# TextArea — 기획 메모

- **계층**: atoms
- **작성일**: 2026-04-25
- **주요 결정**:
  - Base만 구성 (Wrapper 분리 없음) — Input의 InputSearch/InputPassword 같은 특수 변형이 없음
  - 카운터 영역은 maxLength prop이 설정된 경우에만 렌더링 (조건부)
  - 카운터는 `현재 글자 수 / 최대 글자 수` 형태, 우측 정렬, 필드 내부 하단에 배치
  - 리사이즈 방향은 기본값 `none` (CSS resize 속성 제어)
  - 상태 정의(focus, disabled, readonly, error) 및 색상 토큰은 Input 컴포넌트와 동일 방식 적용
  - 카운터 요소는 `aria-describedby`로 `<textarea>`에 연결해 스크린리더가 인식하도록 명시
- **미확정 항목**:
  - focus 상태 테두리 색상 — Figma에 focus 케이스 없음. Input 토큰(`$border-input-focus`) 동일 적용 가정, 디자인 확인 필요
  - disabled / error 상태 시각적 케이스 — Figma에 해당 상태 노드 없음. Input 상태와 동일 처리로 가정
  - 스크롤바 인디케이터 커스텀 구현 여부 — 브라우저 기본 스크롤바 대체 여부는 퍼블리셔와 협의 필요
