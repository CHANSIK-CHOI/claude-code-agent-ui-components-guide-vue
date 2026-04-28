# Switch 컴포넌트 명세

> Figma 노드: `40004010:2329` (checked / unchecked 두 상태 포함)
> (fileKey는 `.claude/CLAUDE.md` "프로젝트 외부 리소스 → Figma" 단일 출처 참조)

---

### 0. Atomic 계층 & 파일 배치

- **계층**: atoms — 단일 boolean 토글 입력 요소. Checkbox, Input과 동급의 폼 입력 atom.
- **배치 경로**: `components/atoms/Switch.vue`
- **Base/Wrapper 분리**: Base만 구성. 레이블 조합이 필요한 경우 상위 FormField 또는 슬롯으로 처리.

계층 판단 근거: 켜짐/꺼짐 한 가지 상태를 제어하는 단일 역할 컴포넌트. Radix Vue를 래핑하지만 외부에서 보면 단일 폼 컨트롤이므로 atoms 분류.

---

### 1. 컴포넌트 개요

켜짐/꺼짐 두 상태를 즉시 전환하는 토글 스위치 컴포넌트입니다.
설정 옵션 활성화, 알림 수신 동의 등 즉각적인 상태 전환이 필요한 폼 입력 맥락에서 사용합니다.
Checkbox와 달리 폼 제출을 기다리지 않고 선택 즉시 동작이 반영됩니다.

---

### 2. 영역 구성 (Area Map)

```
① switch  (SwitchRoot — Radix Vue, 전체 Track 영역, button 역할)
  ② switch__thumb  (SwitchThumb — Radix Vue, 슬라이딩 원형 손잡이)
```

- ① **switch (Track)** — 전체 스위치 배경 트랙. `SwitchRoot`가 렌더. checked/unchecked 상태에 따라 배경색이 변경됨. 필수.
- ② **switch__thumb (Thumb)** — 트랙 위를 좌우로 이동하는 원형 손잡이. `SwitchThumb`가 렌더. 필수.

> **레이블**: Switch 컴포넌트 내부에 레이블 영역 없음. 레이블이 필요한 경우 사용처에서 `<label>` + `aria-label` 또는 `aria-labelledby`로 직접 연결한다.

---

### 2-1. Props 목록

| 항목 | 설명 | 기본값 |
|------|------|--------|
| 켜짐 여부 (v-model) | 현재 토글 상태. `true` = 켜짐(checked) | `false` |
| 비활성 여부 | 켜면 클릭 차단, 시각적으로 흐려짐 | `false` |
| id | 외부 `<label for>`와 연결하는 고유 식별자 | 미설정 |
| name | HTML form 전송 시 필드 name | 미설정 |
| required | HTML form 필수 여부 | `false` |
| value | HTML form 전송 시 켜짐 상태일 때의 값 | `'on'` |

> **Radix Vue SwitchRoot Root 전용 props (1단계 위임 목록)**
> `name`, `required`, `value`, `defaultChecked`, `checked`, `dir` 는 `SwitchRoot`로 직접 위임.
> `aria-*`, `tabindex`, `data-*`, `id` 등 인터랙티브 attrs는 `SwitchRoot`(2단계) 전달.
> Switch는 단일 인터랙티브 요소(`SwitchRoot` = button)이므로 Content 포지셔닝(3단계)은 없음.
>
> Radix Vue `SwitchRoot`의 모든 props를 외부에서 전달할 수 있도록 attrs 위임 설계 필요.

---

### 2-2. Props 설계 원칙 — 중복 제어 제거

| 안티패턴 | 원칙 | 올바른 방향 |
|---------|------|-----------|
| `checked: boolean` + `modelValue: boolean` 이중 노출 | v-model 단일 채널 | `modelValue`만 노출. `checked`는 SwitchRoot 내부 연결 |
| `label: string` prop 추가 | 슬롯 또는 외부 label로 처리 | Switch 내부에 레이블 영역 없음. 사용처에서 label 직접 작성 |
| `size: string` prop 추가 | Figma에 단일 사이즈만 존재 | 사이즈 prop 없음. 추후 디자인 추가 시 확장 검토 |

---

### 3. Variant 목록

Figma에 크기 및 스타일 Variant 없음. 단일 스타일로 구성.

| 상태 축 | 값 | 설명 |
|--------|-----|------|
| 토글 상태 | checked / unchecked | Track 색상으로 구분 |
| 활성화 여부 | enabled / disabled | 흐림 처리로 구분 |

> Figma에 size, shape 등 별도 Variant 없음. 추후 디자인 추가 시 `size` prop 확장 검토.

---

### 4. 상태(State) 정의

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| unchecked (꺼짐) | Track 배경 회색, Thumb 왼쪽 위치 | 클릭 시 checked 전환 |
| checked (켜짐) | Track 배경 파란색, Thumb 오른쪽 위치 | 클릭 시 unchecked 전환 |
| disabled (unchecked) | Track 배경 회색 + 전체 opacity 감소 (`$opacity-disabled` 또는 `0.4`) | 클릭 차단 |
| disabled (checked) | Track 배경 파란색 + 전체 opacity 감소 | 클릭 차단 |
| focus-visible | Track 외곽에 포커스 링 표시 (다른 컴포넌트와 동일한 box-shadow) | 키보드 접근 중 |
| hover | Track 배경색 살짝 어둡게 (다른 컴포넌트 hover 수준으로 통일) | — |
| active (press) | Thumb 살짝 축소 (scale) | — |

> **Figma 확인 결과**: checked `#00ADDB` / unchecked `#C0C0C0` 두 Track 색상만 명시.
> hover·active 상태: Figma 미명시이나 **일반적인 수준으로 추가** 결정 — Button 등 다른 컴포넌트와 동일한 수준 적용.
> disabled 상태: Figma 미명시 — opacity 처리로 구현.
> focus 시각 처리: Figma 미명시이나 접근성상 반드시 구현 — 포커스 링 색상 및 형태는 다른 컴포넌트(Checkbox 등)와 통일.
> Thumb 전환 애니메이션: **`$duration-fast ease-in-out` 추가** 결정 — Transform(이동) + background-color 동시 전환.

---

### 5. 동작 규칙

- 클릭 또는 키보드 Space/Enter로 켜짐/꺼짐 즉시 전환
- `disabled` 상태에서는 클릭이 차단되며 상태가 변경되지 않음
- Thumb이 unchecked 시 왼쪽, checked 시 오른쪽으로 이동 (CSS transition으로 부드럽게 이동)
- Track 배경색 전환도 Thumb 이동과 동시에 진행
- 레이블을 컴포넌트 외부에서 `<label for="[id]">` 형태로 연결할 경우, 레이블 클릭 시 토글 동작
- `name` + `value` prop 전달 시 HTML form 네이티브 전송에 포함됨 (Radix Vue `SwitchRoot`가 숨김 input을 자동 렌더)
- 외부에서 `id`를 전달하면 내부 자동 생성 id 대신 외부 값 사용

---

### 6. 이벤트 목록

| 이벤트 | 발생 시점 | 전달 정보 |
|--------|---------|---------|
| update:modelValue | 토글 전환 시 (disabled 제외) | 변경된 상태 (boolean: true = 켜짐) |

---

### 7. 접근성 요구사항

Radix Vue `SwitchRoot`가 자동으로 처리하는 항목:

| 항목 | 처리 방식 |
|------|---------|
| `role="switch"` | `SwitchRoot`에 자동 적용 |
| `aria-checked` | 토글 상태에 따라 `"true"` / `"false"` 자동 갱신 |
| `aria-disabled` | disabled 시 자동 적용 |
| 키보드 Space / Enter 토글 | 내장 키보드 핸들러 |

퍼블리셔가 직접 처리해야 하는 항목:

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| 레이블 연결 | 항상 (레이블 텍스트 없는 단독 사용 시) | 외부에서 `aria-label` 또는 `aria-labelledby`를 `$attrs`로 전달 |
| 에러 메시지 연결 | 에러 상태 표시 필요 시 | `aria-describedby`를 `$attrs`로 전달 |
| 포커스 표시 | 키보드 포커스 시 | `SwitchRoot`에 `:focus-visible` 외곽선 반드시 표시 (`outline: none` 단독 금지) |

---

### 8. 사용 예시

```vue
<!-- 단독 사용 — aria-label 필수 -->
<Switch v-model="isEnabled" aria-label="알림 수신 동의" />

<!-- 외부 레이블 연결 -->
<label for="notification-switch">알림 수신</label>
<Switch id="notification-switch" v-model="isEnabled" />

<!-- 비활성 상태 -->
<Switch v-model="isEnabled" :disabled="true" aria-label="비활성 토글" />

<!-- FormField 안에서 사용 -->
<FormField label="알림 수신 동의">
  <Switch v-model="isEnabled" />
</FormField>
```

---

### 9. 디자인 토큰 매핑

Figma 노드: `40004010:2329` 기준

#### Track 크기

| 속성 | Figma 수치 | 매핑 토큰 / 값 |
|-----|-----------|-------------|
| 너비 | 46px | `4.6rem` (직접 사용, 토큰 없음) |
| 높이 | 26px | `2.6rem` (직접 사용, 토큰 없음) |
| border-radius | 19.5px (완전 pill) | `$radius-full` |

#### Thumb 크기 및 위치

| 속성 | Figma 수치 | 매핑 토큰 / 값 |
|-----|-----------|-------------|
| 너비 / 높이 | 22px × 22px | `2.2rem` (직접 사용, 토큰 없음) |
| unchecked 위치 | 트랙 왼쪽 정렬 (여백 약 2px) | `translateX(2px)` 또는 `left: 0.2rem` |
| checked 위치 | 트랙 오른쪽 정렬 (여백 약 2px) | `translateX(22px)` 또는 computed |
| border-radius | 완전 원형 | `$radius-full` |
| 외관 | 흰 원형 + 드롭 섀도우 (Figma 에셋) | 흰 배경 (`$bg-primary`) + `box-shadow` |

> **Thumb 구현 참고**: Figma에서 Thumb이 이미지 에셋(PNG)으로 렌더됐으나, 구현 시 `background-color: $bg-primary` + `border-radius: $radius-full` + `box-shadow` 조합으로 CSS 단독 구현 가능. 퍼블리셔가 시각적으로 맞춰 결정.

#### Track 색상

| 상태 | Figma 값 | 매핑 토큰 |
|------|---------|---------|
| checked (켜짐) | `#00ADDB` | `$color-primary-hover` |
| unchecked (꺼짐) | `#C0C0C0` | `$text-300` |
| disabled | Figma 미명시 | unchecked 색상 유지 + opacity 감소 (구현 시 결정) |

#### Thumb 색상

| 상태 | Figma 값 | 매핑 토큰 |
|------|---------|---------|
| 모든 상태 | 흰색 | `$bg-primary` |
| 그림자 | Figma 에셋으로 표현 | `box-shadow` 직접 정의 (토큰 없음, 구현 시 결정) |

#### Thumb 전환 애니메이션

| 속성 | Figma | 구현 방향 |
|-----|-------|---------|
| 이동 애니메이션 | 명시 없음 | `transition: transform $duration-fast ease-in-out` **추가 결정** |
| 배경색 전환 | 명시 없음 | `transition: background-color $duration-fast ease-in-out` **추가 결정** |

---

### 구현 복잡도 신호

| 컴포넌트 유형 | 이유 | 권장 방식 |
|-------------|------|---------|
| Switch | 접근성 처리 및 폼 연동 | Radix Vue `SwitchRoot` + `SwitchThumb` 래핑 |

Radix Vue 구성요소 사용 목록:
- `SwitchRoot` — Track 역할. `role="switch"`, `aria-checked` 자동 관리, 폼 숨김 input 자동 렌더
- `SwitchThumb` — 슬라이딩 Thumb 역할. `data-state` 속성으로 CSS 전환 제어

> Radix Vue Switch는 **Stable** 컴포넌트이므로 래핑 패턴 적극 적용.
> Dialog, Dropdown 등과 달리 Portal/Popper 없음 — 구현 복잡도 낮음.

⚠️ Radix Vue 래핑 패턴 적용 — 프론트엔드 담당자와 구현 방식 협의

---

## 디자인 확정 사항 (Figma 미명시 → 사용자 결정)

| 항목 | 결정 |
|------|------|
| hover 상태 | **추가** — Track 색상 살짝 어둡게 (Button 등 다른 컴포넌트와 동일 수준) |
| active (press) 상태 | **추가** — Thumb 살짝 축소 (scale) |
| disabled opacity | **opacity 감소 처리** — 수치는 퍼블리셔가 다른 컴포넌트와 맞춰 결정 |
| Thumb 전환 애니메이션 | **추가** — `$duration-fast ease-in-out` |
| Thumb 드롭 섀도우 | CSS 직접 정의 — 퍼블리셔가 시각적으로 맞춰 결정 |
