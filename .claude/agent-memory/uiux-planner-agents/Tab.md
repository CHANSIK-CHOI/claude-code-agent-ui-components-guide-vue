# Tab — 기획 메모

- **계층**: organisms
- **작성일**: 2026-04-27
- **주요 결정**:
  - Radix Vue Tabs 래핑 (`TabsRoot` / `TabsList` / `TabsTrigger`). `TabsContent` 미사용 (Navigation only 설계).
  - overflowIndicator (`TabRoot__overflow-indicator`) 제거 확정 — 디자인에 없는 요소.
  - viewToggle 렌더링 방식: `v-if`/`v-else`로 단일 버튼 렌더링. 현재 viewType의 반대 상태 버튼만 DOM에 존재.
    - `viewType === 'grid'` → 목록 보기 버튼(list 아이콘)만 표시
    - `viewType === 'list'` → 격자 보기 버튼(grid 아이콘)만 표시
  - 뷰 토글 버튼 아이콘 색상: `$text-900` 단일 (active/inactive 구분 없음, `aria-pressed` 미적용).
  - pill active 배경: `$color-primary-hover` (#00addb) — `$color-primary` (#0cb5e2) 아님.
  - SVG stroke는 `currentColor`로 교체하여 CSS color로 색상 제어.
- **미확정 항목**:
  - 뷰 토글 아이콘 색상 hex(`#333333`)는 Figma 미확인으로 추정값. 실측 시 토큰 재검토 필요.
