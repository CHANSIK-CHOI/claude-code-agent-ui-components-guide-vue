# PinPickerGuidePage — 구현 메모

- **파일 경로**: pages/guide/pinPicker/index.vue + pages/guide/pinPicker/pinPicker.scss
- **계층**: guide
- **구현 완료일**: 2026-05-14
- **비표준 구현**: 없음. pinDatePicker 가이드 페이지 패턴 그대로 준수
- **개발자 핸드오프**: sizeColumns / hourColumns / minuteColumns / regionColumns — API 연동 시 교체 필요
- **GuideSidebar**: ORGANISMS 그룹의 PinDatePicker 바로 다음에 PinPicker 추가
- **섹션 구성**: ①단일컬럼(사이즈) / ②다중독립컬럼(시분) / ③cascading(지역) / ④상태데모(loading/readonly/okDisabled 토글) / ⑤Props+Events 테이블
- **특이사항**: 상태 섹션에서 PinPicker를 열기 전 토글 버튼으로 상태 전환 가능하도록 구성 (pinDatePicker와 다른 UX — 상태 토글이 팝업 밖에 노출)
