# Icon 컴포넌트 시스템 명세

- **Atomic 계층**: 독립 폴더 (`components/icons/`) — Atomic Design 계층 외부
- **역할**: SVG 기반 아이콘 렌더링. Base 컴포넌트 + 개별 아이콘 정의 파일로 구성.
- **Figma**: `40004010:1023` (Icons 가이드 페이지)

---

## 파일 구조

```
components/icons/
└── Icon.vue        ← Base 컴포넌트 (size/color/label/slot 처리)

assets/
└── icons/          ← SVG 파일 보관 폴더
    ├── home.svg
    ├── close.svg
    └── ...          (파일명: camelCase, 예: smallChevronDown.svg)
```

```
components/types.ts  ← IconSize 타입 추가
```

---

## 아이콘 사이즈 체계

### 프리셋 크기 (Figma 기준)

| size prop | 픽셀 | 용도                    |
| --------- | ---- | ----------------------- |
| `'xs'`    | 8px  | 초소형 UI 요소 내 아이콘 |
| `'sm'`    | 16px | 소형 UI 요소 내 아이콘  |
| `'md'`    | 24px | 일반 UI 아이콘 (기본값) |
| `'lg'`    | 40px | 대형/일러스트 아이콘    |

### 커스텀 크기

프리셋 외에 픽셀 수치를 직접 지정할 수 있다.

| 형태 | 예시 | 결과 |
| ---- | ---- | ---- |
| `number` (정방형) | `:size="50"` | 50×50px |

- 커스텀 크기는 CSS class가 아닌 inline style(`width` / `height`)로 처리한다

---

## Icon.vue (Base) 명세

### 영역 구성

단일 `<span>` 래퍼 안에 slot으로 SVG를 수신한다.

```
[span.icon icon--{size}]
  └─ <slot /> (SVG가 삽입되는 자리)
```

### Props

| 이름    | 타입                                                  | 기본값      | 설명                                                                          |
| ------- | ----------------------------------------------------- | ----------- | ----------------------------------------------------------------------------- |
| `size`  | `'xs' \| 'sm' \| 'md' \| 'lg' \| number`             | `'md'`      | 아이콘 크기. 프리셋 문자열은 CSS class로, 숫자는 inline style로 처리한다     |
| `color` | `string \| undefined`                                 | `undefined` | CSS color 값. 미전달 시 부모 `color` CSS 상속                                 |
| `label` | `string \| undefined`                                 | `undefined` | 접근성 라벨. 전달 시 `aria-label` + `role="img"` 적용                         |

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
<!-- size가 프리셋 문자열일 때는 CSS class, 숫자일 때는 inline style로 처리 -->
<span
  v-bind="$attrs"
  class="icon"
  :class="typeof size === 'string' ? `icon--${size}` : undefined"
  :style="sizeStyle"
  :aria-hidden="label ? undefined : 'true'"
  :aria-label="label"
  :role="label ? 'img' : undefined"
>
  <slot />
</span>
```

`sizeStyle` 계산 규칙:
- `size`가 `'xs' | 'sm' | 'md' | 'lg'` → `sizeStyle = color ? { color } : undefined`
- `size`가 `number` → `sizeStyle = { width: '{size}px', height: '{size}px', ...(color 있으면 color) }`

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

  &--xs {
    width: 0.8rem;
    height: 0.8rem;
  } // 8px
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
  // 커스텀 크기(number)는 inline style로 처리 — CSS class 없음
}
```

---

## nuxt.config.ts 설정

`nuxt-svgo` 모듈을 사용한다. `defaultImport: 'url'`로 bare import는 URL 문자열로 반환되며, 인라인 SVG가 필요한 경우 `?component` 또는 `?skipsvgo` 쿼리를 명시한다.

```typescript
export default defineNuxtConfig({
  modules: [
    ['nuxt-svgo', {
      defaultImport: 'url',       // bare import → URL 문자열 (청크 비대화 방지)
      svgoConfig: {
        plugins: [
          {
            name: 'convertColors',
            params: { currentColor: true },
          },
        ],
      },
    }],
  ],
})
```

**쿼리 접미사별 동작**:

| 쿼리          | 결과                         | 용도                                |
| ------------- | ---------------------------- | ----------------------------------- |
| 없음 (bare)   | URL 문자열                   | `<img :src>` 또는 CSS background    |
| `?component`  | Vue 컴포넌트 (SVGO 적용)     | currentColor 색상 제어가 필요한 SVG |
| `?skipsvgo`   | Vue 컴포넌트 (SVGO 건너뜀)   | 색상 고정이 필요한 SVG              |
| `?url`        | URL 문자열 (명시적)          | bare import와 동일                  |

- `convertColors: true` → `?component` import 시 `fill/stroke` 색상값을 빌드 시 자동으로 `currentColor`로 변환
- `fill="none"` 은 색상값이 아니므로 변환되지 않음

---

## types.ts 업데이트

```typescript
// components/types.ts에 추가/수정
export type IconPresetSize = "xs" | "sm" | "md" | "lg";
export type IconSize = IconPresetSize | number;
```

`IconPresetSize`는 `Icon.vue` Props 타입에서 사용한다.

---

## 사용 방법

배럴 export 없음. 사용처에서 필요한 SVG만 직접 import한다.

```typescript
// Nuxt auto-import 미지원 — 명시적 import 필수
import Icon from '@nd/components/icons/Icon.vue'
// @ts-ignore — vite-svg-loader ?component 모듈은 런타임에 정상 동작
import HomeSvg from '@nd/assets/icons/home.svg?component'  // currentColor 필요
// @ts-ignore
import HeartSvg from '@nd/assets/icons/heart.svg?skipsvgo' // 색상 고정
```

```html
<!-- 기본: md(24px), currentColor 상속 -->
<Icon><HomeSvg /></Icon>

<!-- 프리셋 크기 -->
<Icon size="sm"><SmallCloseSvg /></Icon>

<!-- 명시적 색상 -->
<Icon color="#0CB5E2"><AlertSvg /></Icon>

<!-- 의미있는 아이콘 (aria-label) -->
<Icon label="홈으로 이동"><HomeSvg /></Icon>

<!-- 커스텀 크기 -->
<Icon :size="50"><HomeSvg /></Icon>
```

부모 CSS로 색상 제어 (currentColor 상속):

```html
<span style="color: #0CB5E2;">
  <Icon><HomeSvg /></Icon>
</span>
```

---

## SVG 추가 가이드

### 기본 워크플로우

```
1. Figma에서 SVG Export
2. assets/icons/ 에 저장 (파일명: camelCase, 예: chevronDown.svg)
3. 사용 파일에서 직접 import
```

```typescript
// 사용처 SFC의 <script setup>
import Icon from '@nd/components/icons/Icon.vue'
// @ts-ignore
import ChevronDownSvg from '@nd/assets/icons/chevronDown.svg?component'
```

```html
<Icon size="sm"><ChevronDownSvg /></Icon>
```

- `?component` 쿼리: nuxt-svgo가 SVG 파일을 Vue 컴포넌트로 변환
- SVGO `convertColors`가 빌드 시 자동으로 `fill/stroke` 색상값 → `currentColor` 변환

### 예외 케이스 — SVGO 건너뛰기

의도치 않은 색상 변환이 발생하는 SVG는 `?skipsvgo`를 사용한다.

**skipsvgo 적용 아이콘 목록**

| SVG 파일            | 이유                                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `play.svg`          | `<filter>` drop-shadow + `fill="white"` 포함 — SVGO가 white를 currentColor로 변환하면 드롭섀도 시각이 깨짐             |
| `tooltip.svg`       | 배경 fill 없이 라인(stroke)만 있는 구조 — SVGO convertColors 오적용 방지                                               |
| `circularNote.svg`  | 배경 fill 없이 라인(stroke)만 있는 구조 — 동일 이유                                                                    |

**등록된 전체 아이콘 목록**

| 파일명 | 권장 쿼리 | 용도/비고 |
| --- | --- | --- |
| `alert.svg` | `?component` | 경고 |
| `bag.svg` | `?component` | 가방/쇼핑백 |
| `bigCircularNoteIcon.svg` | `?component` | 대형 원형 안내 아이콘 |
| `bigCircularNoteIconFilled.svg` | `?component` | 대형 원형 안내 아이콘 (채움) |
| `calender.svg` | `?component` | 캘린더 |
| `card.svg` | `?skipsvgo` | 신용카드/결제 — 고정 stroke 색상 (#838B92) |
| `cart.svg` | `?component` | 장바구니 |
| `category.svg` | `?component` | 카테고리 |
| `chain.svg` | `?component` | 링크/체인 |
| `chevronLeft.svg` | `?component` | 왼쪽 화살표 (크기 md) |
| `chevronRight.svg` | `?component` | 오른쪽 화살표 (크기 md) |
| `circularArrow.svg` | `?component` | 원형 새로고침 화살표 |
| `circularNote.svg` | `?skipsvgo` | 원형 안내 아이콘 — stroke 전용 구조 |
| `close.svg` | `?component` | 닫기 (크기 md) |
| `coupon.svg` | `?component` | 쿠폰 |
| `delete.svg` | `?component` | 삭제/휴지통 |
| `download.svg` | `?component` | 다운로드 |
| `document.svg` | `?component` | 문서 |
| `gift.svg` | `?component` | 선물 |
| `grid.svg` | `?component` | 그리드 보기 |
| `heart.svg` | `?component` | 하트 (빈) |
| `heartFull.svg` | `?component` | 하트 (채움) |
| `heartLine.svg` | `?component` | 하트 (라인) |
| `home.svg` | `?component` | 홈 |
| `IcCheckCircle.svg` | `?component` | 체크 원형 |
| `IcCircularNote.svg` | `?component` | 원형 안내 (IC 접두사 버전) |
| `kakao.svg` | `?component` | 카카오 로고 |
| `left.svg` | `?component` | 왼쪽 (단순 화살표) |
| `list.svg` | `?component` | 목록 보기 |
| `lock.svg` | `?component` | 잠금 |
| `moreVertical.svg` | `?component` | 세로 점 3개 (더보기/케밥 메뉴) |
| `logout.svg` | `?component` | 로그아웃 |
| `notification.svg` | `?component` | 알림 |
| `pencilFilled.svg` | `?component` | 수정/편집 |
| `phoneSearch.svg` | `?skipsvgo` | 앱 검색 — 고정 색상 (#E9EBEB, #C4CDD7, #0CB5E2) |
| `play.svg` | `?skipsvgo` | 재생 — drop-shadow + `fill="white"` 유지 |
| `plus.svg` | `?component` | 플러스/추가 |
| `right.svg` | `?component` | 오른쪽 (단순 화살표) |
| `search.svg` | `?component` | 검색 |
| `share.svg` | `?component` | 공유 |
| `shoppingCart.svg` | `?component` | 쇼핑카트 |
| `shoppingCartCheck.svg` | `?skipsvgo` | 쇼핑카트 체크 (주문 완료 등) |
| `shoppingCartPlus.svg` | `?skipsvgo` | 쇼핑카트 플러스 (구독 플러스+ 아이콘) — 고정 stroke 색상 (#C4CDD7, #00ADDB) |
| `smallBag.svg` | `?component` | 소형 가방 |
| `smallChevronDown.svg` | `?component` | 소형 아래 화살표 |
| `smallChevronLeft.svg` | `?component` | 소형 왼쪽 화살표 |
| `smallChevronRight.svg` | `?component` | 소형 오른쪽 화살표 |
| `smallChevronUp.svg` | `?component` | 소형 위 화살표 |
| `smallClose.svg` | `?component` | 소형 닫기 |
| `smallGreat.svg` | `?component` | 소형 엄지 |
| `smallPlus.svg` | `?component` | 소형 플러스 |
| `star.svg` | `?component` | 별점 |
| `time.svg` | `?component` | 시간/시계 |
| `tooltip.svg` | `?skipsvgo` | 툴팁 아이콘 — stroke 전용 구조 |
| `truck.svg` | `?skipsvgo` | 배송 트럭 — 고정 stroke 색상 (#00ADDB) |
| `user.svg` | `?component` | 사용자/마이페이지 |

```typescript
// 색상 고정이 필요한 경우 ?skipsvgo 사용
// @ts-ignore
import PlaySvg from '@nd/assets/icons/play.svg?skipsvgo'
// @ts-ignore
import TooltipSvg from '@nd/assets/icons/tooltip.svg?skipsvgo'
```

- `?skipsvgo` 사용 시: SVGO 자동 변환이 없으므로 SVG 파일 내에서 `stroke/fill` 값을 직접 `currentColor`로 수정해야 한다 (디자인 의도로 유지해야 하는 색상값 제외)
- `play.svg`의 `fill="white"`는 드롭섀도 효과를 위한 디자인 의도이므로 변환하지 않는다

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
