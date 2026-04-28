# component-audit

`$ARGUMENTS` 컴포넌트를 검수만 수행한다 (신규 생성 없이).
QA 검수(라이브러리 사실 체크 + 화면 동작 검증) → Vue 시니어 리뷰(메커니즘/복잡도) 순차 실행.
이슈 발견 시 자동 분기 루프백 (planner 또는 publisher 재실행 후 다시 검수). 최대 2회 루프, 초과 시 사용자 개입 요청으로 종료.

---

## 0단계 — 사전 확인

다음 두 파일의 존재 여부를 확인한다:

| 파일                                                      | 처리                                                                                                |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `components/{atoms\|molecules\|organisms}/$ARGUMENTS.vue` | **부재 시 즉시 종료** — "구현 파일이 없습니다. `/component-create $ARGUMENTS`로 먼저 생성해주세요." |
| `.claude/specs/$ARGUMENTS.md`                             | **부재 시 reverse-mode 진행** (아래 참조)                                                           |

### Spec 부재 시 — reverse-mode

spec 파일이 없으면 `uiux-planner-agents`를 **reverse-mode**로 호출한다.

```
@uiux-planner-agents

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

reverse-mode로 spec이 생성되면 `.claude/specs/$ARGUMENTS.md`에 저장 후 1단계로 진행.

---

## 1단계 — QA 검수

`uiux-qa-agents`를 호출해 다음을 검증한다:

- Context7 MCP로 외부 라이브러리 API 사실 체크 (Radix Vue, @vuepic/vue-datepicker 등)
- Playwright MCP로 가이드 페이지(`pages/guide/$ARGUMENTS/index.vue`) 실제 동작 검증
- spec과 구현 일치 여부

**dev server 사전 체크**: QA 에이전트가 `curl`로 `http://localhost:5000`을 확인. 미기동 시 사용자에게 `npm run dev` 안내 후 대기. 자체 기동 금지.

**가이드 페이지 부재 시**: Playwright 단계는 INFO로 스킵, Context7 단계만 실행.

### QA 검수 결과 처리

`uiux-qa-agents`는 보고서 마지막 줄에 다음 중 하나를 출력한다. 명령은 이 헤더를 파싱해 다음 단계를 결정한다.

| 헤더                                            | 다음 단계                                 |
| ----------------------------------------------- | ----------------------------------------- |
| `## 검수 결과: PASS`                            | 2단계 (Vue 시니어 리뷰) 진행              |
| `## 검수 결과: FAIL — 루프백 planner`           | 3단계 (루프백)로 분기, 시작점 = planner   |
| `## 검수 결과: FAIL — 루프백 publisher`         | 3단계 (루프백)로 분기, 시작점 = publisher |
| `## 검수 결과: FAIL — 루프백 planner+publisher` | 3단계 (루프백)로 분기, 시작점 = planner   |

WARN만 있고 BLOCKER가 없는 경우는 PASS로 분류된다 (WARN은 호출자 명령 단에서 사용자에게 묻고 결정 — 본 명령 4단계 참조).

---

## 2단계 — Vue 시니어 리뷰

`vue-senior-reviewer-agents`를 호출해 다음을 검토한다:

- Composition API 관용구 (watch/computed 적절성, props mutation, v-model 패턴 등)
- 복잡도 (분기/중첩/반복)
- Vue/Nuxt 메커니즘 정합성 (`defineOptions`, `v-bind="$attrs"` 위치, auto-import 등)

### 시니어 리뷰 결과 처리

`vue-senior-reviewer-agents`는 보고서 마지막 줄에 다음 중 하나를 출력한다. 명령은 이 헤더를 파싱해 다음 단계를 결정한다.

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

### 루프백 분기 — 시작점에 따라 다른 에이전트 호출

| 루프백 시작점       | 호출 순서                                                                                       |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| `planner`           | `uiux-planner-agents`로 spec 수정 → 사용자 승인 → `uiux-publisher-agents`로 구현 → 1단계로 복귀 |
| `publisher`         | `uiux-publisher-agents`로 구현 수정 → 1단계로 복귀                                              |
| `planner+publisher` | `uiux-planner-agents`로 spec 수정 → 사용자 승인 → `uiux-publisher-agents`로 구현 → 1단계로 복귀 |

루프백 시 호출하는 에이전트에 다음을 함께 전달:

- 검수 보고서의 BLOCKER 목록
- (시니어 리뷰의 경우) `현재 코드 / 권고 / 이유` 3단 권고

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

- **모두 자동 수정 / 일부 수정**: 해당 WARN 항목들과 함께 `uiux-publisher-agents` 호출 → 1단계로 복귀 (루프 카운트 +1, 단 카운트 초과 시 종료)
- **무시하고 종료**: 5단계로 진행

---

## 5단계 — 완료 보고

검수 완료 시 다음을 출력한다:

```
✅ $ARGUMENTS 검수 완료

- QA: PASS (BLOCKER 0 / WARN [n] / INFO [n])
- Vue 시니어 리뷰: PASS (BLOCKER 0 / WARN [n] / INFO [n])
- 루프 횟수: [n]회

[INFO/WARN 무시 항목이 있다면 목록 표시 — 향후 개선 참고용]

검수 메모 저장:
- .claude/agent-memory/uiux-qa-agents/$ARGUMENTS.md
- .claude/agent-memory/vue-senior-reviewer-agents/$ARGUMENTS.md
```
