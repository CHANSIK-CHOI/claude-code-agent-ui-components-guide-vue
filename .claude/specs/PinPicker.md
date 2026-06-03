---
name: PinPicker
description: BottomSheet + vant Picker 조합 범용 옵션 선택 팝업 컴포넌트
type: component
layer: popup
---

# PinPicker — 컴포넌트 명세

---

### 0. Atomic 계층 & 파일 배치

- **계층**: popup — BottomSheet(popup 카테고리)를 레이아웃으로 내부에서 사용하며, 바텀시트 팝업 단위로 독립 동작하기 때문에 동일한 popup 카테고리에 배치한다. PinDatePicker와 동일한 계층 판단 근거를 따른다.
- **배치 경로**: `components/popup/PinPicker.vue`
- **Base/Wrapper 분리**: Base만

---

### 1. 컴포넌트 개요

일반 옵션(배송지, 사이즈, 지역 등)을 드럼 롤 휠로 선택하는 바텀시트 팝업 컴포넌트. BottomSheet를 레이아웃으로 사용하고 body 영역에 vant Picker를 삽입하여 헤더·푸터 마크업을 직접 구현하지 않는다. Select 컴포넌트의 모바일 바텀시트 대체재로, 단일 컬럼·다중 독립 컬럼·cascading(계층형) 컬럼 모두 지원한다.

---

### 2. 영역 구성 (Area Map)

- ① **헤더(타이틀 + 닫기 버튼)** — BottomSheet의 `title` prop과 `showClose` prop으로 렌더링. PinPicker가 직접 마크업하지 않는다.
- ② **바디 — 드럼 롤 휠** — BottomSheet의 default slot에 `<van-picker>` 삽입. vant 자체 3D 스크롤 휠 UI 렌더링.
  - ②-a **선택 강조 띠 (indicator)** — 현재 선택된 항목을 가로로 가로지르는 강조 배경 띠. 상·하 border line으로 표현. vant 내장 렌더링. 선택 항목(`.van-picker-column__item--selected`)은 bold 텍스트로 강조.
- ③ **푸터(확인 버튼)** — BottomSheet의 `okLabel`, `@ok` 이벤트로 처리. PinPicker가 직접 마크업하지 않는다.

> **내부 슬롯 위임 구조**: vant Picker의 자체 toolbar(`show-toolbar`)는 `false`로 비활성화. 타이틀·확인·취소는 BottomSheet가 전담.

---

### 3. Props 목록

#### 3-A. 컴포넌트 자체 Props

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `modelValue` | `string[]` | `[]` | 선택된 value 배열. `v-model`로 양방향 바인딩 |
| `open` | `boolean` | `false` | 바텀시트 열림 여부. `v-model:open`으로 양방향 바인딩 |

#### 3-B. BottomSheet 위임 Props

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `title` | `string` | `''` | 헤더 영역 제목. BottomSheet `title` prop으로 위임 |
| `okLabel` | `string` | `'확인'` | 푸터 확인 버튼 레이블. BottomSheet `okLabel`로 위임 |
| `showCancel` | `boolean` | `true` | 취소 버튼 표시 여부. BottomSheet `showCancel`로 위임 |
| `okDisabled` | `boolean` | `false` | 확인 버튼 비활성. BottomSheet `okDisabled`로 위임 |
| `closeOnOverlay` | `boolean` | `true` | 오버레이 클릭 시 닫기. BottomSheet `closeOnOverlay`로 위임 |

#### 3-C. vant Picker Passthrough Props

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `columns` | `PickerOption[] \| PickerOption[][]` | `[]` | 옵션 데이터. 단일 컬럼은 `PickerOption[]`, 다중 독립 컬럼은 `PickerOption[][]`, cascading은 `children` 필드 포함 `PickerOption[]` |
| `columnsFieldNames` | `{ text?: string; value?: string; children?: string }` | `{ text: 'text', value: 'value', children: 'children' }` | `text`·`value`·`children` 필드명 커스터마이징 |
| `loading` | `boolean` | `false` | 로딩 인디케이터 표시, 휠 조작 불가 |
| `readonly` | `boolean` | `false` | 휠 스크롤 불가, 현재 선택값 표시만 |
| `optionHeight` | `number \| string` | `44` | 각 옵션 행의 높이 |
| `visibleOptionNum` | `number` | `6` | 한 번에 보이는 옵션 개수 |
| `swipeDuration` | `number` | `1000` | 빠른 스와이프 후 관성 스크롤 지속 시간 (ms) |
| `allowHtml` | `boolean` | `false` | 옵션 텍스트에 HTML 허용 (보안상 기본 비활성) |

> **`formatter` prop 미제공**: PinDatePicker와 달리 PinPicker는 일반 텍스트 옵션을 그대로 표시. 외부에서 `columns` 데이터를 직접 가공해 전달하는 것이 역할 분리에 적합.

---

### 4. Variant 목록

`columns`의 구조가 사실상 유일한 사용 패턴 축이다.

| 컬럼 구조 | 사용 맥락 |
|---------|---------|
| 단일 컬럼 (`PickerOption[]`) | 배송지 선택, 사이즈 선택, 색상 선택 등 1개 항목 선택 |
| 다중 독립 컬럼 (`PickerOption[][]`) | 시·분 선택, 무게·단위 선택 등 독립적인 복수 항목 동시 선택 |
| cascading 컬럼 (`children` 포함 `PickerOption[]`) | 시·군·구 지역 선택, 대분류→소분류 카테고리 선택 등 계층형 선택 |

---

### 5. 상태(State) 정의

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| default | BottomSheet 닫힘 | PinPicker 비표시 |
| open | BottomSheet 슬라이드 업, 휠 표시 | 옵션 선택 가능 |
| selected | 선택 항목 bold 텍스트 강조, 선택 강조 띠 표시 | 기능적 변화 없음 — 시각 강조만 |
| loading | 휠 영역에 로딩 인디케이터 오버레이 | 휠 스크롤 차단 |
| readonly | 휠이 정적으로 고정 | 옵션 변경 불가, confirm은 가능 |
| okDisabled | 확인 버튼 비활성 (BottomSheet 처리) | 확인 버튼 클릭 차단 |

---

### 6. 동작 규칙

- `open` prop이 `true`가 되면 BottomSheet가 올라오고, vant Picker가 body 영역에 렌더링된다.
- vant Picker의 내장 toolbar(`show-toolbar`)는 항상 `false`로 고정. 타이틀·확인·취소는 BottomSheet가 전담한다.
- 선택 항목(`.van-picker-column__item--selected`)은 `:deep()` 패턴으로 `font-weight: bold` 강조 처리. `.van-picker__frame`에는 `box-shadow`를 적용하지 않는다 — `border-top` · `border-bottom` · `border-radius`만 사용한다.
- 휠을 스크롤할 때마다 `change` 이벤트가 발생하고, 내부적으로 현재 선택값을 임시 보관한다 (confirm 전까지는 `modelValue`를 업데이트하지 않는다).
- BottomSheet의 `@ok` 이벤트가 발생하면 임시 보관 값을 `update:modelValue`로 emit하고 `confirm` 이벤트를 함께 emit한다.
- BottomSheet의 `@cancel` 또는 `@close` 이벤트가 발생하면 임시 보관 값을 폐기하고 `cancel` 이벤트를 emit한다. `modelValue`는 변경되지 않는다.
- **cascading 컬럼**의 경우 상위 컬럼 선택이 바뀌면 하위 컬럼이 자동으로 초기화된다 (vant Picker 내장 동작).
- **3D 드럼롤 효과**: PinDatePicker와 동일하게 MutationObserver + RAF(RequestAnimationFrame) 루프로 휠 항목에 `rotateX` + `opacity` 애니메이션을 적용. vant 기본 2D 렌더링 위에 CSS transform으로 덮어쓰는 방식.

---

### 7. 이벤트 목록

| 이벤트 | 발생 시점 | 전달 정보 |
|--------|---------|---------|
| `update:modelValue` | confirm 시점에 선택 확정 | `string[]` — 선택된 value 배열 |
| `update:open` | BottomSheet 닫힘 처리 시 | `false` |
| `confirm` | 확인 버튼 클릭 | `{ selectedValues: string[], selectedOptions: PickerOption[], selectedIndexes: number[] }` |
| `cancel` | 취소 버튼 또는 X 버튼 클릭 | `{ selectedValues: string[], selectedOptions: PickerOption[], selectedIndexes: number[] }` |
| `change` | 휠 스크롤로 선택 항목 변경 시 | `{ selectedValues: string[], selectedOptions: PickerOption[], selectedIndexes: number[], columnIndex: number }` |

---

### 8. 접근성 요구사항

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| 포커스 트랩 | BottomSheet 열린 상태 | BottomSheet(Radix Vue 기반) 내장 처리 |
| ESC 닫기 | BottomSheet 열린 상태 | BottomSheet 내장 처리 |
| 역할 알림 | 항상 | vant Picker 휠은 `role="listbox"` 내장 |
| 확인 버튼 비활성 | okDisabled | BottomSheet의 네이티브 `disabled` 처리 |

---

### 9. 디자인 토큰 매핑 (vant CSS 변수 오버라이드)

PinDatePicker와 동일한 토큰 체계를 적용한다.

| 영역 | 토큰 | vant CSS 변수 |
|------|------|--------------|
| 휠 배경 | `$bg-primary` | `--van-picker-background` |
| 비선택 항목 텍스트 | `$text-300` (근사) | `--van-picker-option-text-color` |
| 선택 항목 텍스트 | `$text-inverse` / `$font-weight-bold` | `--van-picker-option-selected-text-color` |
| 옵션 폰트 사이즈 | `$font-size-body2` | `--van-picker-option-font-size` |
| 로딩 아이콘 색상 | `$color-primary` | `--van-picker-loading-icon-color` |
| 선택 강조 띠 테두리 | `$line-300` | `.van-picker__frame` border-top / border-bottom |
| 선택 강조 띠 | `:deep()` 패턴으로 `.van-picker__frame` 오버라이드. `border-top` / `border-bottom` 유지, `box-shadow` 제거 | — |
| 선택 항목 강조 | `:deep(.van-picker-column__item--selected)` — `font-weight: bold` | — |

> **`.van-picker__frame` 스타일 정책**: `border-top` · `border-bottom` · `border-radius` 유지, `box-shadow` 미사용 (PinDatePicker 동일).

---

### 10. plugins/vant.ts 등록 필요

`van-picker` 온디맨드 등록 추가 필요. 현재 `plugins/vant.ts`에 DatePicker·PickerGroup만 등록되어 있음.

---

### 11. 사용 예시

```vue
<!-- 단일 컬럼 — 사이즈 선택 -->
<PinPicker
  v-model="selectedSize"
  v-model:open="isOpen"
  title="사이즈 선택"
  :columns="sizeOptions"
  @confirm="({ selectedValues }) => console.log(selectedValues)"
/>

<!-- 다중 독립 컬럼 — 시·분 선택 -->
<PinPicker
  v-model="selectedTime"
  v-model:open="isOpen"
  title="시간 선택"
  :columns="[hourOptions, minuteOptions]"
  @confirm="handleTimeConfirm"
/>

<!-- cascading 컬럼 — 지역 선택 -->
<PinPicker
  v-model="selectedRegion"
  v-model:open="isOpen"
  title="지역 선택"
  :columns="regionCascadeOptions"
  :ok-disabled="!selectedRegion.length"
  @confirm="handleRegionConfirm"
  @change="({ selectedValues }) => updatePreview(selectedValues)"
/>
```
