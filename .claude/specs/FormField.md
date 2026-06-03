# FormField 컴포넌트 명세

---

### 0. Atomic 계층 & 파일 배치

- **계층**: molecules — Input, Select, DatePicker 등 atoms를 감싸는 form layout 래퍼
- **배치 경로**: `components/molecules/FormField.vue`
- **구조**: Base 컴포넌트만 구성. 내부에 특정 입력 컴포넌트를 주입하는 slot 기반 구조.

---

### 1. 컴포넌트 개요

form 요소에 공통으로 필요한 **라벨 · 툴팁 · 도움말 텍스트** 레이아웃을 제공하는 래퍼 컴포넌트입니다.
Input, Select, DatePicker 등 다양한 폼 컨트롤을 `default slot`으로 주입하면, 어떤 컴포넌트도 동일한 form layout을 재사용할 수 있습니다.

`default slot`에 단일 폼 요소뿐 아니라 **다중 폼 요소 조합**도 삽입 가능합니다. 연락처(Input 3개 가로 배열), 주소(우편번호 Input + 검색 버튼 + 상세주소 Input) 등의 패턴을 지원합니다.

```vue
<!-- 외부 class 추가 (inputId 있음 → label 태그 출력) -->
<FormField class="myPage__fieldWrap" label-text="이메일" input-id="email">
  <Input id="email" v-model="val" />
</FormField>

<!-- inputId 없음 → span 태그로 라벨 출력 (label for 연결 불필요한 경우) -->
<FormField label-text="선택 정보">
  <SomeCustomControl />
</FormField>

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

<!-- successText 조합 (예시) -->
<FormField label-text="쿠폰" input-id="coupon" success-text="추가 할인 %판매가%*%쿠폰 할인율%">
  <Select id="coupon" v-model="val" aria-describedby="helper-coupon" />
</FormField>

<!-- helperText + showHelperIcon: true 조합 (아이콘 포함) -->
<FormField label-text="쿠폰코드" input-id="coupon-code" helper-text="쿠폰은 1회만 사용 가능합니다." :show-helper-icon="true">
  <Input id="coupon-code" v-model="val" aria-describedby="helper-coupon-code" />
</FormField>

<!-- 다중 폼 요소 조합 (연락처) — inputId는 첫 번째 요소 또는 그룹 wrapper의 id를 지정 -->
<!-- 라벨이 그룹 전체를 가리킬 때는 aria-label로 각 Input에 보조 레이블 직접 전달 -->
<FormField label-text="연락처" input-id="phone-1">
  <div class="inputGroup">
    <Input id="phone-1" v-model="phone1" aria-label="연락처 앞자리" maxlength="3" />
    <Input id="phone-2" v-model="phone2" aria-label="연락처 중간자리" maxlength="4" />
    <Input id="phone-3" v-model="phone3" aria-label="연락처 뒷자리" maxlength="4" />
  </div>
</FormField>
```

---

### 2. 영역 구성 (Area Map)

#### Base (FormField.vue)

- ⓪ **루트 컨테이너(div.formField)** — 컴포넌트 최상위 래퍼. 외부에서 전달한 `class` 속성이 이 div에 병합됨 (`v-bind="$attrs"` 적용). `data-*`, `style` 등 다른 네이티브 속성도 함께 위임됨 / 필수
- ① **라벨(Label)** — 입력 필드의 목적을 알려주는 텍스트. 툴팁 slot을 선택적으로 포함. `inputId` 값이 있으면 `<label for="{inputId}">` 태그로, 없으면 `<span>` 태그로 렌더링 / 조건부 (`showLabel`이 켜진 경우)
- ② **입력 슬롯(default slot)** — Input, Select, DatePicker 등 임의 폼 컨트롤 영역. 단일 컴포넌트 또는 복수 컴포넌트를 wrapper div로 감싸서 삽입 가능 / 필수
- ③ **도움말 텍스트(HelperText / ErrorText / SuccessText)** — 입력 안내 메시지, 에러 메시지, 또는 성공/확인 안내 메시지 / `helperText`, `errorText`, `successText` 값이 있을 때 자동 표시.
  세 메시지는 동시에 표시되며, 순서는 `errorText`(맨 위) → `successText` → `helperText`(맨 아래).
  단, `errorText`와 `successText`가 동시에 존재하는 경우는 실무상 드물며, 동시 표시 시 `errorText`가 시각적으로 위에 위치한다.
  `successText`는 체크마크 아이콘(16×16px)과 `$color-primary-hover`(#00ADDB) 색상으로 렌더링.
  `helperText`는 `showHelperIcon: true`일 때 CircularNote 아이콘(`IcCircularNote`, 16×16px)을 텍스트 앞에 선택적으로 표시. 기본값은 아이콘 없음.

---

### 2-1. Props 목록

| 항목 | 설명 | 기본값 |
|------|------|--------|
| inputId | label for 연결용 id (선택). 값이 있으면 라벨을 `<label for="{inputId}">` 태그로 출력해 폼 컨트롤과 명시적 연결. 값이 없으면 라벨을 `<span>` 태그로 출력 (label for 연결 불필요한 경우). **단일 폼 요소**: 내부 컨트롤 id와 일치. **다중 폼 요소**: 첫 번째(대표) 컨트롤의 id 또는 그룹 wrapper의 id를 지정. 각 폼 요소에 `aria-label`로 보조 레이블 직접 전달 권장. 도움말 id는 `helper-{inputId}`로 자동 생성. `inputId` 없을 때 도움말 id는 생성되지 않음 | — (선택, 기본값 없음) |
| labelText | 라벨 영역에 표시할 텍스트 | 빈 값 |
| showLabel | 라벨 영역 표시 여부 | 켬 |
| required | 라벨 옆 `*` 시각 표시. `aria-required`는 슬롯 내 컴포넌트에 직접 전달 | 끔 |
| helperText | 일반 도움말 메시지. 값이 있으면 자동 표시. `errorText`·`successText`와 동시 표시 가능하며, 세 메시지 중 맨 아래에 위치 | 빈 값 |
| errorText | 에러 메시지. 값이 있으면 빨간색으로 표시. 세 메시지 중 맨 위에 위치 | 빈 값 |
| successText | 성공/확인 안내 메시지. 값이 있으면 체크마크 아이콘(IcCheckCircle) + `$color-primary-hover`(#00ADDB) 색상으로 표시. `errorText`와 `helperText` 사이 중간에 위치. `errorText` 유무와 무관하게 값이 있으면 항상 표시. | 빈 값 |
| showHelperIcon | `helperText` 앞에 CircularNote 아이콘(`IcCircularNote`) 표시 여부. `true`이고 `helperText` 값이 있을 때만 아이콘 렌더링. `errorText`·`successText` 표시 여부와 무관하게 동작 | 끔 |

> 표시 순서 (동시 표시): `errorText`(맨 위) → `successText` → `helperText`(맨 아래). 값이 없는 메시지는 DOM에서 제거됨.

> **네이티브 속성 위임**: 이 컴포넌트는 `v-bind="$attrs"`를 루트 `<div>`에 적용합니다. 명시된 Props 외에 `class`, `style`, `data-*` 등 HTML 속성을 외부에서 자유롭게 추가할 수 있습니다. `class`는 항상 병합(merge)되므로 컴포넌트 내부 클래스가 덮어씌워지지 않습니다.

---

### 2-2. Slots 목록

| 슬롯 | 설명 |
|------|------|
| default | Input, Select, DatePicker 등 임의 폼 컨트롤 삽입 |
| tooltip | 라벨 우측 툴팁 영역. 슬롯에 내용이 있으면 자동으로 렌더링. Tooltip 컴포넌트 직접 삽입 |

---

### 2-3. 아이콘 컴포넌트 사용 방식

#### IcCheckCircle (successText 전용)

`successText` 렌더링 시 아래 SVG 아이콘을 사용한다.

- **아이콘 파일명**: `IcCheckCircle.svg`
- **파일 위치**: `assets/icons/IcCheckCircle.svg`
- **사이즈**: 16×16px (sm 기준)
- **SVG 원본**:
  ```svg
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M3.63672 7.27472L6.9264 10.5475L12.364 5.45654" stroke="#00ADDB" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  ```
- **import 방식**: `?skipsvgo` 사용 (색상 고정 아이콘 — SVGO 최적화를 건너뛰어 SVG 내부 stroke 색상 보존)
  ```vue
  import IcCheckCircle from '@nd/assets/icons/IcCheckCircle.svg?skipsvgo'
  ```
- **렌더링**: `successText` 값이 있을 때만 `<IcCheckCircle />` 렌더링 (`v-if` 제어). stroke 색상은 SVG 내부에 하드코딩(`#00ADDB`).
- **아이콘 가이드 등록**: `pages/guide/icon/index.vue`의 sm(16px) 그룹에 `IcCheckCircle` 추가 필요.

#### IcCircularNote (helperText 선택적 아이콘)

`showHelperIcon: true` + `helperText` 있을 때 사용.

- **아이콘 파일명**: `IcCircularNote.svg` (신규 생성 — 기존 `circularNote.svg`는 stroke `#B5BCC2`로 `$text-helper(#777777)` 불일치)
- **파일 위치**: `assets/icons/IcCircularNote.svg`
- **사이즈**: 16×16px
- **색상**: stroke/fill `#777777` (`$text-helper`와 동일, SVG 내부 하드코딩)
- **SVG 원본** (circularNote.svg 형태에서 색상만 `#777777`로 교체):
  ```svg
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" fill="white" stroke="#777777" stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 4.5V8.58333" stroke="#777777" stroke-width="1.47857" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8.00022 12.4666C8.49114 12.4666 8.88911 12.0686 8.88911 11.5777C8.88911 11.0868 8.49114 10.6888 8.00022 10.6888C7.5093 10.6888 7.11133 11.0868 7.11133 11.5777C7.11133 12.0686 7.5093 12.4666 8.00022 12.4666Z" fill="#777777"/>
  </svg>
  ```
- **import 방식**: `?skipsvgo` (색상 고정 아이콘 공통 패턴 — SVGO 최적화를 건너뛰어 SVG 내부 fill/stroke 색상 보존)
  ```vue
  import IcCircularNote from '@nd/assets/icons/IcCircularNote.svg?skipsvgo'
  ```
- **렌더링**: `showHelperIcon: true` + `helperText` 값 있음 일 때 렌더링. `errorText`·`successText` 유무와 무관하게 동작. `aria-hidden="true"` 적용.
- **아이콘 가이드 등록**: `pages/guide/icon/index.vue`의 sm(16px) 그룹에 `IcCircularNote` 추가 필요.

---

### 3. id 연결 컨벤션

FormField는 도움말 영역 전체를 감싸는 래퍼 div 하나에 `helper-{inputId}` 단일 id를 부여합니다.
슬롯 내 폼 컨트롤의 `aria-describedby`는 이 단일 id 하나만 참조합니다. (공백 구분 복수 id 나열 방식 사용 안 함)

`inputId`가 없는 경우 도움말 id는 생성되지 않으며, 라벨은 `<span>`으로 렌더링됩니다.
이 경우 슬롯 내 폼 컨트롤에서 `aria-describedby` 연결도 사용자가 직접 처리해야 합니다.

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

<!-- successText: 성공 안내 메시지 (helperText보다 우선, errorText보다 낮음) -->
<FormField label-text="쿠폰" input-id="coupon" success-text="추가 할인 %판매가%*%쿠폰 할인율%">
  <!-- FormField가 체크 아이콘 + <p id="helper-coupon" role="status"> 렌더링 -->
  <Select id="coupon" v-model="val" aria-describedby="helper-coupon" />
</FormField>

<!-- 다중 폼 요소 (연락처): inputId는 대표 첫 번째 요소 id -->
<FormField label-text="연락처" input-id="phone-1" helper-text="숫자만 입력해주세요">
  <!-- FormField가 <label for="phone-1">연락처</label> + <p id="helper-phone-1"> 렌더링 -->
  <!-- phone-2, phone-3은 라벨이 없으므로 aria-label로 직접 레이블 전달 -->
  <div class="inputGroup">
    <Input id="phone-1" v-model="p1" aria-label="연락처 앞자리" aria-describedby="helper-phone-1" maxlength="3" />
    <Input id="phone-2" v-model="p2" aria-label="연락처 중간자리" maxlength="4" />
    <Input id="phone-3" v-model="p3" aria-label="연락처 뒷자리" maxlength="4" />
  </div>
</FormField>

<!-- 다중 폼 요소 (주소): inputId는 대표 첫 번째 Input id -->
<FormField label-text="주소" input-id="addr-zip">
  <div class="addrGroup">
    <div class="addrGroup__row">
      <Input id="addr-zip" v-model="zip" aria-label="우편번호" readonly />
      <Button type="button" shape="line" @click="openPostcode">우편번호 검색</Button>
    </div>
    <Input id="addr-road" v-model="addrRoad" aria-label="도로명 주소" readonly />
    <Input id="addr-detail" v-model="addrDetail" aria-label="상세주소" placeholder="상세 주소를 입력해 주세요." />
  </div>
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
| 라벨 있음 + 에러만 | 유효성 검사 실패 (도움말 없음) |
| 라벨 있음 + 도움말 있음 + 에러 동시 | 유효성 검사 실패 + 안내 메시지 병행 표시 |
| 라벨 있음 + 성공만 | 선택/입력 확인 안내 (쿠폰 적용, 인증 완료 등) |
| 라벨 있음 + 도움말 있음 + 성공 동시 | 성공 안내 + 도움말 병행 표시 |
| 라벨 있음 + 도움말 있음 + 아이콘 | `showHelperIcon: true` — 주의 안내 등 아이콘 강조가 필요한 폼 필드 |
| 라벨 있음 + 다중 폼 요소 | 연락처(Input 3분할), 주소(우편번호+상세주소) 등 slot에 복수 컨트롤 삽입. label은 대표 id 하나만 가리키며, 나머지 컨트롤에 `aria-label` 개별 부여 |

---

### 5. 동작 규칙

- `inputId` 값이 있으면 라벨 영역을 `<label for="{inputId}">` 태그로 렌더링하여 폼 컨트롤과 명시적 연결. 값이 없으면 `<span>` 태그로 렌더링 (label for 연결 없음).
- `inputId` 없을 때 라벨에 `@mousedown` 핸들러를 바인딩하지 않음 (`<span>` 태그에는 불필요).
- `inputId` 없을 때 도움말 요소 id 속성(`id="helper-{inputId}"`)을 출력하지 않음 (`id="helper-undefined"` 방지). 슬롯 내 컨트롤의 `aria-describedby` 연결은 사용처에서 직접 처리.
- `showLabel`이 꺼지면 라벨 영역 전체(텍스트 + 툴팁 slot)가 렌더링되지 않음
- `#tooltip` slot에 내용이 있으면 자동으로 툴팁 영역이 렌더링됨 (별도 prop 불필요)
- `errorText`, `successText`, `helperText` 세 props는 값이 있으면 **동시에 모두 렌더링**된다. 순서는 `errorText`(맨 위) → `successText` → `helperText`(맨 아래). 값이 없는 메시지는 DOM에서 제거됨.
- `errorText`가 있으면 빨간색(`$color-danger`)으로 표시. `role="alert"` 자동 부여
- `successText`가 있으면 체크마크 아이콘(`IcCheckCircle.svg`, 16×16) + `$color-primary-hover`(#00ADDB) 색상으로 표시. `errorText` 유무와 무관하게 값이 있으면 항상 표시. `role="status"` 자동 부여 (보조기기에 성공 상태 비침습적 통보)
- `showHelperIcon: true`이고 `helperText` 값이 있으면 → `IcCircularNote` 아이콘을 `helperText` 앞에 렌더링. `errorText` / `successText` 활성 여부와 무관하게 동작. `showHelperIcon: false`(기본)이면 아이콘 렌더링하지 않음.
- 세 가지 메시지 prop이 모두 없으면 도움말 영역 전체가 DOM에서 제거됨. 일부만 있으면 해당 메시지만 렌더링됨.
- `required`는 라벨 옆 `*` 시각 표시만 담당. `aria-required`는 슬롯 내 컴포넌트에 직접 전달
- 도움말 요소 id는 `helper-{inputId}` 형식으로 자동 생성. 슬롯 컴포넌트의 `aria-describedby`와 일치해야 함
- 다중 폼 요소를 slot에 삽입할 때, `inputId`는 대표(첫 번째) 컨트롤의 id를 지정한다. `<label for>`은 하나의 컨트롤만 가리킬 수 있으므로 나머지 컨트롤에는 `aria-label`로 개별 레이블을 직접 전달한다
- 다중 폼 요소의 wrapper div(`inputGroup`, `addrGroup` 등)는 FormField 내부가 아닌 **사용처(가이드 페이지, 섹션)에서 정의**한다. FormField 자체는 wrapper 레이아웃에 개입하지 않는다
- 도움말 텍스트(`helperText`, `errorText`, `successText`)는 다중 폼 요소 그룹 전체에 대한 메시지로 동작한다. 그룹 전체 에러(예: "연락처를 모두 입력해주세요")에 사용하고, 개별 필드별 에러는 사용처에서 별도 처리한다
- `v-bind="$attrs"`가 루트 `<div class="formField">`에 적용되므로, 외부에서 `class`를 추가해도 내부 `formField` 클래스와 병합된다. `style`, `data-*` 등 다른 HTML 속성도 동일하게 위임됨. 단, 이벤트 핸들러(`@click` 등)는 루트 div에 위임되며 입력 컨트롤에 전달되지 않는다

---

### 6. 접근성 요구사항

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| 라벨 연결 | showLabel 켜진 경우, inputId 있음 | `<label for="{inputId}">` 태그 출력 — 슬롯 컴포넌트의 id와 반드시 일치 |
| 라벨 출력 (연결 없음) | showLabel 켜진 경우, inputId 없음 | `<span>` 태그로 라벨 출력. label for 연결 없음. 슬롯 컨트롤에 `aria-label` 또는 별도 연결 방식 사용 권장 |
| 에러 메시지 연결 | errorText 있을 때 | 도움말 래퍼에 `id="helper-{inputId}"` (단일 id), `role="alert"` 자동 부여. 슬롯 컴포넌트가 `aria-describedby="helper-{inputId}"` 하나로 참조 |
| 성공 메시지 연결 | successText 있을 때 | 도움말 래퍼에 `id="helper-{inputId}"` (단일 id), `role="status"` 자동 부여. `errorText`와 동시 표시 가능. 슬롯 컴포넌트가 `aria-describedby="helper-{inputId}"` 하나로 참조 |
| 아이콘 대체 텍스트 (성공) | successText 렌더링 시 | 아이콘 `<IcCheckCircle>`은 장식 목적이므로 `aria-hidden="true"` 적용 |
| 아이콘 대체 텍스트 (도움말) | showHelperIcon + helperText 렌더링 시 | 아이콘 `<IcCircularNote>`은 장식 목적이므로 `aria-hidden="true"` 적용 |
| 필수 항목 | required 켜진 경우 | 라벨에 `*` 시각 표시 (`aria-hidden="true"`). `aria-required`는 슬롯 컴포넌트에 직접 전달 |
| 툴팁 접근 | #tooltip slot 내용이 있을 때 | `#tooltip` slot에 삽입되는 버튼/컴포넌트가 `aria-label` 또는 `title` 제공 책임 |
| 다중 폼 요소 레이블 | slot에 복수 컨트롤 삽입 시 | `label for`는 대표(첫 번째) 컨트롤 id만 가리킴. 나머지 컨트롤에 `aria-label` 개별 부여 필수. 도움말 `aria-describedby="helper-{inputId}"` (단일 id)는 대표 컨트롤에만 연결. 복수 id 공백 나열 방식 사용 안 함 |
| 키보드 접근 | 항상 | Tab 키로 라벨·슬롯 컨트롤·툴팁 버튼 순서 탐색 가능 |

---

### 7. 디자인 토큰 참고

Figma 노드 `40004010:2461` 기준 (Input 명세와 동일 노드에서 추출).

#### 색상

| 적용 위치 | Figma 색상값 | 매핑 토큰 |
|----------|------------|---------|
| 라벨 텍스트 | `#777777` | `$text-500` |
| 도움말 텍스트 (기본) | `#777777` | `$text-500` |
| 도움말 텍스트 (error) | `#ff5146` | `$color-danger` |
| 필수 `*` | `#ff5146` | `$color-danger` |
| 도움말 텍스트 (success) | `#00ADDB` | `$color-primary-hover` |
| 성공 아이콘 stroke | `#00ADDB` | SVG 내부 하드코딩 (scoped 오버라이드 불가로 아이콘 파일에 고정) |
| 도움말 아이콘 stroke (helperText) | `#777777` | SVG 내부 하드코딩 (`$text-helper`와 동일 색상, 아이콘 파일에 고정) |

#### 간격 및 타이포그래피

| 적용 위치 | 수치 | 매핑 토큰 |
|----------|------|---------|
| 라벨과 필드 사이 간격 | 6px | — (0.6rem 고정값) |
| 필드와 도움말 사이 간격 | 4px | `$spacing-xs` |
| 라벨 텍스트 | 14px / 400 / lh 1.3 | `$font-size-sm`, `$font-weight-regular`, `$line-height-snug` |
| 도움말 텍스트 | 12px / 700 / lh 1.3 | `$font-size-xs`, `$font-weight-bold`, `$line-height-snug` |

---

### 8. 가이드 페이지 신규 제작 지침

**파일 위치**: `pages/guide/form-field/index.vue`
**레이아웃**: `layout: 'guide'`

가이드 페이지는 지금까지 제작된 다양한 form 요소를 한 화면에서 확인할 수 있는 **종합 폼 예시 레이아웃**으로 구성한다.

#### 섹션 구성

- **① 기본 폼 구성** — `FormField` + `Input` 조합 (labelText / required / helperText / showHelperIcon)
- **② 에러 상태** — `FormField` + `Input` 조합 (`errorText` 표시, `Input`에 `:error="true"`)
- **③ 성공/확인 상태 (신규)** — `FormField` + `Select` 조합 (`successText` 표시, 체크 아이콘 + 파란색)
- **④ 라벨 없음** — `FormField` + `Input` 조합 (`showLabel: false`)
- **⑤ 툴팁 포함** — `FormField` + `Input` + `#tooltip` slot (`Tooltip` 컴포넌트 연결, 있는 경우)
- **⑥ 다중 폼 요소 케이스 (신규)** — Figma 배송지 정보 폼 패턴 기반:
  - **연락처**: `FormField` 1개 + `default slot` 안에 `Input` 3개 가로 배열 (`inputGroup` wrapper div, `display: flex; gap: 0.4rem`). `inputId="phone-1"`. 각 Input에 `aria-label` 직접 전달
  - **주소**: `FormField` 1개 + `default slot` 안에 (우편번호 Input + 검색 Button 가로) + 도로명 Input + 상세주소 Input 세로 배열 (`addrGroup` wrapper div, `display: flex; flex-direction: column; gap: 0.8rem`). `inputId="addr-zip"`. "우편번호 검색" 버튼 클릭 시 mock 주소값 자동 채움
  - 두 케이스 모두 실제 동작하는 `v-model` 바인딩 포함 (mock 데이터 없이 `ref` 선언)
  - 각 케이스 하단에 사용법 코드 스니펫 포함
- **⑦ 복합 폼 레이아웃** — 실제 폼처럼 여러 `FormField`를 세로로 쌓은 예시:
  - 이름(Input) / 이메일(Input) / 지역(Select) / 쿠폰(Select + successText) / 생년월일(DatePicker, 등록된 경우)
  - 하단에 `Button` (제출 버튼, primary)
- **⑧ Props / Slots / Events 표** — `guide-page.md` 규칙 준수. Props 표 하단에 **`delegationNote`** 추가 필수: "이 컴포넌트는 `v-bind="$attrs"`를 사용하므로 위 Props 외에도 루트 `<div>` 요소의 모든 네이티브 HTML 속성(`class`, `style`, `data-*` 등)을 그대로 전달할 수 있습니다."

#### 사용 컴포넌트 목록

`FormField`, `Input`, `Select`, `Button` (모두 `components/` 등록 컴포넌트).
DatePicker 및 Tooltip은 등록 여부 확인 후 포함 여부 결정.
