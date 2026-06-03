# ButtonGroupGuidePage — 구현 메모

- **파일 경로**: pages/guide/buttonGroup/index.vue + pages/guide/buttonGroup/buttonGroup.scss
- **계층**: guide
- **구현 완료일**: 2026-05-11
- **비표준 구현**: 없음
- **개발자 핸드오프**: 없음 (가이드 페이지 — 정적 데모)
- **특이사항**:
  - molecules 배지 토큰: `$bg-accent-green` 미존재 → `$bg-tertiary` + `$text-600`으로 대체 (중립 처리)
  - GuideSidebar MOLECULES 그룹에 ButtonGroup 링크 추가 (Collapsible 앞에 알파벳 순 배치)
  - Events 테이블: 레이아웃 전용 컴포넌트임을 colspan=3 셀로 명시
  - delegationNote: `<div>` 컨테이너 위임 — `class`, `id`, `data-*`, `aria-label` 안내
