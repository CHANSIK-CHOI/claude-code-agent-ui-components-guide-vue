# Input 컴포넌트 명세

---

### 0. Atomic 계층 & 파일 배치

- **계층**: atoms — 외부 컴포넌트 의존 없이 단일 텍스트 입력 역할을 수행하는 최소 단위
- **배치 경로**: `components/atoms/Input.vue`
- **구조**: Base 컴포넌트만 구성. `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"`를 핵심 `<input>` 요소에 적용.
- **form layout 관심사** (라벨, 툴팁, 도움말 텍스트)는 `FormField` (molecules)가 담당. Input은 순수 입력만 담당.

---

### 1. 컴포넌트 개요

사용자가 텍스트를 직접 입력하는 기본 폼 요소입니다.
라벨이나 도움말 텍스트가 필요한 경우 `FormField`와 조합해 사용합니다.

```vue
<!-- 단독 사용 — 라벨 없이 aria-label 직접 전달 -->
<Input v-model="val" placeholder="이름 입력" aria-label="이름" />

<!-- FormField와 조합 — 라벨/도움말 필요 시 -->
<FormField label-text="이메일" input-id="email">
  <Input id="email" v-model="val" placeholder="example@email.com" />
</FormField>
```

---

### 2. 영역 구성 (Area Map)

#### Base (Input.vue)

- ① **입력 필드(Field)** — 사용자가 텍스트를 입력하는 영역. placeholder 텍스트 표시 / 필수

라벨, 툴팁, 도움말 텍스트는 `FormField` 명세를 참조.

---

### 2-1. Props 목록

| 항목 | 설명 | 기본값 |
|------|------|--------|
| 입력값 | 입력 필드에 표시되는 현재 값 (v-model 연동) | 빈 값 |
| 에러 여부 | `aria-invalid="true"` 전달. 시각적 에러 표시는 FormField 담당 | 끔 |
| 비활성 여부 | 켜면 입력 불가, 시각적으로 흐려짐 | 끔 |
| Placeholder | 값이 없을 때 필드 내에 표시할 안내 텍스트 | 빈 값 |
| 입력 타입 | text / email / password / tel / number 등 HTML input type | text |
| id | 입력 요소와 외부 라벨을 연결하는 고유 식별자. 전달 시 내부 생성 id보다 우선 적용됨 | 빈 값 (미전달 시 자동 생성) |

> `aria-describedby`, `aria-label`, `maxlength` 등 네이티브 속성은 `v-bind="$attrs"` 위임으로 직접 전달 가능.

---

### 3. Variant 목록

Input 컴포넌트는 별도의 시각적 variant가 없으며, 상태(State)에 따라 외관이 변합니다.

---

### 4. 상태(State) 정의

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| default | 기본 테두리(회색), 흰 배경, placeholder 텍스트 표시 | 입력 가능 |
| filled | 기본 테두리(회색), 흰 배경, 입력된 텍스트가 진하게 표시 | 입력 가능 |
| focus | 테두리 색상 어둡게(#111111), 흰 배경 유지 | 키보드 입력 활성 |
| disabled | 배경 어둡게(회색 계열), 테두리 유지, 텍스트 흐리게, 커서 변경 | 입력 차단, 클릭 차단, 포커스 차단 |
| readonly | default와 동일 (시각적 변화 없음) | 입력만 차단. 포커스·선택·복사는 가능 |
| error | `aria-invalid="true"` 전달. 도움말 에러 표시는 FormField가 담당 | 입력은 가능 |

---

### 5. 동작 규칙

- disabled 상태에서는 입력 이벤트, 포커스, 클릭 모두 차단
- readonly 상태에서는 입력만 차단. 포커스, 텍스트 선택, 복사는 가능
- placeholder는 입력값이 없을 때만 표시
- 입력 필드의 너비는 부모 컨테이너에 맞게 늘어남 (고정 너비 없음)
- 외부에서 id prop이 전달되면 내부 자동 생성 id 대신 외부 id를 사용
- 라벨/도움말/툴팁 관련 동작은 `FormField` 명세를 참조

---

### 6. 이벤트 목록

| 이벤트 | 발생 시점 | 전달 정보 |
|--------|---------|---------|
| update:modelValue | 입력값이 변경될 때 (입력 시마다) | 현재 입력값(문자열) |
| focus | 입력 필드에 포커스가 잡힐 때 | — |
| blur | 입력 필드에서 포커스가 벗어날 때 | 현재 입력값(문자열) |
| change | 입력 완료 후 포커스 이탈 시 (값이 변경된 경우) | 현재 입력값(문자열) |

---

### 7. 접근성 요구사항

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| 라벨 연결 | FormField와 조합 시 | `<label for>` ↔ `<input id>` 연결. `inputId`가 일치해야 함 |
| 라벨 미사용 시 | 단독 사용 시 | `aria-label` 또는 `aria-labelledby`를 $attrs로 전달 필요 |
| 에러 메시지 연결 | error 상태일 때 | `aria-describedby="helper-{inputId}"`를 $attrs로 직접 전달 |
| 유효성 상태 전달 | error 상태일 때 | `:error="true"` → `<input aria-invalid="true">` 자동 적용 |
| 비활성 알림 | disabled 상태일 때 | 네이티브 `<input disabled>` 속성으로 보조기기에 자동 전달 |
| 포커스 표시 | 키보드 포커스 시 | 외곽선(포커스 링) 시각적으로 반드시 표시 |
| 키보드 접근 | 항상 | Tab 키로 포커스 이동, 입력 필드 내 기본 키보드 동작 지원 |

---

### 8. 디자인 토큰 참고

Figma 노드 `40004010:2461` 기준.

#### 색상

| 적용 위치 | Figma 색상값 | 매핑 토큰 |
|----------|------------|---------|
| 필드 배경 (default / filled / focus) | `#ffffff` | `$bg-primary` |
| 필드 배경 (disabled) | `#f5f5f5` | `$bg-disabled` |
| 테두리 (default / filled) | `#dddddd` | `$border-default` |
| 테두리 (focus) | `#111111` | `$border-input-focus` |
| placeholder 텍스트 | `#666666` | `$text-secondary` |
| filled 입력 텍스트 | `#111111` | `$text-strong` |
| disabled 텍스트 | `#c0c0c0` | `$text-disabled` |

#### 테두리 및 형태

| 속성 | 수치 | 매핑 토큰 |
|-----|------|---------|
| 테두리 두께 | 1px | — (고정값) |
| border-radius | 8px | `$radius-md` |

#### 내부 여백 및 높이

| 적용 위치 | 수치 | 매핑 토큰 |
|----------|------|---------|
| 필드 좌우 패딩 | 13px | `$spacing-input-x` |
| 필드 전체 높이 | 46px | — (고정 높이) |

#### 타이포그래피

| 적용 위치 | 크기 | 굵기 | 매핑 토큰 |
|----------|------|------|---------|
| 입력 텍스트 (placeholder / filled) | 16px | 400 | `$font-size-body1`, `$font-weight-regular` |
