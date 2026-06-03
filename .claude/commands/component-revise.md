# component-revise

기존 컴포넌트의 명세(spec)를 변경 내용에 맞게 수정하고, 구현·가이드 페이지를 재작성한 후 검수까지 자동으로 진행한다.

---

## 인수 파싱

| 항목           | 추출 규칙                                       | 필수 여부 |
| -------------- | ----------------------------------------------- | --------- |
| **컴포넌트명** | 첫 번째 단어 (PascalCase)                       | 필수      |
| **변경 내용** | 컴포넌트명을 제외한 나머지 전체 텍스트          | 필수      |

입력 예시:

```
/component-revise Button icon 슬롯 추가 및 loading 상태 개선
```

→ 컴포넌트명 = `Button`, 변경 내용 = `icon 슬롯 추가 및 loading 상태 개선`

---

## ⚠️ 명령 실행 원칙 (BLOCKING — 반드시 준수)

본 명령의 **모든 단계는 반드시 Agent 도구를 호출**해 해당 에이전트에게 위임한다. Claude 본인이 spec 파일·`.vue` 파일을 직접 작성·수정하는 것은 금지된다 (저장 단계만 예외 — 1단계의 spec 저장은 명령이 직접 수행).

`@uiux-planner-agents` / `@uiux-publisher-agents` 등의 표기는 **Agent 도구 호출 지시**이다. 단순 텍스트로 무시하지 말 것.

자세한 원칙은 `.claude/CLAUDE.md` "슬래시 명령 실행 원칙" 섹션 참조.

### 명령 시작 시 출력

명령 시작 직후 다음 reminder를 출력한다:

> 📌 1단계(spec 수정안 승인) 완료 후 `Shift+Tab`으로 accept mode 전환이 필요합니다. 그래야 2단계 이후 자동 진행됩니다.

또한 명령 시작 직후 **TaskCreate로 다음 5개 task를 등록**한다 (이 task가 모두 completed가 될 때까지 명령을 종료하지 않는다). subject/activeForm 는 아래 템플릿을 그대로 사용한다 (`{Name}` = 추출한 컴포넌트명):

| # | subject                                  | activeForm                         |
| - | ---------------------------------------- | ---------------------------------- |
| 1 | `{Name} spec 수정`                       | `{Name} spec 수정 중`              |
| 2 | `{Name} spec 사용자 승인 + 저장`         | `{Name} spec 승인·저장 중`         |
| 3 | `{Name} 구현 재작성`                     | `{Name} 구현 재작성 중`            |
| 4 | `{Name} 가이드 페이지 업데이트`          | `{Name} 가이드 페이지 업데이트 중` |
| 5 | `{Name} QA + 시니어 리뷰 검수`           | `{Name} 검수 중`                   |

---

## 0단계 — 사전 확인

다음 두 파일의 존재 여부를 확인한다:

| 파일                                                        | 처리                                                                                                    |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `components/{atoms\|molecules\|organisms}/{컴포넌트명}.vue` | **부재 시 즉시 종료** — "구현 파일이 없습니다. `/component-create {컴포넌트명}`으로 먼저 생성해주세요." |
| `.claude/specs/{컴포넌트명}.md`                             | **부재 시 reverse-mode 진행** (아래 참조)                                                               |

### Spec 부재 시 — reverse-mode

spec 파일이 없으면 `uiux-planner-agents`를 **reverse-mode**로 호출해 현재 코드에서 명세를 역추출한다.

**호출 방법** — Agent 도구 사용 (BLOCKING):

```
도구: Agent
파라미터:
  subagent_type: "uiux-planner-agents"
  description: "{컴포넌트명} spec 역추출"
  prompt: |
    reverse-mode: 다음 컴포넌트의 현재 코드에서 명세를 역추출해주세요.
    - 파일: components/{layer}/{컴포넌트명}.vue
    - 산출물: .claude/specs/{컴포넌트명}.md (저장 전 사용자에게 초안을 보여주고 승인받기)
```

역추출된 spec을 `.claude/specs/{컴포넌트명}.md`에 저장한 후 1단계로 진행한다.

---

## 1단계 — 명세 수정 [플랜 모드]

**BLOCKING**: 본 단계는 반드시 Agent 도구로 `uiux-planner-agents`를 호출한다. Claude가 직접 spec 파일을 작성하거나 수정하면 안 된다.

```
도구: Agent
파라미터:
  subagent_type: "uiux-planner-agents"
  description: "{컴포넌트명} spec diff 작성"
  prompt: |
    다음 컴포넌트의 명세를 변경 내용에 맞게 수정해주세요.

    - 컴포넌트명: {컴포넌트명}
    - 현재 spec: .claude/specs/{컴포넌트명}.md (파일 읽기)
    - 현재 구현: components/{layer}/{컴포넌트명}.vue (파일 읽기)

    [변경 내용]
    {변경 내용 원문 전체}

    수정 지침:
    - 변경 내용에 해당하는 부분만 최소한으로 수정한다 (변경 범위 밖 항목은 건드리지 않는다)
    - 변경으로 인해 영향받는 Props / Variant / 접근성 항목을 함께 업데이트한다
    - Radix Vue 사용 여부는 변경 전과 동일하게 유지한다 (변경 내용에 명시된 경우 제외)
    - 수정 전·후 diff 형식(변경된 항목만)으로 출력한다 — 전체 spec을 다시 출력하지 않는다
    - 저장은 하지 않는다 (사용자 승인 후 명령이 직접 저장한다)
```

에이전트 응답을 받으면 사용자에게 수정안(diff)을 그대로 보여주고 승인을 받는다 (ExitPlanMode 호출).

승인 후 본 명령이 직접 `.claude/specs/{컴포넌트명}.md`를 업데이트하고 2단계로 진행한다.
이중 저장 방지를 위해 planner를 재호출하지 않는다.

→ Task #1, #2 완료 표시.

---

## 2단계 이후 — [어셉트 모드, 무중단 자동 진행]

⚠️ 1단계 승인 후 **사용자에게 추가로 묻지 말고** 2~4단계를 순차 자동 실행한다. 각 단계는 반드시 Agent 도구로 해당 에이전트를 호출한다.

⚠️ 단계 사이에 "다음 단계 진행할까요?"를 묻지 마라. 사용자 확인은 1단계(spec 승인)와 4단계 WARN 처리 시점에만 발생한다.

### 2단계 — 구현 재작성 (uiux-publisher-agents)

**BLOCKING**: Agent 도구로 `uiux-publisher-agents`를 호출한다. Claude가 직접 `.vue` 파일을 수정하면 안 된다.

```
도구: Agent
파라미터:
  subagent_type: "uiux-publisher-agents"
  description: "{컴포넌트명} 구현 재작성"
  prompt: |
    다음 컴포넌트를 수정된 spec에 맞게 재구현해주세요.

    - 컴포넌트명: {컴포넌트명}
    - spec: .claude/specs/{컴포넌트명}.md
    - 현재 구현: components/{layer}/{컴포넌트명}.vue

    [변경된 spec 항목]
    {1단계 diff 요약}

    구현 지침:
    - 변경 내용에 해당하는 부분만 최소한으로 수정한다 (변경 범위 밖 코드는 건드리지 않는다)
    - BEM 블록명 유지: {현재 블록명}
      - 블록명 규칙: PascalCase 컴포넌트명의 첫 글자만 소문자로 (camelCase, 나머지 대문자 유지)
      - 예) Button → 'button', InputSearch → 'inputSearch', ProductDetail → 'productDetail'
    - defineOptions({ inheritAttrs: false }) + v-bind="$attrs" 위치 유지
    - barrel export(index.ts)는 컴포넌트명이 이미 등록되어 있으면 건드리지 않는다
```

#### 2-A) Spec 이탈 항목 자동 현행화 (필수)

publisher 응답 본문에서 `⚠️ Spec 이탈 항목` 표를 검색한다.

- **표가 있으면**: Claude가 **Edit 도구로 `.claude/specs/{컴포넌트명}.md`를 직접 수정**한다. 각 행의 "실제 구현" 내용을 spec 의 해당 항목에 반영한다. 사용자 추가 확인 없이 자동 적용 (무중단 진행 원칙 유지). 변경 내용은 5단계 완료 보고에 명시한다.
- **표가 없거나 "이탈 없음" 으로 보고**: 그대로 다음 단계 진행.

> **자동 적용 근거**: 1단계에서 사용자가 spec 수정안을 승인했지만, publisher는 변경 부분 재구현 중 더 적합한 동작 방식을 발견할 수 있다. publisher가 명시적으로 이탈을 보고했다는 것은 의도된 변경이며, 4단계 QA에서 "spec과 구현 일치 여부" 검수로 한 번 더 검증된다. 자동 적용으로 spec/구현 정합성을 유지한다.
> **CLAUDE.md "Claude가 직접 spec 작성 금지" 와의 정합**: 본 단계의 spec 수정은 publisher 가 출력한 이탈 표를 그대로 옮기는 **저장 행위**이며, "본문 = 에이전트 / 저장 = Claude" 책임 분리 원칙(CLAUDE.md 예외 조항)에 부합한다. Claude 가 임의로 spec 내용을 생성·요약·가공하면 안 된다.

→ Task #3 완료 표시. 즉시 3단계 진행 (사용자 추가 확인 없음).

### 3단계 — 가이드 페이지 업데이트

**BLOCKING**: Agent 도구로 `uiux-publisher-agents`를 다시 호출해 가이드 페이지를 업데이트한다.

```
도구: Agent
파라미터:
  subagent_type: "uiux-publisher-agents"
  description: "{컴포넌트명} 가이드 페이지 업데이트"
  prompt: |
    `rules/guide-page.md` 규칙에 따라 `pages/guide/{컴포넌트명}/index.vue`를 변경 내용에 맞게 업데이트해주세요.

    - spec: .claude/specs/{컴포넌트명}.md
    - 변경된 항목: {1단계 diff 요약}

    작업 지침:
    - 가이드 페이지가 없으면 신규 작성
    - 변경된 Props / Slots / Events 섹션을 반영
    - 추가된 variant나 상태가 있으면 데모 섹션에 추가
```

→ Task #4 완료 표시. 즉시 4단계 진행 (사용자 추가 확인 없음).

### 4단계 — 검수 (inline 자동 호출, 자동 분기 루프백 포함)

**BLOCKING**: 4단계는 `/component-audit` 슬래시 명령을 호출하지 않고, 그 명령의 1~4단계와 동일한 에이전트 호출 시퀀스를 본 명령에서 **inline으로 직접 수행**한다. (슬래시 명령은 사용자만 입력 가능하므로 명령 안에서 자동 호출 불가.)

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

    본 명령은 spec이 1단계에서 사용자 승인된 상태입니다. 따라서 spec 결함을 발견하더라도 자동 planner 루프백은 불가합니다. spec 결함이 의심되면 `FAIL — 루프백 planner-요청`으로 보고하세요 (명령이 사용자에게 직접 묻습니다).

    보고서 마지막 줄에 다음 중 하나를 출력:
    - `## 검수 결과: PASS` (Context7 + Playwright 모두 수행 완료 시에만)
    - `## 검수 결과: PARTIAL — Playwright 미수행 (호출자 허용)`
    - `## 검수 결과: BLOCKED — dev server 미기동 (Playwright 검증 불가)`
    - `## 검수 결과: BLOCKED — 가이드 페이지 부재`
    - `## 검수 결과: FAIL — 루프백 publisher`
    - `## 검수 결과: FAIL — 루프백 planner-요청` (spec 결함 의심 — 사용자 결정 필요)
```

응답의 마지막 줄을 파싱:

- `PASS` → 4-2 진행
- `PARTIAL — Playwright 미수행 (호출자 허용)` → 사용자가 4-0에서 선택 2를 고른 경우만 허용, 4-2 진행
- `BLOCKED — dev server 미기동` → 4-0으로 복귀 (사용자에게 다시 안내)
- `BLOCKED — 가이드 페이지 부재` → 가이드 페이지를 publisher Agent로 작성 후 4-1 복귀
- `FAIL — 루프백 publisher` → 4-3 루프백 (publisher 재호출)
- `FAIL — 루프백 planner-요청` → 사용자에게 안내 후 결정 받기:

  ```
  QA가 spec 자체 결함을 발견했습니다. /component-revise는 spec이 이미 승인된 상태라
  자동 planner 루프백을 수행하지 않습니다.

  [QA가 보고한 spec 결함]
  {BLOCKER 상세}

  진행 방식을 선택해주세요:
  1. 명령 종료 → 사용자가 별도로 /component-revise 재실행해서 spec부터 다시 정의
  2. 이번 검수 결과 무시하고 종료 (BLOCKER 알면서 종료 — 비권장)
  ```

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
- `FAIL — 루프백 publisher` → 4-3 루프백

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

루프백 시 publisher Agent를 다음 prompt로 호출 후 4-1로 복귀:

```
도구: Agent
파라미터:
  subagent_type: "uiux-publisher-agents"
  description: "{컴포넌트명} 루프백 수정 (시도 [n])"
  prompt: |
    이전 검수에서 발견된 다음 BLOCKER를 수정해주세요.

    - 구현: components/{layer}/{컴포넌트명}.vue
    - 가이드 페이지: pages/guide/{컴포넌트명}/index.vue

    [BLOCKER 목록 — QA 보고서 + 시니어 리뷰 보고서에서 추출]
    {BLOCKER 상세}

    [시니어 리뷰 권고 — 있을 경우]
    {현재 코드 / 권고 / 이유 3단 권고 내용}
```

**4-3-A) Spec 이탈 항목 자동 현행화 (publisher 호출 직후 필수)**

publisher 응답 본문에서 `⚠️ Spec 이탈 항목` 표를 검색한다.

- 표가 있으면: Claude가 Edit 도구로 `.claude/specs/{컴포넌트명}.md`를 직접 수정. 사용자 추가 확인 없이 자동 적용. 변경 내용은 5단계 완료 보고에 명시.
- 표가 없거나 "이탈 없음": 그대로 4-1 복귀.

처리 흐름·자동 적용 근거는 `rules/spec-scope.md §4` 단일 출처 참조. 2-A 단계와 동일 처리.

> **루프백 시작점**: 본 명령(revise)의 루프백은 항상 publisher 만 — spec은 1단계에서 사용자가 승인한 상태이므로 planner 루프백 없음. spec 자체 결함이 의심되면 루프 카운트 초과 시 사용자 개입 요청으로 처리한다.

#### 4-4) WARN 처리 (조건부)

QA·시니어 리뷰 모두 PASS이지만 WARN이 있는 경우 사용자에게 처리 방식을 묻는다:

```
검수는 통과했으나 다음 WARN 항목이 있습니다:

[QA WARN 목록]
- (예) 시각적 미세 차이 — Figma 대비 hover 색상 약간 어두움

[시니어 리뷰 WARN 목록]
- (예) 불필요한 watch — computed로 대체 권고

처리 방식을 선택해주세요:
1. 모두 자동 수정 (publisher 재실행, 루프 카운트 +1)
2. 일부만 수정 (수정할 항목 번호 선택)
3. 무시하고 종료
```

선택에 따라:

- **모두 / 일부 자동 수정**: 4-3 루프백과 동일한 방식으로 publisher Agent 호출 → **4-3-A) Spec 이탈 항목 자동 현행화 동일 절차 수행** → 4-1 복귀 (루프 카운트 +1, 초과 시 종료)
- **무시하고 종료**: 5단계로 진행

> **dev server 사전 기동 필요**: 가이드 페이지 검증을 위해 `npm run dev`가 별도 터미널에 떠 있어야 한다. QA 에이전트가 미기동을 감지하면 사용자에게 안내 후 대기.

→ Task #5 완료 표시.

### 5단계 — 완료 보고

다음을 출력한다:

```
✅ {컴포넌트명} 수정 완료

- 변경 내용: {변경 내용 요약}
- 수정된 파일:
  - .claude/specs/{컴포넌트명}.md (spec)
  - components/{layer}/{컴포넌트명}.vue
  - pages/guide/{컴포넌트명}/index.vue (가이드 페이지)
- 검수 결과:
  - QA: PASS
  - Vue 시니어 리뷰: PASS
- 루프 횟수: [n]회
- spec 자동 현행화 (2-A 결과 — 이탈 항목이 있었을 경우만 출력):
  - [항목명]: [spec 기존] → [실제 구현으로 변경]
  - ...

이슈가 발견된 경우 적용 내역도 함께 보고합니다.
```
