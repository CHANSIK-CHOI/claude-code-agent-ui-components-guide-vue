# Stepper 컴포넌트 명세

---

### 0. Atomic 계층 & 파일 배치

- **계층**: atoms — 외부 컴포넌트 의존 없이 단일 숫자 조작 역할을 수행하는 최소 단위
- **배치 경로**: `components/atoms/Stepper.vue`
- **구조**: Base 컴포넌트만 구성. 복합 컴포넌트($attrs 위임 전략 별도 명세).
- **라벨/도움말 관심사**: `FormField` (molecules)가 담당. Stepper는 순수 숫자 조작만 담당.

---

### 1. 컴포넌트 개요

증가/감소 버튼과 숫자 표시 영역으로 이루어진 수량 입력 컴포넌트. 상품 수량 선택 등 정수 범위 내에서 값을 조작해야 하는 상황에 사용된다.

Radix Vue NumberField는 Alpha 상태이므로 자체 구현한다.

```vue
<!-- 기본 사용 -->
<Stepper v-model="qty" :min="1" :max="99" />

<!-- FormField와 조합 -->
<FormField label-text="수량" input-id="qty">
  <Stepper id="qty" v-model="qty" :min="1" :max="10" />
</FormField>

<!-- 직접 입력 허용 -->
<Stepper v-model="qty" :min="1" :readonly="false" />
```

---

### 2. 영역 구성 (Area Map)

- ① **루트(Root)** — 컴포넌트 전체 컨테이너. 가로 방향 flex 배치
- ② **제거 버튼(Decrement Button)** — 값을 1단계(step) 감소시키는 `<button>`. 현재값 = min이면 disabled
- ③ **숫자 표시 영역(Value Display)** — 현재 숫자값을 표시하는 `<input>`. `readonly` prop에 따라 직접 편집 가능 여부 결정
- ④ **추가 버튼(Increment Button)** — 값을 1단계(step) 증가시키는 `<button>`. 현재값 = max이면 disabled

배치 순서: ② 제거 버튼 → ③ 숫자 표시 → ④ 추가 버튼 (좌 → 중앙 → 우)

---

### 2-1. Props 목록

| 항목 | 설명 | 기본값 |
|------|------|--------|
| 현재 값 | v-model로 바인딩되는 숫자. 컴포넌트가 표시하고 제어한다 | 1 |
| 최솟값 | 감소 가능한 하한선. 이 값 이하로는 내려가지 않음 | 1 |
| 최댓값 | 증가 가능한 상한선. 이 값 이상으로는 올라가지 않음. 미설정 시 무제한 | 없음 |
| 증감 단위 | 버튼 클릭 한 번에 변화하는 값 | 1 |
| 직접 입력 불가 여부 | true면 버튼으로만 조작. false면 숫자 표시 영역에서 직접 타이핑 가능 | true |
| 전체 비활성 여부 | true면 버튼과 입력 영역 모두 클릭·포커스 불가 | false |
| 제거 버튼 attrs | 제거 버튼(`<button>`)에 그대로 위임. aria-*, data-*, 이벤트 등 | `{}` |
| 추가 버튼 attrs | 추가 버튼(`<button>`)에 그대로 위임. aria-*, data-*, 이벤트 등 | `{}` |

> 기본 `v-bind="$attrs"` 위임 대상은 `<input>` (숫자 표시 영역). `id`, `name`, `aria-label`, `aria-describedby` 등 폼·접근성 속성은 input으로 전달된다. FormField의 `label for`와 연결하려면 `id`를 전달하면 된다.

---

### 2-2. $attrs 위임 전략 (복합 컴포넌트)

Stepper는 세 가지 인터랙티브 요소로 구성된 복합 컴포넌트이므로, 외부에서 전달한 attrs가 어느 요소로 가는지 명시한다.

| 전달 방법 | 도달 위치 | 주요 사용 사례 |
|---------|---------|-------------|
| 컴포넌트에 직접 전달 (`v-bind="$attrs"`) | `<input>` | `id`, `name`, `aria-label`, `aria-describedby` |
| `decrementAttrs` prop | 제거 버튼 `<button>` | `data-*`, 커스텀 aria-label 오버라이드, 추가 이벤트 핸들러 |
| `incrementAttrs` prop | 추가 버튼 `<button>` | `data-*`, 커스텀 aria-label 오버라이드, 추가 이벤트 핸들러 |

**버튼 attrs 적용 순서**: `v-bind="decrementAttrs"` → 명시 바인딩(disabled, aria-label, @click) 순으로 배치. 명시 바인딩이 나중에 오므로 컴포넌트 내부 값이 외부 전달값에 덮어씌워지지 않는다.

> 규칙 근거: `components.md` — Radix Vue 래핑 컴포넌트 attrs 위임 전략과 동일한 패턴. 복합 컴포넌트에서 attrs 목적지를 명세 단계에서 결정한다.

---

### 3. Variant 목록

Figma에서 단일 형태만 정의됨. 현재는 크기 variant가 없으며, 향후 크기 확장 시 아래 축을 추가한다.

| 축 | 현재 값 | 비고 |
|----|---------|------|
| 크기(size) | md (단일) | 30×30 버튼 기준. 향후 sm/lg 추가 가능 |

---

### 4. 상태(State) 정의

#### 4-1. 컴포넌트 전체 상태

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| default | 기본 스타일 | — |
| disabled | 전체 영역 흐려짐 (`$bg-disabled` 배경, 텍스트·아이콘 `$text-300`) | 버튼 클릭 차단, 입력 불가, 포커스 불가 |

#### 4-2. 제거/추가 버튼 상태

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| default | 흰 배경, `$line-100` 테두리, 아이콘 `$text-800` | — |
| hover | 버튼 배경 `$bg-secondary`로 변화 | — |
| focus-visible | 포커스 외곽선(box-shadow) 표시 | 키보드 포커스 |
| active | 버튼 배경 `$bg-tertiary`로 변화 | — |
| disabled | 아이콘 색상 `$text-300`으로 변화 | 클릭 차단, 포커스 차단 |

> disabled 버튼의 테두리 색상: Figma에 별도 정의 없음. 기본 테두리(`$line-100`) 유지로 처리.

#### 4-3. 숫자 표시 영역(input) 상태

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| default (readonly) | 기본 스타일. 커서 default | 타이핑 불가. 포커스·선택은 가능 |
| default (editable) | 기본 스타일 | 숫자 직접 입력 가능 |
| focus (editable) | 포커스 외곽선 표시 | 키보드 입력 활성 |
| disabled | 배경 `$bg-disabled`, 텍스트 `$text-300` | 입력·포커스 불가 |

---

### 5. 동작 규칙

#### 버튼 조작

- 추가 버튼 클릭 → 현재값 + step. 결과가 max 초과 시 max로 고정
- 제거 버튼 클릭 → 현재값 − step. 결과가 min 미만 시 min으로 고정
- 현재값 = min → 제거 버튼 disabled
- 현재값 = max → 추가 버튼 disabled
- max 미설정 시 추가 버튼 항상 활성

#### 직접 입력 (readonly=false)

- 숫자 표시 영역에서 직접 타이핑 가능
- 숫자 이외 문자 입력은 무시
- 입력 완료(blur 또는 Enter 키) 시 min~max 범위 내로 clamp 처리
- 입력 중에는 범위 검사를 하지 않음 (타이핑 중단 방지)
- 비어있는 상태로 blur 시 min값으로 복원

#### 직접 입력 불가 (readonly=true, 기본값)

- 숫자 표시 영역 타이핑 불가
- 포커스, 텍스트 선택, 복사는 가능

#### 전체 비활성 (disabled=true)

- 버튼과 input 모두 비활성
- min/max에 의한 개별 버튼 비활성보다 disabled 전체 비활성이 우선

---

### 6. 이벤트 목록

| 이벤트 | 발생 시점 | 전달 정보 |
|--------|---------|---------|
| update:modelValue | 버튼 클릭 또는 직접 입력 완료 시 값이 변경될 때 | 변경된 숫자 값 |
| change | 값이 최종 확정될 때 (버튼 클릭 즉시, 직접 입력이면 blur/Enter 시) | 변경된 숫자 값 |

---

### 7. 접근성 요구사항

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| 숫자 입력 역할 표시 | 항상 | `<input type="text" inputmode="numeric">` 으로 마크업. `type="number"` 사용 시 브라우저 기본 스피너 CSS로 숨김 처리 필요 |
| 버튼 대체 텍스트 | 항상 | 제거 버튼 `aria-label="수량 감소"`, 추가 버튼 `aria-label="수량 증가"` 필수 (아이콘만 존재하므로) |
| 값 범위 전달 | min/max 지정 시 | `aria-valuemin`, `aria-valuemax` 속성 |
| 현재 값 전달 | 항상 | `aria-valuenow` 속성으로 현재 숫자 보조기기에 전달 |
| 버튼 비활성 알림 | 버튼 disabled 시 | 네이티브 `<button disabled>`. `aria-disabled` 중복 추가 금지 |
| 전체 비활성 알림 | disabled=true 시 | 버튼과 input 모두 disabled. 보조기기에 자동 전달 |
| 포커스 표시 | 키보드 포커스 시 | `:focus-visible` 외곽선 표시. `outline: none` 단독 사용 금지 |
| 라벨 연결 | FormField와 조합 시 | `<label for>` ↔ `<input id>` 연결. `id`를 $attrs로 전달하면 input에 위임됨 |
| 라벨 미사용 시 | 단독 사용 시 | `aria-label` 또는 `aria-labelledby`를 컴포넌트에 직접 전달 (input으로 위임됨) |
| 키보드: 버튼 | 항상 | Tab 포커스, Enter·Space로 클릭 |
| 키보드: 증감 | readonly=false 시 | 숫자 표시 영역 포커스 상태에서 ↑(증가) / ↓(감소) 키 동작 |

---

### 8. 디자인 토큰 매핑

Figma 노드 `40004010:2303` (컴포넌트 전체), `40004028:3052` (추가 버튼), `40004028:3066` (제거 버튼) 기준.

#### 버튼 영역

| 시각 요소 | Figma 값 | 매핑 토큰 |
|---------|---------|---------|
| 버튼 배경 (default) | `#ffffff` | `$bg-primary` |
| 버튼 배경 (hover) | Figma 미정의 | `$bg-secondary` (`#f6f7f9`) 근사 |
| 버튼 배경 (active) | Figma 미정의 | `$bg-tertiary` (`#f5f5f5`) 근사 |
| 버튼 테두리 | `#c4cdd7` | `$line-100` |
| 버튼 테두리 두께 | 1px | 1px (고정값 허용) |
| 버튼 모서리 둥글기 | 8px | `$radius-md` |
| 버튼 크기 (가로×세로) | 30×30px | 3.0rem × 3.0rem |
| 아이콘 색상 (default) | `#333333` | `$text-800` |
| 아이콘 색상 (disabled) | Figma 미정의 (사용자 요구사항) | `$text-300` (`#c0c0c0`) |

#### 숫자 표시 영역

| 시각 요소 | Figma 값 | 매핑 토큰 |
|---------|---------|---------|
| 텍스트 색상 | `#333333` | `$text-800` |
| 텍스트 색상 (disabled) | `#c0c0c0` | `$text-300` |
| 폰트 크기 | 14px | `$font-size-body3` (1.4rem) |
| 폰트 굵기 | Medium (500) | `$font-weight-medium` |
| 줄 높이 | 1.3 | `$line-height-snug` |
| 텍스트 정렬 | 가운데 | `text-align: center` |
| 표시 영역 너비 | ~42px (전체 102px − 버튼 60px) | 4.2rem 고정. 퍼블리셔 구현 시 Figma 재측정 |

#### 컴포넌트 전체

| 시각 요소 | Figma 값 | 매핑 토큰 |
|---------|---------|---------|
| 전체 높이 | 30px | 3.0rem |
| 버튼·숫자 영역 간격 | Figma 불명확 | 간격 없음(0) 또는 퍼블리셔 재측정 후 결정 |
| 배경 (disabled) | `#f5f5f5` | `$bg-disabled` |

---

### 9. 구현 주의사항

- `type="number"` 사용 시 브라우저 기본 스피너가 표시되므로, `-webkit-inner-spin-button` / `-webkit-outer-spin-button` CSS로 숨긴다. 또는 `type="text" inputmode="numeric"`으로 대체.
- `readonly=true`일 때 input에 `readonly` HTML 속성 적용 — 타이핑은 막되 포커스와 텍스트 선택은 허용.
- `readonly=false`로 직접 입력 허용 시, blur/Enter에서 min~max clamp 처리. 입력 중에는 검사하지 않음.
- `decrementAttrs`와 `incrementAttrs` 위임 순서: `v-bind="decrementAttrs"` 먼저, 그 다음 명시 바인딩. 내부 기본값(aria-label, disabled, @click)이 외부에 덮어씌워지지 않도록.
- `defineOptions({ inheritAttrs: false })` 적용 후 기본 `v-bind="$attrs"`를 `<input>`에 배치.
- FormField와 조합 시 `id`를 Stepper에 전달하면 자동으로 `<input id>` 에 위임됨.
