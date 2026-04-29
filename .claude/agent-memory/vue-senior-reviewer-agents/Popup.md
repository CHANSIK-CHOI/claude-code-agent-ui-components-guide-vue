# Popup — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-04-29
- **리뷰 결과**: PASS
- **루프 횟수**: 누적 10회 (9차 PASS 이후 /component-revise — 10차 PASS)
- **반복 발견 패턴**: 없음
- **rules 보강 제안**:
  - rules/style.md에 "keyframe 내 transform 체계는 기본 스타일과 반드시 일치시킬 것" 항목 추가 권고 (이전 리뷰에서 기록, 유지)
  - rules/components.md에 "컴포넌트 간 통신은 emit 우선 — 함수를 prop으로 전달하는 패턴(React 관용구)은 Vue에서 WARN" 명시 권고
  - rules/components.md 또는 architecture.md에 "외부 컴포넌트의 prop 타입을 인라인 리터럴로 재선언 금지 — 반드시 types.ts 단일 출처 참조" 추가 권고

## 10차 리뷰 (2026-04-29 /component-revise — showFooter prop 추가)

### 변경 범위
1. `Popup.vue`: `showFooter?: boolean` (기본값 `true`) prop 추가, `<footer v-if="showFooter">` 적용
2. `LayerPopup.vue`, `BottomSheet.vue`, `FullPopup.vue`: `showFooter` prop 추가 후 `:show-footer="showFooter"` 명시 전달

### 검토 결과
- BLOCKER: 없음
- WARN: 없음
- INFO: 없음

### 검토 포인트 상세
- `showClose` / `showCancel` 패턴과 일관성: 완전히 동일 (prefix, 기본값 방향, withDefaults 위치)
- `v-if="showFooter"` computed 불필요: 단순 boolean prop pass-through — 다중 반응형 조합 없음, 직접 바인딩이 관용구에 맞음
- Wrapper의 개별 prop 명시 vs `$attrs` 경유: 현재 아키텍처에서 `$attrs`가 Radix DialogContent까지 내려가므로 `showFooter`를 `$attrs`에 섞으면 오염 위험. 명시 prop 패턴이 안전하고 올바름
- Alert / Confirm `showFooter` 미전달: 의도에 맞음 — 두 타입은 항상 footer(ok/cancel 버튼)가 필요하므로 기본값 `true` 그대로 사용이 정확

## 이전 리뷰 이력 (요약)

- 1차: `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` 누락 → BLOCKER → 수정 완료
- 2차: `translate: -50% 0` 개별 속성 + `transform` 키프레임 혼재 → BLOCKER → 수정 완료
- 3차 (FullPopup 변경분): `DialogOverlay v-if` 제거 + `slideInRight` 시작점 수정 → PASS
- 4차 (alert/confirm 타입 추가): WARN 3건 (emit 패턴, required prop, isOkClicked 리스크) → PASS
- 5차 (layer 타입 close 버튼 absolute 분리): WARN 2건 ($slots.header 분산, v-else-if 의미 불일치) → PASS
- 6차 (Footer Button 교체 + cancelColor/cancelFlex/okFlex): BLOCKER 1건 (cancelColor 타입 단일 출처 위반), WARN 3건 → FAIL
- 7차 (6차 BLOCKER 수정 검증): BLOCKER 해소 확인 → PASS
- 8차 (BottomSheet showClose 기본값 변경 + bottomSheet CSS 추가): PASS
- 9차 (full 타입 닫기 버튼 분기 제거 + popup--full CSS padding 추가): PASS
- 10차 (showFooter prop 추가): PASS
