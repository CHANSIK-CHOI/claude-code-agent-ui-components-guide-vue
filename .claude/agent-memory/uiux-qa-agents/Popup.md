# QA 검수 메모: Popup 계열 (Popup / Alert / Confirm / LayerPopup / BottomSheet / FullPopup)

검수일: 2026-04-29

## 최종 결과

PASS (BLOCKER 0 / WARN 0 / INFO 2)

## 루프백 이력

### 1차 루프백 (FAIL → publisher)

**원인**: `pages/guide/layerPopup`, `pages/guide/bottomSheet`, `pages/guide/fullPopup` 3개 가이드 페이지에서 `v-model:open="xxx.isOpen"` 패턴이 `Ref<boolean>` 객체를 그대로 전달 — 팝업이 열리지만 닫히지 않음.

**수정**: `v-model:open="xxx.isOpen"` → `v-model:open="xxx.isOpen.value"` (총 10곳)

**근본 원인**: Vue 3 템플릿의 ref 자동 언박싱은 최상위(top-level) 변수에만 작동. `const basic = useLayerPopup()` 처럼 객체로 받은 후 `basic.isOpen`을 템플릿에서 사용하면 Ref 객체가 그대로 전달됨.

### 2차 검수 — SCSS 레이아웃 변경 (60rem 중앙 배치) — 1차 시도

**변경 내용**: overlay / bottomSheet / full 타입에 `left: 50%; translate: -50% 0; width: min(60rem, 100%)` 패턴 적용.

**판정**: WARN → 이후 BLOCKER 격상 요청으로 수정

- WARN: CSS `translate` 개별 속성 + `@keyframes`의 `transform` 혼용 — 브라우저 합성 레이어 분리로 애니메이션 종료 후 위치 불일치 가능성

### 3차 검수 — SCSS transform 통일 수정본 — 2026-04-29

**변경 내용**: `translate: -50% 0` 개별 속성 전부 제거 → `transform: translateX(-50%)` base 스타일로 통일. 키프레임에도 X 오프셋 포함.

**판정**: PASS

- `left: 50%; transform: translateX(-50%)` base + 키프레임 내 `translate(-50%, ...)` 통일 — 충돌 없음.
- slideInRight `from { transform: translate(100%, 0) }` + `left: 50%`: 요소 너비(min(60rem, 100%))만큼 오른쪽 추가 이동 → 화면 밖 시작 위치 수학적으로 보장.
- 열림 애니메이션 종료(fill-mode 없음): base `transform: translateX(-50%)`로 복귀 → 중앙 정렬 유지.
- 닫힘 애니메이션 종료(forwards): 마지막 프레임 유지 → Radix Vue가 unmount — 깜빡임 없음.
- BottomSheet, FullPopup 실제 Playwright 검증 통과.

### 4차 검수 — dim(overlay) 추가 + slideInRight 키프레임 변경 — 2026-04-29

**변경 내용**:
1. `DialogOverlay`의 `v-if="type !== 'full'"` 조건 제거 → FullPopup에도 dim 렌더링
2. `slideInRight` from: `translate(100%, 0)` → `translate(50%, 0)` (레이아웃 오른쪽 끝에서 시작)
3. `slideOutRight` to: `translate(100%, 0)` → `translate(50%, 0)` (레이아웃 오른쪽 끝으로 나감)

**판정**: PASS (BLOCKER 0 / WARN 0 / INFO 2)

- FullPopup dim: `data-state: "open"`, `position: fixed`, `z-index: 300`, `background: rgba(17,17,17,0.5)`, `width: 600px(=min(60rem,100%))` — 스펙 일치
- dim 클릭 시 팝업 닫히지 않음 (`closeOnOverlay: false` 고정) — PASS
- 뒤로가기(←) 버튼 클릭 → 팝업 닫힘 — PASS
- ESC 키 → 팝업 닫힘 (`closeOnEscape: true` 기본값) — PASS
- `aria-label="뒤로가기"` — 접근성 스펙 일치
- LayerPopup 회귀: overlay 클릭 시 정상 닫힘 — 회귀 없음
- slideInRight/slideOutRight from/to `translate(50%, 0)`: `left:50%` 기준 레이아웃 우측 끝 출발/도착 — 스펙 일치

## Context7 사실 체크 결과

- `DialogContent` 이벤트: `@interact-outside`, `@escape-key-down` (kebab-case) — 정상
- `handleAnimationEnd`: 네이티브 DOM `animationend` — 정상
- `DialogRoot` open 제어: `:open` + `@update:open` 분리 방식 — 정상
- `DialogClose` + `as-child` + `<button>`: shadcn-vue 예시와 동일 — 정상
- Context7 radix-vue 라이브러리 스니펫 수 부족(5개)으로 DialogOverlay 상세 props 직접 조회 불가 → 코드 분석 + DOM 동작으로 대체 검증

## INFO

- overlay 클릭 Playwright 검증: `.popup__content`(FullPopup 전체화면)가 pointer-events를 가로채므로 `dispatchEvent('click')` 우회 필요. 실제 브라우저 동작에는 영향 없음.
- CSS `translate` 개별 속성(Houdini, CSS Transforms Level 2)과 `transform` shorthand 혼용 금지 규칙 확립 — 슬라이드 애니메이션 있는 컴포넌트는 `transform`으로 통일.

## 재발 방지 메모

- `left: 50%` + 키프레임 내 `transform`을 사용하는 슬라이드 패턴에서는 키프레임 모든 프레임에 X 오프셋(-50%)을 반드시 포함해야 한다.
- CSS `translate` 개별 속성과 `transform`을 혼용하면 브라우저가 두 속성을 별개 합성 레이어로 처리 → 충돌. `transform` 단일 속성으로 통일할 것.
- `slideInRight` from/to `translate(50%, 0)`: `left:50%` 기준 `translate(50%)` = 요소 자신 너비(min(60rem,100%))의 절반만큼 이동 → 레이아웃 우측 끝에서 출발. `translate(100%)` 보다 덜 나가므로 화면 완전 밖이 아닌 레이아웃 경계에서 시작.
