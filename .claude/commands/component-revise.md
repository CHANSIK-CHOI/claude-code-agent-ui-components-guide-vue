# component-revise

`$ARGUMENTS`의 첫 번째 단어를 **컴포넌트명**, 나머지 전체를 **변경 내용**으로 파싱한다.

예시: `/component-revise Button icon 슬롯 추가 및 loading 상태 개선`
→ 컴포넌트명 = `Button`, 변경 내용 = `icon 슬롯 추가 및 loading 상태 개선`

기존 컴포넌트의 명세(spec)를 변경 내용에 맞게 수정하고, 구현·가이드 페이지를 재작성한 후 검수까지 자동으로 진행한다.

---

## 0단계 — 사전 확인

다음 두 파일의 존재 여부를 확인한다:

| 파일 | 처리 |
|------|------|
| `components/{atoms\|molecules\|organisms}/{컴포넌트명}.vue` | **부재 시 즉시 종료** — "구현 파일이 없습니다. `/component-create {컴포넌트명}`으로 먼저 생성해주세요." |
| `.claude/specs/{컴포넌트명}.md` | **부재 시 reverse-mode 진행** (아래 참조) |

### Spec 부재 시 — reverse-mode

spec 파일이 없으면 `uiux-planner-agents`를 **reverse-mode**로 호출해 현재 코드에서 명세를 역추출한다.

```
@uiux-planner-agents

reverse-mode: 다음 컴포넌트의 현재 코드에서 명세를 역추출해주세요.
- 파일: components/{layer}/{컴포넌트명}.vue
- 산출물: .claude/specs/{컴포넌트명}.md (저장 전 사용자에게 초안을 보여주고 승인받기)
```

역추출된 spec을 `.claude/specs/{컴포넌트명}.md`에 저장한 후 1단계로 진행한다.

---

## 1단계 — 명세 수정 [플랜 모드]

현재 spec과 변경 내용을 함께 `uiux-planner-agents`에 전달해 수정안을 작성한다.

```
@uiux-planner-agents

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

사용자에게 수정안(diff)을 보여주고 승인을 받는다.

승인 후 본 명령이 직접 `.claude/specs/{컴포넌트명}.md`를 업데이트하고 2단계로 진행한다.
이중 저장 방지를 위해 planner를 재호출하지 않는다.

---

## 2단계 이후 — [어셉트 모드]

1단계 승인 후 **추가 확인 없이** 아래 순서를 자동으로 진행한다.

### 2단계 — 구현 재작성 (uiux-publisher-agents)

수정된 `.claude/specs/{컴포넌트명}.md`를 기준으로 `uiux-publisher-agents`를 호출한다.

```
@uiux-publisher-agents

다음 컴포넌트를 수정된 spec에 맞게 재구현해주세요.

- 컴포넌트명: {컴포넌트명}
- spec: .claude/specs/{컴포넌트명}.md
- 현재 구현: components/{layer}/{컴포넌트명}.vue

[변경된 spec 항목]
{1단계 diff 요약}

구현 지침:
- 변경 내용에 해당하는 부분만 최소한으로 수정한다 (변경 범위 밖 코드는 건드리지 않는다)
- BEM 블록명 유지: {현재 블록명}
- defineOptions({ inheritAttrs: false }) + v-bind="$attrs" 위치 유지
- barrel export(index.ts)는 컴포넌트명이 이미 등록되어 있으면 건드리지 않는다
```

### 3단계 — 가이드 페이지 업데이트

`rules/guide-page.md` 규칙에 따라 `pages/guide/{컴포넌트명}/index.vue`를 변경 내용에 맞게 업데이트한다.

- 가이드 페이지가 없으면 신규 작성한다
- 변경된 Props / Slots / Events 섹션을 반영한다
- 추가된 variant나 상태가 있으면 데모 섹션에 추가한다

(uiux-publisher-agents가 담당 — 사용자 추가 확인 없이 진행)

### 4단계 — 검수 (자동 분기 루프백 포함)

`/component-audit {컴포넌트명}`과 동일한 검수 절차를 수행한다 (해당 명령의 1~4단계를 그대로 따른다).

요약:
1. **QA 검수** (`uiux-qa-agents`) — Context7 사실 체크 + Playwright 실제 화면 검증
2. **Vue 시니어 리뷰** (`vue-senior-reviewer-agents`) — Composition API 관용구 + 복잡도
3. **루프백 (조건부)** — BLOCKER 시 자동 분기 (publisher 재실행 후 다시 1단계 검수). 최대 2회, 초과 시 사용자 개입 요청으로 종료
4. **WARN 처리 (조건부)** — 사용자에게 묻고 결정

> **루프백 시작점**: 수정 단계의 이슈는 항상 publisher부터 재실행한다 (spec은 이미 사용자가 승인한 상태이므로 planner 루프백 없음). spec 자체 결함이 의심되면 루프 카운트 초과 시 사용자 개입 요청으로 처리한다.

> **dev server 사전 기동 필요**: 가이드 페이지 검증을 위해 `npm run dev`가 별도 터미널에 떠 있어야 한다. QA 에이전트가 미기동을 감지하면 사용자에게 안내 후 대기한다.

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

이슈가 발견된 경우 적용 내역도 함께 보고합니다.
```
