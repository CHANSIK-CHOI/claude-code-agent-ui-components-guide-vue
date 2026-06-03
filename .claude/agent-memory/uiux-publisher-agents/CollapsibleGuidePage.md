# CollapsibleGuidePage — 구현 메모

- **파일 경로**: pages/guide/collapsible/index.vue
- **계층**: guide
- **구현 완료일**: 2026-05-11
- **비표준 구현**: Radix Vue CollapsibleRoot 래핑 컴포넌트 / attrs 2단계 위임 (Root + Trigger) / `?skipsvgo` SVG import (SmallChevronDownSvg)
- **개발자 핸드오프**: 없음 (가이드 페이지 — 더미 데이터만 사용)

## 주요 구현 사항

- 코드 블록 배경: `$bg-tertiary` (`$bg-code` 토큰 미존재)
- `controlledOpen = ref(false)` — ③ Controlled 모드 예시 로컬 상태
- GuideSidebar에 MOLECULES 그룹 신규 추가 (`Collapsible` 항목)
- `delegationNote`: 2단계 위임 구조 (CollapsibleRoot / CollapsibleTrigger) 안내
- `radixNote`: Radix Vue Collapsible 공식 문서 링크 포함
