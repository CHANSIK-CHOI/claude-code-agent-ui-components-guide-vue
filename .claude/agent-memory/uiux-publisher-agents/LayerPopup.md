# LayerPopup — 구현 메모

- **파일 경로**: components/popup/LayerPopup.vue (Wrapper), components/popup/Popup.vue (Base)
- **계층**: organisms — `components/popup/` 전용 폴더
- **구현 완료일**: 2026-04-29
- **비표준 구현**:
  - Radix Vue DialogRoot/DialogContent 래핑 (Popup.vue Base)
  - layer 타입 전용: close 버튼을 header 내부 flex item이 아닌 `position: absolute`로 DialogContent 안에 별도 배치 (`popup__closeBtn--absolute`)
  - layer 타입 전용: header에 border-bottom 없음, body padding: 0, footer border-top 없음 (`.popup--layer` modifier로 오버라이드)
  - CloseIcon은 `@nd/components/icons`에서 import (`close.svg?component` 기반)
  - layer 타입에서 title 있으면 header 안에 `<DialogTitle>` 직접 렌더 (VisuallyHidden 미적용)
  - 6개 파일 전체 inheritAttrs:false + v-bind="$attrs" 위임
- **개발자 핸드오프**: 없음 (UI 제어만)

## 가이드 페이지 패턴 (2026-04-29 업데이트)

가이드 페이지(`pages/guide/layerPopup/index.vue`)는 **별도 데모 컴포넌트 래핑 + ref 제어** 패턴으로 구성.

실제 개발에서 LayerPopup / BottomSheet / FullPopup은 항상 별도 컴포넌트로 한 번 더 래핑한 뒤, 부모에서 ref를 통해 `.open()` / `.close()`로 제어한다.

- 데모 컴포넌트 5개: `components/guide/LayerPopupDemo*.vue`
- 각 컴포넌트 내부에서 `useLayerPopup()` 호출 + `defineExpose({ open, close })`
- 가이드 페이지: `ref<PopupRef>()` 선언 + `ref?.open()` 옵셔널 체이닝 호출
- `PopupRef` 타입: `{ open: () => void; close: () => void }` — 가이드 페이지 `<script setup>` 인라인 선언
- Vue 3.4 환경 → `useTemplateRef` 금지, `ref<PopupRef>()` 패턴 사용
- `v-model:open="popup.isOpen.value"` — isOpen은 `Ref<boolean>`이므로 반드시 `.value` 붙임
