# Accordion — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-19
- **리뷰 결과**: PASS
- **루프 횟수**: 1회 (headTrigger prop 교체 변경 리뷰)
- **반복 발견 패턴**: 없음
- **변경 포커스**: `triggerAnimation` prop → `headTrigger: boolean` prop 교체 (icon 패턴 / head 전체 트리거 패턴 분기)
- **확인 사항**:
  - `headTrigger: false`(기본): `accordion__trigger--icon` 클래스 + 슬롯 비면 SmallChevronDownSvg 폴백 렌더 — spec 정합
  - `headTrigger: true`: `accordion__trigger--head` 클래스 + 슬롯 콘텐츠 그대로, 회전 없음 — spec 정합
  - `hasSlot = !!slots.default?.().length` — 빈 comment VNode edge case 취약, 실용 범위에서 허용 (INFO)
  - defaultContent 분기 단순화 가능 (`hasSlot` 변수 제거 후 삼항 인라인) — INFO
  - `:deep()` 회전 애니메이션 선택자 (`accordion__trigger--icon`) — plain object 구조상 필연적 사용, 정당
  - `rootAttrs` computed, auto-import, emit 시그니처, value→modelValue 리맵 모두 정합
  - dual script block 패턴 (SSR v-for 슬롯 경계 해결 목적) — Collapsible과 동일, 정합
- **rules 보강 제안**: 없음
