# PinPicker — 구현 메모

- **파일 경로**: components/popup/PinPicker.vue
- **계층**: popup
- **구현 완료일**: 2026-05-14
- **비표준 구현**: PinDatePicker와 동일한 MutationObserver + RAF 3D 드럼롤 효과 적용. vant `<van-picker>` 사용 (van-date-picker와 달리 columns/columnsFieldNames prop 구조)
- **개발자 핸드오프**: columns prop — API 연동 시 실제 옵션 데이터 배열로 교체 필요
