---
name: RadioGroup
description: 단일 선택 입력을 위한 라디오 버튼 그룹 컴포넌트. Radix Vue RadioGroup(Stable) 래핑.
type: component
layer: atoms
status: approved
date: 2026-05-13
---

## 1. 컴포넌트 개요

단일 선택(single choice) 입력을 위한 라디오 버튼 그룹 컴포넌트. 배송지 선택, 성별 선택, 결제수단 선택 등 "하나만 고를 수 있는" 폼 필드 전반에 사용한다. Radix Vue `RadioGroupRoot` + `RadioGroupItem` + `RadioGroupIndicator`를 래핑하여 접근성을 보장하고, 시각 스타일은 프로젝트 디자인 시스템 토큰을 적용한다.

---

## 2. 계층 & 파일 배치

- **계층**: atoms — 단일 선택 입력 제어 단위. 외부 컴포넌트에 의존하지 않음.
- **구현 파일**: `components/atoms/RadioGroup.vue`
- **barrel export**: `components/atoms/index.ts`
- **가이드 페이지**: `pages/guide/radioGroup/index.vue`
- **Base/Wrapper**: Base만 — `items` prop 배열로 아이템 내부 렌더링. 독립 아이템 컴포넌트 노출 없음.
- **아이콘 렌더 방식**: CSS + SVG 직접 구현 (이미지 에셋 미사용, Switch·Checkbox와 동일 방식)

---

## 3. 영역 구성 (Area Map)

```
[RadioGroupRoot]
  └─ v-for items
      └─ [label 요소 — label for 연결]
          ├─ [RadioGroupItem] — 실제 라디오 인터랙티브 요소
          │   └─ [RadioGroupIndicator] — 선택됨 상태에서만 내부 원 표시
          └─ [label 텍스트 span]
```

- **RadioGroupRoot**: 그룹 역할(role="radiogroup"), v-model 연결, orientation·disabled·required 제어
- **RadioGroupItem**: 클릭/키보드로 선택 처리. 커스텀 CSS 원형 아이콘
- **RadioGroupIndicator**: 선택됨 상태에서만 Radix Vue가 렌더링 조건 제어
- **label 요소**: `<label>`로 텍스트와 아이템을 연결 (for + id)

---

## 4. Props

### 직접 정의 Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `modelValue` | `string` | `undefined` | 현재 선택된 value (v-model) |
| `items` | `RadioGroupItem[]` | `[]` | `{ value: string; label: string; disabled?: boolean }` 배열 |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | 아이템 나열 방향 |
| `disabled` | `boolean` | `false` | 그룹 전체 비활성 |
| `required` | `boolean` | `false` | 폼 필수 여부 |
| `error` | `boolean` | `false` | 에러 상태 (FormField 연동 시 사용) |

### 타입 정의

```ts
export interface RadioGroupItem {
  value: string
  label: string
  disabled?: boolean
}
```

### attrs 위임 설계 (3단계)

| 단계 | 대상 attrs | 위임 위치 | 처리 방법 |
|------|-----------|---------|---------|
| 1단계 — Root 전용 | `name`, `required`, `dir`, `loop`, `defaultValue` | `RadioGroupRoot` | `useAttrs()`로 명시적 분리 |
| 2단계 — 인터랙티브 | `aria-label`, `aria-labelledby`, `aria-describedby`, `tabindex`, `data-*` | `RadioGroupRoot` | 1단계 제외 나머지 |
| 3단계 | 해당 없음 (팝오버/오버레이 없음) | — | — |

---

## 5. 상태(State) 정의

### RadioGroupItem 단위 상태

| 상태 | 시각적 변화 | 비고 |
|------|-----------|------|
| unchecked (기본) | 외곽 원: `$text-300` (#C0C0C0), 내부 원 없음 | |
| checked | 외곽 원 + 내부 원: `$color-primary` (#00ADDB) | RadioGroupIndicator 표시 |
| hover | 외곽 원: `$color-primary` 투명도 약하게 (`$color-primary` + opacity 0.6) | 마우스 오버 피드백 |
| focus-visible | 외곽 원 주변 2px 외곽선 `$color-primary` | 접근성 필수 |
| error | 외곽 원: `$color-danger` | `error` prop true 시 |
| disabled (아이템) | opacity 0.4, cursor: not-allowed | 클릭 차단 |
| disabled (그룹) | 그룹 전체 opacity 0.4 | `disabled` prop true 시 |

---

## 6. Variant

RadioGroup 자체의 시각 variant 없음. orientation으로 레이아웃 분기.

| orientation | 사용 맥락 | 아이템 gap |
|------------|---------|----------|
| `horizontal` | 선택지 짧을 때 (기본값) — Figma 실사용 예시 기준 | `2.0rem` (20px) |
| `vertical` | 선택지 길거나 많을 때, 폼 세로 레이아웃 | `$spacing-sm` |

---

## 7. 이벤트

| 이벤트 | 발생 시점 | 페이로드 |
|--------|---------|---------|
| `update:modelValue` | 아이템 선택 시 | `string` (선택된 value) |
| `change` | 선택값 변경 시 | `string` (선택된 value) |

---

## 8. 디자인 토큰 매핑

| 영역 | 시맨틱 토큰 | Figma 값 |
|------|-----------|----------|
| 선택 색상 (외곽 원 + 내부 원) | `$color-primary` | #00ADDB |
| 미선택 색상 (외곽 원) | `$text-300` | #C0C0C0 |
| 에러 색상 | `$color-danger` | — |
| 라벨 텍스트 색상 | `$text-secondary` | #666666 |
| 라벨 폰트 크기 | `$font-size-body2` | 14px |
| 라벨 폰트 굵기 | `$font-weight-regular` | 400 |
| 라디오 아이콘 크기 | `2.2rem` | 22×22px |
| 라디오↔라벨 gap | `0.5rem` | 5px |
| 아이템 간 gap (horizontal) | `2.0rem` | 20px |
| disabled opacity | `0.4` | — |

---

## 9. 접근성 요구사항

| 항목 | 요구사항 |
|------|---------|
| 그룹 역할 | `role="radiogroup"` — Radix Vue 자동 부여 |
| 키보드 탐색 | Tab으로 그룹 진입, 화살표 키로 아이템 간 이동·선택 (Radix Vue 제공) |
| 그룹 레이블 | `aria-label` 또는 `aria-labelledby` 외부에서 위임 필수 |
| 포커스 표시 | `:focus-visible` 외곽선 필수 — `$color-primary` 2px |
| 비활성 알림 | `aria-disabled` — Radix Vue 자동 처리 |
| 필수 알림 | `aria-required` — Radix Vue 자동 처리 |
| 선택 상태 | `aria-checked` — Radix Vue 자동 처리 |
| 라벨 연결 | `<label>` for + `<RadioGroupItem>` id로 텍스트와 아이템 연결 |

---

## 10. 사용 예시

```vue
<!-- 기본 사용 (배송지 선택) -->
<RadioGroup
  v-model="selectedAddress"
  :items="[
    { value: 'default', label: '기본 배송지' },
    { value: 'new', label: '새 배송지' },
  ]"
  orientation="horizontal"
  aria-label="배송지 선택"
/>

<!-- FormField 연동 -->
<FormField label="배송지" :error="errors.address">
  <RadioGroup
    v-model="selectedAddress"
    :items="addressOptions"
    :error="!!errors.address"
    name="address"
    required
  />
</FormField>

<!-- 세로 배열 + 일부 아이템 비활성 -->
<RadioGroup
  v-model="paymentMethod"
  :items="[
    { value: 'card', label: '신용카드' },
    { value: 'bank', label: '무통장입금' },
    { value: 'kakao', label: '카카오페이', disabled: true },
  ]"
  orientation="vertical"
  aria-label="결제 수단"
/>
```
