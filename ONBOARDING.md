# ONBOARDING — Vue UI Components Guide

**Claude Code를 활용한 컴포넌트 제작·검수 플로우 구축 & 컴포넌트 가이드** — 개인 프로젝트의 Claude Code 작업 환경 안내 문서입니다.
기획(spec) → 구현(SFC) → 검수(QA·시니어 리뷰)로 이어지는 에이전트 기반 파이프라인으로 컴포넌트를 제작하고, 그 결과를 가이드 페이지로 문서화합니다.

---

## 1. 전체 구조 한눈에 보기

```
.claude/
├── CLAUDE.md            ← 프로젝트 최상위 설정 (환경·기술 결정·명령 원칙·에이전트 카탈로그)
├── settings.json        ← 권한·hook·MCP 설정 (defaultMode: plan)
├── rules/               ← 작업 규칙 10개 (아래 표)
├── agents/              ← 에이전트 4개 정의
├── commands/            ← 슬래시 명령 (component-* 3개 + 유틸 4개)
├── specs/               ← 컴포넌트 명세 (planner 산출물)
├── agent-memory/        ← 에이전트별 작업 메모리 (git 포함, 세션 간 공유)
└── hooks/               ← bash 자동화 스크립트 (포맷·타입체크·문서 동기화 안내)

components/   atoms / molecules / organisms / popup + guide / icons
pages/guide/  컴포넌트별 가이드 페이지
popups/guide/ 가이드 데모용 콘텐츠 팝업 래퍼
assets/       SCSS 토큰·믹스인, 이미지·아이콘
```

**rules/ 디렉토리 (판단 기준 단일 출처)**

| 파일 | 내용 |
|------|------|
| `architecture.md` | Atomic 3계층 + 보조 카테고리(popup), 의존 규칙, barrel export, pages 구조 |
| `components.md` | SFC 작성법, props/emit, defineModel, $attrs 위임, Radix Vue 래핑 |
| `style.md` | SCSS·BEM·`$b` 변수, 단위(rem), 중첩 규칙, flex/gap 정책 |
| `a11y.md` | 시맨틱 HTML, role 우회 금지, 폼 라벨, 이미지 placeholder 패턴 |
| `tokens.md` | 디자인 토큰 네이밍·전체 토큰 참조표 (목록 외 토큰 사용 금지) |
| `libraries.md` | Radix Vue Stable/Alpha 매트릭스, vant 정책 |
| `guide-page.md` | 가이드 페이지 작성 규칙 (Props 테이블, delegationNote, radixNote) |
| `popups.md` | 팝업 SSOT — open 제어(defineModel), 비중첩, 내부 라우팅 |
| `spec-scope.md` | spec 영역 / publisher 자율 영역 경계 + 이탈 보고 매트릭스 |
| `hooks.md` | 자동화 hook 상세 (포맷 항상 ON / 타입체크 토글) |

---

## 2. 권한 설정

`.claude/settings.json`:

- **allow**: `git *`, `npm *`, `npx *`, `curl -s *`, Read/Write 전체, Figma·Playwright·Context7 MCP
- **deny**: `git push *`, `rm -rf *`, `wget*`, `ssh*`, `.env` 파일 쓰기
- **defaultMode: `plan`** — 모든 세션이 plan mode로 시작. 워크플로우 명령 1단계 승인 후 `Shift+Tab`으로 accept 전환 필요

---

## 3. 훅 설정 (bash — macOS)

| 스크립트 | 타입 | 동작 |
|---|---|---|
| `format-on-edit.sh` | PostToolUse (Edit\|Write) | 편집 파일 즉시 `prettier --write`. **항상 ON**, 비차단 |
| `typecheck.sh` | Stop | `.typecheck-on` 플래그 존재 시에만 `vue-tsc --noEmit` → git 변경 파일 에러만 필터 → 있으면 exit 2 (최대 3회 가드). **기본 OFF** — "타입체크 켜줘/꺼줘"로 토글 |
| `detect-claude-changes.sh` | PostToolUse | `.claude/rules\|agents\|commands/*.md` 변경 시 `.docs-dirty` 기록 |
| `notify-docs-sync.sh` | Stop | `.docs-dirty` 존재 시 `/sync-docs` 실행 안내 출력 |

---

## 4. 슬래시 명령

**워크플로우 명령 (BLOCKING — 반드시 에이전트 위임, 단계 생략 금지)**

```
/component-create {ComponentName}   # 신규: planner(spec) → publisher(SFC) → 가이드 페이지 → QA → 시니어 리뷰
/component-revise {ComponentName}   # 기획 수정: spec diff → 변경 부분 재구현 → 가이드 갱신 → QA → 리뷰
/component-audit  {ComponentName}   # 기존 검수: (spec 없으면 reverse-mode 역추출) → QA → 리뷰
```

- 1단계(plan mode) 승인 후 `Shift+Tab` accept 전환
- BLOCKER 발견 시 자동 루프백 (spec 결함→planner / 구현 결함→publisher, 최대 2회)
- publisher의 "⚠️ Spec 이탈 항목" 표는 Claude가 spec 파일에 자동 현행화 (`rules/spec-scope.md §4`)

**유틸 명령 (에이전트 위임 없음)**

```
/sync-docs              # rules·agents·commands 변경 → CLAUDE.md + ONBOARDING.md 반영
/design:token-scaffold  # Figma → design-tokens.json
/design:token-scss      # design-tokens.json → _variables.scss
/git:commit             # 포맷된 커밋 생성
```

---

## 5. 에이전트 카탈로그 (4개)

| 에이전트 | 역할 | 권한 |
|---|---|---|
| `uiux-planner-agents` | 컴포넌트 명세 작성 (기획 + 디자인 토큰 매핑 통합) | spec 본문 출력만 — 저장은 호출자(Claude) |
| `uiux-publisher-agents` | Vue SFC 구현 (마크업·스타일·접근성) + 가이드 페이지 | `.vue`/`.scss` 작성·수정 |
| `uiux-qa-agents` | Context7로 라이브러리 API 팩트체크 + Playwright로 가이드 페이지 실동작 검증 | 보고만 (수정 불가) |
| `vue-senior-reviewer-agents` | Vue 메커니즘·복잡도 리뷰 (BLOCKER/WARN/INFO) | 권고만 (수정은 publisher) |

- 책임 분리 핵심: **본문 = 에이전트 / 저장 = Claude** (CLAUDE.md "🔍 예외 조항")
- 각 에이전트는 `.claude/agent-memory/{agent}/`에 컴포넌트별 메모를 남긴다 (덮어쓰기, 이력은 git)

---

## 6. MCP 서버

| 서버 | 용도 | 주의 |
|---|---|---|
| **Figma** | `/design:token-*` 추출, planner 시각 참조 | 미인증 시 "Figma 인증해줘" 안내. fileKey는 CLAUDE.md 단일 출처 |
| **Context7** | 외부 라이브러리(Radix Vue·vant 등) API 사실 확인 | Vue/Nuxt 자체 문법은 호출 금지 (학습 데이터로 충분) |
| **Playwright** | QA의 가이드 페이지 실동작 검증 | dev server는 사용자가 `npm run dev`로 사전 기동 — 에이전트 자체 기동 금지 |

---

## 7. 검수 흐름

```
publisher 구현 완료
  → QA (uiux-qa-agents)
      ├─ Context7: 존재하지 않는 prop/event/slot, Alpha 컴포넌트, 3단계 위임 누락 → BLOCKER
      └─ Playwright: 콘솔 에러, 키보드 접근, aria, 상태별 시각 → BLOCKER/WARN
  → PASS 시 시니어 리뷰 (vue-senior-reviewer-agents)
      └─ props mutation, 반응성 누수, watch 남용, $attrs 순서 → BLOCKER/WARN/INFO
  → BLOCKER 시 루프백: spec 결함 → planner / 구현 결함 → publisher (항상 publisher가 수정 실행)
```

- Playwright 미수행 상태로 PASS 판정 절대 금지 (`BLOCKED`/`PARTIAL`로 보고)
- WARN은 사용자에게 묻고 결정, INFO는 보고만

---

## 8. 자주 쓰는 시나리오

| 하고 싶은 것 | 방법 |
|---|---|
| 새 컴포넌트 추가 | `/component-create Tooltip` → spec 승인 → Shift+Tab → 자동 진행 |
| 기존 컴포넌트 기획 변경 | `/component-revise Select` (spec diff 승인 후 publisher만 재구현) |
| 컴포넌트 품질 점검 | `/component-audit Button` (dev server 기동 후) |
| 타입체크 켜기/끄기 | "타입체크 켜줘" / "타입체크 꺼줘" |
| Figma 토큰 갱신 | `/design:token-scaffold` → `/design:token-scss` |
| 규칙 파일 수정 후 문서 반영 | `/sync-docs` (Stop hook이 자동으로 안내) |
| 커밋 | `/git:commit` (git push는 deny — 수동) |

---

## 9. 주의사항

- **Vue 3.4.19 고정** — `useTemplateRef`, `useId` 등 **3.5+ API 금지** (`defineModel`은 3.4 정식이라 허용)
- **Radix Vue Stable만** — Alpha(DatePicker 등)는 vant 또는 자체 구현으로 대체 (`rules/libraries.md`)
- **SVG는 `?component`로 import 시 번들에 인라인됨** — `<img :src>`로 쓸 이미지나 base64가 내장된 대용량 SVG는 `?url`로 import해 별도 에셋으로 분리 (번들 청크 비대화 방지)
- **raw hex·임의 토큰 금지** — `rules/tokens.md` 참조표에 있는 토큰만 사용
- **팝업 open 제어는 `defineModel('open')` + `v-model:open` 표준** — 수동 포워딩·`defineExpose({open})`·`v-if` 마운트 제어 금지 (`rules/popups.md §3`)
- **카테고리 barrel import만 허용** — 개별 `.vue` 직접 import 금지 (`@nd/components/atoms` 등)
- 워크플로우 명령에서 **Claude가 직접 spec/SFC를 작성하는 것 금지** — 반드시 에이전트 위임 (CLAUDE.md BLOCKING 원칙)
- prettier hook이 저장 직후 파일을 포맷하므로, 직후 Edit에서 "file modified" 발생 시 재 Read 후 진행 (정상 동작)
- 기존 타입 에러 약 10건(PopupRenderer·Select·Accordion 등) 존재 — Stop hook 타입체크는 git 변경 파일만 보므로 작업을 막지 않음
