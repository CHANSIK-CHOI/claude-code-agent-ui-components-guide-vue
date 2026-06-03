# Pagination — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-11
- **리뷰 결과**: PASS (BLOCKER 없음, WARN 4건)
- **루프 횟수**: 1회
- **반복 발견 패턴**:
  - `PAGINATION_ROOT_PROPS` 변수명이 Select의 허용 목록과 반대 방향(차단 목록)이어서 의도 불명확
  - `:aria-label="'정적문자열'"` 이중 따옴표 (정적 바인딩에 v-bind 불필요)
  - `v-model:page` 대신 `:page` + `@update:page` 수동 분리 (React value/onChange 패턴 그대로 이식)
  - `v-for` key에 `items.indexOf(item)` 사용 (index 직접 수령 가능)
- **rules 보강 제안**:
  - `rules/components.md` Radix Vue 래핑 패턴 예시에 "차단 목록(deny list)" 방향 패턴도 추가 권고
  - `rootAttrs` 필터 변수명 컨벤션(allow list vs deny list)을 명시하면 혼동 방지
