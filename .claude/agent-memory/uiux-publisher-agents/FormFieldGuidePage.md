# FormFieldGuidePage — 구현 메모

- **파일 경로**: pages/guide/form-field/index.vue
- **계층**: guide
- **구현 완료일**: 2026-05-13
- **비표준 구현**:
  - `$bg-code` 토큰 미존재 → `$bg-tertiary` + `border: 1px solid $line-200`으로 대체
  - ③ 성공 상태 섹션에 우선순위 비교 3단 레이아웃 추가 (helper / success / error 동시 비교)
  - ⑤ 복합 폼에서 Checkbox의 `v-model:checked` 패턴 사용 (Radix Vue CheckboxRoot 래핑)
  - delegationNote: FormField는 v-bind="$attrs" 미사용(순수 wrapper) 안내 + aria-describedby 연결 규칙 병기
- **개발자 핸드오프**: 없음 (가이드 페이지 — mock 데이터만 사용)
- **GuideSidebar 수정**: MOLECULES 그룹 최상단에 FormField 항목 추가 (`/guide/form-field`)
