# QA 검수 메모: Popup 계열 (Popup / Alert / Confirm / LayerPopup / BottomSheet / FullPopup)

검수일: 2026-04-29 (5차 검수 — Alert/Confirm 변경 사항)

## 최종 결과

FAIL (BLOCKER 3 / WARN 2 / INFO 2) — 루프백 publisher

---

## 5차 검수 — Alert/Confirm PopupType 추가 및 레이아웃 변경 — 2026-04-29

### 발견한 BLOCKER

1. **Alert: `showClose=false` 전달에도 닫기 버튼이 렌더링됨**
   - Alert.vue: `:show-close="false"` + `type="alert"` 전달
   - Popup.vue 헤더 조건: `(title || showClose) && type !== 'alert' && type !== 'confirm'`
   - `title="안내"(truthy)` + `type='alert'` → 전체 조건 false → 헤더 미렌더링이어야 하나
   - Playwright 스크린샷 및 접근성 트리에서 `banner > button "닫기"` 실제 렌더링 확인됨
   - 원인 추정: `v-bind="$attrs"`로 전달된 값이 showClose 기본값을 override하거나, `$slots.header` check가 오작동 가능성
   - spec §5-3: `title 없음 + showClose=false` → Header 박스 미렌더링. Alert은 항상 헤더 없어야 함

2. **Confirm 가이드 페이지(index.vue) — `okDisabled` 섹션이 존재하나 Confirm.vue에는 `okDisabled` prop 없음**
   - `pages/guide/confirm/index.vue` 접근성 트리에서 "④ ok 버튼 비활성" 섹션 + `okDisabled 열기` 버튼 확인
   - `components/popup/Confirm.vue` defineProps에 `okDisabled` prop 없음
   - `useConfirm.ts`의 `ConfirmConfig` 인터페이스에도 `okDisabled` 없음
   - 가이드 페이지가 구현보다 앞서 나가거나 파일 내용이 불일치 (Read로 확인한 파일과 실제 서버 서브 파일이 다를 수 있음)
   - 가이드 페이지 Props 테이블에도 `okDisabled` 항목 존재

3. **Alert 가이드 페이지 Props 테이블 — `title` 설명 불일치**
   - 가이드 페이지 테이블: `title` 설명 = "헤더 타이틀. 생략 가능" (헤더에 들어간다고 안내)
   - 실제 구현: `title`은 Alert body 내부(`<p class="alert__title">`)에 표시, 헤더에 들어가지 않음
   - 사용자 혼선 유발 가능 — spec과도 불일치 (spec: body에 title+message 표시)

### 발견한 WARN

1. **`DialogTitle` 중복 렌더링 가능성**
   - Popup.vue: `v-if="!title || type === 'alert' || type === 'confirm'"` → VisuallyHidden으로 항상 마운트
   - Alert.vue: `:title="title ?? '안내'"` → title이 없어도 '안내' 문자열 전달 → `!title` 조건은 false지만 `type === 'alert'`이므로 VisuallyHidden 마운트됨 (OK)
   - Confirm도 동일: `:title="title ?? '확인'"` → 항상 title이 있어 보임
   - 접근성 트리에서 `dialog` 안에 `heading [level=2]`가 두 개 나타남 (VisuallyHidden용 + 헤더가 렌더링될 경우) — 헤더 렌더링 차단이 제대로 안 되면 중복 heading 문제

2. **Popup.vue `type` prop에 `'alert' | 'confirm'` 추가 — spec §2-1 미반영**
   - spec §2-1 type prop: `'layer' | 'bottomSheet' | 'full'` 3가지만 정의
   - 구현: `type PopupType = "layer" | "bottomSheet" | "full" | "alert" | "confirm"` — spec에 없는 타입 추가
   - Popup.vue가 Base로 직접 사용 안 되는 컴포넌트라도 spec에 없는 타입 추가는 planner 승인 필요 여부 검토

### INFO

- Confirm 팝업 cancel 버튼 배경색: 스크린샷에서 `$border-disabled` = `$_accent-light-gray` = `#BECCD2` 시각 확인 — spec 요구사항 일치
- 콘솔 에러: `kakao.min.js` CSP 에러 — 컴포넌트와 무관한 외부 스크립트. `ToastRenderer`의 `#popup-container` Teleport 실패 warn은 기존 이슈(ToastPopup 관련)로 이번 변경과 무관

---

## 재발 방지 메모

- Popup Base 컴포넌트의 type prop에 신규 타입을 추가할 때는 반드시 spec §2-1을 먼저 업데이트해야 한다.
- Alert/Confirm 같이 `showClose=false`가 고정인 Wrapper에서는 헤더 미렌더링 여부를 Playwright로 반드시 확인한다. `v-bind="$attrs"` 전달 경로에서 의도치 않은 prop 오버라이드가 일어날 수 있다.
- 가이드 페이지의 Props 테이블은 컴포넌트 구현과 동시에 업데이트해야 불일치가 발생하지 않는다.

---

## 이전 검수 이력 (참고)

### 4차 검수 (PASS) — dim(overlay) 추가 + slideInRight 키프레임 변경 — 2026-04-29

PASS (BLOCKER 0 / WARN 0 / INFO 2)

- overlay 클릭 및 ESC 동작 정상
- FullPopup dim 렌더링 정상
- slideInRight/Out transform 통일 확인
