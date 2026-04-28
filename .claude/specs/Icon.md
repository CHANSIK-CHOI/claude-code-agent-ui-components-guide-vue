# Icon 컴포넌트 시스템 명세

- **Atomic 계층**: 독립 폴더 (`components/icons/`) — Atomic Design 계층 외부
- **역할**: SVG 기반 아이콘 렌더링. Base 컴포넌트 + 개별 아이콘 정의 파일로 구성.
- **Figma**: `40004010:1023` (Icons 가이드 페이지)

---

## 파일 구조

```
components/icons/
├── Icon.vue      ← Base 컴포넌트 (size/color/label/slot 처리)
└── index.ts      ← makeIcon 헬퍼 + 아이콘 named export

assets/
└── icons/        ← SVG 파일 보관 폴더
    ├── home.svg
    ├── close.svg
    └── ...        (파일명: kebab-case)
```

```
components/types.ts  ← IconSize 타입 추가
```

---

## 아이콘 사이즈 체계

Figma 기준 3가지 크기:

| size prop | 픽셀 | 용도                    |
| --------- | ---- | ----------------------- |
| `'sm'`    | 16px | 소형 UI 요소 내 아이콘  |
| `'md'`    | 24px | 일반 UI 아이콘 (기본값) |
| `'lg'`    | 40px | 대형/일러스트 아이콘    |

---

## Icon.vue (Base) 명세

### 영역 구성

단일 `<span>` 래퍼 안에 slot으로 SVG를 수신한다.

```
[span.icon icon--{size}]
  └─ <slot /> (SVG가 삽입되는 자리)
```

### Props

| 이름    | 타입                   | 기본값      | 설명                                                  |
| ------- | ---------------------- | ----------- | ----------------------------------------------------- |
| `size`  | `'sm' \| 'md' \| 'lg'` | `'md'`      | 아이콘 크기                                           |
| `color` | `string \| undefined`  | `undefined` | CSS color 값. 미전달 시 부모 `color` CSS 상속         |
| `label` | `string \| undefined`  | `undefined` | 접근성 라벨. 전달 시 `aria-label` + `role="img"` 적용 |

### Slots

| 이름      | 필수 | 설명                         |
| --------- | ---- | ---------------------------- |
| `default` | 필수 | SVG 엘리먼트를 삽입하는 슬롯 |

### 접근성 요구사항

- `label` prop 없음 → `aria-hidden="true"` (장식 아이콘)
- `label` prop 있음 → `aria-label="{label}"` + `role="img"` (의미 있는 아이콘)
- `v-bind="$attrs"` 위임: `<span>` 요소에 적용 (핵심 인터랙티브 요소)

### 마크업 구조

```html
<span
  v-bind="$attrs"
  class="icon"
  :class="`icon--${size}`"
  :style="color ? { color } : undefined"
  :aria-hidden="label ? undefined : 'true'"
  :aria-label="label"
  :role="label ? 'img' : undefined"
>
  <slot />
</span>
```

### SCSS 명세

```scss
$b: "icon";

.#{$b} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  :deep(svg) {
    // slot으로 들어온 SVG는 scoped 미적용 → :deep() 필요
    display: block;
    width: 100%;
    height: 100%;
  }

  &--sm {
    width: 1.6rem;
    height: 1.6rem;
  } // 16px
  &--md {
    width: 2.4rem;
    height: 2.4rem;
  } // 24px
  &--lg {
    width: 4rem;
    height: 4rem;
  } // 40px
}
```

---

## index.ts 명세

### 구조 원칙

- `.ts` 파일 (`.vue` 아님) — named export만 담당
- `makeIcon()` 헬퍼 함수로 일반 아이콘을 render function 기반으로 생성
- CartIcon은 배지 처리를 위해 `defineComponent`로 별도 정의
- CartIcon CSS는 별도 전역 스타일 블록에 작성 (scoped 미사용)

### `makeIcon()` 헬퍼

```typescript
import type { Component } from 'vue'

function makeIcon(name: string, defaultSize: IconSize, SvgComponent: Component);
```

| 인수           | 타입        | 설명                                              |
| -------------- | ----------- | ------------------------------------------------- |
| `name`         | `string`    | 컴포넌트 이름 (DevTools 표시용)                   |
| `defaultSize`  | `IconSize`  | 해당 아이콘의 Figma 기준 기본 크기                |
| `SvgComponent` | `Component` | `vite-svg-loader`가 변환한 SVG Vue 컴포넌트       |

render function 내부 구조:

```typescript
// 변경 전 (구 방식 — paths 문자열 embed)
() => h('svg', { xmlns: '...', viewBox: '0 0 24 24', fill: 'none', innerHTML: svgPaths })

// 변경 후 (현행 방식 — SVG 컴포넌트 위임)
() => h(SvgComponent)
```

### 아이콘 컴포넌트 네이밍 규칙

모든 아이콘 컴포넌트 이름은 반드시 `Icon` 접미사로 끝나야 한다.

**이유**: `<Close>`, `<Tooltip>` 등 접미사 없는 이름은 일반 HTML 요소(`<input>`, `<select>`) 또는 Radix Vue 서브 컴포넌트(`<TooltipRoot>` 등)와 이름 충돌 위험이 있다.

| 패턴 | 예시 |
|------|------|
| ✅ 올바른 이름 | `CloseIcon`, `CartIcon`, `TooltipIcon`, `ChevronDownIcon` |
| ❌ 금지 — 접미사 없음 | `Close`, `Cart`, `Tooltip`, `ChevronDown` |

### 아이콘 목록 및 기본 크기

아이콘 목록은 사용자가 직접 추가한다. 각 size별 패턴 예시:

| size | 예시 컴포넌트 이름 | 용도 |
|------|-----------------|------|
| `'md'` (24px) | `HomeIcon` | 일반 UI 아이콘 |
| `'sm'` (16px) | `ChevronUpIcon` | 소형 UI 아이콘 |
| `'lg'` (40px) | `WarningLargeIcon` | 대형/일러스트 |

> **publisher 구현 범위**: `HomeIcon`(`'md'`) 1개를 예시로 구현한다. 나머지 아이콘은 사용자가 패턴을 참고해 직접 추가.

### CartIcon Props

| 이름    | 타입                  | 기본값      | 설명                                            |
| ------- | --------------------- | ----------- | ----------------------------------------------- |
| `size`  | `IconSize`            | `'md'`      | 아이콘 크기                                     |
| `color` | `string \| undefined` | `undefined` | CSS color 값                                    |
| `label` | `string \| undefined` | `undefined` | 접근성 라벨                                     |
| `count` | `number \| undefined` | `undefined` | 배지 숫자. `undefined` 또는 `0`이면 배지 미표시 |

### CartIcon 배지 동작

- `count > 0` → 배지 표시
- `count > 99` → `'99+'` 표시
- 배지 위치: 아이콘 우상단 (absolute, top/right -4px)
- 배지 색상: `#ff5146` (danger)
- `aria-label`: "장바구니 {count}개"

### CartIcon SCSS (전역)

```css
.cartIcon {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.cartIcon__badge {
  position: absolute;
  top: -0.4rem;
  right: -0.4rem;
  min-width: 1.6rem;
  height: 1.6rem;
  padding: 0 0.4rem;
  border-radius: 9999px;
  background-color: #ff5146;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.6rem;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
  box-sizing: border-box;
}
```

> scoped 없는 `<style>` 블록에서는 `additionalData` SCSS 변수 자동 주입이 작동하지 않아 raw 값을 사용합니다.

---

## nuxt.config.ts 설정

`vite-svg-loader` 플러그인을 등록하고 SVGO `convertColors` 설정을 추가한다.

```typescript
import svgLoader from 'vite-svg-loader'

export default defineNuxtConfig({
  vite: {
    plugins: [
      svgLoader({
        svgoConfig: {
          plugins: [
            {
              name: 'convertColors',
              params: { currentColor: true },
            },
          ],
        },
      }),
    ],
  },
})
```

- `convertColors: true` → SVG 내 `fill="black"`, `stroke="black"` 등 색상값을 빌드 시 자동으로 `currentColor`로 변환
- `fill="none"` 은 색상값이 아니므로 변환되지 않음 (그대로 유지됨)

---

## types.ts 업데이트

```typescript
// components/types.ts에 추가
export type IconSize = "sm" | "md" | "lg";
```

---

## 사용 방법

```typescript
// Nuxt auto-import 미지원 — 명시적 import 필수
import { HomeIcon, SearchIcon, CartIcon } from "~/components/icons";
```

```html
<HomeIcon />
<!-- 24px, currentColor 상속 -->
<SearchIcon size="sm" />
<!-- 16px -->
<SearchIcon color="#0CB5E2" />
<!-- 명시적 색상 -->
<HomeIcon label="홈으로 이동" />
<!-- 의미있는 아이콘 (aria-label) -->
<CartIcon />
<!-- 배지 없음 -->
<CartIcon :count="3" />
<!-- 배지 '3' -->
<CartIcon :count="100" />
<!-- 배지 '99+' -->
```

부모 CSS로 색상 제어 (권장 방식):

```html
<span style="color: #0CB5E2;">
  <HomeIcon />
  <!-- currentColor = #0CB5E2 상속 -->
</span>
```

---

## SVG 추가 가이드

### 기본 워크플로우

```
1. Figma에서 SVG Export
2. assets/icons/ 에 저장 (파일명: kebab-case, 예: chevron-down.svg)
3. components/icons/index.ts 에 import + makeIcon 한 줄 추가
```

```typescript
// components/icons/index.ts
import ChevronDownSvg from '~/assets/icons/chevron-down.svg?component'

export const ChevronDownIcon = makeIcon('ChevronDownIcon', 'md', ChevronDownSvg)
```

- `?component` 쿼리: `vite-svg-loader`가 SVG 파일을 Vue 컴포넌트로 변환
- 색상 처리: SVGO `convertColors`가 빌드 시 자동으로 `fill/stroke` 색상값 → `currentColor` 변환. 수동 치환 불필요.

### 예외 케이스 — SVGO 건너뛰기

SVGO 전역 설정(`convertColors`)이 SVG 내 색상값을 `currentColor`로 변환하면서 의도치 않은 시각 결과가 생기는 경우, `?component&skipsvgo` 쿼리를 사용해 SVGO 처리를 건너뛴다.

**skipsvgo 적용 아이콘 목록**

| 아이콘 컴포넌트 | 이유 |
|---------------|------|
| `PlayIcon` | `<filter>` drop-shadow + `fill="white"` 포함 — SVGO가 white를 currentColor로 변환하면 드롭섀도 시각이 깨짐 |
| `TooltipIcon` | 배경 fill 없이 라인(stroke)만 있는 구조 — SVGO가 stroke를 currentColor로 변환하면 배경이 검정색으로 표시되는 문제 발생 |
| `CircularNoteIcon` | 배경 fill 없이 라인(stroke)만 있는 구조 — 동일 이유 |

```typescript
// PlayIcon — <filter> drop-shadow + fill="white" 포함, SVGO 건너뜀
import PlaySvg from '~/assets/icons/play.svg?component&skipsvgo'
export const PlayIcon = makeIcon('PlayIcon', 'lg', PlaySvg)

// TooltipIcon — 라인(stroke)만 있는 SVG, SVGO convertColors 오적용 방지
import TooltipSvg from '~/assets/icons/tooltip.svg?component&skipsvgo'
export const TooltipIcon = makeIcon('TooltipIcon', 'md', TooltipSvg)

// CircularNoteIcon — 라인(stroke)만 있는 SVG, SVGO convertColors 오적용 방지
import CircularNoteSvg from '~/assets/icons/circular-note.svg?component&skipsvgo'
export const CircularNoteIcon = makeIcon('CircularNoteIcon', 'md', CircularNoteSvg)
```

- `skipsvgo` 사용 시: SVGO 자동 변환이 없으므로 SVG 파일 내에서 `stroke/fill` 값을 직접 `currentColor`로 수정해야 한다 (단, 디자인 의도로 유지해야 하는 색상값은 그대로 둔다)
- PlayIcon의 `fill="white"`는 드롭섀도 효과를 위한 디자인 의도이므로 변환하지 않는다
- TooltipIcon/CircularNoteIcon의 `stroke` 색상값은 `currentColor`로 직접 수정해 부모 color를 상속받도록 한다

---

## 접근성 요구사항

| 상황                  | 처리                                             |
| --------------------- | ------------------------------------------------ |
| 장식 아이콘 (기본)    | `aria-hidden="true"`                             |
| 의미 있는 단독 아이콘 | `label` prop 전달 → `aria-label` + `role="img"`  |
| 버튼 내부 아이콘      | 버튼에 `aria-label` 적용, 아이콘은 `aria-hidden` |

---

## 인터랙션 명세

- 아이콘 자체는 인터랙션 없음 (클릭 등은 부모 버튼/링크에서 처리)
- `pointer-events`는 기본 상속 (부모가 제어)
- 포커스 스타일 없음 (비인터랙티브 요소)
