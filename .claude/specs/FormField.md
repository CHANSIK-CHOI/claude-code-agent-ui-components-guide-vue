# FormField 컴포넌트 명세

---

### 0. Atomic 계층 & 파일 배치

- **계층**: molecules — Input, Select, DatePicker 등 atoms를 감싸는 form layout 래퍼
- **배치 경로**: `components/molecules/FormField/`
- **구조**: Base 컴포넌트만 구성. 내부에 특정 입력 컴포넌트를 주입하는 slot 기반 구조.

---

### 1. 컴포넌트 개요

form 요소에 공통으로 필요한 **라벨 · 툴팁 · 도움말 텍스트** 레이아웃을 제공하는 래퍼 컴포넌트입니다.
Input, Select, DatePicker 등 다양한 폼 컨트롤을 `default slot`으로 주입하면, 어떤 컴포넌트도 동일한 form layout을 재사용할 수 있습니다.

```vue
<!-- Input + 에러 메시지 조합 -->
<FormField label-text="이메일" input-id="email" error-text="올바른 이메일 형식이 아닙니다.">
  <Input id="email" v-model="val" :error="true" aria-describedby="helper-email" />
</FormField>

<!-- Input + 도움말 텍스트 조합 -->
<FormField label-text="비밀번호" input-id="pw" helper-text="영문, 숫자, 특수문자 포함 8자 이상">
  <Input id="pw" v-model="val" aria-describedby="helper-pw" />
</FormField>

<!-- Select와 조합 (예시) -->
<FormField label-text="지역" input-id="region">
  <Select id="region" v-model="val" />
</FormField>
```

---

### 2. 영역 구성 (Area Map)

#### Base (FormField.vue)

- ① **라벨(Label)** — 입력 필드의 목적을 알려주는 텍스트. 툴팁 slot을 선택적으로 포함 / 조건부 (`showLabel`이 켜진 경우)
- ② **입력 슬롯(default slot)** — Input, Select, DatePicker 등 임의 폼 컨트롤 영역 / 필수
- ③ **도움말 텍스트(HelperText)** — 입력 안내 메시지 또는 에러 메시지 / `helperText` 또는 `errorText` 값이 있을 때 자동 표시

---

### 2-1. Props 목록

| 항목 | 설명 | 기본값 |
|------|------|--------|
| inputId | label for 연결용 id (필수). 내부 폼 컨트롤의 id와 일치해야 함. 도움말 id는 `helper-{inputId}`로 자동 생성 | — (필수) |
| labelText | 라벨 영역에 표시할 텍스트 | 빈 값 |
| showLabel | 라벨 영역 표시 여부 | 켬 |
| required | 라벨 옆 `*` 시각 표시. `aria-required`는 슬롯 내 컴포넌트에 직접 전달 | 끔 |
| helperText | 일반 도움말 메시지. 값이 있으면 자동 표시. `errorText`가 있으면 대체됨 | 빈 값 |
| errorText | 에러 메시지. 값이 있으면 빨간색으로 표시되며 `helperText`보다 우선함 | 빈 값 |

---

### 2-2. Slots 목록

| 슬롯 | 설명 |
|------|------|
| default | Input, Select, DatePicker 등 임의 폼 컨트롤 삽입 |
| tooltip | 라벨 우측 툴팁 영역. 슬롯에 내용이 있으면 자동으로 렌더링. Tooltip 컴포넌트 직접 삽입 |

---

### 3. id 연결 컨벤션

FormField는 `helper-{inputId}` 형식으로 도움말 요소의 id를 자동 생성합니다.
슬롯 내 폼 컨트롤에서 `aria-describedby`를 연결할 때 이 컨벤션을 따릅니다.

```vue
<!-- helperText: 일반 도움말 -->
<FormField label-text="비밀번호" input-id="pw" helper-text="8자 이상">
  <!-- FormField가 <p id="helper-pw"> 렌더링 -->
  <Input id="pw" v-model="val" aria-describedby="helper-pw" />
</FormField>

<!-- errorText: 에러 메시지 (helperText보다 우선) -->
<FormField label-text="이메일" input-id="email" error-text="올바른 이메일 형식이 아닙니다.">
  <!-- FormField가 <p id="helper-email" role="alert"> 렌더링 -->
  <Input id="email" v-model="val" :error="true" aria-describedby="helper-email" />
</FormField>
```

---

### 4. Variant 목록

FormField 컴포넌트는 별도의 시각적 variant가 없으며, props 조합에 따라 구성이 달라집니다.

**라벨/도움말 조합** (구성 기준)

| 구성 | 사용 맥락 |
|---------|---------|
| 라벨 없음 + 도움말 없음 | 라벨이 외부에서 제공되는 경우 |
| 라벨 있음 + 도움말 없음 | 기본 폼 필드 |
| 라벨 있음 + 도움말 있음 | 추가 안내가 필요한 폼 필드 |
| 라벨 있음 + 도움말 있음 + 에러 | 유효성 검사 실패 시 |

---

### 5. 동작 규칙

- `showLabel`이 꺼지면 라벨 영역 전체(텍스트 + 툴팁 slot)가 렌더링되지 않음
- `#tooltip` slot에 내용이 있으면 자동으로 툴팁 영역이 렌더링됨 (별도 prop 불필요)
- `errorText` 또는 `helperText` 값이 있으면 도움말 영역 자동 표시. 둘 다 없으면 DOM에서 제거됨
- `errorText`가 있으면 빨간색으로 표시되며 `helperText`보다 우선함. `role="alert"` 자동 부여
- `required`는 라벨 옆 `*` 시각 표시만 담당. `aria-required`는 슬롯 내 컴포넌트에 직접 전달
- 도움말 요소 id는 `helper-{inputId}` 형식으로 자동 생성. 슬롯 컴포넌트의 `aria-describedby`와 일치해야 함

---

### 6. 접근성 요구사항

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| 라벨 연결 | showLabel 켜진 경우 | `<label for="{inputId}">` — 슬롯 컴포넌트의 id와 반드시 일치 |
| 에러 메시지 연결 | errorText 있을 때 | 도움말 요소에 `id="helper-{inputId}"`, `role="alert"` 자동 부여. 슬롯 컴포넌트가 `aria-describedby`로 참조해야 함 |
| 필수 항목 | required 켜진 경우 | 라벨에 `*` 시각 표시 (`aria-hidden="true"`). `aria-required`는 슬롯 컴포넌트에 직접 전달 |
| 툴팁 접근 | #tooltip slot 내용이 있을 때 | `#tooltip` slot에 삽입되는 버튼/컴포넌트가 `aria-label` 또는 `title` 제공 책임 |
| 키보드 접근 | 항상 | Tab 키로 라벨·슬롯 컨트롤·툴팁 버튼 순서 탐색 가능 |

---

### 7. 디자인 토큰 참고

Figma 노드 `40004010:2461` 기준 (Input 명세와 동일 노드에서 추출).

#### 색상

| 적용 위치 | Figma 색상값 | 매핑 토큰 |
|----------|------------|---------|
| 라벨 텍스트 | `#777777` | `$text-label` |
| 도움말 텍스트 (기본) | `#777777` | `$text-helper` |
| 도움말 텍스트 (error) | `#ff5146` | `$color-danger` |
| 필수 `*` | `#ff5146` | `$color-danger` |

#### 간격 및 타이포그래피

| 적용 위치 | 수치 | 매핑 토큰 |
|----------|------|---------|
| 라벨과 필드 사이 간격 | 6px | — (0.6rem 고정값) |
| 필드와 도움말 사이 간격 | 4px | `$spacing-xs` |
| 라벨 텍스트 | 14px / 400 / lh 1.3 | `$font-size-sm`, `$font-weight-regular`, `$line-height-snug` |
| 도움말 텍스트 | 12px / 700 / lh 1.3 | `$font-size-xs`, `$font-weight-bold`, `$line-height-snug` |
