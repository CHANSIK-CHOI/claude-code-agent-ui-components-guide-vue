# component-audit

지정된 컴포넌트를 검수만 수행한다 (신규 생성 없이).
QA 검수(라이브러리 사실 체크 + 화면 동작 검증) → Vue 시니어 리뷰(메커니즘/복잡도) 순차 실행.
이슈 발견 시 자동 분기 루프백 (planner 또는 publisher 재실행 후 다시 검수). 최대 2회 루프, 초과 시 사용자 개입 요청으로 종료.

---

## 인수 파싱

| 항목           | 추출 규칙                  | 필수 여부 |
| -------------- | -------------------------- | --------- |
| **컴포넌트명** | `$ARGUMENTS` (PascalCase)  | 필수      |

입력 예시:

```
/component-audit Button
```

---

## ⚠️ 명령 실행 원칙 (BLOCKING — 반드시 준수)

본 명령의 **모든 단계는 반드시 Agent 도구를 호출**해 해당 에이전트에게 위임한다. Claude 본인이 검수 보고서를 직접 작성하거나 spec/구현 파일을 직접 수정하는 것은 금지된다.

`@uiux-qa-agents` / `@vue-senior-reviewer-agents` 등의 표기는 **Agent 도구 호출 지시**이다. 단순 텍스트로 무시하지 말 것.

자세한 원칙은 `.claude/CLAUDE.md` "슬래시 명령 실행 원칙" 섹션 참조.

### 명령 시작 시 출력

명령 시작 직후 **TaskCreate로 다음 task를 등록**한다 (모두 completed가 될 때까지 명령을 종료하지 않는다). subject/activeForm 는 아래 템플릿을 그대로 사용한다 (`{Name}` = 추출한 컴포넌트명):

| # | subject                                       | activeForm                         | 비고            |
| - | --------------------------------------------- | ---------------------------------- | --------------- |
| 1 | `{Name} reverse-mode spec 역추출`             | `{Name} spec 역추출 중`            | spec 부재 시만  |
| 2 | `{Name} QA 검수`                              | `{Name} QA 검수 중`                |                 |
| 3 | `{Name} Vue 시니어 리뷰`                      | `{Name} 시니어 리뷰 중`            |                 |
| 4 | `{Name} 루프백 / WARN 처리`                   | `{Name} 루프백 처리 중`            | 필요 시만       |
| 5 | `{Name} 완료 보고 + 검수 메모 저장`           | `{Name} 완료 보고 작성 중`         |                 |

---

## 0단계 — 사전 확인

다음 두 파일의 존재 여부를 확인한다:

| 파일                                                      | 처리                                                                                                |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `components/{atoms\|molecules\|organisms}/$ARGUMENTS.vue` | **부재 시 즉시 종료** — "구현 파일이 없습니다. `/component-create $ARGUMENTS`로 먼저 생성해주세요." |
| `.claude/specs/$ARGUMENTS.md`                             | **부재 시 reverse-mode 진행** (아래 참조)                                                           |

### Spec 부재 시 — reverse-mode

spec 파일이 없으면 `uiux-planner-agents`를 **reverse-mode**로 호출한다.

**호출 방법** — Agent 도구 사용 (BLOCKING):

```
도구: Agent
파라미터:
  subagent_type: "uiux-planner-agents"
  description: "$ARGUMENTS spec 역추출"
  prompt: |
    reverse-mode: 다음 컴포넌트의 현재 코드에서 명세를 역추출해주세요.
    - 파일: components/{layer}/$ARGUMENTS.vue
    - 산출물: .claude/specs/$ARGUMENTS.md (저장 전 사용자에게 초안을 보여주고 승인받기)

    추출 항목:
    1. Atomic 계층 (현재 파일이 위치한 폴더 기준)
    2. Props/Emit (defineProps/defineEmits에서 추출)
    3. Variant 목록 (:class 바인딩 분석)
    4. 상태 정의 (disabled, loading, error 등 props에서)
    5. 동작 규칙 (template + script 분석)
    6. 접근성 처리 (aria-*, role, type 등)
    7. 사용한 외부 라이브러리 (Radix Vue 등)

    코드에서 추론할 수 없는 항목(원래 의도, Variant 사용 맥락 등)은 "확인 필요" 표시 후 사용자에게 질문한다.
```

reverse-mode로 spec이 생성되면 사용자 승인 후 `.claude/specs/$ARGUMENTS.md`에 저장 → 1단계로 진행.

---

## 1단계 — QA 검수

**BLOCKING**: Agent 도구로 `uiux-qa-agents`를 호출한다. Claude가 직접 라이브러리 API를 검증하거나 화면을 분석해 검수 보고서를 작성하면 안 된다.

### 1-0) dev server 사전 체크 (필수, 명령 본인이 직접 수행)

QA Agent를 호출하기 전에 **명령(Claude) 자체가** 다음을 수행한다. 에이전트의 자체 판단을 신뢰하지 않는다.

```bash
# Bash 도구로 실행
curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/claude-code-agent-ui-components-guide-vue/
# 비-2xx면 포트 3000으로 동일 경로 재시도 (5000 점유 시 Nuxt 폴백)
```

응답 처리:

- `200~399`: dev server 기동됨 → 1-1 진행. QA prompt에 "dev server 사전 체크 완료 — 기동됨" 명시.
- 그 외 (`000`, `5xx` 등): 미기동 — **AskUserQuestion으로 사용자에게 안내**:

```
dev server가 기동되지 않아 Playwright 시각·동작 검증을 할 수 없습니다.
별도 터미널에서 npm run dev 를 실행한 뒤 알려주세요.

선택지:
1. dev server 기동 완료 (재체크 후 검증 진행)  ← 권장
2. 이번에는 Context7만 검증 (Playwright 스킵, PARTIAL 결과로 종료)
3. 검수 자체 건너뛰기 (5단계 완료 보고로 직행)
```

선택 1 → curl 재실행 후 200대면 1-1 진행, 여전히 미기동이면 다시 묻기.
선택 2 → QA prompt에 "Playwright 스킵 허용 — Context7만 실행" 명시. 결과 헤더 `PARTIAL` 수용.
선택 3 → 1~3단계 전체 스킵, 5단계로 직행. 완료 보고에 "검수 미수행" 명시.

### 1-1) QA Agent 호출

```
도구: Agent
파라미터:
  subagent_type: "uiux-qa-agents"
  description: "$ARGUMENTS QA 검수"
  prompt: |
    $ARGUMENTS 컴포넌트를 검수해주세요.
    - spec: .claude/specs/$ARGUMENTS.md
    - 구현: components/{layer}/$ARGUMENTS.vue
    - 가이드 페이지: pages/guide/$ARGUMENTS/index.vue

    검수 항목:
    - Context7 MCP로 외부 라이브러리 API 사실 체크 (Radix Vue, vant 등)
      ※ 본 명령에서는 QA 에이전트가 Context7을 호출한다 — 컴포넌트 단위 검수이므로 spec/구현/가이드 페이지의 라이브러리 사용 정확성을 QA 보고서 안에 통합해 일관된 결과로 만든다.
    - Playwright MCP로 가이드 페이지 실제 동작 검증
    - spec과 구현 일치 여부

    dev server 사전 체크 완료 — {기동됨 / 미기동·Playwright 스킵 허용 — Context7만 실행} (1-0 결과 전달)

    보고서 마지막 줄에 다음 중 하나를 출력:
    - `## 검수 결과: PASS` (Context7 + Playwright 모두 수행 완료 시에만)
    - `## 검수 결과: PARTIAL — Playwright 미수행 (호출자 허용)`
    - `## 검수 결과: BLOCKED — dev server 미기동 (Playwright 검증 불가)`
    - `## 검수 결과: BLOCKED — 가이드 페이지 부재`
    - `## 검수 결과: FAIL — 루프백 planner` (spec 영역 BLOCKER — spec 만 결함이거나 spec+구현 양쪽 결함 둘 다 동일 헤더)
    - `## 검수 결과: FAIL — 루프백 publisher` (구현 영역만 BLOCKER, spec 정상)
```

### QA 검수 결과 처리

응답의 마지막 줄을 파싱해 다음 단계 결정:

| 헤더                                            | 다음 단계                                         |
| ----------------------------------------------- | ------------------------------------------------- |
| `## 검수 결과: PASS`                            | 2단계 (Vue 시니어 리뷰) 진행                      |
| `## 검수 결과: PARTIAL — Playwright 미수행`     | 2단계 진행 (사용자가 1-0에서 선택 2 고른 경우만)  |
| `## 검수 결과: BLOCKED — dev server 미기동`     | 1-0으로 복귀 (사용자에게 다시 안내)               |
| `## 검수 결과: BLOCKED — 가이드 페이지 부재`    | 사용자에게 보고 후 종료 (가이드 페이지 작성 안내) |
| `## 검수 결과: FAIL — 루프백 planner`           | 3단계 (루프백)로 분기, 시작점 = planner (spec+구현 양쪽 BLOCKER 케이스도 포함) |
| `## 검수 결과: FAIL — 루프백 publisher`         | 3단계 (루프백)로 분기, 시작점 = publisher         |

WARN만 있고 BLOCKER가 없는 경우는 PASS로 분류된다 (WARN은 4단계에서 사용자에게 묻고 결정).

---

## 2단계 — Vue 시니어 리뷰

**BLOCKING**: Agent 도구로 `vue-senior-reviewer-agents`를 호출한다. Claude가 직접 코드를 리뷰해 보고서를 작성하면 안 된다.

```
도구: Agent
파라미터:
  subagent_type: "vue-senior-reviewer-agents"
  description: "$ARGUMENTS Vue 시니어 리뷰"
  prompt: |
    $ARGUMENTS 컴포넌트의 Vue 메커니즘 적합성과 복잡도를 리뷰해주세요.
    - 구현: components/{layer}/$ARGUMENTS.vue

    검토 항목:
    - Composition API 관용구 (watch/computed 적절성, props mutation, v-model 패턴 등)
    - 복잡도 (분기/중첩/반복)
    - Vue/Nuxt 메커니즘 정합성 (defineOptions, v-bind="$attrs" 위치, auto-import 등)

    보고서 마지막 줄에 다음 중 하나를 출력:
    - `## 리뷰 결과: PASS`
    - `## 리뷰 결과: FAIL — 루프백 publisher`
```

### 시니어 리뷰 결과 처리

응답의 마지막 줄을 파싱해 다음 단계 결정:

| 헤더                                    | 다음 단계                                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------------ |
| `## 리뷰 결과: PASS`                    | 4단계 (WARN 처리) 진행                                                               |
| `## 리뷰 결과: FAIL — 루프백 publisher` | 3단계 (루프백)로 분기, 시작점 = publisher (시니어 영역 이슈는 항상 publisher 재실행) |

---

## 3단계 — 루프백 (조건부)

QA 또는 시니어 리뷰에서 BLOCKER 발견 시 진입.

### 루프 카운트 관리

본 명령은 루프 카운트를 추적한다. 초기값 0, 루프백 1회마다 +1. **2회 초과(즉, 3회째 루프백 시도) 시 사용자 개입 요청으로 종료**:

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

### 루프백 분기 — 시작점에 따라 다른 Agent 호출 (BLOCKING)

| 루프백 시작점 | 호출 순서                                                                                                |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| `planner`     | uiux-planner-agents Agent 호출 (spec 수정) → 사용자 승인 → uiux-publisher-agents Agent 호출 → 1단계 복귀 |
| `publisher`   | uiux-publisher-agents Agent 호출 (구현 수정) → 1단계 복귀                                                |

루프백 호출 시 prompt에 다음을 함께 전달:

- 검수 보고서의 BLOCKER 목록
- (시니어 리뷰의 경우) `현재 코드 / 권고 / 이유` 3단 권고

### 3-A) Spec 이탈 항목 자동 현행화 (publisher 호출 직후 필수)

publisher 응답 본문에서 `⚠️ Spec 이탈 항목` 표를 검색한다.

- **표가 있으면**: Claude가 **Edit 도구로 `.claude/specs/$ARGUMENTS.md`를 직접 수정**한다. 각 행의 "실제 구현" 내용을 spec 의 해당 항목에 반영한다. 사용자 추가 확인 없이 자동 적용. 변경 내용은 5단계 완료 보고에 명시한다.
- **표가 없거나 "이탈 없음" 으로 보고**: 그대로 1단계로 복귀.

> **자동 적용 근거**: BLOCKER 수정 과정에서 publisher 가 spec 과 다른 방식을 선택해야 하는 경우가 있다. publisher 가 명시적으로 이탈을 보고했다는 것은 의도된 변경이며, 1단계 QA 가 재검수 시 "spec과 구현 일치 여부" 를 다시 확인하므로 안전망이 작동한다. spec 을 그대로 둘 경우 다음 audit 사이클이 동일 BLOCKER 를 반복 보고해 무한 루프 위험이 있으므로 자동 현행화가 필요하다.
> **CLAUDE.md "🔍 예외 조항" 정합**: publisher 가 출력한 이탈 표를 그대로 옮기는 저장 행위이며, "본문 = 에이전트 / 저장 = Claude" 책임 분리 원칙에 부합한다.

루프 카운트 +1 한 후 1단계로 복귀.

---

## 4단계 — WARN 처리 (조건부)

QA와 시니어 리뷰 모두 PASS이지만 WARN 이슈가 존재하는 경우 사용자에게 처리 방식을 묻는다.

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

사용자 선택에 따라:

- **모두 자동 수정 / 일부 수정**: 해당 WARN 항목들을 prompt에 포함해 `uiux-publisher-agents` Agent 호출 → **3-A) Spec 이탈 항목 자동 현행화 동일 절차 수행** → 1단계로 복귀 (루프 카운트 +1, 단 카운트 초과 시 종료)
- **무시하고 종료**: 5단계로 진행

---

## 5단계 — 완료 보고

검수 완료 시 다음을 출력한다:

```
✅ $ARGUMENTS 검수 완료

- QA: PASS (BLOCKER 0 / WARN [n] / INFO [n])
- Vue 시니어 리뷰: PASS (BLOCKER 0 / WARN [n] / INFO [n])
- 루프 횟수: [n]회
- spec 자동 현행화 (3-A 결과 — 이탈 항목이 있었을 경우만 출력):
  - [항목명]: [spec 기존] → [실제 구현으로 변경]

[INFO/WARN 무시 항목이 있다면 목록 표시 — 향후 개선 참고용]

검수 메모 저장:
- .claude/agent-memory/uiux-qa-agents/$ARGUMENTS.md
- .claude/agent-memory/vue-senior-reviewer-agents/$ARGUMENTS.md
```
