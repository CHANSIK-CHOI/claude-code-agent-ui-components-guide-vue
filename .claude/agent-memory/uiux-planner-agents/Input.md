# Input — 기획 메모

- **계층**: atoms
- **작성일**: 2026-04-25
- **주요 결정**:
  - Base(Input) + Wrapper(InputSelect) 분리 — Figma에서 `icon=on` 케이스가 드롭다운 화살표 포함 Select 트리거 용도임을 확인, 별도 Wrapper로 분리
  - HelperText는 on/off/error 세 가지 상태를 props로 제어
  - 라벨 표시 여부는 prop으로 제어하며, 툴팁 아이콘은 라벨이 켜진 경우에만 활성화
- **미확정 항목**:
  - hover 상태 테두리 색 변화 디자인 케이스 없음 — 디자인 확인 필요
  - error 상태 시 필드 자체 테두리 색 변경 여부 미확인 (현재 도움말 텍스트 색상만 에러 색상)
  - readonly 상태 추가 여부 미확정
