---
name: OptionButtonGroup
description: radio/checkbox 선택 타입과 그리드 레이아웃을 지원하는 버튼 선택 그룹 컴포넌트
metadata:
  type: component
  layer: molecules
  status: approved
---

# OptionButtonGroup — 컴포넌트 명세

## 0. Atomic 계층 & 파일 배치

- **계층**: molecules — Radix Vue RadioGroup/Checkbox를 직접 래핑하여 그리드 레이아웃 + 배지/슬롯 등 부가 기능을 구성하는 복합 단위
- **배치 경로**: `components/molecules/`
- **구현 방식**: Radix Vue 서브 컴포넌트 직접 래핑 (RadioGroupRoot+Item, CheckboxRoot) — 원형마커·체크아이콘 없이 버튼 UI 구현에 적합

---

## 1. 컴포넌트 개요

여러 선택지를 버튼 형태의 그리드로 나열하여 단일 또는 복수 선택을 받는 컴포넌트다.  
`type="radio"`이면 RadioGroupRoot(단일 선택), `type="checkbox"`이면 각 아이템이 독립 CheckboxRoot(복수 선택)로 동작한다.  
결제 수단 선택, 취소 사유 선택, 옵션 태그 선택 등 이미지·텍스트 혼합 콘텐츠가 들어가는 폼 선택 UI에서 주로 사용한다.

---

## 2. 영역 구성 (Area Map)

- ① **그리드 컨테이너** — 버튼 목록을 그리드로 배치하는 최상위 래퍼 / 필수
- ② **버튼 아이템** — 개별 선택 단위 버튼 / 필수 (1개 이상)
  - ② -A **기본 콘텐츠 영역** — 텍스트(`item.label` + 선택적 `item.subLabel`) 또는 `#content` 슬롯 (이미지+텍스트, 로고 등) / 필수 (text 또는 slot 중 하나)
  - ② -B **선택 시 콘텐츠 영역** — `#selected-content` 슬롯이 있을 때 선택 상태에서 기본 콘텐츠 대신 교체 표시 / 조건부
- ③ **배지(badge)** — 버튼 우측 상단에 오버레이되는 작은 라벨 (예: "최근 결제") / 조건부, `item.badge` 값 존재 시

---

## 3. Props 목록

| 항목 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `type` | `'radio' \| 'checkbox'` | `'radio'` | 단일 선택(radio) 또는 복수 선택(checkbox) |
| `modelValue` | `string \| string[] \| undefined` | `undefined` | v-model 바인딩. radio는 string, checkbox는 string[] |
| `items` | `OptionButtonItem[]` | `[]` | 버튼 목록 데이터 배열 |
| `columns` | `1 \| 2 \| 3` | `2` | 그리드 열 수. `rowColumns` 미지정 시 균등 그리드로 동작 |
| `rowColumns` | `number[] \| undefined` | `undefined` | 행마다 열 수를 다르게 지정. 예: `[3, 2, 1]` → 1행 3열, 2행 2열, 3행 1열. 지정 시 `columns`는 무시됨 |
| `maxRows` | `number \| undefined` | `undefined` | 최대 행 수 (미지정 시 전체 노출). `rowColumns` 지정 시 `maxRows`번째 행 그룹까지만 노출 |
| `selectedColor` | `string \| undefined` | `undefined` | 선택 시 배경·테두리 색상 커스터마이징 (미지정 시 기본 `$text-900`) |
| `disabled` | `boolean` | `false` | 그룹 전체 선택 불가 |
| `name` | `string \| undefined` | `undefined` | 폼 name 속성 |
| `required` | `boolean` | `false` | 폼 필수 검증 여부 |

### 아이템 데이터 구조 (OptionButtonItem)

| 필드 | 타입 | 필수 여부 | 설명 |
|------|------|---------|------|
| `value` | `string` | 필수 | 선택 값 (고유 식별자) |
| `label` | `string` | 조건부 | 버튼 텍스트 (slot 없을 때 필수) |
| `subLabel` | `string` | 선택 | label 아래에 caption 크기로 표시되는 보조 텍스트. 예: `'(자사몰 상품 기준)'` |
| `badge` | `string` | 선택 | 버튼 우측 상단 배지 텍스트 (예: "최근 결제") |
| `disabled` | `boolean` | 선택 | 해당 아이템만 비활성 |

---

## 4. Props 설계 원칙 — 중복 제어 제거

| 안티패턴 | 원칙 | 올바른 방향 |
|---------|------|-----------|
| `showBadge: boolean` + `badge: string` | 값 유무로 파생 가능 | `showBadge` 제거, `item.badge`가 있으면 자동 표시 |
| `isSelected: boolean[]` 별도 전달 | v-model로 파생 가능 | `modelValue` 하나로 제어 |

---

## 5. Variant 목록

**type 축**

| Variant | 사용 맥락 |
|---------|---------|
| `radio` (기본) | 결제 수단 선택, 배송지 선택 등 단일 선택 |
| `checkbox` | 취소 사유 복수 선택, 다중 옵션 태그 선택 등 |

**columns 축**

| Variant | 사용 맥락 |
|---------|---------|
| `columns="1"` | 텍스트가 길거나 단열 표시가 필요한 경우 — 최대 3행(버튼 3개) 권장 |
| `columns="2"` (기본) | 결제 수단(이미지+텍스트) 등 — 최대 2행(버튼 4개) 권장 |
| `columns="3"` | 취소 사유 등 짧은 텍스트 다수 선택지 |
| `rowColumns="[3, 2, 1]"` 등 | 행마다 열 수가 다른 비대칭 레이아웃 — 예: 6개 옵션을 3+2+1로 배치 |

---

## 6. 상태(State) 정의

| 상태 | 배경 | 테두리 | 텍스트 | 기능 |
|------|------|--------|--------|------|
| default | `$bg-primary` (흰색) | `$line-200` (1.5px) | `$text-800` | — |
| selected | `$text-900` 또는 `selectedColor` | 동일 | `$text-white` | 선택 값 반영, `#selected-content` 슬롯 교체 |
| disabled (아이템) | 구현 안 함 | 구현 안 함 | — | 클릭 차단 (Radix 자동) |
| hover | 구현 안 함 | — | — | — |

> **disabled 시각**: Figma에 명시되지 않아 시각 처리 추가 안 함. Radix Vue의 `data-disabled` 속성으로 보조기기 전달 자동 처리됨.

---

## 7. 동작 규칙

- `type="radio"`: 한 번에 하나의 버튼만 선택됨. 이미 선택된 버튼 재클릭 시 해제 불가 (RadioGroup 기본 동작)
- `type="checkbox"`: 각 버튼 독립적으로 체크/해제 가능. 선택된 value들의 배열로 v-model 유지
- `type`에 따라 내부 렌더 분기:
  - `radio` → `RadioGroupRoot` + `RadioGroupItem`
  - `checkbox` → 각 버튼이 독립 `CheckboxRoot`로 렌더
- `#content` 슬롯이 전달되면 `item.label` 텍스트 대신 슬롯 콘텐츠 표시
- `item.subLabel`이 있으면 `item.label` 아래에 caption 크기(`$font-size-caption1`)로 렌더링. 슬롯 미사용(기본 콘텐츠) 경우에만 표시되며, `#content` · `#selected-content` 슬롯 사용 시에는 렌더링되지 않음
- `#selected-content` 슬롯이 전달되면 해당 버튼 선택 시 `#content` 대신 표시
- `item.badge`가 있으면 버튼 우측 상단에 배지 오버레이 표시
- `selectedColor` prop이 있으면 CSS custom property(`--option-selected-color`)로 주입, 선택 상태 배경·테두리에 적용
- `maxRows` prop이 있으면 `columns × maxRows` 초과 아이템은 잘리지 않고 계속 노출 (스크롤 없음, 전체 노출)
- `rowColumns` prop이 지정되면 `columns`를 무시하고 행 단위로 그리드를 분리 렌더링한다. 아이템은 `rowColumns` 배열의 누적합 기준으로 각 행 그룹에 배분되며, 각 행에 독립적인 `grid-template-columns`가 적용됨
  - 예: `items` 6개, `rowColumns="[3, 2, 1]"` → 1행에 아이템 0~2(3열), 2행에 아이템 3~4(2열), 3행에 아이템 5(1열)
  - 누적합이 전체 아이템 수보다 적으면 나머지 아이템은 **1열**로 이어 붙임
  - `rowColumns` + `maxRows` 동시 지정 시 `maxRows`번째 행 그룹까지만 노출
  - `rowColumns`가 빈 배열이면 `columns` 기본 동작으로 폴백
- 버튼 높이 `4.6rem` 고정, 텍스트 2줄 표시 허용

---

## 8. 이벤트 목록

| 이벤트 | 발생 시점 | 전달 정보 |
|--------|---------|---------|
| `update:modelValue` | 버튼 선택/해제 시 | radio: `string` / checkbox: `string[]` |
| `change` | 선택 값 변경 시 | 동일 (API 연동용) |

---

## 9. 접근성 요구사항

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| role | `type="radio"` | `RadioGroupRoot`가 `role="radiogroup"` 자동 부여 |
| role | `type="checkbox"` | 각 `CheckboxRoot`가 `role="checkbox"` 자동 부여 |
| 키보드 탐색 | `type="radio"` | 화살표 키로 항목 간 이동 (RadioGroup 기본) |
| 키보드 탐색 | `type="checkbox"` | Tab으로 포커스 이동, Space로 토글 |
| 대체 텍스트 | 슬롯에 이미지만 있을 때 | `item.label`을 버튼 `aria-label`로 적용 |
| 포커스 표시 | 키보드 포커스 시 | `:focus-visible`로 외곽선 표시 |
| 비활성 알림 | disabled 시 | `data-disabled` 속성 (Radix 자동) |
| 배지 숨김 | badge 있을 때 | 배지 요소에 `aria-hidden="true"` 적용 |

---

## 10. Slot 설계

| 슬롯명 | scoped data | 설명 |
|--------|-------------|------|
| `#content` | `{ item: OptionButtonItem, isSelected: boolean }` | 버튼 기본 콘텐츠. 미전달 시 `item.label` 텍스트 표시 |
| `#selected-content` | `{ item: OptionButtonItem }` | 선택 시 교체 콘텐츠. 미전달 시 `#content` 유지 |

**사용 예시 (이미지+텍스트)**

```vue
<OptionButtonGroup v-model="payMethod" type="radio" :items="payItems">
  <template #content="{ item }">
    <img :src="item.logoSrc" :alt="item.label" />
    <span>{{ item.label }}</span>
  </template>
</OptionButtonGroup>
```

**사용 예시 (rowColumns 비대칭 레이아웃)**

```vue
<!-- 3+2+1 비대칭 레이아웃 — 6개 아이템을 각 행 다른 열 수로 배치 -->
<OptionButtonGroup
  v-model="selected"
  type="radio"
  :items="items"
  :row-columns="[3, 2, 1]"
/>
```

---

## 11. 디자인 토큰 매핑

### 색상

| Figma 값 | 사용 위치 | 매핑 토큰 |
|---------|---------|---------|
| `#FFFFFF` | 버튼 기본 배경 | `$bg-primary` |
| `#DDDDDD` | 버튼 기본 테두리 | `$line-200` |
| `#111111` | 선택 시 배경·테두리 (기본) | `$text-900` |
| `#FFFFFF` | 선택 시 텍스트 | `$text-white` |
| `#333333` | 기본 버튼 텍스트 | `$text-800` (근사) |
| `selectedColor` | 선택 색상 커스터마이징 | CSS var `--option-selected-color` |
| 배지 배경 | `rgba(17,17,17,0.7)` | `$text-900` + `opacity: 0.7` |
| `#FFFFFF` | 배지 텍스트 | `$text-white` |

### Typography

| Figma 값 | 사용 위치 | 매핑 토큰 |
|---------|---------|---------|
| 14px / 500 / 1.3 | 버튼 라벨 텍스트 | `$font-size-body3` / `$font-weight-medium` / `$line-height-snug` |
| 11px / 400 | subLabel 텍스트 | `$font-size-caption1` / `$font-weight-regular` |
| 11px / 400 | 배지 텍스트 | `$font-size-caption1` / `$font-weight-regular` |

### Spacing / Radius

| Figma 값 | 사용 위치 | 처리 |
|---------|---------|------|
| 높이 4.6rem | 버튼 고정 높이 | 직접 `4.6rem` |
| 8px radius | 버튼 모서리 | `$radius-md` |
| 0.4rem gap | 버튼 간격 | `$spacing-xs` |
| 20px 좌우 패딩 | 버튼 내부 패딩 | 직접 `2rem` |
| 1.5px | 버튼 테두리 두께 | 직접 `1.5px` |
| 4px/2px 배지 패딩 | 배지 내부 패딩 | 직접 `0.4rem` / `0.2rem` |
| 6px 배지 radius | 배지 모서리 | `$radius-sm` |
