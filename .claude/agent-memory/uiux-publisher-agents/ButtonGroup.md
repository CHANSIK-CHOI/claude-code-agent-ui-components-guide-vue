# ButtonGroup — 구현 메모

- **파일 경로**: components/molecules/ButtonGroup.vue
- **계층**: molecules
- **구현 완료일**: 2026-05-11
- **비표준 구현**: `:deep(> *)` 선택자로 슬롯 자식 flex 제어 (Vue scoped 특성상 필수). JS computed 없이 순수 CSS로만 처리.
- **개발자 핸드오프**: 없음 (레이아웃 전용, API 연동 불필요)
