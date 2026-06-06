# Vue UI Components Guide — Claude 설정

## 프로젝트 개요

**Claude Code를 활용한 컴포넌트 제작·검수 플로우 구축 & 컴포넌트 가이드** — 개인 프로젝트.

- 목표: 기획(spec) → 구현(SFC) → 검수(QA·시니어 리뷰)로 이어지는 **에이전트 기반 컴포넌트 제작 파이프라인**을 설계·운영하고, 그 산출물을 컴포넌트 가이드로 문서화한다.
- 산출물: Atomic Design 기반 컴포넌트 라이브러리 + 컴포넌트별 가이드 페이지(`pages/guide/*`)
- 페이지(서비스 화면) 제작은 본 프로젝트 범위가 아니다 — 컴포넌트 제작·검수·가이드 문서화에 집중한다.

## 환경

- OS: macOS
- Claude Code의 Bash 도구가 사용하는 셸: zsh (bash 호환)
- hook 스크립트: bash (`.claude/hooks/*.sh`) — `rules/hooks.md` 참조

## 개발 환경

- 스택: Vue 3.5.33 / Nuxt 3.10.3 / TypeScript
- 역할: 퍼블리셔 (React 경력 → Vue 첫 프로젝트)
- 스타일: SCSS / Atomic Design
- UI 라이브러리: Radix Vue (헤드리스), vant (DatePicker/Picker/PickerGroup 온디맨드)
- 에디터: VS Code / 패키지매니저: npm

### 고정 패키지 버전 (exact pin)

| 패키지          | 버전   | 비고                                                    |
| --------------- | ------ | ------------------------------------------------------- |
| vue             | 3.5.33 | `overrides`로 단일화(nuxt 내부 중첩 제거). `useId`·`useTemplateRef` 등 3.5 API 사용 가능 |
| nuxt            | 3.10.3 | Vite 5.x 기반 — `scss.api: 'modern-compiler'` 사용 불가 |
| radix-vue       | 1.9.17 | Stable 컴포넌트만 사용                                  |
| nuxt-svgo       | 4.2.6  |                                                         |
| sass            | 1.85.0 | `@use` 문법 사용 (`@import` deprecated)                 |
| vite-svg-loader | 5.1.1  |                                                         |

## 응답 방식 (필수)

- 결론 먼저, 이유 뒤에 (IMPORTANT)
- 모르면 "모른다"
- 답변 & 결과물은 한국어로 (IMPORTANT)
- Vue 코드 설명 시 **항상 React와 비교** — "React의 useState = Vue의 ref()"
- Vue 입문자 기준으로 친절하게, 코드 예시는 Vue/React 나란히

## 핵심 기술 결정

- 컴포넌트 패턴: Atomic Design (atoms / molecules / organisms) + 보조 카테고리 popup
- TypeScript 전면 사용 (`any` 금지)
- Vuetify 사용 금지 — 자체 디자인 시스템으로 대체
- 복잡한 UI (Dialog, Dropdown 등): Radix Vue **Stable** 컴포넌트만 래핑
- DatePicker: `vant` DatePicker/Picker/PickerGroup 사용 — Radix Vue Alpha 회피용. `plugins/vant.ts`에서 온디맨드 등록, 3개 컴포넌트만 허용
- v-model 양방향 바인딩: **`defineModel` 매크로 사용** (Vue 3.4+ 정식 매크로). 팝업 래퍼 open 제어는 `defineModel<boolean>('open', { required: true })` + base에 `v-model:open` 표준 (`defineProps`+`defineEmits('update:open')`+수동 포워딩 금지 — 한 곳만 빠져도 dim·ESC 닫힘 끊김). 단일 출처: `rules/components.md` §"v-model 양방향 바인딩" + `rules/popups.md` §3
- Radix Vue 컴포넌트 stability 매트릭스 및 외부 라이브러리 정책: `rules/libraries.md` 참조

## 슬래시 명령 실행 원칙 (필수, BLOCKING)

본 프로젝트의 모든 워크플로우 슬래시 명령(`/component-create`, `/component-revise`, `/component-audit`)을 실행할 때 다음 원칙을 반드시 준수한다.

### ❌ 절대 금지

- planner 에이전트(`uiux-planner-agents`)를 호출하지 않고 Claude 본인이 직접 spec 파일을 작성
- publisher 에이전트(`uiux-publisher-agents`)를 호출하지 않고 Claude 본인이 직접 `.vue`/`.scss`/`.ts` 파일 작성·수정
- QA 에이전트(`uiux-qa-agents`) 호출을 건너뛰고 "검수 완료" 보고
- 시니어 리뷰 에이전트(`vue-senior-reviewer-agents`) 호출을 건너뛰고 "검수 완료" 보고
- 명령 파일에 명시된 단계를 사용자 추가 확인 없이 임의로 생략·통합
- 명령 파일에 등장하는 `@uiux-planner-agents` / `@uiux-publisher-agents` 등의 표기를 단순 텍스트로 무시 — 이는 **Agent 도구 호출 지시**이다

### ✅ 반드시 수행

- 명령 파일에 적힌 모든 단계를 빠짐없이 Agent 도구로 실행 (`subagent_type` 명시)
- 단계 진입 직후 TaskCreate / TaskUpdate로 진행 상황 추적 (3단계 이상의 명령 모두 해당)
- 에이전트 응답 결과(diff, 보고서 등)를 사용자에게 보여주고 명령 파일에 명시된 승인 시점에서만 사용자 확인 요청
- 명령 4단계(검수)는 audit 명령 호출이 아닌 **inline으로 QA → 시니어 리뷰 에이전트를 직접 호출**

### 🔍 예외 조항 — spec 본문 생성 vs 저장 책임 분리

위 "❌ 절대 금지" 첫 항목("Claude 가 직접 spec 파일 작성")의 **예외**:

- **spec 본문 생성**: 반드시 planner 에이전트(`uiux-planner-agents`)가 출력한다. Claude 가 본문 텍스트를 직접 쓰면 안 된다.
- **spec 파일 저장 행위**: 에이전트는 파일 시스템 쓰기 권한이 없으므로, Claude 가 ExitPlanMode 호출 후 Write 도구로 에이전트 출력 본문을 그대로 저장한다.
- **즉**: "본문 = 에이전트 / 저장 = Claude" 의 두 책임이 분리되어 있으며, 저장 행위 자체는 금지 규칙 위반이 아니다. 단, 저장하기 전에 본문을 가공·수정·요약하는 것은 위반이다 (그건 "직접 작성"이다).

### Plan / Accept 모드 전환

`.claude/settings.json` `defaultMode: "plan"`으로 모든 세션이 plan mode로 시작한다.

- `/component-create`, `/component-revise` 1단계는 plan mode에서 진행 → ExitPlanMode 호출
- 2단계 이후 코드 변경을 위해 1단계 승인 직후 사용자가 `Shift+Tab`으로 accept mode 전환 (Claude는 모드 전환 불가)
- 명령 첫 출력에 "1단계 승인 후 Shift+Tab으로 accept mode 전환 필요" reminder를 표시한다

---

## 에이전트 카탈로그

본 프로젝트는 다음 4개 에이전트를 운영한다. 디자인 가이드가 별도로 정리되지 않은 환경 특성상, 디자인 가이드 역할은 planner 가 흡수한다.

- `uiux-planner-agents` — 컴포넌트 명세 작성 (`.claude/specs/*.md` 산출). 기획 + 디자인 토큰 매핑 통합 담당.
- `uiux-publisher-agents` — Vue SFC 구현. spec을 기준으로 마크업/스타일/접근성을 작성한다.
- `uiux-qa-agents` — 검수. Context7 MCP로 외부 라이브러리(Radix Vue, vant DatePicker/Picker/PickerGroup) API 사실 체크 + Playwright MCP로 가이드 페이지 실제 동작 검증. 코드 수정 권한 없음 (보고만).
- `vue-senior-reviewer-agents` — Vue 메커니즘/복잡도 리뷰. 단일 SFC + co-located composable 검토 (Composition API 관용구, watch/computed 적절성, props mutation 등, BLOCKER/WARN/INFO 등급). 코드 수정 권한 없음 (권고만, 실제 수정은 publisher).

### 에이전트 워크플로우

```
신규 컴포넌트:  /component-create  → uiux-planner(spec) → uiux-publisher(SFC) → 가이드 페이지(자동) → QA → 시니어 리뷰 → (BLOCKER 시 자동 분기 루프백 최대 2회)
기획 수정:      /component-revise  → uiux-planner(spec diff) → uiux-publisher(변경 부분 재구현) → 가이드 페이지 업데이트 → QA → 시니어 리뷰 → (publisher만 루프백)
기존 컴포넌트:  /component-audit   → (spec 부재 시 reverse-mode: planner가 코드 → spec 역추출) → QA → 시니어 리뷰 → (동일 루프백 정책)
```

루프백 분기 규칙:

- spec 자체 결함 → planner 부터 재실행
- 구현 영역 결함 → publisher 만 재실행
- 시니어 리뷰 영역은 항상 publisher 만 (spec 영역 아님)
- `/component-revise` 루프백은 항상 uiux-publisher 만 — spec은 1단계에서 사용자가 승인한 상태

### 작업 폴더 구조

본 프로젝트의 코드는 다음 폴더에 위치한다.

| 폴더            | 용도                                                                              |
| --------------- | --------------------------------------------------------------------------------- |
| `components/`   | atoms / molecules / organisms / popup 컴포넌트 + co-located composable + guide / icons 특수 폴더 |
| `pages/guide/`  | 컴포넌트별 가이드 페이지 (`pages/guide/[componentName]/index.vue`)                |
| `popups/guide/` | 팝업 가이드 페이지 데모용 콘텐츠 팝업 래퍼                                        |
| `assets/`       | SCSS 토큰·믹스인, 이미지·아이콘                                                   |
| `layouts/`      | Nuxt 레이아웃 (가이드 페이지는 `layouts/guide.vue`)                               |
| `plugins/`      | vant 온디맨드 등록 등 Nuxt 플러그인                                               |

- `@nd` alias 는 프로젝트 루트를 가리킨다 — `@nd/components/atoms`, `@nd/components/popup`, `@nd/assets/...`

### 컴포넌트 사용 정책 (BLOCKING)

- 가이드 페이지·데모 팝업 작업은 `components/` 안의 등록된 컴포넌트만 조합
  - `@nd/components/atoms`, `@nd/components/molecules`, `@nd/components/organisms`, `@nd/components/popup` (+가이드 전용 `@nd/components/guide`, 아이콘 `@nd/components/icons`)
- 신규 컴포넌트가 필요하면 `/component-create` 로 진행 (가이드 페이지 작업 안에서 신규 컴포넌트 SFC 작성 금지)

> **plan / accept mode 전환**은 위 "슬래시 명령 실행 원칙 → Plan / Accept 모드 전환" 섹션 참조.

## 유틸 명령 (워크플로우 외, Agent 위임 대상 아님)

다음 명령들은 위 "슬래시 명령 실행 원칙"의 BLOCKING 대상이 아니다 — 에이전트 위임 없이 Claude 가 직접 파일을 읽고 처리한다.

- `/sync-docs` — `.claude/rules/`·`agents/`·`commands/` 변경 사항을 CLAUDE.md / ONBOARDING.md 에 반영. 문서 동기화 전용.
- `/design:token-scaffold` — Figma → `design-tokens.json` 추출
- `/design:token-scss` — `design-tokens.json` → `assets/scss/abstracts/_variables.scss` 변환
- `/git:commit` — 포맷된 커밋 생성

## Rules 참조

자세한 규칙은 `.claude/rules/` 디렉토리 참조:

- `architecture.md` — 폴더 구조, Atomic 3계층 + 보조 카테고리(popup), 계층/카테고리 의존 규칙, pages 구조
- `components.md` — SFC 작성법, props/emit, slot, variant
- `style.md` — SCSS 규칙, BEM, 단위, 중첩, 변수 주입
- `a11y.md` — 접근성 기준 (aria, 키보드, 시맨틱 HTML, 이미지 placeholder 패턴)
- `tokens.md` — 디자인 토큰 네이밍 및 구조
- `libraries.md` — 외부 라이브러리(Radix Vue 등) stability 매트릭스 및 사용 정책
- `guide-page.md` — 컴포넌트 가이드 페이지 작성 규칙
- **`popups.md`** — **팝업 규칙 단일 출처(SSOT)**. 팝업 종류(콘텐츠/명령형) 구분, 폴더 구조, **open 제어(`defineModel('open')` + `v-model:open`)**, 비중첩 원칙, 내부 라우팅(닫힘 완료 후 이동), 제어 hook 정책
- **`spec-scope.md`** — spec 영역 / publisher 자율 영역 경계 (단일 출처). publisher 가 무엇을 spec 이탈로 보고할지 판정 매트릭스 포함. planner/publisher 에이전트가 공통 참조
- **`hooks.md`** — 자동화 hook 규칙 (Prettier 자동 포맷 + 타입체크 토글). 토글·검사 범위 단일 출처

## 프로젝트 외부 리소스

### Figma (단일 출처)

모든 Figma 관련 명령/에이전트는 아래 정보를 **단일 출처**로 참조한다. 명령 파일·spec 파일에 fileKey를 별도 하드코딩하지 않는다.

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

`_variables.scss`는 `nuxt.config.ts`의 `additionalData`로 모든 SCSS 블록에 자동 주입된다 (실제 주입 경로: `~/assets/scss/abstracts/variables`, `~/assets/scss/abstracts/mixins`).

## MCP 사용 정책

- **Figma MCP**: `/design:token-*` 명령 및 planner의 명세 작성 시 디자인 시각 참조에 사용. 인증 안 됐으면 사용자에게 `"Figma 인증해줘"` 입력 안내.
- **Context7 MCP**: 외부 라이브러리(Radix Vue, vant DatePicker/Picker/PickerGroup 등)의 props/events/slots 정확도가 결정적인 경우에는 컴포넌트 제작·수정 시 반드시 확인한다. `uiux-qa-agents`의 라이브러리 사실 체크에서도 사용. Vue 3.5 / Nuxt 3.10 자체 문법 등 학습 데이터로 충분한 내용은 호출하지 않는다.
- **Playwright MCP**: `uiux-qa-agents`의 가이드 페이지(`pages/guide/[componentName]/index.vue`) 실제 동작 검증 전용. dev server는 사용자가 사전에 `npm run dev`로 기동해야 한다 — 에이전트 자체 기동 금지. 미기동 감지 시 사용자에게 안내 후 대기.

## 자동화 hook (타입체크 / Prettier 포맷)

컴포넌트 작업 후 타입 에러·포맷 누락을 hook 으로 자동 검증한다 (`.claude/settings.json` 의 `hooks`, 스크립트는 `.claude/hooks/*.sh` — bash). 상세는 `rules/hooks.md` 단일 출처 참조.

- **Prettier 자동 포맷** (`format-on-edit.sh`, PostToolUse, **항상 ON**): 편집한 `.vue`/`.ts` 등을 `prettier --write` 로 즉시 포맷. 비차단.
- **타입체크** (`typecheck.sh`, Stop, **기본 ON / opt-out**): 종료 시 항상 `vue-tsc --noEmit` 실행 → git 변경된 `**/*.{ts,tsx,vue}` 파일의 에러만 필터 → 있으면 `exit 2` 로 수정 유도 (최대 3회 가드). `.claude/hooks/.typecheck-off` 플래그가 있을 때만 건너뛴다. ("자동 품질 검증" 실효성을 위해 기본 강제)
  - **끄기**: "타입체크 꺼줘" → Claude 가 `.typecheck-off` 생성 / **켜기**: "타입체크 켜줘" → 삭제(기본 복귀). `npm run typecheck` 로 수동 전체 검사도 가능.
- **문서 동기화 안내** (`detect-claude-changes.sh` + `notify-docs-sync.sh`): `.claude/rules|agents|commands/*.md` 변경 시 종료 시점에 `/sync-docs` 실행을 안내.
