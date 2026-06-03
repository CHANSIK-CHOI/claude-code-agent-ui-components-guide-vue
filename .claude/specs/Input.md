# Input 컴포넌트 명세

---

### 0. Atomic 계층 & 파일 배치

- **계층**: atoms — 외부 컴포넌트 의존 없이 단일 텍스트 입력 역할을 수행하는 최소 단위
- **배치 경로**: `components/atoms/Input.vue`
- **구조**: Base 컴포넌트만 구성. `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"`를 핵심 `<input>` 요소에 적용.
- **form layout 관심사** (라벨, 툴팁, 도움말 텍스트)는 `FormField` (molecules)가 담당. Input은 입력 + suffix 영역(clear 버튼 + 슬롯)을 담당.
- **Wrapper 예정**: InputPassword(suffix 슬롯에 비밀번호 토글 삽입), InputAuth(suffix 슬롯에 타이머 텍스트 삽입)

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
- ② **suffix 영역(Suffix)** — 입력 필드 오른쪽. clear 버튼 + named slot(`suffix`)으로 구성 / 조건부
  - ② -1 **clear 버튼** — 텍스트 1자 이상 입력 시 노출, 클릭 시 값 삭제. `hideClear`가 true이거나 disabled·readonly 상태이면 항상 미표시 / 조건부
  - ② -2 **suffix 슬롯** — Wrapper가 추가 요소(비밀번호 토글, 타이머 텍스트 등)를 삽입하는 영역 / 조건부(슬롯 사용 시)

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
| **clear 버튼 숨김 여부** (`hideClear`) | true이면 clear 버튼을 항상 미표시. Wrapper가 clear를 직접 구성할 때 사용 | 끔 |

> `id`, `aria-describedby`, `aria-label`, `maxlength` 등 네이티브 속성은 모두 `v-bind="$attrs"` 위임으로 `<input>` 요소에 직접 전달 가능. id 자동 생성 없음 — FormField 또는 사용처에서 id를 직접 전달해야 한다.

---

### 2-2. Slot 목록

| 슬롯명 | 설명 | 위치 |
|--------|------|------|
| `suffix` | clear 버튼 오른쪽에 추가 요소를 삽입하는 영역. 비밀번호 토글 버튼·타이머 텍스트 등 Wrapper 전용 요소를 삽입한다 | suffix 영역 우측 끝 |

> Wrapper 사용 예시:
> ```vue
> <!-- InputPassword.vue — suffix 슬롯에 토글 버튼 삽입 -->
> <Input v-model="value">
>   <template #suffix>
>     <button type="button" aria-label="비밀번호 보기"><EyeIcon /></button>
>   </template>
> </Input>
>
> <!-- InputAuth.vue — suffix 슬롯에 타이머 삽입 -->
> <Input v-model="value">
>   <template #suffix>
>     <span class="inputAuth__timer">00:00</span>
>   </template>
> </Input>
> ```

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
| error | 테두리 색상이 에러 색상으로 변경. `aria-invalid="true"` 전달. 도움말 에러 표시는 FormField가 담당 | 입력은 가능 |

---

### 5. 동작 규칙

- disabled 상태에서는 입력 이벤트, 포커스, 클릭 모두 차단
- readonly 상태에서는 입력만 차단. 포커스, 텍스트 선택, 복사는 가능
- placeholder는 입력값이 없을 때만 표시
- 입력 필드의 너비는 부모 컨테이너에 맞게 늘어남 (고정 너비 없음)
- id는 `v-bind="$attrs"` 위임으로 처리되므로 사용처에서 직접 `id="..."` 속성을 전달한다. 자동 생성 없음
- 라벨/도움말/툴팁 관련 동작은 `FormField` 명세를 참조
- **clear 버튼 표시 조건**: `hideClear=false` + `disabled=false` + `readonly=false` + 입력값 1자 이상일 때 표시. 하나라도 위반하면 미표시
- **clear 버튼 클릭 시**: 입력값을 빈 값으로 초기화 → `update:modelValue('')` 발행 → `clear` 이벤트 발행. 이후 clear 버튼은 자동 숨김
- **suffix 슬롯**: clear 버튼 오른쪽에 위치. Wrapper가 `#suffix` 슬롯에 요소를 삽입하면 clear 버튼과 나란히 렌더됨. 슬롯 콘텐츠가 없으면 공간을 차지하지 않음

---

### 6. 이벤트 목록

| 이벤트 | 발생 시점 | 전달 정보 |
|--------|---------|---------|
| update:modelValue | 입력값이 변경될 때 (입력 시마다 / clear 클릭 시) | 현재 입력값(문자열) |
| focus | 입력 필드에 포커스가 잡힐 때 | — |
| blur | 입력 필드에서 포커스가 벗어날 때 | 현재 입력값(문자열) |
| change | 입력 완료 후 포커스 이탈 시 (값이 변경된 경우) | 현재 입력값(문자열) |
| **clear** | clear 버튼 클릭 시 | — |

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
| 테두리 (default / filled) | `#dddddd` | `$line-200` |
| 테두리 (focus) | `#111111` | `$border-input-focus` |
| 테두리 (error) | — | `$color-danger` |
| placeholder 텍스트 | `#666666` | `$text-600` |
| filled 입력 텍스트 | `#111111` | `$text-900` |
| disabled 텍스트 | `#c0c0c0` | `$text-300` |

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

#### suffix 영역 (신규)

| 적용 위치 | 수치 | 처리 방법 |
|----------|------|---------|
| clear 버튼 아이콘 크기 | 16px | 1.6rem 직접 사용 (아이콘 크기 토큰 없음) |
| suffix 아이템 간 gap (clear ↔ slot 콘텐츠) | 10px | 1.0rem 직접 사용 (Figma 기준, spacing 토큰 근사 없음) |
| suffix 우측 패딩 | 13px | `$spacing-input-x` (입력 필드 좌우 패딩과 동일) |

- **clear 버튼 SVG**: `assets/images/common/inputClear.svg` — `?skipsvgo` 패턴으로 import (SVGO stroke/fill 제거 방지)
