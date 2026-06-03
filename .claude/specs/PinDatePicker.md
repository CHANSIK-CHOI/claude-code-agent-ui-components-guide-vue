---
name: PinDatePicker
description: BottomSheet + vant DatePicker 조합 날짜 선택 팝업 컴포넌트
type: component
layer: popup
---

# PinDatePicker — 컴포넌트 명세

---

### 0. Atomic 계층 & 파일 배치

- **계층**: popup — BottomSheet(popup 카테고리)를 레이아웃으로 내부에서 사용하며, 독립적인 날짜 선택 팝업 단위로 동작하기 때문에 같은 popup 카테고리에 배치한다.
- **배치 경로**: `components/popup/PinDatePicker.vue`
- **Base/Wrapper 분리**: Base만

---

### 1. 컴포넌트 개요

날짜(연·월·일)를 드럼 롤 휠로 선택하는 바텀시트 팝업 컴포넌트. BottomSheet를 레이아웃으로 사용하고 body 영역에 vant DatePicker를 삽입하여 헤더·푸터 마크업을 직접 구현하지 않는다. 주로 회원 정보 입력(생년월일), 일정 선택, 배송 날짜 지정 등 모바일 날짜 입력 폼에서 사용한다.

---

### 2. 영역 구성 (Area Map)

- ① **헤더(타이틀 + 닫기 버튼)** — BottomSheet의 `title` prop과 `showClose` prop으로 렌더링. PinDatePicker가 직접 마크업하지 않는다.
- ② **바디 — 드럼 롤 휠** — BottomSheet의 default slot에 `<van-date-picker>` 삽입. vant의 자체 3D 스크롤 휠 UI 렌더링.
  - ②-a **선택 강조 띠 (indicator)** — 현재 선택된 항목을 가로로 가로지르는 강조 배경 띠. 상·하 border line으로 표현. vant 내장 렌더링. 선택 항목(`.van-picker-column__item--selected`)은 bold 텍스트로 강조 표시.
- ③ **푸터(확인 버튼)** — BottomSheet의 `okLabel`, `@ok` 이벤트로 처리.

> **내부 슬롯 위임 구조**: vant DatePicker의 자체 toolbar(`show-toolbar`)는 `false`로 비활성화. 타이틀·확인·취소는 BottomSheet가 전담.

---

### 3. Props 목록

#### 3-A. 컴포넌트 자체 Props

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `modelValue` | `string[]` | `[]` | 선택된 날짜. `['YYYY', 'MM', 'DD']` 형식. `v-model`로 양방향 바인딩 |
| `open` | `boolean` | `false` | 바텀시트 열림 여부. `v-model:open`으로 양방향 바인딩 |

#### 3-B. BottomSheet 위임 Props

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `title` | `string` | `''` | 헤더 영역 제목. BottomSheet `title` prop으로 위임 |
| `okLabel` | `string` | `'확인'` | 푸터 확인 버튼 레이블. BottomSheet `okLabel`로 위임 |
| `showCancel` | `boolean` | `true` | 취소 버튼 표시 여부. BottomSheet `showCancel`로 위임 |
| `okDisabled` | `boolean` | `false` | 확인 버튼 비활성. BottomSheet `okDisabled`로 위임 |
| `closeOnOverlay` | `boolean` | `true` | 오버레이 클릭 시 닫기. BottomSheet `closeOnOverlay`로 위임 |

#### 3-C. vant DatePicker Passthrough Props

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `columnsType` | `string[]` | `['year', 'month', 'day']` | 표시할 날짜 단위 배열 |
| `minDate` | `Date` | 10년 전 | 선택 가능한 최솟값 날짜 |
| `maxDate` | `Date` | 10년 후 | 선택 가능한 최댓값 날짜 |
| `loading` | `boolean` | `false` | 로딩 인디케이터 표시, 휠 조작 불가 |
| `readonly` | `boolean` | `false` | 휠 스크롤 불가, 현재 선택값 표시만 |
| `optionHeight` | `number \| string` | `44` | 각 옵션 행의 높이 (px 기본) |
| `visibleOptionNum` | `number` | `6` | 한 번에 보이는 옵션 개수 |
| `swipeDuration` | `number` | `1000` | 빠른 스와이프 후 관성 스크롤 지속 시간 (ms) |
| `formatter` | `(type: string, option: PickerOption) => PickerOption` | 연·월·일 접미사 자동 부가 | 옵션 표시 텍스트 가공 함수. 기본값으로 `year→년`, `month→월`, `day→일` 접미사를 각 컬럼 텍스트 뒤에 붙인다. `columnsType`이 일부 단위만 선택하는 경우(`['year', 'month']` 등)에도 해당 컬럼에만 적용된다. 외부에서 직접 전달하면 기본 접미사 동작이 완전히 교체된다. |
| `filter` | `(type: string, options: PickerOption[], values: string[]) => PickerOption[]` | — | 특정 조건의 옵션만 표시하는 필터 함수 |

---

### 4. Variant 목록

`columnsType`으로 표시 단위가 바뀌며, 이것이 사실상 유일한 variant 축이다.

| columnsType | 사용 맥락 |
|---|---|
| `['year', 'month', 'day']` | 생년월일 전체 선택 (기본) |
| `['year', 'month']` | 연·월만 선택 (카드 만료일, 구독 기간 등) |
| `['month', 'day']` | 월·일만 선택 (기념일, 반복 일정 등) |

---

### 5. 상태(State) 정의

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| default | BottomSheet 닫힘 | PinDatePicker 비표시 |
| open | BottomSheet 슬라이드 업, 휠 표시 | 날짜 선택 가능 |
| selected | 선택 항목 bold 텍스트 강조 | 기능적 변화 없음 — 시각 강조만 |
| loading | 휠 영역에 로딩 인디케이터 오버레이 | 휠 스크롤 차단 |
| readonly | 휠이 정적으로 고정됨 | 날짜 변경 불가, confirm은 가능 |
| okDisabled | 확인 버튼 비활성 (BottomSheet 처리) | 확인 버튼 클릭 차단 |

---

### 6. 동작 규칙

- `open` prop이 `true`가 되면 BottomSheet가 올라오고, vant DatePicker가 body 영역에 렌더링된다.
- vant DatePicker의 내장 toolbar(`show-toolbar`)는 항상 `false`로 고정. 타이틀·확인·취소는 BottomSheet가 전담한다.
- 선택 항목(`.van-picker-column__item--selected`)은 `:deep()` 패턴으로 `font-weight: bold` 강조 처리. `.van-picker__frame`에는 `box-shadow`를 적용하지 않는다 — `border-top` · `border-bottom` · `border-radius`만 사용한다.
- 휠을 스크롤할 때마다 `change` 이벤트가 발생하고, 내부적으로 현재 선택값을 임시 보관한다 (confirm 전까지는 `modelValue`를 업데이트하지 않는다).
- BottomSheet의 `@ok` 이벤트가 발생하면 임시 보관 값을 `update:modelValue`로 emit하고 `confirm` 이벤트를 함께 emit한다.
- BottomSheet의 `@cancel` 또는 `@close` 이벤트가 발생하면 임시 보관 값을 폐기하고 `cancel` 이벤트를 emit한다. `modelValue`는 변경되지 않는다.
- `formatter` prop의 기본값은 `(type, option) => ({ ...option, text: option.text + ({year:'년', month:'월', day:'일'}[type] ?? '') })`. 외부에서 `formatter`를 명시적으로 전달하면 기본 접미사 함수가 완전히 교체된다. 부분 오버라이드(일부 컬럼만 변경)가 필요하면 외부에서 기본 함수를 직접 조합해야 한다.

---

### 7. 이벤트 목록

| 이벤트 | 발생 시점 | 전달 정보 |
|--------|---------|---------|
| `update:modelValue` | confirm 시점에 선택 확정 | `string[]` — `['YYYY', 'MM', 'DD']` |
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
| 역할 알림 | 항상 | vant DatePicker 휠은 `role="listbox"` 내장 |
| 확인 버튼 비활성 | okDisabled | BottomSheet의 네이티브 `disabled` 처리 |

---

### 9. 디자인 토큰 매핑 (vant CSS 변수 오버라이드)

| 영역 | 토큰 | vant CSS 변수 |
|------|------|--------------|
| 휠 배경 | `$bg-primary` | `--van-picker-background` |
| 선택 항목 텍스트 | `$text-inverse` / `$font-weight-bold` | `--van-picker-option-selected-text-color` |
| 비선택 항목 텍스트 | `$text-300` (근사) | `--van-picker-option-text-color` |
| 선택 강조 띠 테두리 | `$line-300` | `.van-picker__frame` border-top / border-bottom |
| 선택 강조 띠 | `:deep()` 패턴으로 `.van-picker__frame` 오버라이드. `border-top` / `border-bottom` 유지, `box-shadow` 제거 | — |
| 선택 항목 강조 | `:deep(.van-picker-column__item--selected)` — `font-weight: bold` | — |

> **`.van-picker__frame` 스타일 정책**: `border-top` · `border-bottom` · `border-radius` 유지, `box-shadow` 미사용 (3D 효과 제거).

---

### 10. 사용 예시

```vue
<!-- 기본 사용 (생년월일) -->
<PinDatePicker
  v-model="birthDate"
  v-model:open="isOpen"
  title="생년월일 선택"
  :ok-label="dynamicLabel"
  :min-date="new Date(1900, 0, 1)"
  :max-date="new Date()"
  @confirm="({ selectedValues }) => console.log(selectedValues)"
  @change="({ selectedValues }) => updateLabel(selectedValues)"
/>

<!-- 연·월만 선택 -->
<PinDatePicker
  v-model="yearMonth"
  v-model:open="isOpen"
  title="적용 기간 선택"
  :columns-type="['year', 'month']"
  @confirm="handleConfirm"
/>
```
