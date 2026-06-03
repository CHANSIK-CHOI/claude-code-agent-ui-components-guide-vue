# PaginationGuidePage / PaginationSimpleGuidePage — 구현 메모

- **파일 경로**:
  - `pages/guide/pagination/index.vue`
  - `pages/guide/pagination-simple/index.vue`
- **계층**: guide
- **구현 완료일**: 2026-05-11
- **비표준 구현**:
  - Pagination: siblingPages를 `reactive<Record<number, number>>` 로 관리해 siblingCount 1/2/3 각각 독립적 v-model 시연
  - Pagination: `__radixNote` 단락 포함 (Radix Vue Alpha override 컴포넌트)
  - PaginationSimple: Radix Vue 미사용 — `__radixNote` 없음
  - 두 페이지 모두 SCSS 인라인(외부 파일 분리 없음) — guide 페이지 관례
- **GuideSidebar 업데이트**: MOLECULES 그룹에 Pagination, PaginationSimple 두 항목 추가
- **개발자 핸드오프**: 없음 (가이드 페이지 전용, API 연동 불필요)
