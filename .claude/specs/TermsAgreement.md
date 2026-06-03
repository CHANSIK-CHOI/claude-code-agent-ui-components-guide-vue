# TermsAgreement 컴포넌트 명세

## 0. Atomic 계층 & 파일 배치

- **계층**: molecules — atoms(`Checkbox`)와 molecules(`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`)를 조합해 "약관 동의" 단위 UI를 구성하는 복합 폼 컴포넌트
- **배치 경로**: `components/molecules/TermsAgreement.vue`
- **Base/Wrapper 분리**: Base만

  Base 담당 로직: `items` 배열 기반 전체/개별 체크 상태 관리, 전체 동의 ↔ 개별 항목 양방향 동기화, item type별 렌더 분기 (checkbox / popup / accordion). `hasAccordionItems` computed(`items.some(item => item.type === 'accordion')`)로 컨테이너를 분기한다. `accordion` 타입 항목이 하나라도 있으면 단일 `Accordion` 인스턴스가 컨테이너 역할을 겸하며 `accordion` 타입 항목은 `AccordionItem`으로, 나머지는 일반 `<div>`로 분기 렌더. `accordion` 타입 항목이 전혀 없으면 `<div class="termsAgreement__items">`를 컨테이너로 사용하고 모든 항목을 일반 `<div class="termsAgreement__item">`으로 렌더한다 (불필요한 Radix Vue Accordion 컨텍스트·접근성 트리 노이즈 제거).

---

## 1. 컴포넌트 개요

약관 동의 UI를 구현하는 컴포넌트. "전체 동의" 체크박스와 개별 약관 항목 목록을 하나의 단위로 제공한다.

각 약관 항목은 세 가지 타입으로 렌더된다. `checkbox`는 체크만 가능한 단순 항목, `popup`은 체크 영역 오른쪽에 상세 내용 버튼이 있어 클릭 시 이벤트를 emit, `accordion`은 항목 하단에 내용을 인라인으로 펼쳐 보여주는 패턴이다.

주요 사용 맥락: 회원가입, 결제, 구독 신청 등 다단계 폼의 약관 동의 섹션.

---

## 2. 영역 구성 (Area Map)

- ① **전체 동의 영역** — `Checkbox` 컴포넌트. "전체 동의" 레이블과 함께 표시. 모든 항목이 체크될 때 체크 상태가 되고, 클릭 시 모든 항목을 일괄 체크/언체크 / 필수
- ② **구분선** — 전체 동의 영역과 개별 항목 목록 사이의 시각적 구분. 레이아웃 정의에 따라 선 또는 여백으로 표현 / 조건부
- ③ **항목 컨테이너** — `hasAccordionItems` computed 결과에 따라 두 가지 컨테이너로 분기. `ul/li` 구조를 사용하지 않는다 / 필수
  - **③-accordion** (`hasAccordionItems === true`): 단일 `Accordion` 컴포넌트(`type="multiple"`)가 컨테이너. `v-for` 루프에서 `accordion` 타입은 `AccordionItem`으로, 나머지는 일반 `<div>`로 분기 렌더
  - **③-plain** (`hasAccordionItems === false`): `<div class="termsAgreement__items">` 컨테이너. `v-for` 루프에서 모든 항목을 일반 `<div class="termsAgreement__item">`으로 렌더 (Accordion 미마운트)
  - ③-a **체크 영역** — `Checkbox` 컴포넌트. 항목 레이블과 함께 표시. `required` 여부는 레이블 뱃지로 표시 / 필수
  - ③-b **팝업 버튼** — `popup` 타입 전용. 체크 영역 오른쪽에 배치. 화살표 아이콘 버튼. 클릭 시 `popup-click` emit / 조건부 (`type === 'popup'`일 때)
  - ③-c **아코디언 콘텐츠** — `accordion` 타입 전용. `AccordionItem` > `AccordionContent` 래핑. `item.content` 값을 표시 / 조건부 (`type === 'accordion'`일 때)

---

## 2-1. TermsItem 타입 정의

| 필드명 | 설명 | 필수 여부 |
|--------|------|---------|
| `value` | 항목 고유 식별값. `v-for` key 및 체크 상태 맵의 key로 사용 | 필수 |
| `label` | 항목에 표시할 레이블 텍스트 | 필수 |
| `required` | 필수 동의 여부. `true`이면 레이블 앞에 필수 표시 추가. 타입별 포맷 상이 — checkbox/popup: `[필수]`, accordion: `(필수)` (`<em>` 태그, `aria-hidden="true"`) | 필수 |
| `type` | 항목 렌더 방식: `'checkbox'` / `'popup'` / `'accordion'` | 필수 |
| `content` | `accordion` 타입 전용 인라인 텍스트. `type='accordion'`일 때만 사용 | 조건부 |

---

## 2-2. Props 목록

| 항목 | 설명 | 기본값 |
|------|------|--------|
| items | 약관 항목 배열. 각 항목은 value / label / required / type / content 필드를 가짐 | 빈 배열 |
| allChecked | 전체 동의 체크 상태 (`v-model:allChecked` 연동). 외부에서 전체 동의 상태를 제어하거나 읽을 수 있음 | `false` |
| allCheckText | 전체 동의 체크박스에 표시할 레이블 텍스트 | `'전체 동의'` |

**주요 설계 원칙**
- 개별 체크 상태는 내부 `checkedMap` (value → boolean 맵)으로 관리하며 props로 노출하지 않는다.
- `items` 변경 시 기존 체크 상태를 유지한다 (신규 항목만 `false`로 초기화). 항목 제거 시 해당 항목의 체크 상태도 제거된다.

---

## 3. Variant 목록

TermsAgreement 자체의 Variant는 없다. item type 축은 `TermsItem.type` 필드로 제어한다.

| item type | 렌더 방식 |
|-----------|---------|
| `'checkbox'` | 체크박스 단독. 추가 상호작용 없음 |
| `'popup'` | 체크박스 + 오른쪽 팝업 버튼. 클릭 시 `popup-click` emit |
| `'accordion'` | 체크박스 + 하단 인라인 콘텐츠 펼침 (단일 `Accordion` 인스턴스의 `AccordionItem`으로 렌더) |

---

## 4. 상태(State) 정의

### 전체 동의 체크박스 상태

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| 전체 미체크 | 전체 동의 체크박스 미체크 상태 | — |
| 일부 체크 | 전체 동의 체크박스 미체크 상태 유지 | — |
| 전체 체크 | 전체 동의 체크박스 체크 상태 | `allChecked` emit 발생 |

> 디자인 미확인: 일부 체크 시 indeterminate 상태 표시 여부 — Figma 확인 필요. 현재 명세에서는 미체크와 동일하게 처리 가정.

---

## 5. 동작 규칙

**전체 동의 ↔ 개별 항목 양방향 동기화**
- 전체 동의 체크박스를 클릭하면 모든 개별 항목이 일괄 체크/언체크된다.
- 개별 항목이 모두 체크되면 전체 동의 체크박스가 자동으로 체크 상태로 전환된다.
- 개별 항목 중 하나라도 언체크되면 전체 동의 체크박스가 미체크 상태로 전환된다.

**update:checked emit 규칙**
- 개별 항목의 체크 상태가 변경될 때마다 `update:checked`를 emit한다.
- emit 페이로드: `{ value: string, checked: boolean }`
- 전체 동의 일괄 체크/언체크 시에도 각 항목마다 `update:checked`가 개별 emit된다.

---

## 6. 이벤트 목록

| 이벤트 | 발생 시점 | 전달 정보 |
|--------|---------|---------|
| `update:allChecked` | 전체 동의 상태가 변경될 때 | boolean |
| `update:checked` | 개별 항목의 체크 상태가 변경될 때 | `{ value: string, checked: boolean }` |
| `popup-click` | `popup` 타입 항목의 팝업 버튼 클릭 시 | string (value) |
| `accordion-open` | `accordion` 타입 항목이 펼쳐질 때 (열릴 때만, 닫힐 때는 emit하지 않음) | string (value) |

---

## 7. v-model 바인딩 정의

```vue
<TermsAgreement
  :items="termsItems"
  v-model:allChecked="isAllAgreed"
  @update:checked="onCheckedChange"
  @popup-click="openTermsPopup"
  @accordion-open="onAccordionOpen"
/>
```

**내부 상태 관리**
- 개별 항목 체크 상태는 내부 `checkedMap` (value → boolean 맵) 으로 관리.
- `allChecked` prop 변경 시 내부 `checkedMap` 전체를 동기화 (watch 사용).
- `allChecked=true` 외부 주입 시 `checkedMap` 전체를 `true`로 동기화하며, `allChecked=false` 외부 주입 시에는 `checkedMap`을 변경하지 않고 개별 상태를 유지한다. "전체 해제"는 사용자 인터랙션(`onAllCheckedChange(false)`) 흐름으로만 가능하다.

---

## 8. item type별 렌더링 설명

### `'checkbox'` 타입
- `Checkbox` 컴포넌트. 레이블: `item.label` 텍스트. `required`이면 레이블 앞에 `[필수]` 표시 (`<em aria-hidden="true">`).
- 추가 버튼 없음. 체크/언체크만 가능.

### `'popup'` 타입
- 레이아웃: 체크 영역(좌, flex-grow)과 팝업 버튼(우, shrink)이 한 행에 배치.
- 팝업 버튼: `<button type="button">`. SmallChevronRight 아이콘.
- 클릭 시 `popup-click` emit.
- `required`이면 레이블 앞에 `[필수]` 표시 (`<em aria-hidden="true">`).
- 팝업 버튼 접근성: `aria-label="\`${item.label} 내용 보기\`"` (동적).

### `'accordion'` 타입
- 컨테이너 구조: `hasAccordionItems` computed가 `true`일 때만 **단일 `<Accordion type="multiple">`**이 항목 목록 전체 컨테이너로 마운트된다. `accordion` 타입 항목은 `<AccordionItem>`으로, `checkbox` / `popup` 타입 항목은 `<div class="termsAgreement__item">`으로 분기 렌더. `hasAccordionItems`가 `false`이면 Accordion을 마운트하지 않고 `<div class="termsAgreement__items">` 컨테이너에 모든 항목을 `<div class="termsAgreement__item">`으로 렌더한다. `ul/li` 구조를 사용하지 않는다.
- `AccordionItem.value`는 `item.value` 사용.
- AccordionTrigger: `headTrigger: true` — 체크박스와 분리된 우측 별도 트리거 버튼 패턴. SmallChevronDown 아이콘.
- `AccordionContent` 내부에 `item.content` 텍스트 렌더 (`white-space: pre-line`).
- `required`이면 레이블 앞에 `(필수)` 표시 (`<em aria-hidden="true">`) — checkbox/popup의 `[필수]`와 포맷 다름.
- 아코디언 열림/닫힘은 체크 상태와 독립적으로 동작.
- 아코디언이 펼쳐질 때(열릴 때) `accordion-open` 이벤트를 emit한다. 닫힐 때는 emit하지 않는다.
- 구현 방법: 단일 `Accordion`의 `update:modelValue` 이벤트로 현재 열린 항목 배열 전체(`string[]`)를 수신한다. 이전값을 `prevOpenValues: string[]` 배열 하나로 유지하고, 이전 배열 대비 새로 추가된 value에 대해서만 `accordion-open`을 emit한다. 항목별 캐시 맵(`accordionOpenMap`)은 불필요해진다.

#### 시맨틱 참고 — `ul/li` 제거에 따른 목록 시맨틱 처리
- `ul/li` 제거로 스크린리더가 "목록 N개 항목"을 자동 안내하던 시맨틱이 사라진다.
- 사용자 요청에 따라 `ul/li`를 제거하고 단일 `Accordion`을 컨테이너로 사용한다.
- 목록 시맨틱이 필요하다면 `Accordion` 루트 div에 `role="list"`를 추가하고 각 `AccordionItem` / 일반 `<div>`에 `role="listitem"`을 부여하는 방식으로 대체할 수 있다. 단, 약관 동의 항목 목록은 "순서가 있는 목록" 또는 "항목 수를 알아야 하는 목록"으로서의 스크린리더 안내가 필수적이지 않다고 판단되므로, `role="list"` 대체 없이 구현해도 무방하다.

---

## 9. 접근성 요구사항

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| 전체 동의 레이블 연결 | 항상 | `Checkbox` 슬롯에 텍스트 전달. `for`-`id` 자동 연결 |
| 개별 항목 레이블 연결 | 항상 | 각 `Checkbox`의 슬롯에 `item.label` 전달 |
| popup 버튼 목적 명시 | `type === 'popup'` | `aria-label="[항목명] 내용 보기"` |
| 필수 항목 표시 | `required: true` | checkbox/popup: `[필수]`, accordion: `(필수)` — `<em aria-hidden="true">` 태그로 삽입. 시각 표시용이며 스크린리더는 `aria-hidden`으로 숨김 |
| accordion 열림/닫힘 | `type === 'accordion'` | Radix Vue `AccordionTrigger`가 `aria-expanded` 자동 처리 |

---

## 10. 디자인 토큰 매핑

Figma 인증 미완료 — 사용 컴포넌트(`Checkbox`, `Accordion`)의 기존 토큰 상속. 추가 시각 요소는 Figma 확인 후 보강.

| 사용 위치 | 예상 토큰 |
|---------|---------|
| 항목 간격 | `gap: 1.6rem` (flex 컨테이너) |
| "(필수)" 텍스트 색상 | `$color-danger` |
| 팝업 버튼 / accordion 트리거 색상 | `$text-600` |
| 항목 하단 구분선 | `1px solid $line-300` |
| accordion 콘텐츠 배경 | `$bg-secondary` |
| accordion 콘텐츠 텍스트 | `$font-size-caption1`, `$text-700` |

---

## 11. 미확정 항목

| 항목 | 현재 처리 |
|------|---------|
| 전체 동의 indeterminate 상태 | Figma 확인 전까지 미체크와 동일하게 처리 가정 |
| 에러 상태 (필수 미동의 시) | 컴포넌트 범위 외 — emit만, 에러 표시는 사용처 책임 |
| accordion content 슬롯화 | 텍스트 렌더 방식으로 우선 구현. 슬롯 확장 필요 시 `/component-revise` 검토 |
| 개별 항목 초기 체크 상태 주입 | `items` 변경 시 기존 상태 유지 방식으로 해결됨. 신규 항목만 `false`. 완전 초기화가 필요하면 `items`를 빈 배열로 교체 후 다시 주입 |
