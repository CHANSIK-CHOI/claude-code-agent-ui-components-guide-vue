# Checkbox 컴포넌트 명세

> Figma 노드: 전체 상태 `40004010:2292` / 박스형+텍스트 `40004129:7985` / 체크형+텍스트 `40004129:7988`
> (fileKey는 `.claude/CLAUDE.md` "프로젝트 외부 리소스 → Figma" 단일 출처 참조)

---

### 0. Atomic 계층 & 파일 배치

- **계층**: atoms — 단일 선택 입력 요소. Input, Select와 동급의 폼 입력 atom
- **배치 경로**: `components/atoms/Checkbox.vue`
- **Base/Wrapper 분리**: Base만 구성. Checkbox 그룹화가 필요한 경우 별도 CheckboxGroup 컴포넌트로 확장 예정 (현재 명세 범위 외)

계층 판단 근거: 레이블을 내부 슬롯으로 포함하나, 단일 체크 여부 선택이라는 명확한 단일 역할. Radix Vue 구성요소를 조합하지만 외부에서 보면 단일 폼 컨트롤이므로 atoms 분류.

---

### 1. 컴포넌트 개요

사용자가 하나의 항목에 동의하거나 선택 여부를 표시하는 체크박스 컴포넌트입니다.
두 가지 시각 타입(박스형 / 체크형)을 `type` prop으로 구분하며,
레이블 텍스트는 default 슬롯으로 전달합니다.

---

### 2. 영역 구성 (Area Map)

```
① CheckboxRoot__wrapper  (label 태그 — 텍스트 클릭 시 체크 토글)
  ② CheckboxRoot__control  (CheckboxRoot — Radix Vue, 실제 checkbox 버튼 역할)
    ③ CheckboxRoot__icon--always  (SVG 체크 아이콘 — box/check 두 타입 모두 항상 렌더됨)
  ④ CheckboxRoot__label  (default 슬롯에 내용이 있을 때만 렌더)
```

| 번호 | 영역 | 필수 여부 | 설명 |
|-----|------|---------|------|
| ① | 래퍼 (label) | 필수 | `<label>` 태그로 렌더. 클릭 시 ②의 체크 상태 토글 |
| ② | 체크박스 컨트롤 | 필수 | Radix Vue `CheckboxRoot`. `role="checkbox"`, `aria-checked` 자동 관리 |
| ③ | 체크 아이콘 | 필수 | SVG 아이콘이 항상 렌더됨. 상태는 DOM 제거 방식이 아닌 CSS 색상 제어로 표현 |
| ④ | 레이블 텍스트 | 조건부 | default 슬롯 사용 시에만 렌더. `<span>` 태그 |

> **설계 변경 이력**: 초기 명세의 `CheckboxIndicator` 블록(체크 시에만 DOM 렌더)은 최종 구현에서 제거됐습니다.
> `box` / `check` 두 타입 모두 SVG 아이콘을 항상 렌더하고, 아이콘 색상을 CSS로 제어하는 방식으로 통일했습니다 (Figma 노드 `40004010:2292` 확인).

---

### 2-1. Props 목록

| 항목 | 설명 | 기본값 |
|------|------|--------|
| 체크 여부 | 현재 체크 상태 (v-model 연동). `true` = 체크됨 | `false` |
| 시각 타입 | 박스형(`'box'`) 또는 체크형(`'check'`) | `'box'` |
| 비활성 여부 | 켜면 클릭 차단, 시각적으로 흐려짐 | `false` |
| id | 내부 `<label for>`와 연결하는 고유 식별자. 미전달 시 내부 자동 생성 | 미설정 (자동 생성) |
| name | HTML form 전송 시 필드 name | 미설정 |
| required | HTML form 필수 여부 | `false` |
| value | HTML form 전송 시 체크됐을 때의 값 | `'on'` |

**default slot**: 레이블 텍스트. 슬롯 사용 시 ④ 레이블 영역 렌더. 미사용 시 체크박스만 표시.

슬롯 감지 방식: `$slots.default?.().length` 로 실제 VNode 유무를 판단한다. Vue 3에서 슬롯 미사용 시에도 `$slots.default`가 함수로 존재할 수 있으므로, 함수를 호출해 VNode 배열 길이로 판별한다.

> **Attrs 위임 전략**: `CheckboxRoot`가 root이자 interactive element이므로 단순 위임.
>
> | 처리 | 방법 |
> |------|------|
> | `inheritAttrs: false` 선언 | `CheckboxRoot`에 `v-bind="$attrs"` 직접 위임 |
> | `id` 예외 처리 | 내부 computed로 별도 관리 (`useAttrs()`에서 분리 후 `<label for>` 연결) |
> | 나머지 attrs | `aria-*`, `tabindex`, `data-*` 등 `CheckboxRoot`에 자동 전달 |

> **Controlled 바인딩 구현 비고**: Radix Vue controlled mode에서 `v-model:checked + writable computed` 조합이 불안정한 경우가 확인되어, 최종 구현은 `:checked="proxyValue"` + `@update:checked="onCheckedChange"` 명시적 분리 방식을 사용한다.

---

### 2-2. Props 설계 원칙

| 안티패턴 | 원칙 | 올바른 방향 |
|---------|------|-----------|
| `checked: boolean` prop 별도 추가 | v-model과 혼용 금지 | `modelValue`만 사용. Radix Vue 내부에서 `checked`로 연결 |
| `showLabel: boolean` 추가 | 슬롯 유무로 파생 가능 | `$slots.default?.().length` 유무로 자동 판단, prop 불필요 |
| `labelText: string` prop 추가 | 슬롯으로 충분 | default 슬롯 사용. prop 없음 |
| `color: string` 추가 | Figma에 단일 색상 시스템 | type으로만 구분. 색상 커스텀 prop 없음 |

---

### 3. Variant 목록

| type | 용도 | 특징 |
|------|------|------|
| `'box'` | 일반 체크박스 (약관 동의, 폼 선택 등) | 정사각형 박스 영역 + 미체크 시 회색 아이콘 표시 + 체크 시 파란 배경 채움 + 흰 체크 아이콘 |
| `'check'` | 경량 선택 표시 (마케팅 수신, 세부 항목 선택 등) | 박스 배경/테두리 없음 + 체크 여부에 따라 파란/회색 체크 아이콘만 표시 |

---

### 4. 상태(State) 정의

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| box 미체크 | 흰 배경 + 회색 테두리 (`$line-200`), 회색 체크 아이콘 표시 (`$text-300`) | 클릭 시 체크됨으로 전환 |
| box 체크됨 | 파란 배경 (`$color-primary-hover`), 흰 체크 아이콘 표시 | 클릭 시 미체크로 전환 |
| check 미체크 | 박스 없음, 회색 체크 아이콘 표시 (`$text-300`) | 클릭 시 체크됨으로 전환 |
| check 체크됨 | 박스 없음, 파란 체크 아이콘 표시 (`$color-primary-hover`) | 클릭 시 미체크로 전환 |
| disabled 미체크 (box) | 회색 배경 (`$bg-disabled`), 테두리 흐리게 (`$border-disabled`), 체크 아이콘 회색으로 (`$text-300`) | 클릭 차단 |
| disabled 체크됨 (box) | 회색 배경 (`$bg-disabled`), 체크 아이콘 회색으로 (`$text-300`) | 클릭 차단 |
| disabled 미체크 (check) | 체크 아이콘 더 흐리게 (`$border-disabled`) | 클릭 차단 |
| disabled 체크됨 (check) | 파란 아이콘 대신 회색 아이콘 (`$text-300`) | 클릭 차단 |
| focus-visible | 체크박스 컨트롤 외곽에 포커스 링 표시 (`$color-primary`) | 키보드 접근 중 |

> **box 미체크 설계 변경 이력**: 초기 명세는 "체크 아이콘 숨김"이었으나, Figma 노드 `40004010:2292` 확인 결과 미체크 상태에도 회색(`$text-300`) 아이콘이 표시되는 것이 디자인 의도입니다. 아이콘은 DOM에서 항상 렌더되고 CSS 색상만 변경합니다.

---

### 5. 동작 규칙

- 클릭(또는 키보드 Space)으로 체크/언체크 토글
- `disabled` 상태에서는 클릭이 차단되며 상태가 변경되지 않음
- ① 래퍼(`<label>`)를 클릭하면 ④ 레이블 텍스트 클릭도 체크 토글로 연결됨
- ④ 레이블 영역이 없을 때 (슬롯 미사용)에도 ② 컨트롤 클릭은 정상 동작
- `box` / `check` 두 타입 모두 아이콘이 항상 DOM에 렌더됨 — 상태는 CSS 색상으로만 표현
- `id`가 외부에서 전달되면 내부 자동 생성 id 대신 외부 값 사용
- `name` / `value` prop은 HTML form 내에서 사용 시 폼 전송 데이터에 포함됨 (Radix Vue `CheckboxRoot`가 숨김 input을 자동 렌더)

---

### 6. 이벤트 목록

| 이벤트 | 발생 시점 | 전달 정보 |
|--------|---------|---------|
| update:modelValue | 체크/언체크 토글 시 | 변경된 체크 상태 (boolean) |

---

### 7. 접근성 요구사항

Radix Vue가 자동으로 처리하는 항목:

| 항목 | 처리 방식 |
|------|---------|
| `role="checkbox"` | `CheckboxRoot`에 자동 적용 |
| `aria-checked` | 체크 상태에 따라 `"true"` / `"false"` 자동 갱신 |
| `aria-disabled` | disabled 시 자동 적용 |
| 키보드 Space 토글 | 내장 키보드 핸들러 |

퍼블리셔가 직접 처리해야 하는 항목:

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| 레이블 연결 | 슬롯 미사용 단독 사용 시 | `aria-label` 또는 `aria-labelledby`를 `$attrs`로 전달 |
| 에러 메시지 연결 | 에러 상태 표시 필요 시 | `aria-describedby`를 `$attrs`로 전달 |
| 포커스 표시 | 키보드 포커스 시 | `CheckboxRoot`에 `:focus-visible` 외곽선 반드시 표시 (`outline: none` 단독 금지) |

---

### 8. 외부 form 연동 패턴

```
<form @submit.prevent="onSubmit">
  <Checkbox v-model="agree" name="agree" value="yes" id="agree">
    이용약관에 동의합니다
  </Checkbox>
</form>
```

- `name` + `value` prop 전달 시 HTML form의 네이티브 폼 전송에 포함됨 (Radix Vue `CheckboxRoot`가 숨김 input을 자동 렌더)
- `v-model`로 상태를 직접 관리하는 경우 `name` / `value`는 생략 가능

---

### 9. 디자인 토큰 참고

Figma 노드: 전체 상태 `40004010:2292` / 박스형+텍스트 `40004129:7985` / 체크형+텍스트 `40004129:7988`

#### 체크박스 컨트롤 크기

| 속성 | 수치 | 매핑 토큰 |
|-----|------|---------|
| 너비 / 높이 | 22px | `2.2rem` (직접 사용, 토큰 없음) |
| border-radius (box type) | ~4px | `$radius-sm` |

#### box type 색상

| 적용 위치 | Figma 값 | 매핑 토큰 |
|----------|---------|---------|
| 미체크 배경 | #ffffff | `$bg-primary` |
| 미체크 테두리 | #dddddd | `$line-200` |
| **미체크 아이콘** | **#C0C0C0** | **`$text-300`** |
| 체크됨 배경 | #00ADDB | `$color-primary-hover` |
| 체크됨 체크 아이콘 | white | `$text-white` |
| disabled 배경 | #f5f5f5 | `$bg-disabled` |
| disabled 테두리 | #beccd2 | `$border-disabled` |
| disabled 체크 아이콘 | ~#c0c0c0 | `$text-300` |

#### check type 색상

| 적용 위치 | Figma 값 | 매핑 토큰 |
|----------|---------|---------|
| 미체크 아이콘 | ~#c0c0c0 | `$text-300` |
| 체크됨 아이콘 | #00ADDB | `$color-primary-hover` |
| disabled 미체크 아이콘 | #beccd2 | `$border-disabled` |
| disabled 체크됨 아이콘 | ~#c0c0c0 | `$text-300` |

> check type은 박스(배경/테두리) 없음. 아이콘 색상만으로 상태 구분.

#### 레이블 텍스트

| 적용 위치 | Figma 값 | 매핑 토큰 |
|----------|---------|---------|
| box type 레이블 색상 | #333333 | `$text-800` |
| check type 레이블 색상 | #535e66 | `$text-700` |
| 레이블 font-size | 14px | `$font-size-body3` |
| 레이블 font-weight | 500 (Medium) | `$font-weight-medium` |
| 레이블 line-height | 1.3 | `$line-height-snug` |
| disabled 레이블 색상 | ~#c0c0c0 | `$text-300` |

#### 레이아웃

| 속성 | 수치 | 매핑 토큰 |
|-----|------|---------|
| 체크박스 ↔ 레이블 gap | 10px | `1.0rem` (직접 사용, 토큰 없음) |
| 컴포넌트 외부 패딩 | 없음 | 페이지에서 제어 |

#### SVG 체크 아이콘

사용자 제공 SVG 두 개의 path가 미세하게 다르지만, **단일 SVG + `stroke="currentColor"`** 로 통일해 CSS에서 색상 제어.

```
박스형 path:  M1.1001 3.59998L5.43494 8.09998L12.6001 1.09998  (viewBox 0 0 14 10)
체크형 path:  M1.1001 3.59998L5.62341 8.09998L13.1001 1.09998  (viewBox 0 0 15 10)
```

퍼블리셔는 두 path 중 하나를 선택하거나 절충점을 사용한다. stroke-width는 `2.2`, stroke-linecap `round`, stroke-linejoin `round` 공통.

---

### 구현 복잡도 신호

| 컴포넌트 유형 | 이유 | 권장 방식 |
|-------------|------|---------|
| Checkbox | 접근성 처리 및 폼 연동 | Radix Vue `CheckboxRoot` 래핑 |

Radix Vue 구성요소 사용 목록:
`CheckboxRoot`

> `CheckboxIndicator`는 이 컴포넌트에서 사용하지 않습니다. 아이콘을 항상 렌더하고 CSS 색상으로 상태를 표현하는 방식으로 구현됐습니다.
> Select와 달리 Portal, Popper 포지셔닝 없음. 구현 복잡도 낮음.

---

## 제외 범위

| 항목 | 이유 |
|------|------|
| indeterminate (세번째 상태) | Figma 미존재. 추후 필요 시 별도 확장 |
| FormField 조합 | Checkbox는 내부 슬롯으로 레이블 자체 포함. 상위 FormField 조합 불필요 |
| 체크박스 그룹 (CheckboxGroup) | 별도 컴포넌트로 확장 예정. 현재 명세 범위 외 |
| 컴포넌트 외부 패딩 | 사용자 요청으로 페이지에서 직접 제어 |
