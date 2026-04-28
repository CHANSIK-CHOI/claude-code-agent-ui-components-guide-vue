# Tab 컴포넌트 명세

> Figma 노드:
> - underline-dark: `40004019:2417` (상세_depth)
> - underline-primary: `40004010:2337` (Tap_1depth)
> - pill: `40004010:2348` (Tap_2depth)
>
> (fileKey는 `.claude/CLAUDE.md` "프로젝트 외부 리소스 → Figma" 단일 출처 참조)

---

### 0. Atomic 계층 & 파일 배치

- **계층**: organisms — Radix Vue 래핑 + 독립 탐색 UI 블록
- **배치 경로**: `components/organisms/Tab.vue`
- **barrel**: `components/organisms/index.ts`에 `export { default as Tab } from './Tab.vue'` 추가

계층 판단 근거: 외부 라이브러리(Radix Vue Tabs)를 래핑하고 복잡한 탐색 상태를 관리하는 독립 UI 블록. Select가 atoms인 것과 달리 Tab은 여러 인터랙티브 요소(TabsTrigger × N, 뷰 토글 버튼)를 조합하므로 organisms로 분류.

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

**기능 분류**

| 기능 | 설명 |
|------|------|
| 기본 tablist | 탭 목록 렌더링 + 선택 상태 v-model |
| 뷰 토글 (pill 전용) | `showViewToggle=true` 시 우측에 격자/목록 전환 버튼 표시 |

---

### 2. 영역 구성 (Area Map)

```
tab (TabsRoot)
└── tab__header (position: relative 래퍼)
    ├── tab__list (TabsList, overflow-x: auto)
    │   └── tab__trigger (TabsTrigger × items.length)   ← 필수
    │       ├── tab__label                               ← 필수 (탭 텍스트)
    │       └── tab__badge                               ← 조건부 (badge prop 있을 때만)
    └── tab__view-toggle                                 ← 조건부 (showViewToggle=true, pill 전용)
        └── tab__view-btn (단일 버튼: viewType='grid'이면 목록 아이콘, 'list'이면 격자 아이콘)
```

- `tab__badge`: badge prop이 있을 때만 렌더링. 의미 있는 텍스트이므로 `aria-hidden` 미적용.
- `tab__view-toggle`: `showViewToggle=true`이고 `variant="pill"`일 때만 렌더링.

---

### 2-1. Props 목록

```typescript
interface TabItem {
  value: string     // 탭 고유 식별자. v-model 연동
  label: string     // 탭 표시 텍스트
  badge?: string    // 라벨 뒤 배지 텍스트 (예: "9,999"). 포맷은 호출자가 결정
}

type TabVariant = 'underline-dark' | 'underline-primary' | 'pill'
type ViewType = 'grid' | 'list'
```

| 항목 | 설명 | 기본값 |
|------|------|--------|
| `variant` | 디자인 3가지 (`underline-dark` / `underline-primary` / `pill`) | `'underline-primary'` |
| `items` | 탭 항목 배열 (`TabItem[]`) | — (필수) |
| `modelValue` | 현재 선택된 탭 value (v-model) | `items[0].value` |
| `showViewToggle` | 격자/목록 전환 버튼 표시 여부. `variant="pill"` 전용 | `false` |
| `viewType` | 현재 뷰 타입 (`'grid'` / `'list'`) (v-model:viewType) | `'grid'` |

> **attrs 위임**: `defineOptions({ inheritAttrs: false })` + `TabsRoot`에 `v-bind="$attrs"` 적용. `aria-label`, `aria-labelledby` 등 외부 접근성 속성을 TabsRoot에 전달 가능.

---

### 2-2. Props 설계 원칙 — 중복 제어 제거

| 안티패턴 | 원칙 | 올바른 방향 |
|---------|------|-----------|
| `activeIndex: number` | value 기반 식별이 더 명확 | `modelValue: string` (value로 탭 식별) |
| `defaultValue` 별도 제공 | v-model 하나로 제어 통일 | `modelValue`의 `withDefaults` 기본값으로 처리 |
| `isGridView: boolean` | viewType 한 prop으로 통합 | `viewType: 'grid' \| 'list'` |
| `showViewToggle` + `pill` 이외 variant | pill 이외에서는 동작하지 않음 | 명세에서 pill 전용임을 명시. 타 variant에서는 무시 |

---

### 3. Variant 목록

| variant | Figma 이름 | 높이 | 주요 사용처 | 스크롤 |
|---------|----------|------|-----------|--------|
| `underline-dark` | 상세_depth | 52px | 상품 상세 탭 (상품설명/리뷰/배송안내/문의) | ✅ |
| `underline-primary` | Tap_1depth | 48px | 카테고리 메뉴 탭 (전체/프로모션/…) | ✅ |
| `pill` | Tap_2depth | 36px | 정렬/필터 탭 (최신순/판매순/…) | ✅ |

**3종 variant 시각 규칙**

| 항목 | underline-dark | underline-primary | pill |
|------|---------------|------------------|------|
| Active 배경 | — | — | `$color-primary-hover` |
| Active 인디케이터 | `$text-800` 하단 2px | `$color-primary` 하단 2px | — |
| Active 텍스트 | `$text-800` | `$text-800` | 흰색 |
| Active 폰트 굵기 | Medium(500) | Bold(700) | Medium(500) |
| Inactive 텍스트 | `$text-400` | `$text-700` | `$text-700` |
| Inactive 폰트 굵기 | Medium(500) | Regular(400) | Regular(400) |
| Inactive 배경 | — | — | `$bg-tertiary` |
| 폰트 크기 | 15px | 14px | 14px |
| border-radius | — | — | `$radius-full` (pill) |

---

### 4. 상태(State) 정의

**TabsTrigger 상태**

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| default (inactive) | Variant별 비활성 스타일 | 클릭 시 해당 탭 활성화 |
| active | Variant별 활성 스타일 (인디케이터 또는 배경 변경) | 선택 상태 유지 |
| hover | 텍스트 색 진하게 | — |
| focus-visible | 포커스 링 표시 | 키보드 탐색 중 |

**뷰 토글 버튼 상태** (`showViewToggle=true` 시)

| 상태 | 시각적 변화 | 기능적 변화 |
|------|-----------|-----------|
| 표시 중 (단일 버튼) | 아이콘 색 `$text-900` | 클릭 시 반대 viewType으로 전환 |

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

**뷰 토글** (`showViewToggle=true`, `pill` 전용)
- 탭 목록 우측에 단일 버튼으로 고정 배치 (스크롤 영역 밖)
- `viewType === 'grid'`이면 "목록 보기" 버튼(list 아이콘)만 표시 → 클릭 시 `update:viewType` emit with `'list'`
- `viewType === 'list'`이면 "격자 보기" 버튼(grid 아이콘)만 표시 → 클릭 시 `update:viewType` emit with `'grid'`
- 버튼은 항상 `$text-900` 단일 색상 (active/inactive 구분 없음)

**badge 표시**
- `badge` prop이 있으면 라벨 뒤에 공백 없이 이어서 렌더링: `label + badge`
- 예: `label="리뷰"`, `badge="(9,999)"` → 렌더링: `리뷰(9,999)`
- 포맷(괄호 포함 여부 등)은 호출자가 결정해서 문자열로 전달

**Navigation only**
- `TabsContent` 미사용. 콘텐츠 패널은 부모가 `v-if` / `v-else-if`로 전환
- `aria-controls` 연결이 없어 ARIA tabpanel 패턴은 부분 적용됨 (키보드 탐색·`aria-selected`는 Radix Vue 자동 처리)

---

### 6. 이벤트 목록

| 이벤트 | 발생 시점 | 전달 정보 |
|--------|---------|---------|
| `update:modelValue` | 탭 클릭 시 | 선택된 탭의 `value` (string) |
| `update:viewType` | 뷰 토글 버튼 클릭 시 | `'grid'` 또는 `'list'` |

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
| 뷰 토글 레이블 | `showViewToggle=true` | 표시 중인 단일 버튼에 `aria-label="목록 보기"` 또는 `aria-label="격자 보기"` 적용 (aria-pressed 제거) |
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

#### 뷰 토글 버튼 아이콘 색상

| 상태 | 색상값 | 매핑 토큰 |
|------|-------|---------|
| 표시 중 | `#333333` (추정) | `$text-900` |

#### 뷰 토글 SVG 아이콘

**격자 보기 (Grid)**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <rect width="24" height="24" fill="white"/>
  <rect x="5.2" y="5.2" width="5.45019" height="5.56501" rx="1.3" stroke="currentColor" stroke-width="1.4"/>
  <rect x="13.3499" y="5.2" width="5.45019" height="5.56501" rx="1.3" stroke="currentColor" stroke-width="1.4"/>
  <rect x="13.3499" y="13.2366" width="5.45019" height="5.56501" rx="1.3" stroke="currentColor" stroke-width="1.4"/>
  <rect x="5.2" y="13.2367" width="5.45019" height="5.56501" rx="1.3" stroke="currentColor" stroke-width="1.4"/>
</svg>
```

**목록 보기 (List)**
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <rect width="24" height="24" fill="white"/>
  <path d="M19 7L10.5 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M7.5 7L5 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M19 12L10.5 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M7.5 12L5 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M19 17L10.5 17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
  <path d="M7.5 17L5 17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
</svg>
```

> SVG stroke 색상은 하드코딩 대신 `currentColor`로 교체. 부모 요소의 `color` 속성으로 제어.

---

### 9. Radix Vue 구성요소 사용 목록

`TabsRoot` / `TabsList` / `TabsTrigger`

> `TabsContent` 미사용 — Navigation only 설계.

⚠️ Radix Vue 래핑 패턴 적용. `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"`를 `TabsRoot`에 위임.

---

### 확정된 디자인 결정

| 항목 | 확정 내용 |
|------|---------|
| Navigation only | `TabsContent` 미사용. 콘텐츠 전환은 부모 `v-if` 담당 |
| badge 타입 | `string` 단일. 포맷(괄호 등)은 호출자가 결정해서 전달 |
| 가로 스크롤 | 3가지 variant 모두 적용. PC: 스크롤바 표시 / 모바일: 스크롤바 숨김 |
| pill active 색상 | `$color-primary-hover` (#00addb) — `$color-primary` (#0cb5e2) 아님 |
| showViewToggle 동작 범위 | `pill` variant 전용. 타 variant에서는 렌더링하지 않음 |
| viewToggle 렌더링 방식 | `v-if`/`v-else`로 단일 버튼 렌더링. 현재 viewType의 반대 상태 버튼만 DOM에 존재 |
| SVG currentColor | 뷰 토글 아이콘 stroke를 `currentColor`로 교체하여 CSS color로 색상 제어 |
