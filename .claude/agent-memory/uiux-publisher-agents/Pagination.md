# Pagination — 구현 메모

- **파일 경로**: components/molecules/Pagination.vue
- **계층**: molecules
- **구현 완료일**: 2026-05-11
- **비표준 구현**:
  - Radix Vue PaginationRoot 래핑 (Alpha 상태 — 사용자 명시 override)
  - `PaginationRoot`에 `as="nav"` + `aria-label="페이지 네비게이션"` 직접 지정
  - `PaginationPrev` / `PaginationNext` / `PaginationListItem` / `PaginationEllipsis` 모두 `as-child`로 커스텀 버튼/span에 위임
  - `rootAttrs` computed: defaultPage, showEdges 등 Root 전용 외부 attrs + aria-*/data-* 등 전달 attrs를 PaginationRoot에 통합 위임 (page/total/itemsPerPage/siblingCount/disabled는 명시 prop으로 분리)
  - items 배열 `indexOf` 를 key로 사용 — ellipsis가 여러 개 일 수 있으므로 인덱스 기반 key 사용
  - SVG import: `@nd/assets/icons/chevronLeft.svg?component`, `@nd/assets/icons/chevronRight.svg?component`
- **개발자 핸드오프**:
  - `page` prop — 현재 페이지 (API 연동 필요)
  - `total` prop — 전체 항목 수 (API 연동 필요)
  - `itemsPerPage` prop — 페이지당 항목 수 (API 연동 필요)
  - `@update:page` emit — 페이지 변경 시 개발자가 수신해 API 재호출
