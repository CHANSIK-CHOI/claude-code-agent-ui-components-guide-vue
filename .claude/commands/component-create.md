# component-create

`$ARGUMENTS` 컴포넌트를 다음 순서로 생성한다.

---

## 인수 파싱

`$ARGUMENTS`에서 다음 세 가지를 추출한다.

| 항목           | 추출 규칙                                                          | 필수 여부 |
| -------------- | ------------------------------------------------------------------ | --------- |
| **컴포넌트명** | 첫 번째 단어 (PascalCase)                                          | 필수      |
| **Figma URL**  | `https://figma.com` 또는 `https://www.figma.com`으로 시작하는 토큰 | 선택      |
| **방향 설명**  | 컴포넌트명과 Figma URL을 제외한 나머지 텍스트                      | 선택      |

입력 예시:

```
/component-create BottomSheet
/component-create BottomSheet https://figma.com/design/xxx?node-id=123-456
/component-create BottomSheet 스와이프로 열고 닫히는 바텀시트, 핸들 영역 있음
/component-create BottomSheet https://figma.com/design/xxx?node-id=123-456 스와이프로 열고 닫히는 바텀시트
```

---

## ⚠️ 명령 실행 원칙 (BLOCKING — 반드시 준수)

본 명령의 **모든 단계는 반드시 Agent 도구를 호출**해 해당 에이전트에게 위임한다. Claude 본인이 spec 파일·`.vue` 파일을 직접 작성·수정하는 것은 금지된다 (저장 단계만 예외 — 1단계 spec 저장은 명령이 직접 수행).

`@uiux-planner-agents` / `@uiux-publisher-agents` 등의 표기는 **Agent 도구 호출 지시**이다. 단순 텍스트로 무시하지 말 것.

자세한 원칙은 `.claude/CLAUDE.md` "슬래시 명령 실행 원칙" 섹션 참조.

### 명령 시작 시 출력

명령 시작 직후 다음 reminder를 출력한다:

> 📌 1단계(spec 승인) 완료 후 `Shift+Tab`으로 accept mode 전환이 필요합니다. 그래야 2단계 이후 자동 진행됩니다.

또한 명령 시작 직후 **TaskCreate로 다음 5개 task를 등록**한다 (모두 completed가 될 때까지 명령을 종료하지 않는다). subject/activeForm 는 아래 템플릿을 그대로 사용한다 (`{Name}` = 추출한 컴포넌트명):

| # | subject                              | activeForm                       |
| - | ------------------------------------ | -------------------------------- |
| 1 | `{Name} spec 작성`                   | `{Name} spec 작성 중`            |
| 2 | `{Name} spec 사용자 승인 + 저장`     | `{Name} spec 승인·저장 중`       |
| 3 | `{Name} SFC 구현`                    | `{Name} SFC 구현 중`             |
| 4 | `{Name} 가이드 페이지 작성`          | `{Name} 가이드 페이지 작성 중`   |
| 5 | `{Name} QA + 시니어 리뷰 검수`       | `{Name} 검수 중`                 |

---

## 0단계 — 사전 확인

`.claude/specs/{컴포넌트명}.md`가 이미 존재하면 1단계를 건너뛰고 기존 명세를 재사용한다.

---

## 1단계 — 명세 작성 [플랜 모드]

**BLOCKING**: 본 단계는 반드시 Agent 도구로 `uiux-planner-agents`를 호출한다. Claude가 직접 spec 파일을 작성하면 안 된다.

```
도구: Agent
파라미터:
  subagent_type: "uiux-planner-agents"
  description: "{컴포넌트명} spec 초안 작성"
  prompt: |
    다음 컴포넌트의 명세 초안을 작성해주세요.

    - 컴포넌트명: {컴포넌트명}
    - 방향 설명 (있을 경우): {방향 설명}
    - Figma URL (있을 경우): {Figma URL → MCP 호출 시 node-id 형식 변환}

    작성 항목:
    - Atomic 계층 결정 (atoms / molecules / organisms) → 이후 단계에서 이 계층을 사용
    - Radix Vue 사용 여부는 rules/libraries.md Stable 매트릭스 확인 후 결정
    - Props / State / Variant / 접근성 요구사항 정의
    - Figma 시각 참조: URL이 있으면 해당 노드, 없으면 기본 가이드 페이지(40004010:2). 미인증 시 생략

    저장 책임 (단일 출처):
    - 출력만 하고 .claude/specs/*.md 파일은 저장하지 마세요 (사용자 승인 후 명령이 직접 저장합니다)
```

에이전트 응답을 받으면 사용자에게 spec 초안을 보여주고 승인받는다 (ExitPlanMode 호출).

승인 후 본 명령이 직접 `.claude/specs/{컴포넌트명}.md`에 저장하고 2단계로 진행한다.
이중 저장 방지를 위해 planner를 재호출하지 않는다.

→ Task #1, #2 완료 표시.

---

## 2단계 이후 — [어셉트 모드, 무중단 자동 진행]

⚠️ 1단계 승인 후 **사용자에게 추가로 묻지 말고** 2~4단계를 순차 자동 실행한다. 각 단계는 반드시 Agent 도구로 해당 에이전트를 호출한다.

⚠️ 단계 사이에 "다음 단계 진행할까요?"를 묻지 마라. 사용자 확인은 1단계(spec 승인)와 4단계 WARN 처리 시점에만 발생한다.

### 2단계 — 구현 (uiux-publisher-agents)

**BLOCKING**: Agent 도구로 `uiux-publisher-agents`를 호출한다. Claude가 직접 `.vue` 파일을 작성하면 안 된다.

```
도구: Agent
파라미터:
  subagent_type: "uiux-publisher-agents"
  description: "{컴포넌트명} SFC 구현"
  prompt: |
    다음 컴포넌트를 spec에 맞게 구현해주세요.

    - 컴포넌트명: {컴포넌트명}
    - spec: .claude/specs/{컴포넌트명}.md
    - 파일 경로: components/{1단계 계층}/{컴포넌트명}.vue
    - barrel export 추가: components/{1단계 계층}/index.ts

    구현 지침:
    - BEM 블록명: **PascalCase 컴포넌트명의 첫 글자만 소문자로 (camelCase, 나머지 대문자 유지)**
      - 예) Button → $b: 'button'
      - 예) InputSearch → $b: 'inputSearch'  (※ 'inputsearch' 아님)
      - 예) ProductDetail → $b: 'productDetail'
      - 단일 단어는 전체 소문자, 합성어는 두 번째 단어부터 PascalCase 유지
    - defineOptions({ inheritAttrs: false }) + v-bind="$attrs" 핵심 요소에 적용
```

#### 2-A) Spec 이탈 항목 자동 현행화 (필수)

publisher 응답 본문에서 `⚠️ Spec 이탈 항목` 표를 검색한다.

- **표가 있으면**: Claude가 **Edit 도구로 `.claude/specs/{컴포넌트명}.md`를 직접 수정**한다. 각 행의 "실제 구현" 내용을 spec 의 해당 항목에 반영한다. 사용자 추가 확인 없이 자동 적용 (무중단 진행 원칙 유지). 변경 내용은 5단계 완료 보고에 명시한다.
- **표가 없거나 "이탈 없음" 으로 보고**: 그대로 다음 단계 진행.

> **자동 적용 근거**: 1단계에서 사용자가 spec 초안을 승인했지만, publisher는 구현 중 더 적합한 동작 방식을 발견할 수 있다. publisher가 명시적으로 이탈을 보고했다는 것은 의도된 변경이며, 4단계 QA에서 "spec과 구현 일치 여부" 검수로 한 번 더 검증된다. 자동 적용으로 spec/구현 정합성을 유지한다.
> **CLAUDE.md "Claude가 직접 spec 작성 금지" 와의 정합**: 본 단계의 spec 수정은 publisher 가 출력한 이탈 표를 그대로 옮기는 **저장 행위**이며, "본문 = 에이전트 / 저장 = Claude" 책임 분리 원칙(CLAUDE.md 예외 조항)에 부합한다. Claude 가 임의로 spec 내용을 생성·요약·가공하면 안 된다.

→ Task #3 완료 표시. 즉시 3단계 진행 (사용자 추가 확인 없음).

### 3단계 — 가이드 페이지

**BLOCKING**: Agent 도구로 `uiux-publisher-agents`를 다시 호출해 가이드 페이지를 작성한다.

```
도구: Agent
파라미터:
  subagent_type: "uiux-publisher-agents"
  description: "{컴포넌트명} 가이드 페이지 작성"
  prompt: |
    `rules/guide-page.md` 규칙에 따라 `pages/guide/{컴포넌트명}/index.vue`를 자동 작성해주세요.

    - spec: .claude/specs/{컴포넌트명}.md
    - 구현: components/{layer}/{컴포넌트명}.vue

    가이드 페이지에는 컴포넌트의 모든 variant / 상태 / Props / Slots / Events 데모가 포함되어야 합니다.
```

→ Task #4 완료 표시. 즉시 4단계 진행 (사용자 추가 확인 없음).

### 4단계 — 검수 (inline 자동 호출, 자동 분기 루프백 포함)

**BLOCKING**: 4단계는 `/component-audit` 슬래시 명령을 호출하지 않고, 그 명령의 1~4단계와 동일한 에이전트 호출 시퀀스를 본 명령에서 **inline으로 직접 수행**한다.

#### 4-0) dev server 사전 체크 (필수, 명령 본인이 직접 수행)

QA Agent를 호출하기 전에 **명령(Claude) 자체가** 다음을 수행한다. 에이전트의 자체 판단을 신뢰하지 않는다.

```bash
# Bash 도구로 실행
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000
```

응답 처리:

- `200~399`: dev server 기동됨 → 4-1 진행. QA prompt에 "dev server 사전 체크 완료 — 기동됨" 명시.
- 그 외 (`000`, `5xx` 등): 미기동 — **AskUserQuestion으로 사용자에게 안내**:

```
dev server가 기동되지 않아 Playwright 시각·동작 검증을 할 수 없습니다.
별도 터미널에서 npm run dev 를 실행한 뒤 알려주세요.

선택지:
1. dev server 기동 완료 (재체크 후 검증 진행)  ← 권장
2. 이번에는 Context7만 검증 (Playwright 스킵, PARTIAL 결과로 종료)
3. 검수 자체 건너뛰기 (5단계 완료 보고로 직행)
```

선택 1 → curl 재실행 후 200대면 4-1 진행, 여전히 미기동이면 다시 묻기.
선택 2 → QA prompt에 "Playwright 스킵 허용 — Context7만 실행" 명시. 결과 헤더 `PARTIAL` 수용.
선택 3 → 4단계 전체 스킵, 5단계로 직행. 완료 보고에 "검수 미수행" 명시.

#### 4-1) QA 검수 — uiux-qa-agents 호출

```
도구: Agent
파라미터:
  subagent_type: "uiux-qa-agents"
  description: "{컴포넌트명} QA 검수"
  prompt: |
    {컴포넌트명} 컴포넌트를 검수해주세요.
    - spec: .claude/specs/{컴포넌트명}.md
    - 구현: components/{layer}/{컴포넌트명}.vue
    - 가이드 페이지: pages/guide/{컴포넌트명}/index.vue

    검수 항목:
    - Context7 MCP로 외부 라이브러리 API 사실 체크 (Radix Vue, vant 등)
    - Playwright MCP로 가이드 페이지 실제 동작 검증
    - spec과 구현 일치 여부

    dev server 사전 체크 완료 — {기동됨 / 미기동·Playwright 스킵 허용 — Context7만 실행} (4-0 결과 전달)

    보고서 마지막 줄에 다음 중 하나를 출력:
    - `## 검수 결과: PASS` (Context7 + Playwright 모두 수행 완료 시에만)
    - `## 검수 결과: PARTIAL — Playwright 미수행 (호출자 허용)`
    - `## 검수 결과: BLOCKED — dev server 미기동 (Playwright 검증 불가)`
    - `## 검수 결과: BLOCKED — 가이드 페이지 부재`
    - `## 검수 결과: FAIL — 루프백 planner` (spec 영역 BLOCKER — spec 만 결함이거나 spec+구현 양쪽 결함 둘 다 동일 헤더)
    - `## 검수 결과: FAIL — 루프백 publisher` (구현 영역만 BLOCKER, spec 정상)
```

응답의 마지막 줄을 파싱:

- `PASS` → 4-2 진행
- `PARTIAL — Playwright 미수행 (호출자 허용)` → 사용자가 4-0에서 선택 2를 고른 경우만 허용, 4-2 진행
- `BLOCKED — dev server 미기동` → 4-0으로 복귀 (사용자에게 다시 안내)
- `BLOCKED — 가이드 페이지 부재` → 가이드 페이지 작성 필요. publisher Agent를 가이드 페이지 작성 모드로 재호출 후 4-1 복귀
- `FAIL — 루프백 planner` → 4-3 (planner부터 재실행 — spec 영역 BLOCKER이거나 spec+구현 양쪽 BLOCKER인 경우 모두)
- `FAIL — 루프백 publisher` → 4-3 (publisher만 재실행)

#### 4-2) Vue 시니어 리뷰 — vue-senior-reviewer-agents 호출

```
도구: Agent
파라미터:
  subagent_type: "vue-senior-reviewer-agents"
  description: "{컴포넌트명} Vue 시니어 리뷰"
  prompt: |
    {컴포넌트명} 컴포넌트의 Vue 메커니즘 적합성과 복잡도를 리뷰해주세요.
    - 구현: components/{layer}/{컴포넌트명}.vue

    검토 항목:
    - Composition API 관용구 (watch/computed 적절성, props mutation, v-model 패턴)
    - 복잡도 (분기/중첩/반복)
    - Vue/Nuxt 메커니즘 정합성 (defineOptions, v-bind="$attrs" 위치, auto-import)

    보고서 마지막 줄에 다음 중 하나를 출력:
    - `## 리뷰 결과: PASS`
    - `## 리뷰 결과: FAIL — 루프백 publisher`
```

응답의 마지막 줄을 파싱:

- `PASS` → 4-4 (WARN 처리)
- `FAIL — 루프백 publisher` → 4-3

#### 4-3) 루프백 (조건부)

루프 카운트는 본 명령에서 추적. 초기 0, 루프백 1회마다 +1. **2회 초과(3회째 시도) 시 사용자 개입 요청으로 종료**:

```
검수 루프가 2회 반복되었으나 이슈가 해결되지 않았습니다.
직접 검토가 필요합니다.

남은 이슈:
[BLOCKER 목록]

다음 중 하나를 선택해주세요:
1. 직접 코드 수정
2. 명세를 재검토 (저와 함께)
3. 검수 종료 (이슈 무시)
```

루프백 분기 — 시작점에 따라 다른 에이전트 호출:

| 시작점              | 호출 순서                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `planner`           | uiux-planner-agents Agent 호출 (spec 수정) → 사용자 승인 → uiux-publisher-agents Agent 호출 (구현 수정) → 4-1 복귀 |
| `publisher`         | uiux-publisher-agents Agent 호출 (구현 수정) → 4-1 복귀                                                            |

루프백 호출 시 prompt에 다음을 포함:

- 검수 보고서의 BLOCKER 목록
- (시니어 리뷰의 경우) `현재 코드 / 권고 / 이유` 3단 권고

**4-3-A) Spec 이탈 항목 자동 현행화 (publisher 호출 직후 필수)**

루프백에서 publisher 가 호출된 직후(planner 시작점인 경우 publisher 까지 끝난 직후), 응답 본문에서 `⚠️ Spec 이탈 항목` 표를 검색한다.

- 표가 있으면: Claude가 Edit 도구로 `.claude/specs/{컴포넌트명}.md`를 직접 수정. 사용자 추가 확인 없이 자동 적용. 변경 내용은 5단계 완료 보고에 명시.
- 표가 없거나 "이탈 없음": 그대로 4-1 복귀.

처리 흐름·자동 적용 근거는 `rules/spec-scope.md §4` 단일 출처 참조. 2-A 단계와 동일 처리.

루프 카운트 +1 한 후 4-1로 복귀.

#### 4-4) WARN 처리 (조건부)

QA·시니어 리뷰 모두 PASS이지만 WARN이 있는 경우 사용자에게 처리 방식을 묻는다:

```
검수는 통과했으나 다음 WARN 항목이 있습니다:

[QA WARN 목록]
[시니어 리뷰 WARN 목록]

처리 방식을 선택해주세요:
1. 모두 자동 수정 (publisher 재실행, 루프 카운트 +1)
2. 일부만 수정 (수정할 항목 번호 선택)
3. 무시하고 종료
```

선택에 따라:

- **모두 / 일부 자동 수정**: 4-3 루프백과 동일하게 publisher Agent 호출 → **4-3-A) Spec 이탈 항목 자동 현행화 동일 절차 수행** → 4-1 복귀 (루프 카운트 +1, 초과 시 종료)
- **무시하고 종료**: 5단계로 진행

> **dev server 사전 기동 필요**: 가이드 페이지 검증을 위해 `npm run dev`가 별도 터미널에 떠 있어야 한다. QA 에이전트가 미기동을 감지하면 사용자에게 안내 후 대기.

→ Task #5 완료 표시.

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
- spec 자동 현행화 (2-A 결과 — 이탈 항목이 있었을 경우만 출력):
  - [항목명]: [spec 기존] → [실제 구현으로 변경]
  - ...

이슈가 발견된 경우 적용 내역도 함께 보고합니다.
```
