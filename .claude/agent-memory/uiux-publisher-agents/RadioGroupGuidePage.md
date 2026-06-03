# RadioGroupGuidePage — 구현 메모

- **파일 경로**: pages/guide/radioGroup/index.vue + pages/guide/radioGroup/radioGroupGuidePage.scss
- **계층**: guide
- **구현 완료일**: 2026-05-13
- **비표준 구현**:
  - `RadioGroupItem` 타입 import — `@nd/components/atoms`에서 re-export 확인 후 사용
  - FormField 연동 섹션에서 `input-id`와 RadioGroup의 `id` prop을 맞춰 aria 연결
  - ④ FormField 섹션의 Props/Slots 표는 중복 금지 규칙에 따라 Input 가이드 참조 안내문만 포함
  - 섹션 구성: ① 기본 horizontal / ② vertical / ③ 상태별(5종) / ④ FormField 연동 / ⑤ Props·Events 테이블
- **개발자 핸드오프**: 없음 (가이드 페이지 — UI 데모 전용)
- **GuideSidebar 변경**: ATOMS 그룹 Progress 다음에 RadioGroup 항목 추가 (`/guide/radioGroup`)
