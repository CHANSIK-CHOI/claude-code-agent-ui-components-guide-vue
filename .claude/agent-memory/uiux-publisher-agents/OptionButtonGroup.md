# OptionButtonGroup — 구현 메모

- **파일 경로**: components/molecules/OptionButtonGroup.vue
- **계층**: molecules
- **구현 완료일**: 2026-05-22 (rowColumns 기능 추가: 2026-05-22 / subLabel 추가: 2026-05-29)
- **비표준 구현**:
  - Radix Vue RadioGroupRoot(radio type) + CheckboxRoot(checkbox type) 직접 래핑
  - RadioGroupItem / CheckboxRoot가 Radix 내부에서 `<button>`을 렌더하므로 scoped attr 미전달 → `.optionButtonGroup__item` 포함 모든 내부 선택자에 `:deep()` 적용
  - selectedColor는 CSS custom property(`--option-selected-color`)로 주입, 선택 배경·테두리에 `var(--option-selected-color, #{$text-900})` 패턴 사용
  - columns는 `--option-columns` custom property로 주입해 `grid-template-columns: repeat(var(--option-columns, 2), 1fr)` 적용
  - **rowColumns 비대칭 레이아웃**: `useRowColumns` computed(빈 배열 폴백 포함) + `rowGroups` computed(누적합 기준 RowGroup[] 분리) + `.optionButtonGroup--rowColumns` modifier 클래스로 컨테이너를 flex-column 전환 + `__row` 래퍼 div에 `gridTemplateColumns` 인라인 스타일 주입
  - `rowColumns` + `maxRows` 조합: rowGroups 슬라이싱으로 처리 (groups.slice(0, maxRows))
  - 배지 배경 `rgba(17,17,17,0.7)` — 토큰 rgba 직접 구성 불가로 raw rgba 사용 (spec §11 명시)
  - `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` 를 RadioGroupRoot(radio) / div(checkbox) 각각에 위임
  - **subLabel**: `OptionButtonItem.subLabel?: string` — 슬롯 미사용(기본 콘텐츠) 시에만 `__label` 아래 렌더. 미선택 시 `$text-600`, 선택 시 `:deep(.#{$b}__item--selected .#{$b}__subLabel) { color: $text-white }` 선택자로 재정의
- **개발자 핸드오프**:
  - `items` prop — API 연동 필요 (배열). `OptionButtonItem.subLabel` 필드 추가됨
  - `modelValue` prop — 폼 선택 값 바인딩
  - `@change` emit — 선택 변경 시 개발자 수신용 (API 호출 등)
  - `name`, `required` prop — 폼 연동 시 활성화
