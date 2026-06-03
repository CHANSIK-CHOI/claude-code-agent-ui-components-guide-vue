---
name: Collapsible
description: Collapsible molecules 컴포넌트 구현 메모 (애니메이션 내부화 포함)
type: project
---

# Collapsible — 구현 메모

- **파일 경로**: `components/molecules/Collapsible.vue`
- **계층**: molecules
- **구현 완료일**: 2026-05-11
- **비표준 구현**:
  - Radix Vue CollapsibleRoot 래핑, Provider 패턴 (scoped slot으로 TriggerComponent·ContentComponent 노출)
  - `defineComponent` + `h()` 렌더 함수로 TriggerComponent·ContentComponent 생성 — Vue template 방식 불가 (scoped slot 전달 구조)
  - **BLOCKER 수정 이력 (2026-05-11)**: `resolveComponent('CollapsibleTrigger')` 패턴 제거. Nuxt auto-import는 `<script setup>` 최상위 컨텍스트에서만 처리되며 `defineComponent` 내부 렌더 함수 안에서는 HTML 비표준 태그로 fallback됨. `import { CollapsibleTrigger, CollapsibleContent } from 'radix-vue'`로 명시적 import 필수.
  - `COLLAPSIBLE_ROOT_PROPS`에 `'default-open'` 포함 (kebab-case 대비)
  - attrs 2단계 위임: rootAttrs(`open`/`defaultOpen`/`disabled`/`dir`) → CollapsibleRoot, triggerAttrs(나머지) → TriggerComponent 내부 CollapsibleTrigger
  - Icon은 atoms barrel이 아닌 `@nd/components/icons/Icon.vue`에서 직접 import (icons 폴더 별도)
  - **`#trigger-icon` 슬롯 폐지** — 기본 아이콘은 `<Icon size="sm"><CircularArrowSvg /></Icon>`
  - **애니메이션 내부화 (spec 변경 2026-05-11)**: `<style lang="scss" scoped>` 블록 추가
    - `contentAnimation` prop(`true` 기본): `collapsible__content--animated` 클래스 → `@keyframes collapsibleSlideDown/Up` + `--radix-collapsible-content-height` CSS 변수
    - `triggerAnimation` prop(`true` 기본): `collapsible__trigger--animated` 클래스 → `CollapsibleTrigger[data-state] > *` 선택자로 rotate transition 적용
    - closed → `rotate(90deg)` (→ 방향), open → `rotate(0deg)` (↑ 방향), `$duration-fast ease`
    - `<style scoped>` 클래스가 동적 컴포넌트(`defineComponent`)에 직접 바인딩되므로 `:deep()` 불필요
  - 이전에는 완전 headless였으나 애니메이션은 이제 컴포넌트 내부 처리 — 사용처는 레이아웃·색상·간격만 담당
- **가이드 페이지 최종 구조 (2026-05-11 업데이트)**:
  - ① 패턴 A: 아이콘 버튼만 트리거 / ② 패턴 B: 텍스트+아이콘 전체가 트리거
  - ③ defaultOpen (uncontrolled) / ④ v-model:open (controlled)
  - ⑤ triggerAnimation=false 데모 (신규 — 커스텀 트리거 형태 대응)
  - ⑥ Props/Slots/Events 테이블 + delegationNote + radixNote
  - Props 테이블에 `contentAnimation`(boolean, true), `triggerAnimation`(boolean, true) 행 추가
  - 가이드 페이지 SCSS에서 아이콘 회전(:deep svg, data-state)·height 애니메이션(@keyframes collapsibleOpen/Close) 코드 제거 — 컴포넌트 내부로 이전됨
  - 토큰 대체: `$text-secondary` → `$text-600`, `$text-strong` → `$text-900`, `$border-default` → `$line-200`
- **개발자 핸드오프**: 없음 (순수 UI 컴포넌트)
