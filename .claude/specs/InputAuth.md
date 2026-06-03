---
name: InputAuth
description: 본인인증용 타이머 내장 Input Wrapper 컴포넌트
metadata:
  type: component
  layer: atoms
  baseComponent: Input
---

# InputAuth 컴포넌트 명세

---

### 0. Atomic 계층 & 파일 배치

- **계층**: atoms — Input(Base)을 래핑한 Wrapper 컴포넌트. 추가 로직(타이머 카운트다운)을 담당하며 atoms 내 평탄 배치.
- **배치 경로**: `components/atoms/InputAuth.vue`
- **Base/Wrapper 분리**: Base + Wrapper
  - Base: `Input.vue` — v-model, disabled, error, $attrs 위임, suffix 슬롯 등 공통 로직 담당
  - Wrapper: `InputAuth.vue` — Input을 내부에서 사용 + `#suffix` 슬롯에 MM:SS 카운트다운 타이머 텍스트 삽입 + `active` / `autoStart` prop 제어 및 타이머 생명주기 관리

---

### 1. 컴포넌트 개요

본인인증 코드 입력 시 유효 시간을 시각적으로 표시하는 타이머 내장 Input입니다.
Input의 `#suffix` 슬롯에 MM:SS 카운트다운 텍스트를 삽입해 구성하며, 인증번호 재발송 등 타이머 재시작이 필요한 폼에서 사용합니다.

```vue
<!-- 기본 사용 (autoStart: 마운트 즉시 시작) -->
<InputAuth v-model="code" :duration="180" auto-start @timer-end="handleExpired" />

<!-- active prop 제어 (외부에서 시작/재시작) -->
<InputAuth v-model="code" :duration="180" :active="isActive" @timer-end="handleExpired" />
```

---

### 2. 영역 구성 (Area Map)

InputAuth는 Input(Base) 위에 다음 구성을 추가합니다.

- ① **입력 필드(Field)** — Input Base가 담당. 사용자가 인증 코드를 입력하는 영역 / 필수
- ② **suffix 영역(Suffix)** — Input Base의 suffix 슬롯 활용 / 조건부
  - ② -1 **타이머 텍스트** — `running` 상태에서만 표시. MM:SS 형식의 카운트다운 텍스트. `expired` 상태에서는 렌더링하지 않음 / 조건부(running 상태일 때)

> clear 버튼은 Input Base가 관리. InputAuth는 `hideClear` prop을 전달해 clear 버튼 표시 여부를 제어할 수 있음.

---

### 2-1. Props 목록

**Wrapper 고유 Props**

| prop | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|------|------|
| `modelValue` | `string` | `''` | 아니오 | 입력값 (v-model) — Input Base로 위임 |
| `duration` | `number` | `180` | 아니오 | 타이머 총 시간(초 단위). 예: 180 → 03:00부터 카운트다운 |
| `active` | `boolean` | `false` | 아니오 | `false → true` 전환 시 타이머 리셋 후 재시작. `true → false` 전환 시 정지 + 리셋 |
| `autoStart` | `boolean` | `false` | 아니오 | 마운트 직후 자동 시작. `active` prop과 독립 동작 |
| `disabled` | `boolean` | `false` | 아니오 | 입력 비활성 — Input Base로 위임. 타이머는 독립 계속 진행 |
| `error` | `string \| boolean` | `false` | 아니오 | 에러 상태 — `!!error`로 boolean 캐스팅 후 Input Base(boolean만 지원)에 위임. 에러 메시지 표시는 FormField 담당 |
| `hideClear` | `boolean` | `false` | 아니오 | clear 버튼 숨김 — Input Base로 위임 |

> `id`, `aria-describedby`, `aria-label`, `placeholder`, `maxlength` 등 네이티브 속성은 `v-bind="$attrs"`를 통해 Input Base의 `<input>` 요소로 위임됨.

> **Wrapper의 $attrs 위임 전략**: InputAuth 자체에 `defineOptions({ inheritAttrs: false })`를 선언하고, `<Input v-bind="$attrs" />`로 모든 네이티브 attrs를 Input Base에 그대로 위임한다. Input Base가 다시 `<input>` 요소에 위임하므로 이중 위임 구조를 가진다.

---

### 3. Variant 목록

InputAuth는 Input Base의 Variant 축을 그대로 따릅니다. InputAuth 자체의 별도 Variant는 없습니다.

---

### 4. 상태(State) 정의

Input Base의 상태(default / filled / focus / disabled / readonly / error)를 그대로 계승하며, 타이머 고유 상태가 추가됩니다.

**타이머 고유 상태**

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| `running` | suffix 영역에 MM:SS 카운트다운 텍스트 표시 | 1초마다 카운트다운 진행 |
| `expired` | suffix 타이머 텍스트 미표시 (suffix 영역 비어있음) | 타이머 정지, `timer-end` 이벤트 발행 |

> **expiring 상태 없음**: 잔여 시간이 임박했을 때의 별도 시각 처리는 포함하지 않음 (사용자 확인 완료).

---

### 5. 동작 규칙

- **`autoStart`가 켜져 있으면** 컴포넌트 마운트 직후 타이머가 자동 시작됨. `active` prop 상태와 무관하게 독립 동작.
- **`active` prop `false → true` 전환 시**: 잔여 시간과 관계없이 타이머를 `duration` 값으로 리셋하고 즉시 재시작. 인증번호 재발송 후 타이머 재시작 시 사용.
- **`active` prop `true → false` 전환 시**: 타이머를 정지하고 내부 잔여 시간을 `duration` 값으로 리셋. expired 상태로 전환하지 않음.
- **카운트다운이 0에 도달하면**: `expired` 상태로 전환 → suffix 타이머 텍스트 미표시 → `timer-end` 이벤트 발행.
- **언마운트 시**: 진행 중인 타이머 인터벌을 반드시 정리해 메모리 누수 방지 (`onUnmounted` 훅에서 인터벌 클리어).
- **타이머 텍스트 형식**: `MM:SS`. 분/초 모두 2자리로 0 패딩. 예: 3분 0초 → `03:00`, 0분 9초 → `00:09`.
- **suffix 슬롯 렌더링**: `running` 상태일 때만 타이머 텍스트를 렌더링. `expired` 상태에서는 suffix 슬롯 자체가 비어있음.
- `disabled` 상태여도 타이머는 계속 카운트다운됨. 타이머와 입력 비활성은 독립적.
- Input Base의 clear 버튼 동작, disabled, error, $attrs 위임은 Input Base 명세를 따름.

---

### 6. 이벤트 목록

**Wrapper 고유 이벤트**

| 이벤트 | 발생 시점 | 페이로드 |
|--------|---------|---------|
| `timer-start` | 타이머가 시작(또는 재시작)될 때 | — |
| `timer-end` | 카운트다운이 0에 도달해 타이머가 만료될 때 | — |

**Input Base에서 위임되는 이벤트**

| 이벤트 | 발생 시점 | 페이로드 |
|--------|---------|---------|
| `update:modelValue` | 입력값이 변경될 때 | `string` |
| `focus` | 입력 필드에 포커스가 잡힐 때 | — |
| `blur` | 입력 필드에서 포커스가 벗어날 때 | `string` |
| `change` | 입력 완료 후 포커스 이탈 시 (값이 변경된 경우) | `string` |
| `clear` | clear 버튼 클릭 시 | — |

> **`timer-tick` 이벤트 없음**: 매 초 이벤트를 발행하지 않음 (사용자 확인 완료).

---

### 7. 접근성 요구사항

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| 입력 필드 라벨 연결 | FormField와 조합 시 | `<label for>` ↔ `<input id>` 연결. Input Base와 동일 |
| 라벨 미사용 시 | 단독 사용 시 | `aria-label` 또는 `aria-labelledby`를 $attrs로 전달 |
| 에러 메시지 연결 | error 상태일 때 | `aria-describedby="helper-{inputId}"` $attrs로 전달 |
| 비활성 알림 | disabled 상태일 때 | 네이티브 `<input disabled>` 속성으로 보조기기에 자동 전달 |
| 타이머 텍스트 낭독 억제 | running 상태, 타이머 텍스트 | 타이머 텍스트 요소에 `aria-live="off"` 적용. 매 초마다 스크린리더가 낭독하는 것을 방지 |
| 포커스 표시 | 키보드 포커스 시 | 외곽선(포커스 링) 시각적으로 반드시 표시. Input Base에서 처리 |

---

### 8. 디자인 토큰 매핑

Input Base의 토큰(필드 배경, 테두리, 입력 텍스트, 패딩, radius 등)은 `Input.md` §8 디자인 토큰을 그대로 적용합니다.

**InputAuth 고유 — 타이머 텍스트**

| 사용 위치 | 매핑 토큰 | 비고 |
|---------|---------|------|
| 타이머 텍스트 색상 | `$color-primary` | Figma 미확인 — 가장 자연스러운 브랜드 컬러로 기본 적용 |
| 타이머 텍스트 폰트 크기 | `$font-size-body3` | Input suffix 영역 폰트 사이즈 기준 |
| 타이머 텍스트 폰트 굵기 | `$font-weight-medium` | 숫자 가독성을 위해 medium 적용 |
