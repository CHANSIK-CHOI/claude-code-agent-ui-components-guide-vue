# Tab 컴포넌트 명세

> Figma 노드:
> - underline-dark: `40004019:2417` (상세_depth)
> - underline-primary: `40004010:2337` (Tap_1depth)
> - pill: `40004010:2348` (Tap_2depth)
> - pill-vertical: `40005066:2374` (03_Tap 체험팩)
>
> (fileKey는 `.claude/CLAUDE.md` "프로젝트 외부 리소스 → Figma" 단일 출처 참조)

---

### 0. Atomic 계층 & 파일 배치

- **계층**: organisms — Radix Vue 래핑 + 독립 탐색 UI 블록
- **배치 경로**: `components/organisms/Tab.vue`
- **barrel**: `components/organisms/index.ts`에 `export { default as Tab } from './Tab.vue'` 추가

계층 판단 근거: 외부 라이브러리(Radix Vue Tabs)를 래핑하고 복잡한 탐색 상태를 관리하는 독립 UI 블록. Select가 atoms인 것과 달리 Tab은 여러 인터랙티브 요소(TabsTrigger × N)를 조합하므로 organisms로 분류.

---

### 1. 컴포넌트 개요

콘텐츠 영역을 전환하는 탭 네비게이션 컴포넌트. **Navigation only** 설계로, Tab 자체는 탭 목록(`TabsList`)만 렌더링하고 콘텐츠 패널은 부모 컴포넌트가 `v-model`로 받은 선택값에 따라 직접 전환한다.

```vue
<!-- 사용 예시 — 부모 컴포넌트 -->
<Tab v-model="activeTab" :items="tabs" variant="underline-dark" />
<ProductDescription v-if="activeTab === 'desc'" />
<ReviewList         v-else-if="activeTab === 'review'" />
<ShippingInfo       v-else-if="activeTab === 'shipping'" />
```

```vue
<!-- actions 슬롯 사용 예시 — Button 조합 -->
<Tab v-model="activeTab" :items="tabs" variant="pill">
  <template #actions>
    <Button shape="text" size="xs" @click="reset">초기화</Button>
  </template>
</Tab>
```

**기능 분류**

| 기능 | 설명 |
|------|------|
| 기본 tablist | 탭 목록 렌더링 + 선택 상태 v-model |
| actions 슬롯 | 탭 목록 우측 영역에 Button 등 외부 컨텐츠 배치 가능 |

---

### 2. 영역 구성 (Area Map)

```
tab (TabsRoot)
└── tab__header (position: relative 래퍼)
    ├── tab__list (TabsList, overflow-x: auto)
    │   └── tab__trigger (TabsTrigger × items.length)   ← 필수
    │       ├── tab__label                               ← 필수 (탭 텍스트)
    │       └── tab__badge                               ← 조건부 (badge prop 있을 때만)
    └── tab__actions                                     ← 조건부 ($slots.actions 있을 때만)
        └── <slot name="actions" />                      ← Button 등 외부 컨텐츠
```

- `tab__badge`: badge prop이 있을 때만 렌더링. 의미 있는 텍스트이므로 `aria-hidden` 미적용.
- `tab__actions`: `$slots.actions`가 존재할 때만 렌더링. 스크롤 영역 밖 고정 배치.

---

### 2-1. Props / Slots 목록

```typescript
interface TabItem {
  value: string     // 탭 고유 식별자. v-model 연동
  label: string     // 탭 표시 텍스트
  badge?: string    // 라벨 뒤 배지 텍스트 (예: "9,999"). 포맷은 호출자가 결정
}

type TabVariant = 'underline-dark' | 'underline-primary' | 'pill' | 'pill-vertical'
```

**Props**

| 항목 | 설명 | 기본값 |
|------|------|--------|
| `variant` | 디자인 4가지 (`underline-dark` / `underline-primary` / `pill` / `pill-vertical`) | `'underline-primary'` |
| `items` | 탭 항목 배열 (`TabItem[]`) | — (필수) |
| `modelValue` | 현재 선택된 탭 value (v-model) | `items[0].value` |
| `grow` | **`underline-dark` variant에서만 사용 가능**. 켜면 탭 버튼이 리스트 너비를 균등하게 나눠 꽉 채움 (`flex: 1`). 켜면 가로 스크롤 비활성화됨 | `false` |

- `pill-vertical` 적용 시 `grow` prop 무효, `actions` 슬롯 미렌더링

**Slots**

| 이름 | 필수 | 설명 |
|------|------|------|
| `actions` | 선택 | 탭 목록 우측에 고정 배치되는 액션 슬롯. `Button` 등 외부 컨텐츠 삽입에 사용 |

> **attrs 위임**: `defineOptions({ inheritAttrs: false })` + `TabsRoot`에 `v-bind="$attrs"` 적용. `aria-label`, `aria-labelledby` 등 외부 접근성 속성을 TabsRoot에 전달 가능.

---

### 2-2. Props 설계 원칙 — 중복 제어 제거

| 안티패턴 | 원칙 | 올바른 방향 |
|---------|------|-----------|
| `activeIndex: number` | value 기반 식별이 더 명확 | `modelValue: string` (value로 탭 식별) |
| `defaultValue` 별도 제공 | v-model 하나로 제어 통일 | `modelValue`의 `withDefaults` 기본값으로 처리 |
| `showViewToggle: boolean` | 뷰 토글류 기능은 독립 컴포넌트로 분리 | `#actions` 슬롯에 외부 컴포넌트 삽입 |

---

### 3. Variant 목록

| variant | Figma 이름 | 높이 | 주요 사용처 | 스크롤 |
|---------|----------|------|-----------|--------|
| `underline-dark` | 상세_depth | 52px | 상품 상세 탭 (상품설명/리뷰/배송안내/문의) | ✅ |
| `underline-primary` | Tap_1depth | 48px | 카테고리 메뉴 탭 (전체/프로모션/…) | ✅ |
| `pill` | Tap_2depth | 36px | 정렬/필터 탭 (최신순/판매순/…) | ✅ |
| `pill-vertical` | 03_Tap(체험팩) | 41px (py 1.2rem) | 세로 질문형 선택 탭 (체험팩 추천 등) | ❌ 없음 |

**4종 variant 시각 규칙**

| 항목 | underline-dark | underline-primary | pill | pill-vertical |
|------|---------------|------------------|------|---------------|
| Active 배경 | — | — | `$color-primary-hover` | `$color-primary-hover` |
| Active 인디케이터 | `$text-800` 하단 2px | `$color-primary` 하단 2px | — | — |
| Active 텍스트 | `$text-800` | `$text-800` | `$text-white` | `$text-white` |
| Active 폰트 굵기 | Medium(500) | Bold(700) | Medium(500) | Bold(700) |
| Active 테두리 | — | — | — | 없음 |
| Inactive 텍스트 | `$text-400` | `$text-700` | `$text-700` | `$text-800` |
| Inactive 폰트 굵기 | Medium(500) | Regular(400) | Regular(400) | Medium(500) |
| Inactive 배경 | — | — | `$bg-tertiary` | `$bg-primary` |
| Inactive 테두리 | — | — | — | 1px solid `$line-200` |
| 폰트 크기 | 15px | 14px | 14px | 14px (`$font-size-body4`) |
| border-radius | — | — | `$radius-full` | `$radius-full` |

---

### 4. 상태(State) 정의

**TabsTrigger 상태**

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| default (inactive) | Variant별 비활성 스타일 | 클릭 시 해당 탭 활성화 |
| active | Variant별 활성 스타일 (인디케이터 또는 배경 변경) | 선택 상태 유지 |
| hover | 텍스트 색 진하게 | — |
| focus-visible | 포커스 링 표시 | 키보드 탐색 중 |

---

### 5. 동작 규칙

**탭 전환**
- `TabsTrigger` 클릭 시 해당 탭의 `value`를 `update:modelValue`로 emit
- Radix Vue가 `aria-selected`, 키보드 탐색(좌우 방향키)을 자동 처리
- 동일 탭 재클릭 시 아무 변화 없음 (Radix Vue 기본 동작)

**가로 스크롤 — 3가지 variant 공통**
- 탭 목록이 컨테이너 너비를 초과하면 자동으로 가로 스크롤 활성화
- PC(비터치): 하단 네이티브 스크롤바 표시 — `@media (hover: hover)` 기본 유지
- 모바일(터치): 스크롤바 숨김, 손가락 스와이프로 이동 — `@media (hover: none)` 에서 `scrollbar-width: none`

```scss
.#{$b}__list {
  overflow-x: auto;
  white-space: nowrap;

  @media (hover: none) {
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
  }
}
```

**grow 모드 — `underline-dark` 전용, 스크롤과 상호 배타**
- `grow` prop은 `variant="underline-dark"`일 때만 유효하다. 다른 variant에서 `grow: true`를 전달하면 무시된다
- `grow: true`이면 각 `TabsTrigger`에 `flex: 1`이 적용되어 탭 버튼이 리스트 너비를 균등하게 나눠 채움
- `grow: true`이면 탭 항목이 리스트를 초과할 수 없으므로 가로 스크롤은 비활성화
- `grow: false`(기본)이면 기존 스크롤 동작 그대로 유지

**actions 슬롯**
- `$slots.actions`가 있을 때만 `.tab__actions` 래퍼를 렌더링 (스크롤 영역 밖 고정 배치)
- `<Button>` 등 어떤 컨텐츠도 삽입 가능

**badge 표시**
- `badge` prop이 있으면 라벨 뒤에 공백 없이 이어서 렌더링: `label + badge`
- 예: `label="리뷰"`, `badge="(9,999)"` → 렌더링: `리뷰(9,999)`
- 포맷(괄호 포함 여부 등)은 호출자가 결정해서 문자열로 전달

**pill-vertical 모드**
- `tab__list`가 `flex-direction: column; align-items: flex-start`로 세로 정렬됨
- 가로 스크롤 없음 (`overflow-x: visible`)
- `tab__header` 좌우 padding: 0 (외부 컨테이너가 여백을 담당)
- 트리거 너비: 콘텐츠 맞춤 (`width: auto`, `flex-shrink: 0`)
- `grow` prop 무효, `actions` 슬롯 미렌더링
- Radix Vue `TabsRoot`에 `orientation="vertical"` 내부 자동 주입 — 키보드 위/아래 방향키로 탭 이동

**Navigation only**
- `TabsContent` 미사용. 콘텐츠 패널은 부모가 `v-if` / `v-else-if`로 전환
- `aria-controls` 연결이 없어 ARIA tabpanel 패턴은 부분 적용됨 (키보드 탐색·`aria-selected`는 Radix Vue 자동 처리)

---

### 6. 이벤트 목록

| 이벤트 | 발생 시점 | 전달 정보 |
|--------|---------|---------|
| `update:modelValue` | 탭 클릭 시 | 선택된 탭의 `value` (string) |

---

### 7. 접근성 요구사항

**Radix Vue가 자동으로 처리하는 항목**

| 항목 | 처리 방식 |
|------|---------|
| `role="tablist"` | TabsList에 자동 적용 |
| `role="tab"` | 각 TabsTrigger에 자동 적용 |
| `aria-selected` | 선택된 탭에 `true`, 나머지 `false` 자동 갱신 |
| 키보드 탐색 | 좌우 방향키로 탭 간 이동, Home/End 지원 내장 |
| `data-state="active"` | 선택된 탭에 자동 적용 (CSS 훅 제공) |

**퍼블리셔가 직접 처리해야 하는 항목**

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| 포커스 표시 | 키보드 포커스 시 | `:focus-visible` 외곽선 표시, `outline: none` 단독 사용 금지 |
| 외부 레이블 연결 | 필요 시 | `aria-label` 또는 `aria-labelledby`를 `$attrs`로 TabsRoot에 전달 |
| `TabsContent` 미사용 | Navigation only | `aria-controls` 미연결 상태 허용. 보조기기는 `aria-selected`로 탭 상태 파악 가능 |

---

### 8. 디자인 토큰 참고

#### underline-dark (상세_depth, 노드: 40004019:2417)

| 적용 위치 | Figma 색상값 | 매핑 토큰 |
|----------|------------|---------|
| 전체 하단 border | `#dddddd` | `$line-200` |
| Active 하단 인디케이터 | `#333333` | `$text-800` |
| Active 텍스트 | `#333333` | `$text-800` |
| Inactive 텍스트 | `#838b92` | `$text-400` |

| 속성 | Figma 수치 | rem 값 |
|------|----------|-------|
| 컨테이너 높이 | 52px | 5.2rem |
| 탭 상하 패딩 | 15px | 1.5rem |
| 탭 좌우 패딩 | 11px | 1.1rem |
| 하단 border 두께 | 1px | 1px (고정) |
| Active 인디케이터 두께 | 2px | 2px (고정) |
| 폰트 크기 | 15px | `$font-size-body2` |
| 폰트 굵기 (공통) | Medium(500) | `$font-weight-medium` |

#### underline-primary (Tap_1depth, 노드: 40004010:2337)

| 적용 위치 | Figma 색상값 | 매핑 토큰 |
|----------|------------|---------|
| 전체 하단 border | `#dddddd` | `$line-200` |
| Active 하단 인디케이터 | `#0cb5e2` | `$color-primary` |
| Active 텍스트 | `#333333` | `$text-800` |
| Inactive 텍스트 | `#535e66` | `$text-700` |

| 속성 | Figma 수치 | rem 값 |
|------|----------|-------|
| 컨테이너 높이 | 48px | 4.8rem |
| 컨테이너 좌우 패딩 | 16px | `$spacing-md` |
| 탭 간격 (gap) | 26px | 2.6rem |
| 탭 상단 패딩 | 16px | 1.6rem |
| 탭 하단 패딩 | 17px | 1.7rem |
| 하단 border 두께 | 1px | 1px (고정) |
| Active 인디케이터 두께 | 2px | 2px (고정) |
| Active 폰트 크기 | 14px | `$font-size-body4` |
| Active 폰트 굵기 | Bold(700) | `$font-weight-bold` |
| Inactive 폰트 크기 | 14px | `$font-size-body4` |
| Inactive 폰트 굵기 | Regular(400) | `$font-weight-regular` |

#### pill-vertical (03_Tap 체험팩, 노드: 40005066:2374)

| 적용 위치 | Figma 색상값 | 매핑 토큰 |
|----------|------------|---------|
| Active 배경 | `#00A1CE` | `$color-primary-hover` |
| Active 텍스트 | `#ffffff` | `$text-white` |
| Inactive 배경 | `#ffffff` | `$bg-primary` |
| Inactive 텍스트 | `#333333` | `$text-800` |
| Inactive 테두리 | `#dddddd` | `$line-200` |

| 속성 | Figma 수치 | rem / 토큰 값 |
|------|----------|------------|
| 컨테이너 헤더 패딩 | 0 | 0 |
| 탭 상하 패딩 | 12px | 1.2rem |
| 탭 좌우 패딩 | 14px | 1.4rem |
| 탭 간격 (세로 gap) | 8px | `$spacing-sm` |
| border-radius | ~30px | `$radius-full` |
| 폰트 크기 | 14px | `$font-size-body4` |
| Active 폰트 굵기 | Bold(700) | `$font-weight-bold` |
| Inactive 폰트 굵기 | Medium(500) | `$font-weight-medium` |

#### pill (Tap_2depth, 노드: 40004010:2348)

| 적용 위치 | Figma 색상값 | 매핑 토큰 |
|----------|------------|---------|
| Active 배경 | `#00addb` | `$color-primary-hover` ⚠️ (primary가 아닌 primary-hover) |
| Active 텍스트 | `#ffffff` | `$text-white` |
| Inactive 배경 | `#f5f5f5` | `$bg-tertiary` |
| Inactive 텍스트 | `#535e66` | `$text-700` |

| 속성 | Figma 수치 | rem 값 |
|------|----------|-------|
| 컨테이너 높이 | 36px | 3.6rem |
| 컨테이너 좌우 패딩 | 16px | `$spacing-md` |
| 탭 간격 (gap) | 8px | `$spacing-sm` |
| 탭 상하 패딩 (active) | 8px | 0.8rem |
| 탭 상하 패딩 (inactive) | 9px | 0.9rem |
| 탭 좌우 패딩 | 15px | 1.5rem |
| border-radius | 20px | `$radius-full` |
| 폰트 크기 | 14px | `$font-size-body4` |
| Active 폰트 굵기 | Medium(500) | `$font-weight-medium` |
| Inactive 폰트 굵기 | Regular(400) | `$font-weight-regular` |

---

### 9. Radix Vue 구성요소 사용 목록

`TabsRoot` / `TabsList` / `TabsTrigger`

> `TabsContent` 미사용 — Navigation only 설계.

⚠️ Radix Vue 래핑 패턴 적용. `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"`를 `TabsRoot`에 위임.

`pill-vertical` variant 사용 시 `TabsRoot`에 `orientation="vertical"` 컴포넌트 내부 자동 주입. 미전달 시 기본값 `"horizontal"`(좌우 방향키)로 동작하므로, 세로 탭에서 방향키 탐색 정합성을 위해 자동 설정한다.

---

### 확정된 디자인 결정

| 항목 | 확정 내용 |
|------|---------|
| Navigation only | `TabsContent` 미사용. 콘텐츠 전환은 부모 `v-if` 담당 |
| badge 타입 | `string` 단일. 포맷(괄호 등)은 호출자가 결정해서 전달 |
| 가로 스크롤 | 3가지 variant 모두 적용. PC: 스크롤바 표시 / 모바일: 스크롤바 숨김 |
| pill active 색상 | `$color-primary-hover` (#00addb) — `$color-primary` (#0cb5e2) 아님 |
| actions 슬롯 | `$slots.actions` 조건부 래퍼. Button 등 외부 컴포넌트를 탭 우측에 배치 |
| grow | `underline-dark` variant 전용. `grow: true`이면 flex: 1로 탭 버튼 균등 분배. 스크롤과 상호 배타 — 동시 사용 불가 |
| `pill-vertical` variant | 세로 정렬 탭. `flex-direction: column`. 가로 스크롤 없음. 헤더 패딩 0. `orientation="vertical"` 내부 자동 주입. `grow`, `actions` 슬롯 무효 |
