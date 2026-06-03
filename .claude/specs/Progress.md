---
name: Progress
description: 수치화된 진행률을 시각적으로 전달하는 가로형 진행 바 컴포넌트. Radix Vue ProgressRoot 래핑. tooltipText prop으로 Tooltip을 직접 통합하거나, indicator 슬롯으로 임의 HTML을 주입할 수 있다.
type: component
atomic_layer: atoms
---

## 1. 컴포넌트 개요

로딩, 업로드, 단계 완료 등 수치화된 진행률을 시각적으로 전달하는 가로형 진행 바 컴포넌트입니다.
Radix Vue `ProgressRoot` + `ProgressIndicator`를 래핑하며, 접근성(ARIA) 처리는 Radix Vue에 위임합니다.

- **파일 경로**: `components/atoms/Progress.vue`
- **barrel export**: `components/atoms/index.ts`

---

## 2. 영역 구성

- ① **트랙(Track)** — 진행 바의 배경 영역 (전체 길이). 항상 표시. 필수
- ② **인디케이터(Indicator)** — 진행률에 따라 좌→우로 채워지는 그라데이션 바. 항상 표시. 필수
- ③ **인디케이터 슬롯(Indicator Slot)** — 진행 위치(value%)에 따라 수평으로 이동하는 레이어. 조건부 (`tooltipText` prop 또는 `#indicator` 슬롯 주입 시에만 표시)
  - `tooltipText` prop이 있으면: Progress 내부에서 Tooltip을 `alwaysOpen=true`로 자동 마운트. `progress__tooltipAnchor`(빈 span)가 `#trigger` slot anchor로 자동 제공된다.
  - `tooltipText` 없고 `#indicator` 슬롯만 있으면: 슬롯 콘텐츠를 그대로 렌더링 (기존 동작 유지)
  - `tooltipText`와 `#indicator` 슬롯이 동시에 있으면: `tooltipText` 기반 Tooltip이 우선 표시되고 슬롯은 무시된다.
  - 배치 위치: 트랙 바깥 래퍼(`progress__wrap`) 안의 절대 포지셔닝 레이어 — 트랙의 `overflow: hidden`에 잘리지 않도록 ProgressRoot 외부에 배치

---

## 2-1. Slot 목록

| 슬롯명 | 설명 | 기본값 |
|--------|------|--------|
| `indicator` | 진행 위치(displayValue%)에 절대 포지셔닝으로 이동하는 레이어. `tooltipText` prop이 없을 때만 활성. Tooltip 외 다른 콘텐츠 주입 시 사용. 미주입 시 미렌더링 | 없음 |

**슬롯 구현 방식**
- 트랙(`ProgressRoot`)과 형제인 래퍼 div(`progress__wrap`) 안에, 슬롯 콘텐츠를 담는 절대 위치 레이어(`progress__indicatorSlot`)를 배치한다.
- `left` 값을 `max(0%, displayValue / max * 100 + '%')` 로 바인딩해 진행률에 따라 수평 이동. `displayValue` 기반으로 마운트 애니메이션과 동기화.
- `max(0%, ...)` 클램핑으로 value=0 시 슬롯이 트랙 왼쪽 바깥으로 이탈하는 것을 방지.
- `transform: translateX(-50%)` 로 슬롯 중앙을 진행률 끝 지점에 정렬한다.
- `overflow: hidden` 이 있는 ProgressRoot 바깥에 두어 Tooltip 말풍선 등이 잘리지 않도록 한다.
- `tooltipText` prop이 있으면 `v-if="tooltipText"` 분기가 우선 렌더링되어 Tooltip을 내부 마운트한다. `v-else-if="$slots.indicator"` 분기로 슬롯을 조건부 렌더링해 두 경로가 상호 배타적으로 동작한다.
- `progress__tooltipAnchor`는 `<span class="progress__tooltipAnchor" />` 형태의 빈 span으로, Tooltip `#trigger` 슬롯에 주입된다. 이 anchor가 말풍선 위치 계산의 기준점이 된다.

**사용 예시**
```vue
<!-- tooltipText prop 방식 (권장) -->
<Progress :value="60" :max="100" tooltip-text="60%" />

<!-- tooltipText + 외관 제어 -->
<Progress
  :value="60"
  :max="100"
  tooltip-text="60%"
  tooltip-side="top"
  tooltip-color="primary"
  tooltip-arrow-align="center"
/>

<!-- #indicator 슬롯 방식 (Tooltip 외 다른 콘텐츠 주입 시) -->
<Progress :value="60" :max="100">
  <template #indicator>
    <span class="myCustomBubble">60%</span>
  </template>
</Progress>
```

---

## 3. Props

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `value` | `number` | `0` | 현재 진행값 (0~max 범위) |
| `max` | `number` | `100` | 진행 바의 최대값 |
| `getValueLabel` | `(value: number, max: number) => string` | — | 보조기기에 전달할 레이블 커스텀 함수 (예: "50% 완료") |

> `v-bind="$attrs"` → `ProgressRoot`에 단일 위임 (서브 컴포넌트가 Root/Indicator 2개뿐이며 인터랙티브 요소 없음)

**Tooltip 통합 props** — `tooltipText`가 있을 때만 유효. 없으면 무시됨.

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `tooltipText` | `string` | — | 지정 시 Progress 내부에서 Tooltip을 `alwaysOpen=true`로 자동 마운트. 미지정 시 Tooltip 없음 |
| `tooltipSide` | `'top' \| 'bottom'` | `'top'` | Tooltip 말풍선 방향. Tooltip의 `side` prop과 동일 |
| `tooltipColor` | `'dark' \| 'primary'` | `'dark'` | Tooltip 말풍선 색상 variant. Tooltip의 `color` prop과 동일 |
| `tooltipArrowAlign` | `'left' \| 'center' \| 'right'` | `'center'` | Tooltip 화살표 정렬. Tooltip의 `arrowAlign` prop과 동일 |
| `tooltipOffsetX` | `number` | `0` | Tooltip x축 오프셋(px). Tooltip의 `offsetX` prop과 동일 |
| `tooltipOffsetY` | `number` | `8` | Tooltip y축 오프셋(px). Tooltip의 `offsetY` prop과 동일 |
| `tooltipBgColor` | `string` | — | Tooltip 배경 커스텀 색상(CSS 색상값). Tooltip의 `bgColor` prop과 동일. 지정 시 `tooltipColor`보다 우선 |
| `tooltipTextColor` | `string` | — | Tooltip 텍스트 커스텀 색상(CSS 색상값). Tooltip의 `textColor` prop과 동일. 미지정 시 기본 `$text-white` |

---

## 4. Variant

Size variant 없음 — 단일 사이즈.

---

## 5. 상태(State)

| 상태 | 조건 | 시각적 변화 |
|------|------|------------|
| default | 항상 | 인디케이터가 진행률만큼 너비를 채움 |

---

## 6. 디자인 스펙

| 항목 | 값 | 비고 |
|------|-----|------|
| 트랙 높이 | `0.6rem` | 고정값 |
| 트랙 배경 | `$bg-tertiary` | |
| 트랙 border-radius | `99px` | |
| 인디케이터 배경 | `linear-gradient(90deg, #19C2EF 0%, #A2EFD0 100%)` | 토큰 없음 — SCSS 인라인 선언 |
| 인디케이터 border-radius | `99px` | |
| 인디케이터 너비 전환 | CSS `transition` | 부드러운 진행률 변화 |
| 컴포넌트 너비 | `width: 100%` | 부모가 결정 |
| 래퍼(`progress__wrap`) | `position: relative; width: 100%` | 트랙과 인디케이터 슬롯의 공통 기준 컨테이너 |
| `progress__indicatorSlot` | `position: absolute; top: 50%; transform: translateX(-50%) translateY(-50%)` | 슬롯 중앙을 진행률 끝에 정렬. `left`는 스크립트로 바인딩. CSS `transition` 적용해 인디케이터와 동기화 |
| 슬롯 레이어 z-index | 트랙보다 위 | Tooltip 말풍선이 트랙 위에 표시되어야 하므로 퍼블리셔가 컨텍스트에 맞게 지정 |

---

## 7. 동작 규칙

- `value`가 `0`이면 인디케이터 너비 0
- `value`가 `max`와 같으면 인디케이터가 트랙 가득 채움
- `value`는 Radix Vue가 내부적으로 0~max 범위로 클램핑
- 인디케이터 너비는 `transform: translateX(-{100-percentage}%)` 방식
  - 예: 50% → `translateX(-50%)`, 0% → `translateX(-100%)`, 100% → `translateX(0%)`
- **마운트 애니메이션**: 컴포넌트 마운트 시 내부 displayValue를 0으로 시작하고, setTimeout(500ms) 후 실제 `value`로 전환. CSS transition이 자연스럽게 0→실제값 애니메이션을 처리함.
  - `value` prop이 외부에서 변경될 때도 CSS transition으로 부드럽게 전환됨 (watch로 displayValue 동기화)
  - 이 패턴은 Radix Vue 공식 예시와 동일 (ref + setTimeout + v-model)
- **indicator 슬롯 이동**: `progress__indicatorSlot`의 `left`는 `max(0%, displayValue / max * 100 + '%')` 로 바인딩.
  `displayValue` 기반이므로 마운트 애니메이션(0→value)과 동기화되어 Tooltip이 인디케이터 끝을 따라 이동한다.
  CSS `transition`을 `left` 속성에도 적용해 인디케이터 전환과 동일한 속도로 부드럽게 이동.
- **value=0 클램핑**: `max(0%, ...)` 처리로 value=0 시 슬롯이 왼쪽 바깥으로 이탈하지 않도록 컴포넌트 내부에서 자동 처리.
- **tooltipText 존재 시 Tooltip 자동 마운트**: `tooltipText` prop이 있으면 `progress__indicatorSlot` 안에 `<Tooltip :always-open="true" />` 를 자동 마운트한다. 이 때 Tooltip의 `#trigger` 슬롯에 `<span class="progress__tooltipAnchor" />` anchor를 자동 주입해 말풍선 위치 계산 기준점을 확보한다.
- **tooltipText 우선 순위**: `tooltipText` prop과 `#indicator` 슬롯이 동시에 제공될 경우 `tooltipText` 기반 Tooltip이 렌더링되고 슬롯은 무시된다 (v-if/v-else-if 분기 처리).
- **tooltipBgColor 위임**: `tooltipBgColor`가 지정된 경우 Tooltip 내부의 `bgColor` prop으로 그대로 전달되며, Tooltip이 SVG 꼬리 fill 색상까지 자동 반영한다.

---

## 8. 이벤트

없음 — 읽기 전용 표시 컴포넌트.

---

## 9. 접근성

Radix Vue `ProgressRoot`가 자동 처리:
- `role="progressbar"`
- `aria-valuenow` (displayValue 기준)
- `aria-valuemin="0"`, `aria-valuemax="{max}"`
- `aria-valuetext` (getValueLabel 지정 시)

키보드 접근 해당 없음 (표시 전용 컴포넌트).

`tooltipText` prop으로 내부 마운트된 Tooltip은 Tooltip 컴포넌트가 자체적으로 `role="tooltip"` + `aria-describedby` 처리를 담당한다 — Progress 컴포넌트 레벨에서 별도 처리 없음.
`#indicator` 슬롯으로 직접 주입하는 콘텐츠(Tooltip 외)는 주입하는 쪽에서 접근성을 직접 담당해야 한다.
