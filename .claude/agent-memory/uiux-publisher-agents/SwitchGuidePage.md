---
name: SwitchGuidePage
description: Switch 컴포넌트 가이드 페이지 구현 메모
type: project
---

# SwitchGuidePage — 구현 메모

- **파일 경로**:
  - `pages/guide/switch/index.vue`
  - `pages/guide/switch/switchGuidePage.scss`
- **계층**: guide
- **구현 완료일**: 2026-04-28
- **비표준 구현**:
  - `$border-default` 토큰 미존재 → `$line-200`으로 대체 (submitBtn border, propsTable border는 guide-page.md 규칙과 동일)
  - 섹션 ④ 폼 연동 데모에 `handleFormSubmit` 함수로 전송값을 화면에 출력하는 UX 추가
- **개발자 핸드오프**: 없음 (가이드 페이지 전용, API 연동 없음)
- **사이드바 등록**: `components/guide/GuideSidebar.vue` ATOMS 그룹에 Switch 항목 추가
