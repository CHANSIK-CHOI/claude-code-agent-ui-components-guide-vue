# OptionButtonGroupGuidePage — 구현 메모

- **파일 경로**: pages/guide/optionButtonGroup/index.vue, pages/guide/optionButtonGroup/option-button-group.scss
- **계층**: guide
- **구현 완료일**: 2026-05-22
- **비표준 구현**:
  - `EmojiOptionItem` 인터페이스를 `OptionButtonItem`을 extend하여 로컬 타입으로 선언 (emoji 필드 추가)
  - ⑤ content slot 데모에서 `isSelected` 클래스 바인딩 예시 포함 (scoped data 활용 시연)
  - `delegationNote`는 type 분기(RadioGroupRoot / div role="group")를 명시하는 방식으로 작성
- **개발자 핸드오프**: 없음 (가이드 페이지)
- **GuideSidebar**: MOLECULES 그룹에 `{ label: 'OptionButtonGroup', to: '/guide/optionButtonGroup' }` 추가 완료
