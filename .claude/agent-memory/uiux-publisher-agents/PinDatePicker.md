# PinDatePicker — 구현 메모

- **파일 경로**: components/popup/PinDatePicker.vue
- **계층**: popup
- **구현 완료일**: 2026-05-14
- **비표준 구현**:
  - vant `<van-date-picker>` 래핑 (`show-toolbar="false"` 고정)
  - BottomSheet를 레이아웃으로 내부 사용 (마크업 직접 구현 없음)
  - pendingValue 패턴: confirm 전까지 임시 보관, @ok 시에만 update:modelValue emit
  - `PickerConfirmEventParams`, `PickerChangeEventParams` 타입 import from 'vant'
  - `$text-inverse` 토큰 미존재 → `$text-900`으로 대체 (spec §9: `$text-inverse` 근사)
  - handleClose에서 pendingValue 복원만 수행 (update:open은 BottomSheet가 자동 emit)
  - `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` → BottomSheet에 위임
  - `defaultFormatter`: script setup 내부에 정의 (`year→년`, `month→월`, `day→일` 접미사 자동 부가). `withDefaults`에서 `formatter: () => defaultFormatter`로 기본값 설정. 외부에서 전달 시 완전 교체.
- **개발자 핸드오프**:
  - `formatter` prop — 기본값으로 연·월·일 접미사 자동 부가. 외부 전달 시 기본 동작 완전 교체. 부분 오버라이드 필요 시 외부에서 defaultFormatter를 직접 조합해야 함.
  - `filter` prop — 특정 옵션만 표시 (6의 배수 월 등)
  - `@confirm` emit payload의 `selectedOptions` / `selectedIndexes` 는 현재 빈 배열 — vant DatePicker change 이벤트에서 받은 값이 없으므로 개발자가 필요 시 ref로 추적
