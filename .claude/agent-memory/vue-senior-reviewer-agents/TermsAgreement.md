# TermsAgreement — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-05-28
- **리뷰 결과**: PASS
- **루프 횟수**: 2차 PASS (WARN-A·B 수정 완료 후 최종 확인)
- **반복 발견 패턴**: Uncontrolled(checkedMap) + Controlled(allChecked prop) 이중 상태 소유 패턴 — isHandlingChange guard로 해소됨

## 최종(2차) 검토 확인 항목

1. **WARN-A 해소** — items watch 책임 분리 주석 보강 완료. isHandlingChange 가드와의 관심사 분리 계약 명시. PASS
2. **WARN-B 해소** — accordionProps computed로 `{ type, 'onUpdate:modelValue': onAccordionChange }` 통합 + v-bind 단일 바인딩. PASS
3. **1차 QA BLOCKER 해소** — `import Accordion` (default import) + 나머지 3개 named import 패턴으로 수정 완료. PASS
4. **inheritAttrs+$attrs 루트 div 위임** — 단일 핵심 인터랙티브 요소 없는 레이아웃 컨테이너 molecules 특성상 루트 div 위임 예외 적용. PASS
5. **withDefaults 반환값 할당** — `const props = withDefaults(...)` 정상. PASS
6. **emit 시그니처** — 4개 emit 모두 페이로드 타입 포함. PASS

## 잔여 INFO 항목

- `onAccordionChange` 파라미터 `string | string[]` 유니온 — `type="multiple"` 고정이므로 `string[]`으로 좁힐 수 있으나, Accordion.vue emit 시그니처가 유니온이라 TypeScript 타입 충돌 발생 가능. 현행 방어적 Array.isArray 분기가 타입 안전성 보장하여 수정 불필요.

## rules 보강 제안

rules/components.md에 "Uncontrolled + Controlled 혼재 패턴에서 순환 방지 관용구(isHandlingChange guard + nextTick 복원)" 예시 추가 권고
