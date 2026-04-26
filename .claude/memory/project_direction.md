---
name: desimone 프로젝트 방향
description: 아키텍처 전면 변경 결정 사항 (2026-04-24)
type: project
---

2026-04-24 현업 협의 후 프로젝트 전면 개편 결정.

**Why:** 기존 구조(Vuetify 기반, 비체계적 컴포넌트)를 자체 디자인 시스템으로 완전 교체.

**결정된 방향:**
- 컴포넌트 패턴: Atomic Design (atoms/molecules/organisms)
- TypeScript 전면 사용
- SCSS scoped 방식 (CSS Modules 금지)
- UI 라이브러리: Radix Vue (헤드리스), @vuepic/vue-datepicker
- Vuetify 완전 제거

**삭제 예정 폴더:** views/, components/, styles/
**유지:** pages/ (라우팅), TS 파일들, assets/scss/

**How to apply:** 새 컴포넌트 작업 시 반드시 Atomic Design 계층 고려. Vuetify 사용 제안 금지. 복잡한 UI는 Radix Vue 기반으로 래핑 제안.
