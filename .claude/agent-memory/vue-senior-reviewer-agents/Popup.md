# Popup — Vue 시니어 리뷰 메모

- **리뷰일**: 2026-04-29
- **리뷰 결과**: PASS (최신 — alert/confirm 타입 추가 변경분)
- **루프 횟수**: 누적 4회 (1차 BLOCKER, 2차 BLOCKER, 3차 PASS, 4차 PASS)
- **반복 발견 패턴**: React 관용구 이전 — onClose/onOk/onCancel을 props로 수신 (Alert.vue, Confirm.vue)
- **rules 보강 제안**:
  - rules/style.md에 "keyframe 내 transform 체계는 기본 스타일과 반드시 일치시킬 것" 항목 추가 권고 (이전 리뷰에서 기록, 유지)
  - rules/components.md에 "컴포넌트 간 통신은 emit 우선 — 함수를 prop으로 전달하는 패턴(React 관용구)은 Vue에서 WARN" 명시 권고

## 4차 리뷰 확인 사항 (alert/confirm 타입 추가 변경분 — PASS)

### Popup.vue
- `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` 위치 — `DialogContent`에 적용, 정상
- `type !== 'alert' && type !== 'confirm'` 헤더 조건 — 동작상 이슈 없음 (INFO: computed `showHeader`로 추출 권고)
- CSS scoped 하향 선택자 `.popup--alert .popup__body` — 같은 컴포넌트 내 요소 간 하향 선택자이므로 scoped에서 정상 동작 확인
- `VisuallyHidden + DialogTitle` 이중 구조 — alert/confirm 타입 시 항상 숨김 마운트, a11y 정상

### Alert.vue
- `onClose: () => void`를 required prop으로 수신 — WARN (Vue emit 관용구 아님)
- `title ?? '안내'`를 Popup :title에 전달하고 시각적 렌더링은 `v-if="title"` 조건부 — a11y 의도 정합, 정상

### Confirm.vue
- `onOk`/`onCancel`을 required props로 수신 — WARN (Vue emit 관용구 아님)
- `isOkClicked` ref로 ok/cancel 구분 후 `closed` 이벤트에서 콜백 실행 — 애니메이션 완료 후 콜백 실행 의도는 타당. composable 프로그래매틱 마운트 구조라면 현행 유지 가능. race condition 리스크 주의.

## 이전 리뷰 이력 (요약)

- 1차: `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` 누락 → BLOCKER → 수정 완료
- 2차: `translate: -50% 0` 개별 속성 + `transform` 키프레임 혼재 → BLOCKER → 수정 완료
- 3차 (FullPopup 변경분): `DialogOverlay v-if` 제거 + `slideInRight` 시작점 수정 → PASS
- 4차 (alert/confirm 타입 추가): WARN 3건 (emit 패턴, required prop, isOkClicked 리스크) → PASS
