# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Frameout Pub — Claude 설정

## 개발 커맨드

```bash
npm run dev       # 개발 서버 (http://localhost:5000 — 기본 포트 5000, 3000 아님)
npm run build     # Nuxt SSR 빌드
npm run generate  # 정적 생성 (GitHub Pages 배포용)
npm run typecheck # vue-tsc 타입 체크 (CI 전 수동 실행)
```

> **배포**: `nuxt generate` → GitHub Pages. `nuxt.config.ts`의 `ssr: false` (SPA 모드), `baseURL: '/claude-code-agent-ui-components-guide-vue/'`.

## 개발 환경

- 스택: Vue 3.4.19 / Nuxt 3.10.3 / TypeScript
- 역할: 퍼블리셔 (React 경력 → Vue 첫 프로젝트)
- 스타일: SCSS / Atomic Design
- UI 라이브러리: Radix Vue (헤드리스), @vuepic/vue-datepicker
- 에디터: VS Code / 패키지매니저: npm

### 고정 패키지 버전 (exact pin — 실제 프로젝트와 동일)

| 패키지 | 버전 | 비고 |
|--------|------|------|
| vue | 3.4.19 | Vue 3.5+ API(`useTemplateRef`, `useId` 등) 사용 금지 |
| nuxt | 3.10.3 | Vite 5.x 기반 — `scss.api: 'modern-compiler'` 사용 불가 |
| radix-vue | 1.9.17 | Stable 컴포넌트만 사용 |
| nuxt-svgo | 4.2.6 | |
| sass | 1.85.0 | `@use` 문법 사용 (`@import` deprecated) |
| vite-svg-loader | 5.1.1 | |

## 응답 방식 (필수)

- 결론 먼저, 이유 뒤에 (IMPORTANT)
- 모르면 "모른다"
- 답변 & 결과물은 한국어로 (IMPORTANT)
- Vue 코드 설명 시 **항상 React와 비교** — "React의 useState = Vue의 ref()"
- Vue 입문자 기준으로 친절하게, 코드 예시는 Vue/React 나란히

## 핵심 기술 결정

- 컴포넌트 패턴: Atomic Design (atoms / molecules / organisms)
- TypeScript 전면 사용 (`any` 금지)
- Vuetify 사용 금지 — 자체 디자인 시스템으로 대체
- 복잡한 UI (Dialog, Dropdown 등): Radix Vue **Stable** 컴포넌트만 래핑
- DatePicker: `@vuepic/vue-datepicker` 유지 — Radix Vue Calendar/DatePicker는 Alpha
- Radix Vue 컴포넌트 stability 매트릭스 및 외부 라이브러리 정책: `rules/libraries.md` 참조

## 에이전트 카탈로그

본 프로젝트는 다음 네 에이전트를 운영한다. 디자인 가이드가 별도로 정리되지 않은 환경 특성상, 디자인 가이드 역할은 planner가 흡수한다.

- `uiux-planner-agents` — 컴포넌트 명세 작성 (`.claude/specs/*.md` 산출). 기획 + 디자인 토큰 매핑 통합 담당.
- `uiux-publisher-agents` — Vue SFC 구현. spec을 기준으로 마크업/스타일/접근성을 작성한다.
- `uiux-qa-agents` — 검수. Context7 MCP로 외부 라이브러리(Radix Vue, @vuepic/vue-datepicker) API 사실 체크 + Playwright MCP로 가이드 페이지 실제 동작 검증. 코드 수정 권한 없음 (보고만).
- `vue-senior-reviewer-agents` — Vue 메커니즘/복잡도 리뷰. Composition API 관용구, watch/computed 적절성, props mutation 등 검토. 코드 수정 권한 없음 (권고만, 실제 수정은 publisher).

### 에이전트 워크플로우

```
신규 컴포넌트:  /component-create  → planner(spec) → publisher(SFC) → 가이드 페이지(자동) → QA → 시니어 리뷰 → (BLOCKER 시 자동 분기 루프백 최대 2회)
기획 수정:      /component-revise  → planner(spec diff) → publisher(변경 부분 재구현) → 가이드 페이지 업데이트 → QA → 시니어 리뷰 → (publisher만 루프백)
기존 컴포넌트:  /component-audit   → (spec 부재 시 reverse-mode: planner가 코드 → spec 역추출) → QA → 시니어 리뷰 → (동일 루프백 정책)
```

루프백 분기 규칙:
- spec 자체 결함 → planner 부터 재실행
- 구현 영역 결함 → publisher 만 재실행
- 시니어 리뷰 영역은 항상 publisher 만 (spec 영역 아님)
- `/component-revise` 루프백은 항상 publisher 만 — spec은 1단계에서 사용자가 승인한 상태

> **plan / accept mode 전환**: `.claude/settings.json` `defaultMode: "plan"` 으로 모든 세션이 plan mode로 시작한다. `/component-create` 1단계는 plan mode에서 그대로 진행하며, 2단계 이후 코드 변경 자동 진행을 위해서는 **1단계 승인 직후 사용자가 `Shift+Tab`으로 accept mode로 수동 전환**해야 한다. (Claude Code는 명령 내부에서 mode를 자동 전환할 수 없다.) `/component-audit`, `/component-revise`도 동일 — 1단계 승인 후 수동 전환 필요.

## 아키텍처 핵심 패턴

### 경로 alias

`@nd` → 프로젝트 루트. 모든 cross-directory import는 `@nd/` prefix 사용.

```ts
import type { ButtonShape } from '@nd/components/types'
import { useButtonVariant } from './useButtonVariant'  // 같은 폴더는 상대경로
```

### 컴포넌트 폴더 구조 (특수 폴더)

- `components/icons/` — `Icon.vue` 단일 컴포넌트. SVG는 `nuxt-svgo`로 자동 임포트되며 `currentColor`로 색상 변환됨
- `components/popup/` — Popup 계열 전체 (organisms 아님). 아래 팝업 시스템 참조
- `components/guide/` — 가이드 페이지 전용 레이아웃 컴포넌트 (GuideHeader, GuideSidebar)

### 팝업 시스템 — 프로그래매틱 API

Alert/Confirm은 컴포넌트를 직접 사용하지 않고 composable로 호출한다.

```ts
// 사용 측
const { open: openAlert } = useAlert({ title: '...', onConfirm: () => {} })
const { open: openConfirm } = useConfirm({ title: '...', onConfirm: () => {}, onCancel: () => {} })
```

내부 동작: `useAlert`/`useConfirm` → `usePopupManager.mount()` → `PopupRenderer.vue`가 instances를 렌더링 (layout에 마운트됨). Toast는 `ToastRenderer.vue` + `useToastPopup`으로 별도 운영.

`PopupRenderer`와 `ToastRenderer`는 `<ClientOnly>`로 감싸져 있어야 SSR/정적 생성에서 에러 없음.

### Button SCSS 공유 믹스인

Button/ButtonLink는 스타일을 SFC 인라인이 아닌 외부 mixin 파일로 공유한다.

```scss
// Button.vue, ButtonLink.vue 공통 패턴
@use '@nd/assets/scss/components/button-base' as *;
@include button-base('button');   // BEM block명 전달
```

### SCSS 변수 자동 주입

`nuxt.config.ts`의 `vite.css.preprocessorOptions.scss.additionalData`로 `_variables.scss`가 **모든 `<style>` 블록에 자동 주입**된다. `@use`/`@import` 없이 모든 토큰 변수 즉시 사용 가능.

### 레이아웃

- `layouts/default.vue` — 일반 페이지
- `layouts/guide.vue` — GuideHeader + GuideSidebar + `<slot />` 구조. 가이드 페이지(`pages/guide/**`)에서 사용

### 가이드 페이지

신규 컴포넌트마다 `pages/guide/[componentName]/index.vue`를 생성한다. 상세 규칙은 `rules/guide-page.md` 참조.

## Rules 참조

자세한 규칙은 `.claude/rules/` 디렉토리 참조:

- `architecture.md` — 폴더 구조, Atomic Design 계층, pages 구조
- `components.md` — SFC 작성법, props/emit, slot, variant
- `style.md` — SCSS 규칙, BEM, 단위, 중첩, 변수 주입
- `a11y.md` — 접근성 기준 (aria, 키보드, 시맨틱 HTML)
- `tokens.md` — 디자인 토큰 네이밍 및 구조
- `libraries.md` — 외부 라이브러리(Radix Vue 등) stability 매트릭스 및 사용 정책

## 프로젝트 외부 리소스

### Figma (단일 출처)

모든 Figma 관련 명령/에이전트는 아래 정보를 **단일 출처**로 참조한다. 명령 파일·spec 파일에 fileKey를 별도 하드코딩하지 않는다.

- 파일명: `[디자인작] 드시모네몰 리뉴얼_2차`
- fileKey: `4hhLCzE3QlJughv3UqIzAH`
- 노드 (URL의 `node-id=A-B`는 MCP 호출 시 `A:B` 형식으로 변환):
  - 가이드(작업중) 페이지: `40004010:2` — 컴포넌트 명세 작성 시 시각 참조
  - Colors: `40004031:2027` — `/design:token-scaffold` 색상 추출
  - Typography: `40004010:937` — `/design:token-scaffold` 타이포 추출

### 토큰 추출 워크플로우

```
1) /design:token-scaffold  → Figma → design-tokens.json (프로젝트 루트)
2) /design:token-scss      → design-tokens.json → assets/scss/abstracts/_variables.scss
```

`_variables.scss`는 `nuxt.config.ts`의 `additionalData`로 모든 SCSS 블록에 자동 주입된다.

## MCP 사용 정책

- **Figma MCP**: `/design:token-*` 명령 및 planner의 명세 작성 시 디자인 시각 참조에 사용. 인증 안 됐으면 사용자에게 `"Figma 인증해줘"` 입력 안내.
- **Context7 MCP**: 외부 라이브러리(Radix Vue, @vuepic/vue-datepicker 등)의 props/events/slots 정확도가 결정적인 경우에는 컴포넌트 제작·수정 시 반드시 확인한다. `uiux-qa-agents`의 라이브러리 사실 체크에서도 사용. Vue 3.4 / Nuxt 3.10 자체 문법 등 학습 데이터로 충분한 내용은 호출하지 않는다.
- **Playwright MCP**: `uiux-qa-agents`의 가이드 페이지(`pages/guide/[componentName]/index.vue`) 실제 동작 검증 전용. dev server는 사용자가 사전에 `npm run dev`로 기동해야 한다 — 에이전트 자체 기동 금지. 미기동 감지 시 사용자에게 안내 후 대기.
