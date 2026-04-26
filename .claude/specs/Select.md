# Select 컴포넌트 명세

> Figma 노드: 닫힌 상태 `40004010:2461` / 열린 상태(드롭다운) `40004346:13465`
> (fileKey는 `.claude/CLAUDE.md` "프로젝트 외부 리소스 → Figma" 단일 출처 참조)

---

### 0. Atomic 계층 & 파일 배치

- **계층**: atoms — 외부 컴포넌트를 조합하지 않는 단일 폼 선택 요소. Input, TextArea와 동급의 폼 입력 atom
- **배치 경로**: `components/atoms/Select/`
- **Base/Wrapper 분리**: Base만 구성. Wrapper 변형(멀티셀렉트, 검색형 등)은 별도 컴포넌트로 분리 예정이며 현재 명세 범위에 포함되지 않음

계층 판단 근거: 단일 값 선택이라는 명확한 단일 역할. 내부적으로 Radix Vue 구성요소를 조합하나 외부에서 보면 단일 폼 컨트롤이므로 atoms 분류.

---

### 1. 컴포넌트 개요

사용자가 미리 정의된 옵션 목록에서 하나의 값을 선택하는 드롭다운 선택 컴포넌트입니다.
Trigger 영역은 Input과 동일한 외형을 가지며, 클릭 시 드롭다운 패널이 열립니다.
라벨이나 도움말 텍스트가 필요한 경우 `FormField`와 조합해 사용합니다.

---

### 2. 영역 구성 (Area Map)

#### Trigger 영역 (닫힌 상태)

- ① **선택값 / Placeholder (SelectValue)** — 선택된 옵션의 텍스트를 표시. 미선택 시 placeholder 표시 / 필수
- ② **Chevron 아이콘 (SelectIcon)** — 우측 끝에 위치하는 방향 표시 아이콘. SVG 경로 자체는 위를 향하는 형태(∧). 닫힌 상태: CSS `rotate(180deg)` 적용 → 아래 방향(↓) / 열린 상태: `rotate(0deg)` → 위 방향(↑). 크기는 부모 요소(`.SelectRoot__icon`)가 제어 / 필수

#### 드롭다운 패널 영역 (열린 상태)

- ③ **스크롤 위로 버튼 (SelectScrollUpButton)** — 아이템이 많아 스크롤이 필요할 때 패널 상단에 표시 / 조건부
- ④ **옵션 목록 뷰포트 (SelectViewport)** — 아이템 목록이 렌더링되는 스크롤 가능 영역 / 필수
- ⑤ **옵션 아이템 (SelectItem)** — 선택 가능한 개별 항목. 선택된 항목은 배경색으로 강조 표시 / 필수 (1개 이상)
- ⑥ **스크롤 아래로 버튼 (SelectScrollDownButton)** — 아이템이 많아 스크롤이 필요할 때 패널 하단에 표시 / 조건부

> SelectItemIndicator(체크마크): 미사용 확정. Figma에 체크마크 없음. 선택 항목은 배경색 강조(`$bg-disabled`)만으로 구분함.

> 아이템 그룹화(SelectGroup / SelectLabel): 미구현 확정. 현재 디자인에 그룹 구분 없음. 추후 필요 시 별도 확장 예정.

---

### 2-1. Props 목록

| 항목 | 설명 | 기본값 |
|------|------|--------|
| 선택값 | 현재 선택된 옵션의 값 (v-model 연동). 미선택 시 undefined | 미선택 (undefined) |
| 옵션 목록 | 드롭다운에 표시할 항목 배열. 각 항목은 값(value), 표시 텍스트(label), 비활성 여부(disabled, 선택사항)로 구성 | — (필수) |
| Placeholder | 미선택 상태일 때 Trigger에 표시할 안내 텍스트 | 빈 값 |
| 비활성 여부 | 켜면 Trigger 클릭 불가, 드롭다운 열리지 않음, 시각적으로 흐려짐 | 끔 |
| 에러 여부 | 켜면 에러 상태로 표시 (`aria-invalid="true"` 자동 적용). 에러 메시지 텍스트는 FormField 담당 | 끔 |
| id | 외부 `<label>`과 연결하는 고유 식별자. FormField 연동 시 필수. 미전달 시 내부 자동 생성 | 미설정 (자동 생성) |

> **Radix Vue 래핑 컴포넌트 attrs 위임 — 3단계 전략 적용** (자세한 규칙은 `.claude/rules/components.md` "Radix Vue 래핑 컴포넌트 attrs 위임 전략" 참조)
>
> | 단계 | 위임 대상 | 처리 방법 |
> |------|---------|---------|
> | 1단계 — SelectRoot 전용 props | `name`, `required`, `dir`, `open`, `defaultOpen`, `defaultValue`, `autocomplete` | `useAttrs()`로 명시적 리스트 분리 → `SelectRoot`에 `v-bind` |
> | 2단계 — 인터랙티브 attrs | 나머지 전부 (`aria-*`, `class`, `style`, `tabindex`, `data-*` 등) | `SelectTrigger`(내부 `<button>`)에 `v-bind` |
> | 3단계 — Content 포지셔닝 | `position`, `side-offset` 등 | 명시적 prop으로 추가 (현재는 `position="popper"`, `side-offset="4"` 하드코딩 default) |
>
> - `id`는 양쪽 제외 — 내부 `selectId` computed로 별도 처리 (`<label for>` 연동)

---

### 2-2. Props 설계 원칙 — 중복 제어 제거

| 안티패턴 | 원칙 | 올바른 방향 |
|---------|------|-----------|
| `showPlaceholder: boolean` + `placeholder: string` | 값 유무로 파생 가능 | `placeholder` 값만 사용. 값이 있으면 자동 표시 |
| `isOpen: boolean` (외부 제어) | Radix Vue 내부 상태로 관리 | `open-change` 이벤트로 외부에 열림 상태 통보만 |
| `isSelected: boolean` (아이템 단위) | Radix Vue가 내부적으로 `aria-selected` 처리 | 별도 prop 없이 `modelValue`와 일치 여부로 자동 판단 |
| `<Select name="x" />` 시 name이 button에 적용됨 | attrs 목적지에 따라 분리 | `useAttrs()` 분리: SelectRoot용(`name`, `required`, `dir` 등) / SelectTrigger용(`aria-*` 등) |

---

### 3. Variant 목록

Select 컴포넌트는 별도의 시각적 variant가 없으며, 상태(State)에 따라 외관이 변합니다.

---

### 4. 상태(State) 정의

#### Trigger (닫힌 상태)

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| default | 기본 테두리(연한 회색), 흰 배경, placeholder 텍스트 표시, chevron 아래 방향(↓) | 클릭 시 드롭다운 열림 |
| filled | 기본 테두리(연한 회색), 흰 배경, 선택값 텍스트 진하게 표시, chevron 아래 방향(↓) | 클릭 시 드롭다운 열림 |
| open (focus) | 테두리 색상 어둡게, 흰 배경 유지, chevron 위 방향(↑)으로 전환 | 드롭다운 패널 열림 |
| disabled | 배경 어둡게(회색 계열), 테두리 유지, 텍스트 흐리게, 커서 변경 | 클릭 차단, 드롭다운 열리지 않음 |
| error | 테두리 색상 에러 색상으로 변경 | 선택은 가능 |

#### 드롭다운 패널

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| 기본 아이템 | 흰 배경, 텍스트 중간 회색 | 클릭 시 선택 |
| hover 아이템 | 배경 살짝 어둡게 | 해당 아이템 선택 예고 |
| selected 아이템 | 배경 회색(`$bg-disabled`) 강조, 텍스트 동일 | 선택된 값임을 시각적으로 구분 |
| disabled 아이템 | 배경 회색(`$bg-disabled`), 텍스트 흐리게(`$text-disabled`), 커서 `not-allowed` | 클릭 차단 |

---

### 5. 동작 규칙

- Trigger 클릭 시 드롭다운 패널이 열리고, 다시 클릭하거나 외부 클릭 시 닫힘
- disabled 상태에서는 Trigger 클릭이 차단되며 드롭다운이 열리지 않음
- 옵션 항목 클릭 시 해당 값이 선택되고 드롭다운이 자동으로 닫힘
- 개별 옵션 항목에 `disabled`가 설정된 경우 해당 항목은 클릭되지 않음. 시각적으로 배경 `$bg-disabled`, 텍스트 `$text-disabled`, 커서 `not-allowed` 적용 (Trigger disabled 상태와 동일한 스타일)
- placeholder는 선택값이 없을 때만 표시
- 드롭다운 패널은 Trigger 아래쪽에 우선 배치되며, 화면 하단 공간이 부족하면 위쪽으로 전환 (Radix Vue `position="popper"` 자동 처리)
- 드롭다운 패널 너비는 Trigger 너비와 동일하게 맞춤
- 드롭다운 패널 최대 높이는 `50rem`. 아이템 목록이 이를 초과하면 내부 스크롤 활성화. 스크롤 위/아래 버튼(SelectScrollUpButton / SelectScrollDownButton) 자동 표시
- 드롭다운 패널은 `<body>`에 Portal로 렌더링되어 z-index 충돌 방지 (`$z-dropdown` 레이어)
- chevron 아이콘은 드롭다운 열림/닫힘 상태에 따라 방향이 전환됨 (CSS transform)
- 외부에서 id prop이 전달되면 내부 자동 생성 id 대신 외부 id를 사용
- 라벨/도움말/툴팁 관련 동작은 `FormField` 명세를 참조

---

### 6. 이벤트 목록

| 이벤트 | 발생 시점 | 전달 정보 |
|--------|---------|---------|
| update:modelValue | 옵션 항목을 선택했을 때 | 선택된 옵션의 값(문자열) |
| open-change | 드롭다운이 열리거나 닫힐 때 | 열림 여부 (true / false) |

---

### 7. 접근성 요구사항

Radix Vue가 자동으로 처리하는 항목:

| 항목 | 처리 방식 |
|------|---------|
| `role="combobox"` | SelectTrigger에 자동 적용 |
| `aria-expanded` | 드롭다운 열림 여부에 따라 자동 갱신 |
| `aria-haspopup="listbox"` | SelectTrigger에 자동 적용 |
| `role="listbox"` | SelectContent에 자동 적용 |
| `role="option"` | 각 SelectItem에 자동 적용 |
| `aria-selected` | 선택된 항목에 자동 적용 |
| `aria-disabled` | disabled 아이템에 자동 적용 |
| 키보드 탐색 | Enter/Space 열기, 방향키 탐색, Escape 닫기, Home/End 이동 내장 |
| 포커스 트랩 | 드롭다운 열린 동안 포커스가 패널 내부에서만 이동 |

퍼블리셔가 직접 처리해야 하는 항목:

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| 라벨 연결 | FormField와 조합 시 | `<label for="{id}">` ↔ Trigger `id` 연결. `inputId`가 일치해야 함 |
| 라벨 미사용 시 | 단독 사용 시 | `aria-label` 또는 `aria-labelledby`를 `$attrs`로 전달 필요 |
| 에러 메시지 연결 | error 상태일 때 | `aria-describedby="helper-{id}"`를 `$attrs`로 직접 전달 |
| 유효성 상태 전달 | error 상태일 때 | `:error="true"` → Trigger에 `aria-invalid="true"` 자동 적용 |
| 비활성 알림 | disabled 상태일 때 | Radix Vue가 `aria-disabled`로 보조기기에 자동 전달 |
| 포커스 표시 | 키보드 포커스 시 | Trigger에 외곽선(포커스 링) 시각적으로 반드시 표시 |
| 필수 항목 | FormField와 조합 시 | `aria-required="true"`를 `$attrs`로 전달 필요 |

---

### 8. FormField 연동 패턴

```
FormField (inputId="category", labelText="카테고리", required)
  └─ Select (id="category", placeholder="...", aria-describedby="helper-category")
```

- FormField의 `inputId`와 Select의 `id`를 반드시 동일하게 설정
- 에러 상태일 때 FormField에 `error-text`, Select에 `:error="true"` + `aria-describedby="helper-{id}"` 함께 전달

---

### 9. 디자인 토큰 참고

Figma 노드: 닫힌 상태 `40004010:2461` / 열린 상태(드롭다운) `40004346:13465`

#### Trigger 색상 (Input과 동일)

| 적용 위치 | Figma 색상값 | 매핑 토큰 |
|----------|------------|---------|
| Trigger 배경 (default / filled / open) | `#ffffff` | `$bg-primary` |
| Trigger 배경 (disabled) | `#f5f5f5` | `$bg-disabled` |
| Trigger 테두리 (default / filled) | `#dddddd` | `$border-default` |
| Trigger 테두리 (open / focus) | `#111111` | `$border-input-focus` |
| placeholder 텍스트 | `#666666` | `$text-secondary` |
| 선택값 텍스트 (filled) | `#111111` | `$text-strong` |
| 비활성 텍스트 (disabled) | `#c0c0c0` | `$text-disabled` |
| 에러 테두리 | `#ff5146` | `$color-danger` |

#### 드롭다운 패널 색상

| 적용 위치 | Figma 색상값 | 매핑 토큰 |
|----------|------------|---------|
| 패널 배경 | `#ffffff` | `$bg-primary` |
| 패널 테두리 | `#dddddd` | `$border-default` |
| 아이템 기본 배경 | `#ffffff` | `$bg-primary` |
| 선택된 아이템 배경 (selected) | `#f5f5f5` | `$bg-disabled` |
| 아이템 텍스트 | `#666666` | `$text-secondary` |

#### Trigger 형태 및 내부 여백 (Input과 동일)

| 속성 | 수치 | 매핑 토큰 |
|-----|------|---------|
| Trigger 높이 | 46px | — (고정 높이) |
| Trigger 좌우 패딩 | 13px | `$spacing-input-x` |
| Trigger 테두리 두께 | 1px | — (고정값) |
| Trigger border-radius | 8px | `$radius-md` |

#### 드롭다운 패널 형태 및 아이템 여백

| 속성 | 수치 | 매핑 토큰 |
|-----|------|---------|
| 패널 테두리 두께 | 1px | — (고정값) |
| 패널 border-radius | 8px | `$radius-md` |
| 패널 최대 높이 | 500px (`50rem`) | 초과 시 내부 스크롤 + 스크롤 버튼 표시 |
| 각 아이템 높이 | 44px | — (고정 높이) |
| 아이템 좌우 패딩 | 12px | `$spacing-sm` + 소폭 보정 (0.4rem 차이) |

#### 타이포그래피 (Input과 동일)

| 적용 위치 | 크기 | 굵기 | 매핑 토큰 |
|----------|------|------|---------|
| placeholder / 선택값 텍스트 | 16px | 400 | `$font-size-body1`, `$font-weight-regular` |
| 아이템 텍스트 | 16px | 400 | `$font-size-body1`, `$font-weight-regular` |

#### Chevron 아이콘

| 속성 | 값 | 비고 |
|-----|-----|------|
| 아이콘 크기 | 16×16px (`1.6rem × 1.6rem`) | 부모 요소(`.SelectRoot__icon`)가 크기 제어. SVG `width/height` 속성 제거 |
| SVG 방향 | 위를 향하는 경로(∧) | SVG 자체의 기본 형태 |
| 닫힌 상태 방향 | 아래(↓) | CSS `rotate(180deg)` 적용 |
| 열린 상태 방향 | 위(↑) | CSS `rotate(0deg)` (회전 없음) |
| stroke 색상 | `#666666` | `$text-secondary` |

---

### 구현 복잡도 신호

| 컴포넌트 유형 | 이유 | 권장 방식 |
|-------------|------|---------|
| Select (단일 선택) | 포지셔닝, 키보드 탐색, 포커스 트랩, aria 처리 복잡 | Radix Vue 래핑 패턴 |

Radix Vue 구성요소 사용 목록:
`SelectRoot` / `SelectTrigger` / `SelectValue` / `SelectIcon` / `SelectPortal` / `SelectContent` / `SelectViewport` / `SelectScrollUpButton` / `SelectScrollDownButton` / `SelectItem` / `SelectItemText` / `SelectItemIndicator`

⚠️ Radix Vue 래핑 패턴 적용 — 프론트엔드 담당자와 구현 방식 협의

---

## 확정된 디자인 결정

초안 작성 후 확인된 항목입니다.

| 항목 | 확정 내용 |
|------|---------|
| 체크마크 아이콘 (SelectItemIndicator) | 미사용. 선택 항목은 배경색 강조(`$bg-disabled`)만으로 구분 |
| 드롭다운 패널 최대 높이 (max-height) | `50rem`으로 고정. 초과 시 내부 스크롤 + SelectScrollUpButton / SelectScrollDownButton 표시 |
| 아이템 그룹화 (SelectGroup / SelectLabel) | 현재 미구현. 추후 필요 시 별도 확장 예정 |
| disabled 아이템 시각적 표현 | Trigger disabled 상태와 동일 — 배경 `$bg-disabled`, 텍스트 `$text-disabled`, 커서 `not-allowed` |
| Chevron 아이콘 stroke 색상 | `#666666` → `$text-secondary`. SVG 경로는 위를 향하는 형태(∧), CSS rotate로 방향 전환 |
