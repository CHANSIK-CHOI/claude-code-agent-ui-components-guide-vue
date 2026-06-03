---
name: Popover
description: 클릭형 팝오버 패널 컴포넌트 — 트리거 버튼 클릭 시 버튼 바로 아래, 화면 좌측 끝부터 우측 끝까지 전체 너비로 설명 패널이 열림. Radix Vue 기반.
type: atoms
---

## 0. Atomic 계층 & 파일 배치

- **계층**: atoms
- **경로**: `components/atoms/Popover.vue`
- **Base/Wrapper 분리**: Base만

---

## 1. 컴포넌트 개요

정보 보충이 필요한 UI 요소 옆에 배치하는 **클릭형 팝오버 패널**이다. 사용자가 트리거 버튼(물음표 아이콘 등)을 클릭하면 추가 설명 패널이 열리고, 패널 내부 닫기 버튼 또는 외부 클릭으로 닫힌다.

---

## 2. 영역 구성 (Area Map)

| 영역 | 설명 | 필수 여부 |
|------|------|---------|
| ① Trigger | 팝오버를 여는 버튼 영역. `#trigger` 슬롯으로 아이콘·텍스트 자유 삽입 | 필수 |
| ② Panel Header | 제목 텍스트 + 닫기(X) 버튼 행. `title` prop 제공 시만 렌더 | 조건부 |
| ③ Panel Body | 설명 텍스트 또는 커스텀 콘텐츠. 기본 슬롯으로 자유 삽입 | 필수 |
| ④ Close Button | Panel Header 우측 X 아이콘 버튼. 항상 존재 (title 없으면 패널 우측 상단 독립 배치) | 필수 |

---

## 3. Props

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `title` | `string` | — | 패널 상단 제목 텍스트. 미제공 시 Header 행 미렌더 |
| `open` | `boolean` | — | 외부 제어 모드 (v-model:open 연동) |
| `defaultOpen` | `boolean` | `false` | 초기 열림 상태 (비제어 모드) |
| `portal` | `boolean` | `false` | true이면 `PopoverPortal`을 활성화해 body(또는 `container` 지정 요소)에 렌더링. 부모의 `overflow: hidden` 탈출 가능. false(기본)이면 트리거 DOM 인접 인라인 렌더링. **popup(LayerPopup/ToastPopup) 안에서는 반드시 false 유지** |
| `container` | `string \| HTMLElement` | — | portal=true일 때 렌더링 대상 컨테이너. 미지정 시 `<body>`. `PopoverPortal`의 `container` prop으로 전달 |

> 위치·너비 관련 props 없음 — 고정값: `side="bottom"`, 패널 콘텐츠 `max-width: 600px / margin: 0 auto`
> x축 포지셔닝: portal=false(기본, 인라인 렌더링) 시 Radix가 여전히 wrapper에 `transform`을 주입하므로 MutationObserver + CSS override(`!important`) 유지 필요. portal=true 시에는 body 렌더링이므로 동일한 보정 로직이 필요한지 실제 구현 시 검증 필요.

---

## 4. Slots

| 슬롯명 | 필수 | 설명 |
|--------|------|------|
| `trigger` | 필수 | 팝오버를 여는 트리거 요소 |
| `default` | 필수 | 패널 본문 콘텐츠 |

---

## 5. Events

| 이벤트 | 발생 시점 | 페이로드 |
|--------|---------|---------|
| `open` | 패널이 열린 직후 | — |
| `close` | 패널이 닫힌 직후 | — |
| `update:open` | open 상태 변경 시 | `boolean` |

---

## 6. 동작 규칙

- **클릭 전용 트리거**: hover/focus로 열리지 않음. Radix Vue의 open 상태를 클릭 이벤트로만 제어
- **구현 방식**: Radix Vue `Popover` (Stable) — `PopoverRoot > PopoverTrigger + PopoverContent` 구조 사용
  - **portal=false(기본): PopoverPortal 미사용** — PopoverContent를 트리거 DOM 인접 위치에 직접 렌더링
    - 이유: 부모 stacking context 안에서 z-index 동작 → LayerPopup 안에서도 Popover가 정상 표시됨
    - 추가 주의: Portal 없이도 Radix Vue는 여전히 wrapper에 `transform`을 주입하므로 MutationObserver와 CSS override(`!important`)가 여전히 필요함
    - 부작용: 부모 요소에 `overflow: hidden`이 있으면 패널이 잘릴 수 있음
  - **portal=true: PopoverPortal 활성화** — `<body>`(또는 `container` prop 지정 요소)에 렌더링
    - 효과: 부모의 `overflow: hidden` 탈출 가능 (예: `.benefit-card__popover-btn` 등 overflow 제약 환경)
    - 제약 1: LayerPopup(`$z-modal: 300`), ToastPopup(`$z-toast: 400`) 안에서 사용 금지 — Portal로 body에 렌더링되면 popup 뒤에 가려질 수 있음
    - 제약 2: portal=true 시 z-index는 `$z-dropdown(100)` 유지 (기존과 동일) — LayerPopup(300)/ToastPopup(400)보다 이미 낮음
    - div 삽입 순서: body 최하순위(append) — popup/toast 뒤에 위치
    - portal=true 시 MutationObserver + CSS override 필요 여부: 실제 구현 시 검증 필요 (body 렌더링이므로 transform 보정 동작이 달라질 수 있음)
  - `PopoverContent`에 `:forceMount="true"` prop 적용 → 닫힘 애니메이션 완료 보장
- **패널 너비**: `__panel`은 `position: fixed; left: 0; width: 100vw`로 viewport 전체를 차지하는 투명 컨테이너. `__inner`는 `max-width: 600px(60rem); margin: 0 auto`로 중앙 정렬 — popup-container 패턴과 동일
- **패널 x축 위치**: 트리거 위치와 무관하게 `__panel`은 항상 `left: 0`에서 시작. `__inner`가 화면 중앙에 정렬되어 출력됨
  - Portal 없이도 Radix Vue가 여전히 wrapper에 `transform`을 주입하므로 MutationObserver 유지
  - CSS: `position: fixed !important; left: 0 !important; width: 100vw !important;` + MutationObserver로 x축 0 보정
  - `avoid-collisions="false"` 유지 — x축 자동 반전 차단 (패널이 항상 좌측 고정 유지)
- **패널 y축 위치**: 트리거 버튼 바로 아래 (`side="bottom"`, 현행 유지)
- **닫힘 조건**: ① 닫기(X) 버튼 클릭 ② 패널 외부 클릭(Dismiss) ③ `Escape` 키
- **초기 렌더 flash 방지**: `forceMount="true"` + `data-state="closed"` 조합에서 닫힘 애니메이션(`popoverSlideDownAndFade`)의 `from { opacity: 1 }` 키프레임이 초기 로드 시 즉시 실행되어 flash가 발생한다. `opacity: 0` 기본값을 설정해도 CSS 애니메이션의 `from` 프레임이 이를 덮어쓰므로 CSS 단독으로는 해결 불가.
  - **해결책**: JS로 `data-has-been-opened` attribute를 관리 — `watch(proxyOpen, val => true)` 시점에 `panelInnerRef.value.dataset.hasBeenOpened = 'true'` 추가. 닫힘 애니메이션 CSS는 `[data-has-been-opened]` 속성이 있을 때만 적용.
  - **CSS 패턴**:
    - `[data-state='closed'] .popover__inner:not([data-has-been-opened])` → `opacity: 0` (즉시 숨김, 애니메이션 없음)
    - `[data-state='closed'] .popover__inner[data-has-been-opened]` → `animation: popoverSlideDownAndFade` (한 번 열린 후 닫힐 때만)
  - **동작 흐름**: 초기 로드 → 애니메이션 없이 즉시 숨김 → 첫 열림 시 `data-has-been-opened` 추가 → 이후 닫힐 때부터 닫힘 애니메이션 정상 작동
  - **`watch` 브랜치 책임 분리**:
    - `val === true` 브랜치: `document.addEventListener`, `nextTick` 후 `data-has-been-opened` 마킹, `startWrapperFix()` 호출
    - `val === false` 브랜치: `document.removeEventListener` 호출, `stopWrapperFix()`는 **즉시 호출 금지** — `setTimeout(250)` 후 지연 호출
- **z-index**: `$z-dropdown (100)` 사용 — Popup(`$z-modal: 300`), Toast(`$z-toast: 400`)보다 낮게 쌓임
- **애니메이션**: `data-[state=open]` / `data-[state=closed]` 기반 CSS keyframe 적용
  - `open`: fadeIn + slideUpAndFade (아래→위 슬라이드 + 페이드인)
  - `closed`: fadeOut + slideDownAndFade (위→아래 슬라이드 + 페이드아웃)
  - `will-change: transform, opacity` 적용
  - `data-state=closed` 상태에서 `pointer-events: none` 추가
  - **닫힘 중 MutationObserver 유지 필수**: `proxyOpen`이 `false`가 되는 즉시 `stopWrapperFix()`를 호출하면, Radix가 그 직후 wrapper의 `transform`을 원본 x축 오프셋이 포함된 값(`translate(Xpx, Ypx)`)으로 복원하는 타이밍 경합이 발생한다. observer가 해제된 상태이므로 이 변화를 override할 수 없어 닫힘 애니메이션이 잘못된 x축 위치에서 재생된다.
  - **해결책**: `stopWrapperFix()`를 닫힘 애니메이션이 완료된 후에 호출한다. `$duration-base: 250ms`에 맞춰 `setTimeout(stopWrapperFix, 250)` 지연 호출.
- `title` 없을 때: 닫기 버튼은 패널 우측 상단에 독립 배치
- **외부 v-model:open 충돌 금지**: 외부에서 `v-model:open`을 `false`로 설정할 때 Radix 내부 `update:open` 이벤트와 충돌하지 않아야 한다.
  - 원인 패턴: 닫기 버튼이 `PopoverTrigger`의 DOM 자식으로 들어가면 Radix가 트리거 클릭으로 인식 → 부모가 `false`를 set하더라도 Radix 내부 토글이 즉시 `true`로 되돌림 → 열림 상태로 복귀하는 버그 발생
  - 제약: 외부 제어 닫기 버튼은 반드시 `PopoverTrigger` DOM 트리 외부에 배치해야 함. 가이드 페이지의 "외부 버튼" 패턴도 이 원칙을 따른다.
  - 추가 제약: `handleClose()`는 `internalOpen.value = false` 직접 세팅 + `emit('update:open', false)` 양쪽 모두 실행해야 제어/비제어 양 모드에서 닫힘이 보장됨 (Radix `handleOpenChange` 경유만으로는 외부 제어 모드에서 내부 상태가 갱신되지 않을 수 있음)

---

## 7. 디자인 토큰 매핑 (Figma node: 40004237:4714)

| 영역 | Figma 시각값 | 시맨틱 토큰 |
|------|------------|------------|
| 패널 배경 | `#ffffff` | `$bg-primary` |
| 패널 테두리 | `#BECCD2` | `$border-default` |
| 패널 라운드 | `8px → 0.8rem` | `$radius-md` |
| 패널 내부 패딩 | `10px → 1.0rem` | `$spacing-sm` |
| 텍스트 색상 | `#666666` | `$text-secondary` |
| 제목 폰트 사이즈 | `13px` | `$font-size-body3` |
| 본문 폰트 사이즈 | `13px` | `$font-size-body3` |
| 폰트 굵기 | Medium(500) | `$font-weight-medium` |
| 줄높이 | `1.3` | `$line-height-base` |
| 닫기 아이콘 크기 | `16×16px` | Icon 컴포넌트 size prop |
| 패널 너비 (컨테이너) | viewport 전체 | `100vw` 고정값 (투명 컨테이너) |
| 패널 내용 최대 너비 | 600px | `max-width: 60rem` |
| 패널 내용 수평 정렬 | 중앙 정렬 | `margin: 0 auto` |

---

## 8. 접근성 요구사항

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| 트리거 키보드 접근 | 항상 | `Tab` 포커스, `Enter`·`Space`로 열기/닫기 |
| 트리거 대체 텍스트 | 아이콘만 있을 때 | `aria-label` 필수 (사용처에서 전달) |
| 닫기 버튼 | 항상 | `aria-label="닫기"` 필수 |
| Escape 닫기 | 패널 열린 상태 | Radix Vue 기본 제공 |
| 포커스 복귀 | 패널 닫힌 후 | 트리거로 자동 복귀 (Radix Vue 기본 제공) |
| 포커스 표시 | 키보드 포커스 시 | `focus-visible` 스타일 필수 |

---

## 9. 사용 예시

```vue
<!-- 가이드 표준 트리거: Icon 컴포넌트 + tooltip.svg -->
<!-- import Icon from '@nd/components/atoms/Icon.vue' -->
<!-- import TooltipSvg from '@nd/assets/icons/tooltip.svg?component' -->

<!-- 기본 사용 (title + 본문) -->
<Popover title="구독회원 혜택가 안내">
  <template #trigger>
    <button type="button" aria-label="구독 혜택 안내">
      <Icon size="sm"><TooltipSvg /></Icon>
    </button>
  </template>
  상품 정기구독을 결제완료한 회원님에게 단품 50% 혜택 쿠폰을 제공합니다.
</Popover>

<!-- title 없이 본문만 -->
<Popover>
  <template #trigger>
    <button type="button" aria-label="배송 안내">
      <Icon size="sm"><TooltipSvg /></Icon>
    </button>
  </template>
  단건 배송: 자사 브랜드 7%, 제휴 브랜드 15%
</Popover>

<!-- 외부 제어 모드 — 닫기 버튼은 반드시 PopoverTrigger 외부에 배치 -->
<Popover v-model:open="isOpen">
  <template #trigger>
    <button type="button">안내</button>
  </template>
  내용입니다.
</Popover>
<!-- ✅ 외부 닫기 버튼: PopoverTrigger DOM 외부에 있어야 Radix 토글 이벤트 충돌 없음 -->
<button type="button" @click="isOpen = false">닫기 (외부 버튼)</button>
```

---

## 10. 구현 복잡도 신호

**PopoverPortal 제거 후 인라인 렌더링 주의 사항**

| 항목 | 내용 |
|------|------|
| PopoverContent 배치 | `PopoverRoot > PopoverTrigger + PopoverContent` — PopoverPortal 미포함 |
| x축 포지셔닝 | Portal 없이도 Radix가 wrapper에 transform 주입 → MutationObserver 유지. `__panel`: `position: fixed !important; left: 0 !important; width: 100vw !important;` + Observer로 x축 0 보정. `__inner`: `max-width: 60rem; margin: 0 auto` — 화면 중앙 정렬. **닫힘 시 주의**: `proxyOpen`이 `false`가 된 직후 Radix가 wrapper transform을 원본값(`translate(Xpx, Ypx)`)으로 복원하므로, `stopWrapperFix()`는 반드시 닫힘 애니메이션 완료 후 호출해야 한다. |
| **`stopWrapperFix()` 해제 타이밍** | `watch(proxyOpen, val)` false 브랜치에서 즉시 호출 금지. 닫힘 직후 Radix가 wrapper style을 재계산하는 타이밍 경합이 발생하기 때문. `setTimeout(stopWrapperFix, 250)` — `$duration-base`와 동일한 딜레이로 지연 호출. |
| data-state 애니메이션 | `[data-state=open]` / `[data-state=closed]` CSS 속성 선택자로 keyframe 제어 — `:deep()` 필수 (Radix 동적 DOM 특성상 Portal 유무 무관) |
| 닫힘 애니메이션 보장 | `:forceMount="true"` prop 적용 → DOM에 항상 마운트, `v-show`처럼 숨김 처리 |
| **초기 flash 방지 (forceMount 부작용)** | `forceMount="true"` + `data-state="closed"` 초기 렌더 시 닫힘 애니메이션 `from { opacity: 1 }`이 즉시 실행 → flash. JS로 `data-has-been-opened` attribute 관리: `watch(proxyOpen)` val=true 시점에 `panelInnerRef.value.dataset.hasBeenOpened = 'true'` 설정 → 닫힘 애니메이션은 `[data-has-been-opened]` 있을 때만 적용, 없으면 즉시 `opacity: 0` |
| 외부 클릭 닫기 | Radix Vue DismissableLayer가 인라인 배치에서도 정상 작동 — 직접 구현 불필요 |
| Escape 닫기 | Radix Vue Popover 기본 제공 — 직접 구현 불필요 |
| z-index | `$z-dropdown (100)` 사용 — Portal 제거 후 부모 stacking context 안에서 동작. LayerPopup(300) 안에서 Popover 사용 시 자연스럽게 팝업 영역 안에 렌더링 |
| overflow: hidden 주의 (portal=false) | 부모에 `overflow: hidden`이 있는 경우 패널이 잘릴 수 있음. 해당 부모의 `overflow`를 조정하거나 `portal=true`로 전환 |
| portal=true 모드 주의 | popup(LayerPopup/ToastPopup) 안에서 portal=true 사용 금지. body 렌더링 시 stacking context 분리로 popup 뒤에 가려짐. portal=true 시 MutationObserver 보정 동작 변화 여부는 구현 시 검증 필요 |
| 외부 제어 닫기 버그 방지 | 외부 버튼은 `PopoverTrigger` DOM 자식으로 절대 배치 금지. Radix가 트리거 클릭으로 인식해 `update:open(true)` 재발화하므로 닫히자마자 열리는 버그 발생 |
