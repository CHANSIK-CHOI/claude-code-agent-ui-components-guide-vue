# Vue UI Components Guide

**Claude Code를 활용한 컴포넌트 제작·검수 플로우 구축 & 컴포넌트 가이드** — Vue 3 + Nuxt 3 기반 개인 프로젝트입니다.

단순히 컴포넌트를 만드는 것이 아니라, **"어떻게 만들 것인가"를 시스템으로 설계**했습니다.
기획(spec) → 구현(SFC) → 검수(QA·시니어 리뷰)로 이어지는 에이전트 파이프라인이 모든 컴포넌트를 동일한 품질 기준으로 생산하고, 그 결과를 브라우저에서 확인할 수 있는 컴포넌트 가이드로 문서화합니다.

## 핵심 포인트

1. **에이전트 기반 제작 파이프라인** — 역할이 격리된 4개 에이전트(기획·퍼블·QA·리뷰)가 슬래시 명령 한 줄로 협업. 검수 실패 시 결함 영역의 에이전트만 자동 루프백
2. **규칙 기반 품질 시스템** — `.claude/rules/` 10개 문서가 아키텍처·BEM·토큰·접근성·팝업 패턴의 단일 출처(SSOT). 에이전트와 사람이 같은 규칙을 참조
3. **검증 자동화** — Context7 MCP로 라이브러리 API 사실 체크, Playwright MCP로 실제 브라우저 동작 검증, bash hook으로 Prettier 포맷·타입체크 자동 강제. 타입체크 hook은 기본 ON이되 **변경 파일 단위 가드**(기존 커밋 오류는 미검출)이며, 전체 검증은 `npm run typecheck`로 보완

## 스택

| 항목 | 버전 |
|------|------|
| Vue | 3.5.33 (overrides로 단일화) |
| Nuxt | 3.10.3 |
| TypeScript | 6.x |
| Radix Vue | 1.9.17 (헤드리스, Stable만) |
| vant | ^4.9.24 (DatePicker/Picker/PickerGroup 온디맨드) |
| sass | 1.85.0 |

## 시작하기

```bash
npm install
npm run dev       # http://localhost:5000/claude-code-agent-ui-components-guide-vue/
```

```bash
npm run typecheck # 타입 체크
npm run generate  # 정적 빌드 (GitHub Pages)
```

## Claude Code 워크플로우

### 에이전트 카탈로그 (4개)

| 에이전트 | 역할 | 권한 |
|---|---|---|
| `uiux-planner-agents` | 컴포넌트 명세 작성 (기획 + 디자인 토큰 매핑) | spec 본문 출력만 — 저장은 호출자 |
| `uiux-publisher-agents` | spec 기준 Vue SFC 구현 + 가이드 페이지 | `.vue`/`.scss` 작성·수정 |
| `uiux-qa-agents` | Context7 라이브러리 팩트체크 + Playwright 실동작 검증 | 보고만 (수정 불가) |
| `vue-senior-reviewer-agents` | Composition API 관용구·복잡도 리뷰 | 권고만 (수정은 publisher) |

### 제작 흐름

```
/component-create {Name}
  ① 명세 작성 (planner, plan 모드 — 사용자 승인)
  ② Vue SFC 구현 (publisher)
  ③ 가이드 페이지 자동 작성 (publisher)
  ④ QA 검수 (qa — Context7 + Playwright)
  ⑤ 시니어 리뷰 (reviewer — BLOCKER/WARN/INFO)
  ⑥ 완료 보고

BLOCKER 발견 시 자동 루프백:
  spec 결함 → planner부터 재실행 / 구현 결함 → publisher만 재실행 (최대 2회)
```

```bash
/component-create Tooltip      # 신규 컴포넌트 (전체 파이프라인)
/component-revise Select ...   # 기획 변경 — spec diff 승인 후 변경분만 재구현
/component-audit Button        # 기존 컴포넌트 검수 (spec 없으면 코드→spec 역추출)
```

상세 흐름과 이슈 등급 정책은 가이드 홈(`/guide`)과 [ONBOARDING.md](./ONBOARDING.md) 참조.

### 규칙 체계 (`.claude/rules/`)

architecture(Atomic+barrel) · components(SFC·defineModel·$attrs 위임) · style(BEM·`$b` 변수) · tokens(시맨틱 토큰 참조표) · a11y(시맨틱 HTML·role 우회 금지) · popups(open 제어 SSOT) · libraries(Stable/Alpha 매트릭스) · guide-page · spec-scope(spec/자율 경계) · hooks(자동화)

## 컴포넌트 목록

| 계층 | 컴포넌트 | 가이드 URL |
|------|---------|------------|
| atoms | Button | `/guide/button` |
| atoms | ButtonLink | `/guide/button-link` |
| atoms | Input | `/guide/input` |
| atoms | InputAuth | `/guide/input-auth` |
| atoms | InputPassword | `/guide/inputPassword` |
| atoms | Select | `/guide/select` |
| atoms | TextArea | `/guide/textarea` |
| atoms | Stepper | `/guide/stepper` |
| atoms | Checkbox | `/guide/checkbox` |
| atoms | Switch | `/guide/switch` |
| atoms | Popover | `/guide/popover` |
| atoms | Tooltip | `/guide/tooltip` |
| atoms | Progress | `/guide/progress` |
| atoms | RadioGroup | `/guide/radioGroup` |
| molecules | FormField | `/guide/form-field` |
| molecules | ButtonGroup | `/guide/buttonGroup` |
| molecules | Accordion | `/guide/accordion` |
| molecules | Collapsible | `/guide/collapsible` |
| icons | Icon | `/guide/icon` |
| organisms | Tab | `/guide/tab` |
| popup | Alert | `/guide/alert` |
| popup | Confirm | `/guide/confirm` |
| popup | LayerPopup | `/guide/layerPopup` |
| popup | BottomSheet | `/guide/bottomSheet` |
| popup | FullPopup | `/guide/fullPopup` |
| popup | ToastPopup | `/guide/toastPopup` |
| popup | PinDatePicker | `/guide/pinDatePicker` |
| popup | PinPicker | `/guide/pinPicker` |
| globals | Table (전역 스타일) | `/guide/table` |
| globals | Skeleton (전역 스타일) | `/guide/skeleton` |

## 프로젝트 구조

```
components/
├── atoms/          # 최소 단위 컴포넌트 (Button, Input, Select 등)
├── molecules/      # atoms 조합 (FormField, ButtonGroup, Accordion, Collapsible)
├── organisms/      # atoms + molecules 조합 (Tab)
├── popup/          # 팝업 계열 전체 + composable API
├── icons/          # Icon.vue (nuxt-svgo 기반 SVG 래퍼)
├── guide/          # 가이드 페이지 전용 레이아웃 컴포넌트
└── types.ts        # 공용 타입 (Variant, Size, ButtonShape 등)

pages/guide/[componentName]/index.vue   # 컴포넌트별 가이드 페이지
popups/guide/                           # 가이드 데모용 콘텐츠 팝업 래퍼
assets/scss/abstracts/_variables.scss   # 디자인 토큰 (모든 SCSS에 자동 주입)

.claude/
├── CLAUDE.md       # 프로젝트 설정·기술 결정·명령 실행 원칙
├── rules/          # 작업 규칙 10개 (단일 출처)
├── agents/         # 에이전트 4개 정의
├── commands/       # 슬래시 명령
├── specs/          # 컴포넌트 명세 (planner 산출물)
└── hooks/          # bash 자동화 (prettier 포맷 항상 ON·타입체크 기본 ON)
```

## 팝업 시스템

콘텐츠 팝업은 `defineModel('open')` + `v-model:open` 표준으로 제어하고, 메시지형 팝업(Alert/Confirm/Toast)은 composable로 호출합니다.

```ts
import { useAlert, useConfirm } from '@nd/components/popup'

const { open: openAlert } = useAlert()
openAlert({ message: '저장되었습니다.', onClose: () => {} })

const { open: openConfirm } = useConfirm()
openConfirm({ message: '삭제하시겠습니까?', onConfirm: handleDelete, onCancel: () => {} })
```

Toast도 동일하게 `useToastPopup()`으로 호출합니다. 전체 규칙은 `.claude/rules/popups.md` 참조.

## 디자인 토큰 업데이트

Figma에서 토큰을 추출해 `_variables.scss`를 갱신하는 워크플로우입니다.

```
/design:token-scaffold  →  design-tokens.json 생성
/design:token-scss      →  assets/scss/abstracts/_variables.scss 갱신
```

`_variables.scss`는 `nuxt.config.ts`의 `additionalData`로 전체 SCSS에 자동 주입되므로 `@use` 없이 바로 사용 가능합니다.

## 외부 라이브러리 정책

Radix Vue는 **Stable 컴포넌트만** 사용합니다. DatePicker 등 Alpha 컴포넌트는 `vant`(DatePicker/Picker/PickerGroup 온디맨드 등록)로 대체합니다. 전체 stability 매트릭스는 `.claude/rules/libraries.md` 참조.
