---
name: Popup 계열 컴포넌트 구현 메모
description: popup/ 계층 전체 컴포넌트의 attrs 위임 패턴 및 구조
type: project
---

# Popup 계열 — 구현 메모

- **파일 경로**: components/popup/Popup.vue (Base), LayerPopup.vue, BottomSheet.vue, FullPopup.vue, Alert.vue, Confirm.vue
- **계층**: popup (organisms 외부 전용 폴더)
- **구현 완료일**: 2026-04-29
- **비표준 구현**:
  - Radix Vue DialogRoot/DialogContent 래핑 (Popup.vue)
  - Alert/Confirm은 프로그래매틱 팝업 — `onClose`/`onOk`/`onCancel` 콜백 prop 패턴, `isOpen = ref(true)` 내부 상태로 시작
  - Confirm은 `isOkClicked ref(false)` 패턴으로 ok/cancel 구분 후 `@closed` 애니메이션 종료 시점에 콜백 실행
  - `PopupType` = "layer" | "bottomSheet" | "full" | "alert" | "confirm" (alert/confirm은 2026-04-29 추가)
  - alert/confirm 타입: 헤더 표시 안 함 — DialogTitle은 VisuallyHidden으로만 마운트
  - alert/confirm CSS: `.popup--alert, .popup--confirm` 공통 modifier. max-width 32.8rem, padding 3rem 1rem 1rem, border-radius 2rem, footer border-top 없음, 버튼 gap 0.5rem
  - **Footer 버튼 교체 (2026-04-29)**: 기존 `<button>` → `<Button shape="solid" size="lg">` 컴포넌트로 교체. ok는 `color="primary"`, cancel은 `:color="cancelColor"` (기본 `'gray'`). 각 버튼을 `<span class="popup__footerBtnWrap">` + `:style="{ flex: cancelFlex/okFlex }"` 로 감쌈.
  - 신규 props: `cancelColor?: 'secondary' | 'gray'` (기본 `'gray'`), `cancelFlex?: number` (기본 `1`), `okFlex?: number` (기본 `1`)
  - 제거된 SCSS: `.popup__footerBtn` 공통 선언, `--cancel`, `--ok` modifier, type별 `.popup__footerBtn` height/border-radius 재정의 전체
  - 신규 SCSS: `.popup__footerBtnWrap { flex: 1; }` — 인라인 :style로 override
- **attrs 위임 구조**:
  - Popup.vue(Base): `<DialogContent v-bind="$attrs">` — Radix Vue가 실제 `role="dialog"` DOM을 렌더링하는 핵심 요소
  - LayerPopup/BottomSheet/FullPopup: `<Popup v-bind="$attrs">` — Wrapper → Base 이중 위임
  - Alert/Confirm: `<Popup v-bind="$attrs">` — 프로그래매틱이나 규칙 일관성 위해 동일 적용
  - 모든 파일: `defineOptions({ inheritAttrs: false })` 추가
- **개발자 핸드오프**: 없음 (Alert/Confirm의 onClose/onOk/onCancel 콜백은 퍼블리셔 설계)
