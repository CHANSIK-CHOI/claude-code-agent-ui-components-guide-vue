# Tab — 기획 메모

- **계층**: organisms
- **작성일**: 2026-04-27
- **주요 결정**:
  - Radix Vue Tabs 래핑 (`TabsRoot` / `TabsList` / `TabsTrigger`). `TabsContent` 미사용 (Navigation only 설계).
  - overflowIndicator (`tab__overflow-indicator`) 제거 확정 — 디자인에 없는 요소.
  - 탭 우측 외부 컨텐츠는 `#actions` 슬롯으로 배치 (구 viewToggle prop 은 슬롯으로 대체, ViewToggle 컴포넌트는 프로젝트에서 제거됨 — 2026-06-03).
  - pill active 배경: `$color-primary-hover` (#00addb) — `$color-primary` (#0cb5e2) 아님.
  - SVG stroke는 `currentColor`로 교체하여 CSS color로 색상 제어.
