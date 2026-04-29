# component-create

`$ARGUMENTS` 컴포넌트를 다음 순서로 생성한다.

---

## 인수 파싱

`$ARGUMENTS`에서 다음 세 가지를 추출한다.

| 항목 | 추출 규칙 | 필수 여부 |
|------|---------|---------|
| **컴포넌트명** | 첫 번째 단어 (PascalCase) | 필수 |
| **Figma URL** | `https://figma.com` 또는 `https://www.figma.com`으로 시작하는 토큰 | 선택 |
| **방향 설명** | 컴포넌트명과 Figma URL을 제외한 나머지 텍스트 | 선택 |

입력 예시:

```
/component-create BottomSheet
/component-create BottomSheet https://figma.com/design/xxx?node-id=123-456
/component-create BottomSheet 스와이프로 열고 닫히는 바텀시트, 핸들 영역 있음
/component-create BottomSheet https://figma.com/design/xxx?node-id=123-456 스와이프로 열고 닫히는 바텀시트
```

---

## 0단계 — 사전 확인

`.claude/specs/{컴포넌트명}.md`가 이미 존재하면 1단계를 건너뛰고 기존 명세를 재사용한다.

---

## 1단계 — 명세 작성 [플랜 모드]

uiux-planner-agents를 사용해 명세 초안을 작성한다.

- Atomic 계층 결정 (atoms / molecules / organisms) → 이후 단계에서 이 계층을 사용
- Radix Vue 사용 여부는 `rules/libraries.md` Stable 매트릭스 확인 후 결정
- Props / State / Variant / 접근성 요구사항 정의
- **방향 설명이 제공된 경우**: 해당 텍스트를 컴포넌트 의도/요구사항으로 planner에게 전달
- **Figma 시각 참조**:
  - Figma URL이 제공된 경우: URL의 `node-id=A-B` 파라미터를 `A:B` 형식으로 변환해 Figma MCP로 해당 노드 참조 (미인증 시 생략)
  - URL이 없는 경우: 기본 가이드 페이지(`40004010:2`) 참조 (미인증 시 생략)

> **저장 책임 (단일 출처)**: planner 에이전트는 **출력만** 하고 저장하지 않는다 (`uiux-planner-agents.md` §"산출물 저장 규칙" 분기 참조 — `/component-create` 흐름 = 출력만). 명령은 사용자 승인을 받은 후 본 명령이 직접 `.claude/specs/{컴포넌트명}.md`에 저장하고 2단계로 진행한다. 이중 저장 방지를 위해 planner를 재호출하지 않는다.

---

## 2단계 이후 — [어셉트 모드]

1단계 승인 후 **추가 확인 없이** 아래 순서를 자동으로 진행한다.

### 2단계 — 구현 (uiux-publisher-agents)

`.claude/specs/{컴포넌트명}.md`를 기준으로 uiux-publisher-agents를 사용해 구현한다.

- 파일: `components/{1단계 계층}/{컴포넌트명}.vue`
- BEM 블록명: 첫 글자 소문자 카멜케이스 (`Button` → `$b: 'button'`, `InputSearch` → `$b: 'inputSearch'`)
- `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` 핵심 요소에 적용
- `components/{1단계 계층}/index.ts` barrel export 추가

### 3단계 — 가이드 페이지

`rules/guide-page.md` 규칙에 따라 `pages/guide/{컴포넌트명}/index.vue`를 **자동 작성**한다 — 사용자 추가 확인 없이 진행. (uiux-publisher-agents.md §7·§9에 명시된 `/component-create` 흐름 자동 진행 분기.)

### 4단계 — 검수 (자동 분기 루프백 포함)

`/component-audit $ARGUMENTS`와 동일한 검수 절차를 수행한다 (해당 명령의 1~4단계를 그대로 따른다 — 중복 작성을 피하기 위해 그쪽 정의를 단일 출처로 사용).

요약:
1. **QA 검수** (`uiux-qa-agents`) — Context7 사실 체크 + Playwright 실제 화면 검증
2. **Vue 시니어 리뷰** (`vue-senior-reviewer-agents`) — Composition API 관용구 + 복잡도
3. **루프백 (조건부)** — BLOCKER 시 자동 분기 (planner 또는 publisher 재실행 후 다시 1단계 검수). 최대 2회, 초과 시 사용자 개입 요청으로 종료
4. **WARN 처리 (조건부)** — 사용자에게 묻고 결정

> **dev server 사전 기동 필요**: 가이드 페이지 검증을 위해 `npm run dev`가 별도 터미널에 떠 있어야 한다. QA 에이전트가 미기동을 감지하면 사용자에게 안내 후 대기한다.

### 5단계 — 완료 보고

다음을 출력한다:

```
✅ {컴포넌트명} 컴포넌트 생성 완료

- 계층: {atoms|molecules|organisms}
- 구현 파일:
  - components/{layer}/{컴포넌트명}.vue
  - components/{layer}/index.ts (export 추가)
  - pages/guide/{컴포넌트명}/index.vue (가이드 페이지)
- 검수 결과:
  - QA: PASS
  - Vue 시니어 리뷰: PASS
- 주요 Props 요약: [variant, size, disabled, loading 등]

이슈가 발견된 경우 적용 내역도 함께 보고합니다.
```
