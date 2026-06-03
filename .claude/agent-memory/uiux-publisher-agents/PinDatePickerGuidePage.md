# PinDatePickerGuidePage — 구현 메모

- **파일 경로**: pages/guide/pinDatePicker/index.vue + pages/guide/pinDatePicker/pinDatePicker.scss
- **계층**: guide
- **구현 완료일**: 2026-05-13
- **비표준 구현**:
  - Radix Vue 기반이 아닌 Vant DatePicker 기반 컴포넌트이므로 `__radixNote` 대신 `__vantNote` 사용
  - `@confirm` 이벤트에서 직접 `open = false` 처리 (useBottomSheet composable 미사용 — PinDatePicker가 open prop을 직접 제어)
  - `border-left` 색상에 `$border-default` 토큰 미존재로 `$line-300` 대체 사용
- **개발자 핸드오프**: 없음 (가이드 페이지 전용, 더미 데이터만 사용)
- **GuideSidebar**: ORGANISMS 그룹 하단에 PinDatePicker 항목 추가
