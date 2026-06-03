# BottomSheet — QA 검수 메모

- **검수일**: 2026-05-04
- **검수 결과**: BUG INVESTIGATION (디버깅 세션)
- **루프 횟수**: 이전 3회 PASS 이후 신규 버그 조사
- **발견한 BLOCKER 요약**: "BottomSheet 안 Select 클릭 시 BottomSheet 닫힘" — ghost click 버그 원인 파악 완료

---

## 이전 검수 이력 (PASS 까지)
- [1회차] popup__overlay position: fixed → position: absolute 수정 완료
- [2회차] phoneFrame height 미설정으로 BottomSheet content overflow — `height: 60rem` 추가로 해결
- [3회차] PASS

## 이전 재발 방지 메모
- Popup overlay는 반드시 `position: absolute` + phoneFrame `position: relative` 조합 유지. fixed 사용 시 전체화면 덮음.
- 가이드 페이지 phoneFrame 컨테이너에 충분한 `height`(최소 60rem) 지정 필수.
- wide footer 비율: cancel 119px / ok 199px = 37.42% / 62.58% — flex 3:5 정상 동작 확인.
- overlay 크기가 phoneFrame과 동일(358×598 vs 360×600)하게 `position: absolute; inset: 0`으로 렌더링됨.

---

## 2026-05-04 버그 디버깅: BottomSheet 안 Select 클릭 시 닫힘

### 버그 증상
모바일 터치로 BottomSheet(CartBottomSheet 등) 안의 Select 옵션을 선택하면 BottomSheet 자체가 닫힘.

### 현재 코드 상태
- `Popup.vue`의 `DialogOverlay`: `@click="handleOverlayClick"` (원복됨)
- `popup__overlay`: `position: fixed; inset: 0; z-index: 300; pointer-events: auto`
- `handleInteractOutside`: `event.preventDefault()` — interactOutside 경로는 막혀 있음

### 디버깅 결과 (Playwright 검증)

#### 1. SelectPortal DOM 마운트 위치 확인
```
[SELECT-PORTAL] DIV  z-index: 301  position: fixed
  parent: BODY#guide-theme
  radix: data-radix-popper-content-wrapper=""
```
- SelectPortal은 `<body>` 직속으로 마운트됨 (z-index: 301)
- DialogPortal(`#popup-container`)과 별개 DOM 경로

#### 2. interactOutside 경로 검증
- `content.contains(selectPortalElement) === false` 확인
- 즉 Radix Vue DismissableLayer가 SelectContent 클릭을 "외부 클릭"으로 인식
- 하지만 `handleInteractOutside`의 `event.preventDefault()`로 막힘 → BottomSheet 안 닫힘 확인

#### 3. z-index 경쟁 검증
- `popup-container`: `position: fixed; z-index: 300; parent: DIV#__nuxt`
- `SelectPortal`: `position: fixed; z-index: 301; parent: BODY`
- `DIV#__nuxt`: `position: static; z-index: auto` → stacking context 미생성
- 결과: 동일 stacking context(body) 안에서 비교 → SelectPortal(301) > popup-container(300) → hit test에서 SelectPortal이 이김

#### 4. 실제 버그 원인: "Ghost Click" (Tap-Through)
**이벤트 순서 로그**:
```
[BODY-POINTERDOWN] target: select__itemText timeSincePortalRemoved: N/A
[BODY-POINTERUP]   target: select__itemText timeSincePortalRemoved: N/A
[PORTAL-REMOVED]   SelectPortal DOM 제거됨          ← 여기서 SelectPortal 사라짐
[click 이벤트 없음]                                   ← pointerup 후 click이 오기 전에 DOM 제거
```

**모바일 터치에서의 실제 흐름**:
1. 사용자 손가락으로 Select 옵션 탭 (`touchstart` → `touchend`)
2. Radix Vue Select가 `pointerdown/pointerup`에서 옵션 선택 → SelectPortal DOM 즉시 제거
3. 브라우저가 터치 이후 약 300ms 딜레이 후 합성 `click` 이벤트 발화
4. 이 시점에 SelectPortal은 이미 없음 → 동일 좌표의 최상위 요소는 `popup__overlay`
5. `overlay.@click="handleOverlayClick"` 발화 → `emit('update:open', false)` → BottomSheet 닫힘

**이것이 전형적인 "Ghost Click" / "Tap-Through" 버그**

#### 5. handleInteractOutside 경로는 문제 없음
- `event.preventDefault()` 정상 작동 확인
- 가짜 SelectContent(body 마운트, z=301) 클릭 테스트에서 BottomSheet 닫히지 않음

### 근본 원인
`DialogOverlay`가 `@click="handleOverlayClick"` 핸들러를 가지고 있고, `pointer-events: auto`로 설정되어 있어 SelectPortal DOM 제거 후 발생하는 ghost click을 받아버림.

### 수정 방향 (publisher 참고용)

**방법 1: overlay click 핸들러를 pointerdown 기반으로 교체**
- `@click` 대신 `@pointerdown`으로 변경 → ghost click(합성 click)은 pointerdown 없이 발생하므로 차단 가능
- 단, `pointerdown`은 드래그 시작과 구분이 어려울 수 있음

**방법 2: overlay에 touch-action 제어**
- `touch-action: none`으로 설정 → 브라우저의 ghost click 합성 억제
- SelectPortal이 없어진 후 발생하는 합성 click을 원천 차단

**방법 3: Radix Vue DialogOverlay의 네이티브 dismiss 메커니즘 활용**
- `DialogOverlay @click` 제거 → `handleInteractOutside`에서 closeOnOverlay 처리
- 단, Radix Vue interactOutside가 SelectPortal 클릭을 외부로 인식하므로 별도 필터링 필요

**방법 4: click 이벤트에 타이밍 필터 추가**
- `pointerdown` 시각 기록 → `click` 발생 시 `pointerdown`이 일정 시간 내 있었는지 확인
- ghost click은 실제 pointerdown 없이 발생하므로 필터링 가능

**추천**: 방법 1(`@pointerdown` 교체) + 방법 4(타이밍 필터) 조합이 가장 안전.

### 재발 방지 메모
- BottomSheet 안에 Portal을 사용하는 컴포넌트(Select, Tooltip, Popover 등)가 있을 때 "ghost click" 버그 발생 가능.
- Radix Vue SelectPortal은 body에 마운트되므로 닫힐 때 ghost click이 overlay에 전달될 수 있음.
- overlay의 dismiss 핸들러는 `@click` 대신 `@pointerdown`을 기준으로 처리하는 것이 안전.
- 터치 환경에서 브라우저 합성 click 이벤트(300ms 딜레이)는 DOM이 변경된 후에도 발화될 수 있음.
