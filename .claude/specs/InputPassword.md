---
name: InputPassword
description: Input(Base) 래핑 Wrapper. suffix 슬롯에 비밀번호 보기/숨기기 토글 버튼 추가. atoms 계층.
metadata:
  type: component
  layer: atoms
  base: Input
  pattern: wrapper
---

# InputPassword 컴포넌트 명세

---

### 0. Atomic 계층 & 파일 배치

- **계층**: atoms — Input(Base)을 래핑하는 최소 단위 Wrapper
- **배치 경로**: `components/atoms/InputPassword.vue`
- **Base/Wrapper 분리**:
  - **Base 담당 (Input.vue)**: v-model 바인딩, disabled/readonly/error 상태 처리(boolean), clear 버튼 노출 로직, suffix 슬롯 제공, `$attrs` 위임(`<input>` 요소 대상), focus/blur/change/clear 이벤트 발행
  - **Wrapper 담당 (InputPassword.vue)**: Input의 `#suffix` 슬롯에 비밀번호 보기/숨기기 토글 버튼 삽입. 내부에서 `type="password"` ↔ `type="text"` 전환. 토글 상태(`isVisible`) 관리. `toggle` 이벤트 발행. error 텍스트 직접 렌더링(`<p class="inputPassword__error">`)

---

### 1. 컴포넌트 개요

비밀번호 입력 전용 Input Wrapper 컴포넌트.  
Input Base의 suffix 슬롯에 보기/숨기기 토글 버튼을 삽입해 비밀번호 가시성을 제어하며, 로그인·회원가입·비밀번호 변경 등 비밀번호 입력이 필요한 모든 폼 필드에서 사용한다.

---

### 2. 영역 구성 (Area Map)

InputPassword는 Input Base의 영역 구조를 계승하며, suffix 슬롯에 토글 버튼 1개를 추가한다.

- ① **입력 필드(Field)** — Input Base 위임. 비밀번호 입력 텍스트 표시(마스킹 또는 평문) / 필수
- ② **suffix 영역(Suffix)** — Input Base 위임
  - ②-1 **clear 버튼** — Input Base 내부에서 제어 (InputPassword에서 별도 구현 없음)
  - ②-2 **토글 버튼** — suffix 슬롯에 삽입. 비밀번호 숨김 상태일 때 `inputPasswordShow.svg` 아이콘 표시, 보임 상태일 때 `inputPasswordHide.svg` 아이콘 표시 / 항상 표시

> 아이콘 의미 구분: **Show 아이콘** = "현재 숨겨져 있음 → 클릭하면 보임", **Hide 아이콘** = "현재 보이고 있음 → 클릭하면 숨겨짐". 아이콘이 현재 상태가 아닌 **액션 방향**을 나타낸다.

---

### 3. Props

| 이름 | 타입 | 기본값 | 필수 | 설명 |
|------|------|--------|------|------|
| modelValue | `string` | `''` | 아니오 | 입력값 (v-model 연동) |
| error | `string \| undefined` | `undefined` | 아니오 | 에러 메시지. `!!error`(boolean)로 변환해 Input Base에 전달. 에러 텍스트는 Wrapper가 직접 `<p class="inputPassword__error">` 렌더링 (Input Base의 `error` prop 타입이 boolean이므로 변환 필수) |
| disabled | `boolean` | `false` | 아니오 | 켜면 입력 불가 + 토글 버튼 비활성 |
| readonly | `boolean` | `false` | 아니오 | 켜면 입력만 차단. 토글 버튼은 정상 동작 |
| placeholder | `string` | `''` | 아니오 | 값이 없을 때 표시할 안내 텍스트 |

> **노출하지 않는 props**:
> - `type`: 내부에서 `isVisible` 상태에 따라 `"password"` / `"text"` 로 동적 결정. 외부 제어 금지.
> - `hideClear`: clear 버튼은 Input Base 기본 동작 그대로. InputPassword가 별도 제어하지 않음.
>
> `id`, `aria-label`, `aria-describedby`, `maxlength`, `autocomplete` 등 네이티브 속성은 `v-bind="$attrs"` 위임으로 Input Base의 `<input>` 요소까지 전달된다.

---

### 4. Emit

InputPassword 자체 이벤트:

| 이벤트명 | 페이로드 타입 | 발생 시점 |
|---------|------------|---------|
| toggle | `boolean` | 토글 버튼 클릭 시. payload = 변경 후 isVisible 값 (보임: true / 숨김: false). disabled 상태 제외 |

Input Base relay 이벤트:

| 이벤트명 | 페이로드 타입 | 발생 시점 |
|---------|------------|---------|
| update:modelValue | `string` | 입력값 변경 시 |
| focus | — | 입력 필드 포커스 진입 시 |
| blur | `string` | 입력 필드 포커스 이탈 시 |
| change | `string` | 입력 완료 후 포커스 이탈 시 |
| clear | — | clear 버튼 클릭 시 |

---

### 5. Slot

InputPassword는 Input Base의 슬롯을 외부에 재노출하지 않는다.  
`#suffix` 슬롯은 이미 토글 버튼으로 점유되어 있으며 추가 확장 없음.

---

### 6. 상태(State) 정의

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| 기본(숨김) | 입력값 마스킹(***), Show 아이콘 표시 | password 타입으로 렌더 |
| 기본(보임) | 입력값 평문 표시, Hide 아이콘 표시 | text 타입으로 렌더 |
| focus | Input Base 동일 (테두리 변화) | 키보드 입력 활성 |
| disabled | Input Base 동일 (흐리게). 토글 버튼에도 `opacity: 0.4` 적용 | 입력 차단 + 토글 클릭 차단 |
| readonly | Input Base 동일 | 입력만 차단. **토글 버튼은 정상 동작** |
| error | Input Base 동일 (에러 테두리) | 입력 가능 |

---

### 7. 동작 규칙

- 초기 상태는 항상 비밀번호 숨김(`type="password"`) 고정
- 토글 버튼 클릭 시 숨김 ↔ 보임 전환. `toggle` 이벤트 발행
- disabled 상태일 때 토글 버튼 클릭 이벤트 차단 (핸들러 early return + 버튼 `:disabled="disabled"` 속성)
- readonly 상태일 때 토글 버튼은 정상 동작 (readonly는 입력만 차단)
- clear 버튼 동작은 Input Base에 위임 — InputPassword에서 별도 구현 없음
- `v-bind="$attrs"`는 Wrapper 루트가 아닌 Input Base에 위임하여 내부 `<input>` 요소까지 전달
- 토글 버튼 아이콘:
  - 숨김 상태: `inputPasswordShow.svg` (`?skipsvgo` 패턴 import)
  - 보임 상태: `inputPasswordHide.svg` (`?skipsvgo` 패턴 import)

---

### 8. 접근성 요구사항

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| 토글 버튼 레이블 | 항상 | 아이콘만 있으므로 `aria-label` 필수. 숨김 상태: `"비밀번호 보기"`, 보임 상태: `"비밀번호 숨기기"` |
| 토글 버튼 타입 | 항상 | `type="button"` 명시 (폼 제출 방지) |
| 토글 버튼 비활성 | disabled 상태 | `:disabled="disabled"` 속성으로 보조기기에 비활성 전달 |
| 라벨 연결 | FormField와 조합 시 | Input Base 위임으로 자동 처리 (`$attrs` 경유 `id` 전달) |
| 에러 상태 | error 상태 | Input Base 위임 (`aria-invalid="true"`). 에러 텍스트 `<p>`에 `aria-live="polite"` 추가 — 동적 에러 메시지 변경 시 스크린리더에 알림 |
| 키보드 접근 | 항상 | Tab으로 입력 필드 → 토글 버튼 순서 탐색 가능 |

---

### 9. 디자인 토큰 매핑

| 사용 위치 | 처리 방식 |
|---------|---------|
| 토글 버튼 배경 | 없음 (투명) |
| 토글 버튼 아이콘 색상 | SVG 자체 색상 유지 (`?skipsvgo`) |
| disabled 토글 버튼 opacity | `opacity: 0.4` (수치 직접 사용 — 토큰 미존재) |
| 토글 버튼 아이콘 크기 | `1.6rem` (Input Base clear 버튼과 동일) |
