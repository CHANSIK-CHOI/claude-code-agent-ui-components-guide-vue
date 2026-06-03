## Spec 영역 / Publisher 자율 영역 경계 규칙

planner 가 spec 본문에 무엇을 담고, publisher 가 무엇을 자율 결정할 수 있는지 정의하는 **단일 출처**. 이 규칙은 다음 2개 에이전트가 공통으로 참조한다.

- `uiux-planner-agents` — spec 작성 범위 결정
- `uiux-publisher-agents` — 구현 중 spec 이탈 보고 대상 판정

---

### 1. 원칙 한 줄

> **spec 은 "무엇을 만들지(What)" 만 정의하고, publisher 는 "어떻게 만들지(How)" 를 결정한다.**

다만 "어떻게" 중에서도 spec 에 명시적으로 적힌 항목(예: spec 본문에 "공통 단일 Accordion 으로 감싼다" 라고 적혀있음)은 spec 영역으로 승격된다.

---

### 2. 컴포넌트 spec 영역 (uiux-planner / uiux-publisher 공통)

#### 2-1. spec 영역 (planner 가 작성, publisher 가 임의 변경 시 이탈 보고)

| 항목 | 설명 |
|------|------|
| Atomic 계층 | atoms / molecules / organisms / popup |
| 파일 배치 경로 | `components/{계층}/{ComponentName}.vue` |
| Base/Wrapper 분리 여부 | Base 만 / Base + Wrapper / Wrapper 추가 |
| 영역 구성 (Area Map) | ① 영역명 — 설명 / 필수 여부 형태로 번호 매김 |
| props 시그니처 | 이름, 타입, 기본값, 필수 여부, 설명 |
| emit 시그니처 | 이벤트명, 페이로드 타입, 발생 시점 |
| slot 정의 | 기본 슬롯·named slot 목록과 용도 |
| variant 목록 | 시각/기능 분기 축 (size / shape / variant 등) |
| 상태 정의 | disabled / error / loading / readonly 등 시각·기능 변화 |
| 동작 규칙 | 인터랙션 흐름, watch/computed 동작, 양방향 동기화 패턴 |
| 접근성 요구사항 | aria-* 처리, 키보드 탐색, label 연결 |
| 외부 라이브러리 사용 | Radix Vue 컴포넌트 매핑, vant 사용 여부 |

#### 2-2. publisher 자율 영역 (spec 영역 외 — 임의 결정 가능, 이탈 보고 불필요)

| 항목 | 사유 |
|------|------|
| 내부 div/span/ul/li 등 마크업 골격 | spec 의 "영역 구성" 은 의미 단위, 실제 태그 선택은 publisher 책임 |
| BEM 클래스명 (`$b`, `__element`, `--modifier`) | `rules/style.md` 영역 |
| SCSS 중첩 구조, gap/margin 선택 | `rules/style.md` 영역 |
| 디자인 토큰 자동 매핑 (`#535e66` → `$text-700` 등) | `rules/tokens.md` "토큰이 없을 때 처리 기준" 영역 |
| 이벤트 핸들러 함수명 (`onClick`, `handleChange` 등) | publisher 자율 |
| `v-model` 내부 구현 (`computed get/set` vs `watch`) | 동작 결과가 spec 과 일치하면 자율 |
| 내부 상태 변수명·`ref` vs `reactive` 선택 | publisher 자율 |
| Vue 메커니즘 디테일 (`computed` 캐싱·`watch` immediate 등) | 동작 결과가 spec 과 일치하면 자율 |

#### 2-3. 회색 지대 — spec 에 명시되면 spec 영역, 미명시면 publisher 자율

다음 항목은 기본적으로 publisher 자율이나, spec 본문에 명시적으로 적혀있으면 spec 영역으로 승격된다.

| 항목 | spec 에 명시되면 (spec 영역) | spec 에 미명시이면 (publisher 자율) |
|------|-----------|-----------|
| 마크업 골격 패턴 | spec "공통 단일 Accordion 으로 감싼다" → 단일 감싸기 강제 | publisher 가 단일/개별 선택 |
| 필수 표시 포맷 | spec "checkbox/popup: `[필수]`, accordion: `(필수)`" → 그대로 | publisher 가 디자인 보고 결정 |
| placeholder 텍스트 | spec "placeholder='선택해주세요'" → 그대로 | publisher 가 적절히 결정 |
| 아이콘 사용 위치·이름 | spec "닫기 버튼에 SmallCloseSvg" → 그대로 | publisher 가 디자인 보고 결정 |

> **판정 기준 한 줄**: spec 의 어떤 줄에 그 항목이 텍스트로 적혀있으면 spec 영역. 적혀있지 않으면 publisher 자율.

---

### 3. Publisher 이탈 보고 매트릭스 (단일 출처)

publisher 가 spec 과 다르게 구현해야 할 때, 작업 완료 보고서에 `⚠️ Spec 이탈 항목` 표를 포함해야 하는 케이스 매트릭스.

#### 3-1. 이탈 보고 대상 (반드시 보고)

| # | 케이스 | 예시 |
|---|--------|------|
| 1 | spec 에 없는 props 추가 | `allCheckText` prop 을 spec 에 없는데 구현 중 필요해서 추가 |
| 2 | spec 의 props 시그니처 변경 (타입·기본값·필수 여부) | spec `disabled: boolean` → 실제 `disabled?: boolean \| 'force'` |
| 3 | spec 의 emit 이름·페이로드 변경 | spec `@change` → 실제 `@update:value` |
| 4 | spec 의 동작 규칙 변경 | spec "items 변경 시 체크 초기화" → 실제 "기존 상태 유지" |
| 5 | spec 에 명시된 마크업 구조 변경 (§2-3 회색 지대 spec 명시 케이스) | spec "공통 단일 Accordion" → 실제 "개별 Accordion" |
| 6 | spec 에 명시된 a11y 처리 변경 | spec 명시 aria 속성 제외/추가 |
| 7 | spec 에 명시된 시각 포맷 변경 (§2-3 회색 지대 spec 명시 케이스) | spec "필수 표시 `[필수]`" → 실제 "`(필수)`" |

#### 3-2. 이탈 보고 대상이 아닌 케이스

| 케이스 | 사유 |
|--------|------|
| 디자인 토큰 자동 대체 (`#535e66` → `$text-700`) | spec 본문 영역 아님 — `rules/tokens.md` "토큰이 없을 때 처리 기준" |
| spec 미명시 마크업 구조 (§2-3 회색 지대 미명시 케이스) | publisher 자율 영역 |
| BEM 클래스명, SCSS 중첩 구조 | `rules/style.md` 영역 |
| 동일 의미의 단순 표현 차이 (spec "false 로 초기화" / 실제 "기본값 false") | 동작 동일 — 이탈 아님 |
| 이벤트 핸들러 함수명, 내부 변수명 | publisher 자율 |

#### 3-3. 보고 형식

```
⚠️ Spec 이탈 항목 (호출자 spec 현행화 필요):
| 항목 | spec 내용 | 실제 구현 | 이유 |
|------|---------|---------|------|
| [항목명] | [spec에 명시된 동작 또는 "없음 (신규 추가)"] | [실제 구현한 동작] | [이유] |
```

- **신규 추가 케이스**: spec 에 없던 prop/emit 을 추가했다면 "spec 내용" 컬럼에 `없음 (신규 추가)` 라고 쓰고, "실제 구현" 컬럼에 추가한 시그니처를 적는다.
- 이탈 항목이 없으면 `이탈 없음 — spec과 일치` 한 줄로 표기.

---

### 4. 명령(슬래시) 흐름에서의 처리

publisher 응답 본문의 `⚠️ Spec 이탈 항목` 표는 호출자(슬래시 명령) 가 받아 **Claude 가 Edit 도구로 spec 파일을 자동 현행화**한다. 사용자 추가 확인은 없다 (무중단 자동 진행).

해당 명령:
- `/component-create` 2-A 단계
- `/component-revise` 2-A 단계
- `/component-audit` 3-A 단계 (루프백 publisher 호출 직후) / 4단계 WARN 처리 자동 수정 직후

> **자동 적용 근거**: publisher 가 명시적으로 이탈을 보고했다는 것은 의도된 변경이며, 후속 QA/리뷰 단계에서 "spec과 구현 일치 여부" 검수로 한 번 더 검증된다. 자동 적용으로 spec/구현 정합성을 유지한다.
> **CLAUDE.md "🔍 예외 조항" 정합**: publisher 가 출력한 이탈 표를 그대로 옮기는 저장 행위이며, "본문 = 에이전트 / 저장 = Claude" 책임 분리 원칙에 부합한다. Claude 가 임의로 spec 내용을 생성·요약·가공하는 것은 금지.
