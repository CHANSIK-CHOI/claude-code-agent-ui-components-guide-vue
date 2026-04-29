# 시니어 리뷰 메모: Popup 계열 (Popup / Alert / Confirm / LayerPopup / BottomSheet / FullPopup)

검수일: 2026-04-29

## 최종 결과

PASS (BLOCKER 0 / WARN 0 / INFO 1)

## 루프백 이력

### 1차 루프백 (FAIL → publisher)

**BLOCKER**: `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` 전면 누락

**수정된 파일 6개**:
- `Popup.vue` → `<DialogContent v-bind="$attrs" ...>` 에 추가
- `LayerPopup.vue`, `BottomSheet.vue`, `FullPopup.vue`, `Alert.vue`, `Confirm.vue` → `<Popup v-bind="$attrs" ...>` 에 추가

**attrs 흐름**: 외부 → LayerPopup/BottomSheet/FullPopup → Popup → `<DialogContent>` (실제 `role="dialog"` DOM)

## WARN 수정 이력 (사용자 승인 후 수정)

### Confirm.vue `closeReason` 단순화

- 변경 전: `closeReason: Ref<'ok' | 'cancel'>('cancel')` union type
- 변경 후: `isOkClicked: ref(false)` boolean
- `handleClosed()` 이후 `isOkClicked.value = false` 초기화 추가

### PopupRenderer.vue 타입 단언 제거

- 변경 전: `v-bind="(instance.props as Record<string, unknown>)"`
- 변경 후: `v-bind="instance.props"` (PopupInstance.props가 이미 `Record<string, unknown>` 타입)

## INFO

- `useLayerPopup`, `useBottomSheet`, `useFullPopup`은 현재 `usePopupState` 단순 위임. 향후 컴포넌트별 고유 상태가 필요할 경우 여기서 확장.
