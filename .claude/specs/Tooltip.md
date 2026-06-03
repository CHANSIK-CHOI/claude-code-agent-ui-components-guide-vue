---
name: Tooltip
description: 말풍선 형태의 보조 정보 표시 컴포넌트. dark/primary 두 컬러, top/bottom 위치, alwaysOpen(항상 표시) 모드 지원. alwaysOpen=false 시 Radix Vue TooltipRoot 기반, alwaysOpen=true 시 자체 absolute 구현.
type: atoms
---

## 1. Atomic 계층 & 파일 배치

- **계층**: atoms
- **경로**: `components/atoms/Tooltip.vue`
- **Base/Wrapper 분리**: Base만

---

## 2. 컴포넌트 개요

트리거 요소 주변에 **말풍선(bubble)** 형태의 보조 정보를 띄우는 컴포넌트. dark(#333) / primary(#00ADDB) 두 컬러, top/bottom 위치, 항상 표시(alwaysOpen) 모드를 지원한다.

- `alwaysOpen=false`: Radix Vue `TooltipRoot` 기반 (hover/focus 인터랙션 자동 처리)
- `alwaysOpen=true`: 자체 마크업(wrapper + absolute 말풍선)으로 구현 — 스크롤 시 트리거와 함께 자연 이동

> 이전 "클릭형 툴팁 패널" 컴포넌트는 Popover.vue로 리네임 완료 (2026-05-11). 본 Tooltip은 완전 새로 작성.

---

## 3. 구현 방식

**기본 모드: Radix Vue `TooltipRoot` 래핑. `alwaysOpen=true` 조합일 때만 자체(native) 구현으로 분기.**

- `TooltipProvider` 컴포넌트 내부에 포함 — 레이아웃 수정 불필요

---

**[분기 A] alwaysOpen=false — Radix Vue 방식 (기존과 동일)**

- **portal=false(기본): TooltipPortal 미사용** — TooltipContent를 트리거 DOM 인접 위치에 직접 렌더링
  - 이유: 부모 stacking context 안에서 z-index가 동작 → LayerPopup 앞에 뜨는 문제 없음, 팝업 안에서도 정상 표시
  - 부작용: 부모 요소에 `overflow: hidden`이 있으면 콘텐츠가 잘릴 수 있음
- **portal=true: TooltipPortal 활성화** — `<body>`(또는 `container` prop 지정 요소)에 렌더링
  - 효과: 부모의 `overflow: hidden` 탈출 가능 (예: `.benefit-card__popover-btn` 등 overflow 제약 환경)
  - 제약 1: LayerPopup(`$z-modal: 300`), ToastPopup(`$z-toast: 400`) 안에서 사용 금지 — Portal로 body에 렌더링되면 stacking context 분리로 popup 뒤에 가려질 수 있음
  - 제약 2: portal=true 시 z-index는 `$z-dropdown(100)` — LayerPopup(300)/ToastPopup(400)보다 낮음
  - div 삽입 순서: body 최하순위(append) — popup/toast 뒤에 위치
- `alwaysOpen: true`일 때 `:open="true"` 고정 + `@update:open` 이벤트에서 close 차단
- `avoidCollisions: true` + `collisionPadding: 8` 하드코딩 — viewport 경계 자동 반전
- `align` 변경: `arrowAlign='left'`이면 `align='start'`, `arrowAlign='right'`이면 `align='end'`, `arrowAlign='center'`이면 `align='center'` — Radix Vue TooltipContent의 `align` prop으로 툴팁 전체 위치 제어
- 화살표 SVG 위치: `tooltip__content--arrow-left` / `tooltip__content--arrow-right` modifier class로 CSS 제어. `left` → `left: 2rem` 고정, `right` → `right: 2rem` 고정. (중앙 고정 `left: 50%` 제거)
- `alignOffset`에 `offsetX` 값 전달 (기본 0)
- `sideOffset` 고정값 8px → `offsetY` prop 값으로 교체 (기본값 8 유지, 외부에서 조정 가능)
- **scoped CSS 주의**: Radix Vue는 `TooltipContent`를 런타임 동적 DOM 생성 → Vue scoped 해시(`data-v-*`) 미전달. `:deep()` + `:global()` 이중 선언 필수

---

**[분기 B] alwaysOpen=true — 자체(native) 구현**

Radix Vue 내부 floating-ui `autoUpdate`가 스크롤/리사이즈마다 트리거의 `getBoundingClientRect()`를 재계산하고 `transform`을 갱신하는 문제를 방지하기 위해 Radix Vue 포지셔닝을 우회하는 자체 마크업 분기.

**구조:**
```html
<div class="tooltip__alwaysOpen" style="position: relative; display: flex">
  <div v-bind="triggerAttrs" :aria-describedby="tooltipId">
    <slot name="trigger" />
  </div>
  <div class="tooltip__bubble tooltip__bubble--{color} tooltip__bubble--arrow-{arrowAlign}"
       :style="bubbleStyle"
       role="tooltip"
       :id="tooltipId">
    <span class="tooltip__bubble-text">
      <slot>{{ text }}</slot>
    </span>
    <span class="tooltip__bubble-arrow" aria-hidden="true"><!-- 꼬리 SVG --></span>
  </div>
</div>
```

**포지셔닝 방식:**
- wrapper `tooltip__alwaysOpen`: `position: relative; display: flex`
- 말풍선 `tooltip__bubble`: `position: absolute`
- 좌표 계산 (`bubbleStyle` computed — 인라인 style로 처리):

| 조건 | 스타일 |
|------|--------|
| `side="top"` | `bottom: calc(100% + {offsetY}px)` |
| `side="bottom"` | `top: calc(100% + {offsetY}px)` |
| `arrowAlign="left"` | `left: calc(-2rem + {offsetX}px)` |
| `arrowAlign="right"` | `right: calc(-2rem - {offsetX}px)` |
| `arrowAlign="center"` | `left: 50%; transform: translateX(-50%)` |

- DOM 흐름을 따르므로 스크롤 시 트리거와 함께 자연 이동 — 재계산 없음
- `avoidCollisions` 해당 없음 (CSS 절대 위치 — 자동 반전 없음)
- `portal` prop은 `alwaysOpen=true` 시 무시 (분기 B는 항상 인라인 렌더링)

**접근성 수동 처리 필수:**
- Radix Vue가 자동 부여하는 `role="tooltip"` / `aria-describedby` 연결이 없으므로 직접 마크업에 명시
- 말풍선 `<div role="tooltip" :id="tooltipId">`
- 트리거 슬롯 wrapper에 `:aria-describedby="tooltipId"` 수동 바인딩
- `tooltipId`는 컴포넌트 내부에서 고유값으로 생성 (`Math.random` 또는 카운터 기반)

**제거 항목 (이전 WrapperFix 방식 대비):**
- `contentWrapRef`, `startTransformFix`, `stopTransformFix` 함수 및 관련 watch/lifecycle 훅 전체
- `onMounted` 내 WrapperFix 초기화 로직
- MutationObserver 관련 코드 일체

**scoped CSS:** 자체 마크업(`tooltip__alwaysOpen`, `tooltip__bubble`)은 Vue scoped 해시 정상 전달 → `:deep()` 불필요. 일반 scoped 선택자로 스타일 적용.

---

## 4. Props

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `color` | `'dark' \| 'primary'` | `'dark'` | 말풍선 컬러 타입 |
| `bgColor` | `string` | — | 말풍선 배경 커스텀 색상 (CSS 색상값, 예: `#E4F5F5`). 지정 시 `color` prop의 배경색보다 우선 적용됨. SVG 꼬리 fill에도 동일하게 반영됨 |
| `textColor` | `string` | — | 말풍선 텍스트 커스텀 색상 (CSS 색상값, 예: `#13AFAB`). 지정 시 기본 `$text-white`보다 우선 적용됨 |
| `side` | `'top' \| 'bottom'` | `'top'` | 툴팁 표시 위치 (top = 트리거 위, bottom = 트리거 아래) |
| `arrowAlign` | `'left' \| 'right' \| 'center'` | `'right'` | 화살표 x축 정렬. left = 말풍선 좌측, right = 말풍선 우측, center = 말풍선 중앙. 기본값은 Figma 디자인 기준(우측) |
| `offsetX` | `number` | `0` | 말풍선 전체를 x축으로 이동하는 추가 오프셋(px). 양수 = 오른쪽, 음수 = 왼쪽. [분기 A] Radix Vue `alignOffset`으로 전달 / [분기 B] `bubbleStyle` calc에 반영 |
| `offsetY` | `number` | `8` | 말풍선과 트리거 간 세로 간격(px). [분기 A] `sideOffset`으로 전달 / [분기 B] `bubbleStyle` calc에 반영 |
| `alwaysOpen` | `boolean` | `false` | true이면 페이지 로드 시부터 항상 열려 있고 닫히지 않음. true 시 자체 absolute 구현으로 분기 |
| `text` | `string` | — | 말풍선 텍스트 (default 슬롯 없을 때 fallback) |
| `delayDuration` | `number` | `0` | alwaysOpen=false일 때 hover 후 열리기까지 지연 시간(ms). alwaysOpen=true이면 무시 |
| `portal` | `boolean` | `false` | true이면 `TooltipPortal`을 활성화해 body(또는 `container` 지정 요소)에 렌더링. 부모의 `overflow: hidden` 탈출 가능. false(기본)이면 트리거 DOM 인접 인라인 렌더링. **popup(LayerPopup/ToastPopup) 안에서는 반드시 false 유지**. `alwaysOpen=true` 시에는 무시됨 (자체 구현 분기는 항상 인라인) |
| `container` | `string \| HTMLElement` | — | portal=true일 때 렌더링 대상 컨테이너. 미지정 시 `<body>`. `TooltipPortal`의 `container` prop으로 전달 |

---

## 5. Slots

| 슬롯명 | 필수 | 설명 |
|--------|------|------|
| `trigger` | 필수 | 툴팁을 발동시키는 트리거 요소. [분기 A] as-child로 직접 요소에 이벤트 바인딩 / [분기 B] wrapper 안에 배치 + aria-describedby 수동 연결 |
| `default` | 선택 | 말풍선 텍스트 콘텐츠. 없으면 `text` prop 사용 |

---

## 6. Events

| 이벤트 | 발생 시점 | 비고 |
|--------|---------|------|
| `open` | 툴팁이 열릴 때 | — |
| `close` | 툴팁이 닫힐 때 | `alwaysOpen: true`이면 발생하지 않음 |

---

## 7. Variant

### 컬러

| Variant | 배경색 | Figma 값 |
|---------|--------|---------|
| `dark` | `$text-800` 근사 | `#333333` |
| `primary` | `$color-primary-hover` | `#00ADDB` |

> `bgColor` / `textColor` prop을 지정하면 `color` variant의 배경색·텍스트색보다 우선 적용된다. SVG 꼬리 fill은 `bgColor`가 있으면 `bgColor`, 없으면 기존 `color` 매핑값을 따른다.

### 위치

| Variant | 꼬리 위치 | 설명 |
|---------|---------|------|
| `top` | 말풍선 하단 + 꼬리 180도 회전 | 트리거 위에 말풍선 |
| `bottom` | 말풍선 상단 + 꼬리 회전 없음 | 트리거 아래에 말풍선 |

### 화살표 정렬 (arrowAlign)

| arrowAlign | 설명 | [분기 A] Radix align 매핑 | [분기 B] CSS |
|-----------|------|----------------|------|
| `left` | 화살표가 말풍선 **좌측**에 위치 | `align="start"` + CSS `left: 2rem` | `left: calc(-2rem + offsetX px)` |
| `right` | 화살표가 말풍선 **우측**에 위치 — 기본값 | `align="end"` + CSS `right: 2rem` | `right: calc(-2rem - offsetX px)` |
| `center` | 화살표가 말풍선 **중앙**에 위치 | `align="center"` (Radix Vue 말풍선 전체 중앙 정렬) | `left: 50%; transform: translateX(-50%)` |

> `side` + `arrowAlign` 조합으로 6방향 표현: top+left(상좌), top+right(상우), top+center(상중), bottom+left(하좌), bottom+right(하우), bottom+center(하중)

---

## 8. 꼬리(Arrow) SVG

사용자 제공 SVG (꼭짓점이 위를 향하는 삼각형, 11×10px):

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="11" height="10" viewBox="0 0 11 10" fill="none">
  <path d="M3.73475 0.999999C4.50455 -0.333335 6.42905 -0.333333 7.19885 1L10.663 7C11.4328 8.33333 10.4705 10 8.9309 10L2.00269 10C0.463093 10 -0.499156 8.33333 0.270645 7L3.73475 0.999999Z" fill="#00ADDB"/>
</svg>
```

**방향 규칙**:
- `side="bottom"` (꼬리가 말풍선 위): 회전 없음 (꼭짓점 위 그대로)
- `side="top"` (꼬리가 말풍선 아래): `transform: rotate(180deg)`

**fill 색상**: `:fill` 바인딩으로 동적 처리 (분기 A/B 동일 computed 재사용)
- `bgColor` prop 지정 시 → `bgColor` 값 우선
- `bgColor` 미지정 + `color="dark"` → `#333333`
- `bgColor` 미지정 + `color="primary"` → `#00ADDB`

구현: `<svg>` 인라인 삽입, inline SVG + computed fill

---

## 9. 애니메이션

**[분기 A] alwaysOpen=false — Radix Vue `data-state` 기반 CSS fade:**

- `[data-state="delayed-open"]` / `[data-state="instant-open"]` → `tooltipFadeIn`
- `[data-state="closed"]` → `tooltipFadeOut`

```scss
@keyframes tooltipFadeIn  { from { opacity: 0; } to { opacity: 1; } }
@keyframes tooltipFadeOut { from { opacity: 1; } to { opacity: 0; } }
```

duration: `$duration-fast`

**[분기 B] alwaysOpen=true — 애니메이션 없음:**

`data-state` 속성이 없으므로 위 애니메이션을 적용하지 않는다. 말풍선은 마운트 즉시 `opacity: 1`로 표시되며 별도 fade 없음.

---

## 10. 텍스트 처리

- `white-space: normal` — 줄바꿈 허용
- `word-break: keep-all` — 한글 단어 단위 줄바꿈

---

## 11. 상태(State)

| 상태 | 조건 | 동작 | 구현 |
|------|------|------|------|
| closed | 기본 | 말풍선 숨김 | [분기 A] Radix Vue |
| open (hover) | 트리거에 마우스 올림 | 말풍선 fade-in | [분기 A] Radix Vue |
| open (focus) | 트리거에 키보드 포커스 | 말풍선 fade-in | [분기 A] Radix Vue |
| always-open | `alwaysOpen: true` | 마운트 즉시 표시, 스크롤 시 트리거와 함께 자연 이동 | [분기 B] 자체 absolute 마크업 |

---

## 12. overflow / collision 처리

**[분기 A] alwaysOpen=false:**
- `avoidCollisions: true` (하드코딩) — viewport 경계 자동 반전
- `collisionPadding: 8` (하드코딩) — 화면 가장자리 최소 8px 여백
- `sideOffset` — `offsetY` prop 값으로 동적 처리 (기본값 8px)

**[분기 B] alwaysOpen=true:**
- `avoidCollisions`, `collisionPadding` 해당 없음 (CSS 절대 위치 — 자동 반전 없음)
- `offsetY` → `bubbleStyle` calc에 반영

---

## 13. attrs 위임 전략 (Radix Vue 3단계)

`defineOptions({ inheritAttrs: false })` 적용

**[분기 A] alwaysOpen=false (Radix Vue 방식)**

| 단계 | 대상 attrs | 위임 위치 |
|------|-----------|---------|
| 1단계 | `defaultOpen`, `disableHoverableContent` | `TooltipRoot` |
| 2단계 | `aria-*`, `tabindex`, `data-*` 등 나머지 | `TooltipTrigger` |
| 3단계 | `side`, `align`(arrowAlign에서 파생: left→start, right→end), `alignOffset`(offsetX), `sideOffset`(offsetY), `avoidCollisions`, `collisionPadding` | `TooltipContent` |

**[분기 B] alwaysOpen=true (자체 구현)**

- Radix Vue `TooltipContent` 미사용 → 3단계 위임 불필요
- 2단계 attrs(`aria-*`, `tabindex`, `data-*`)는 트리거 슬롯 wrapper에 `v-bind="triggerAttrs"`로 전달
- 단, `aria-describedby`는 자체 tooltip 콘텐츠 요소의 `id`(`tooltipId`)와 수동 연결 필요 (Radix 자동 처리 없음)

---

## 14. 접근성

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| role | [분기 A] Radix 방식 | `role="tooltip"` — Radix Vue TooltipContent 자동 부여 |
| role | [분기 B] 자체 구현 | `role="tooltip"` — 자체 마크업 `<div role="tooltip">` 에 직접 명시 필수 |
| 연결 | [분기 A] Radix 방식 | `aria-describedby` 연결 — Radix Vue 자동 처리 |
| 연결 | [분기 B] 자체 구현 | 말풍선 `<div>`에 고유 `id` 부여 (`tooltipId`), 트리거 요소에 `:aria-describedby="tooltipId"` 수동 바인딩 필수 |
| 키보드 | [분기 A] Radix 방식 | 포커스 시 열림, ESC 닫기 — Radix Vue 자동 처리 |
| 키보드 | [분기 B] 자체 구현 | `alwaysOpen=true`이므로 열림/닫힘 키보드 인터랙션 없음. 트리거는 평소와 동일하게 포커스 가능 |
| 트리거 아이콘 | 항상 | `aria-label` 필수 — 사용처 책임 |

---

## 15. 디자인 토큰 매핑

| 영역 | Figma 값 | 토큰 |
|------|---------|------|
| dark 배경 | `#333333` | `$text-800` |
| primary 배경 | `#00ADDB` | `$color-primary-hover` |
| 텍스트 (기본) | `#FFFFFF` | `$text-white` |
| 배경 커스텀 | (사용처 지정) | `bgColor` prop 인라인 style로 적용 — 토큰 없음, raw CSS 값 직접 수신 |
| 텍스트 커스텀 | (사용처 지정) | `textColor` prop 인라인 style로 적용 — 토큰 없음, raw CSS 값 직접 수신 |
| 폰트 크기 | `12px` | `$font-size-caption1` |
| 폰트 굵기 | `700` | `$font-weight-bold` |
| 내부 패딩 | `6px 12px` | rem 직접 사용 (0.6rem 1.2rem) |
| 모서리 | `99px` | `$radius-full` |
| z-index (alwaysOpen=false, portal=false) | — | `$z-tooltip(500)` — 부모 stacking context 안에서 동작 (Radix 인라인 렌더링) |
| z-index (alwaysOpen=false, portal=true) | — | `$z-dropdown(100)` — body 렌더링 시 LayerPopup(300)/ToastPopup(400)보다 낮게 유지 |
| z-index (alwaysOpen=true) | — | `$z-tooltip(500)` — 자체 absolute 말풍선에 적용. wrapper(`tooltip__alwaysOpen`)가 `position: relative`이므로 부모 stacking context 안에서 동작. `overflow: hidden` 부모 안에서 사용 시 잘릴 수 있음 |
| 애니메이션 | — | `$duration-fast` (alwaysOpen=false만 해당) |

---

## 16. 사용 예시

```vue
<!-- 항상 표시 모드 (primary, 아래 / 화살표 우측 — Figma 기본 케이스) -->
<!-- alwaysOpen=true → [분기 B] 자체 absolute 구현으로 동작. 스크롤 시 트리거와 함께 이동 -->
<Tooltip always-open color="primary" side="bottom" arrow-align="right" text="매월 67,200원 혜택을 받을 수 있어요!">
  <template #trigger>
    <button type="button">구독 신청</button>
  </template>
</Tooltip>

<!-- hover/focus 모드 (dark, 위 / 화살표 우측 + y 간격 12px) -->
<Tooltip color="dark" side="top" arrow-align="right" :offset-y="12" text="구독 시 최대 N% 할인된 가격으로 구매가능해요">
  <template #trigger>
    <button type="button" aria-label="할인 안내">
      <IconInfo />
    </button>
  </template>
</Tooltip>

<!-- 화살표 좌측 + x축 이동 -->
<Tooltip color="primary" side="bottom" arrow-align="left" :offset-x="8" text="왼쪽에 화살표">
  <template #trigger>
    <button type="button">버튼</button>
  </template>
</Tooltip>

<!-- 슬롯으로 텍스트 주입 -->
<Tooltip color="primary" always-open side="bottom" arrow-align="right">
  <template #trigger>
    <button type="button">버튼</button>
  </template>
  매월 <strong>67,200원</strong> 혜택
</Tooltip>

<!-- portal 모드 — overflow: hidden 부모 탈출이 필요한 경우 (alwaysOpen=false만 유효) -->
<!-- ⚠️ popup(LayerPopup/ToastPopup) 안에서는 portal=true 사용 금지 -->
<Tooltip :portal="true" color="primary" side="bottom" arrow-align="right" text="혜택 안내">
  <template #trigger>
    <button type="button" class="benefit-card__popover-btn" aria-label="혜택 안내">
      <IconInfo />
    </button>
  </template>
</Tooltip>

<!-- 커스텀 배경·텍스트 컬러 지정 (color="dark" variant 위에 덮어씀) -->
<Tooltip always-open bg-color="#E4F5F5" text-color="#13AFAB" side="bottom" arrow-align="right" text="구독 혜택 안내">
  <template #trigger>
    <button type="button" aria-label="혜택 안내"><IconInfo /></button>
  </template>
</Tooltip>
```
