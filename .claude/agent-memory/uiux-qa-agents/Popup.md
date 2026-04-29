# QA 검수 메모: Popup 계열 (Popup / Alert / Confirm / LayerPopup / BottomSheet / FullPopup)

검수일: 2026-04-29

## 최종 결과

PASS (BLOCKER 0 / WARN 0 / INFO 1)

## 루프백 이력

### 1차 루프백 (FAIL → publisher)

**원인**: `pages/guide/layerPopup`, `pages/guide/bottomSheet`, `pages/guide/fullPopup` 3개 가이드 페이지에서 `v-model:open="xxx.isOpen"` 패턴이 `Ref<boolean>` 객체를 그대로 전달 — 팝업이 열리지만 닫히지 않음.

**수정**: `v-model:open="xxx.isOpen"` → `v-model:open="xxx.isOpen.value"` (총 10곳)

**근본 원인**: Vue 3 템플릿의 ref 자동 언박싱은 최상위(top-level) 변수에만 작동. `const basic = useLayerPopup()` 처럼 객체로 받은 후 `basic.isOpen`을 템플릿에서 사용하면 Ref 객체가 그대로 전달됨.

## Context7 사실 체크 결과

- `DialogContent` 이벤트: `@interact-outside`, `@escape-key-down` (kebab-case) — 정상
- `handleAnimationEnd`: 네이티브 DOM `animationend` — 정상
- `DialogRoot` open 제어: `:open` + `@update:open` 분리 방식 — 정상
- `DialogClose` + `as-child` + `<button>`: shadcn-vue 예시와 동일 — 정상

## INFO

- overlay 클릭 Playwright 검증: `.popup__content`가 pointer-events를 가로채므로 `dispatchEvent('click')` 우회 필요. 실제 브라우저 동작에는 영향 없음.
