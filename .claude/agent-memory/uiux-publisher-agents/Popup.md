---
name: Popup 계열 컴포넌트 구현 메모
description: popup/ 계층 전체 컴포넌트의 attrs 위임 패턴 및 구조
type: project
---

# Popup 계열 — 구현 메모

- **파일 경로**: components/popup/Popup.vue (Base), LayerPopup.vue, BottomSheet.vue, FullPopup.vue, Alert.vue, Confirm.vue
- **계층**: popup (organisms 외부 전용 폴더)
- **구현 완료일**: 2026-04-29 / 업데이트 2026-06-02
- **비표준 구현**:
  - Radix Vue DialogRoot/DialogContent 래핑 (Popup.vue)
  - Alert/Confirm은 프로그래매틱 팝업 — `onClose`/`onOk`/`onCancel` 콜백 prop 패턴, `isOpen = ref(true)` 내부 상태로 시작
  - Confirm은 `isOkClicked ref(false)` 패턴으로 ok/cancel 구분 후 `@closed` 애니메이션 종료 시점에 콜백 실행
  - `PopupType` = "layer" | "bottomSheet" | "full" | "alert" | "confirm" (alert/confirm은 2026-04-29 추가)
  - alert/confirm 타입: 헤더 표시 안 함 — DialogTitle은 VisuallyHidden으로만 마운트
  - alert/confirm CSS: `.popup--alert, .popup--confirm` 공통 modifier. max-width 32.8rem, padding 3rem 1rem 1rem, border-radius 2rem, footer border-top 없음, 버튼 gap 0.5rem
  - **BottomSheet CSS 업데이트 (2026-04-29)**: `.popup--bottomSheet` border-radius `$radius-lg $radius-lg 0 0` → `2rem 2rem 0 0`. padding `3rem 1.6rem 1rem`, gap `2rem` 추가. descendant 재정의: `.popup__header { padding:0; border-bottom:none }`, `.popup__title { text-align:center }`, `.popup__body { padding:0 }`, `.popup__footer { padding:0; border-top:none }`
  - **BottomSheet.vue showClose 기본값 (2026-05-04)**: `false` → `true`로 변경 (spec 개정)
  - **BottomSheet.vue footerLayout prop (2026-05-04)**: `'equal' | 'wide'` 추가 (기본 `'equal'`). `cancelFlex = wide ? 3 : 1`, `okFlex = wide ? 5 : 1` computed로 Popup에 전달
  - **Popup.vue portalTarget prop (2026-05-04)**: `portalTarget?: string` (기본 `'#popup-container'`) 추가. `<DialogPortal :to="portalTarget">` — 가이드 페이지 phoneFrame 내 독립 컨테이너 지원
  - **Popup.vue position:absolute override (2026-05-04)**: `.popup--bottomSheet { position: absolute }` — `position: fixed` 공통값을 phoneFrame 컨테이너 기준으로 override
  - **Popup.vue 닫기 버튼 구조 변경 (2026-05-04)**: 기존 3개 computed(`showLayerAbsoluteClose`, `showDefaultHeader`, `showLayerTitleHeader`) → 2개(`showAbsoluteClose`, `showTitleHeader`)로 단순화. 닫기 버튼을 type 무관하게 DialogContent 바로 안 absolute 단일 배치로 통합. Header는 title 텍스트만 담당(닫기 버튼 제거). `.popup__closeBtn--absolute` modifier 삭제, `.popup__closeBtn` 기본에 `position:absolute; top:1rem; right:1rem; width:1.6rem; height:1.6rem` 통합. `.popup__header`에서 `justify-content:space-between` 제거
  - **Footer 버튼 교체 (2026-04-29)**: 기존 `<button>` → `<Button shape="solid" size="lg">` 컴포넌트로 교체. ok는 `color="primary"`, cancel은 `:color="cancelColor"` (기본 `'gray'`). 각 버튼을 `<span class="popup__footerBtnWrap">` + `:style="{ flex: cancelFlex/okFlex }"` 로 감쌈.
  - 신규 props: `cancelColor?: 'secondary' | 'gray'` (기본 `'gray'`), `narrowCancel?: boolean` (기본 `false`)
  - **Popup.vue narrowCancel 교체 (2026-05-04)**: `cancelFlex/okFlex` 2개 제거 → `narrowCancel: boolean` 1개로 통합. `false`(기본): 양쪽 wrapper `flex: 1` (SCSS 기본, 50:50). `true`: cancel wrapper `:style="{ flex: 120, maxWidth: '12rem' }"` / ok wrapper `:style="{ flex: 200 }"`. BottomSheet.vue의 `footerLayout prop`도 별도 수정 필요 (Popup cancelFlex/okFlex 제거에 따른 연동)
  - 제거된 SCSS: `.popup__footerBtn` 공통 선언, `--cancel`, `--ok` modifier, type별 `.popup__footerBtn` height/border-radius 재정의 전체
  - 신규 SCSS: `.popup__footerBtnWrap { flex: 1; }` — narrowCancel=true 시 인라인 :style로 override
  - **Popup.vue narrowCancel CSS 변수 방식으로 교체 (2026-05-11)**: 기존 `cancelStyle/okStyle` 인라인 스타일 → `footerStyle` CSS 변수 객체로 통합. `narrowCancel=true`이면 footer `<div>`에 `{ '--footer-cancel-flex': '120', '--footer-cancel-max': '12rem', '--footer-ok-flex': '200' }` 설정. `<span>` 인라인 `:style` 제거. SCSS에 `.popup__footer > :first-child / > :last-child` 선택자 추가. `#footer` slot 커스텀 자식에도 동일하게 비율 적용됨.
  - **Popup.vue `<header>` / `<footer>` → `<div>` 교체 (2026-05-11)**: 시맨틱 태그 대신 div 사용으로 spec 일치
  - **Popup.vue `closeOnCloseBtn` prop 추가 (2026-05-20)**: `boolean` (기본 `true`). `false`이면 `handleCloseBtn`에서 `emit('update:open', false)` 호출 없음 + 템플릿에서 `<DialogClose>` 래핑 제거(순수 `<button>`만 렌더) — Radix Vue 자동 닫기 차단. 부모가 `@close` 수신 후 직접 닫아야 함
  - **bodyNote prop 위치 이동 (2026-06-01)**: Wrapper(LayerPopup/BottomSheet/FullPopup) → Popup.vue(Base)로 이동. Base에서 `bodyNote?: string` prop 추가 및 `<slot />` 아래에 마크업 구현. `CircularNoteSvg` import는 `@nd/assets/icons/circularNote.svg?skipsvgo`. BEM: `popup__bodyNote`, `popup__bodyNoteText`. Wrapper 3개는 prop 선언 유지 + `:body-note="bodyNote"` pass-through만 수행, 자체 마크업/import 없음. 린터가 bodyNote도 bodyLabel과 동일하게 `v-html` 방식으로 자동 처리함.
- **attrs 위임 구조**:
  - Popup.vue(Base): `<DialogContent v-bind="$attrs">` — Radix Vue가 실제 `role="dialog"` DOM을 렌더링하는 핵심 요소
  - LayerPopup/BottomSheet/FullPopup: `<Popup v-bind="$attrs">` — Wrapper → Base 이중 위임
  - Alert/Confirm: `<Popup v-bind="$attrs">` — 프로그래매틱이나 규칙 일관성 위해 동일 적용
  - 모든 파일: `defineOptions({ inheritAttrs: false })` 추가
- **2026-06-02 죽은 코드 정리**: `useLayerPopup`/`useFullPopup`/`useBottomSheet`/`usePopupState` 4개 파일 삭제 + barrel export 4줄 제거. 팝업 open 제어는 `v-model:open`(defineModel) 표준으로 완전 전환됨. `usePopupNavigate`/`useAlert`/`useConfirm`/`useToastPopup`/`usePopupManager`는 유지.
- **개발자 핸드오프**: 없음 (Alert/Confirm의 onClose/onOk/onCancel 콜백은 퍼블리셔 설계)
