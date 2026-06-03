---
name: Collapsible
description: 트리거 버튼으로 열고 닫히는 박스 영역 컴포넌트. Radix Vue CollapsibleRoot 래핑, Provider 패턴 설계. content/trigger 애니메이션을 내부 SCSS로 처리.
type: spec
layer: molecules
---

## 0. Atomic 계층 & 파일 배치

- **계층**: molecules
- **경로**: `components/molecules/Collapsible.vue`
- **Base/Wrapper 분리**: Base만 (슬롯 기반으로 외부 조합)

---

## 1. 컴포넌트 개요

트리거 버튼을 누르면 연결된 박스 영역이 열리고 닫히는 토글 컨테이너 컴포넌트.
슬롯 기반 headless 설계 — 컴포넌트 자체는 스타일 없음. 레이아웃·색상·간격·아이콘 회전·포커스 스타일은 모두 사용처(가이드 페이지·섹션 SCSS) 책임.

**Provider 패턴**: `<Collapsible>`이 영역 전체를 감싸는 최상위 provider 역할을 한다. React의 Context Provider처럼 `<Collapsible>` 안에서 `#trigger`·`#content` 슬롯을 원하는 위치에 분산 배치해도 올바르게 동작한다. Radix Vue CollapsibleRoot가 Context를 하위 트리 전체에 제공하므로, 어느 뎁스에 Trigger/Content가 있어도 동작한다.

현재 사용 맥락: 소비기한 상세 목록처럼 기본 행 외에 추가 정보를 접어두고 필요 시 펼쳐 보여주는 인라인 상세 노출.

---

## 2. 영역 구성 (슬롯)

| 슬롯 | 필수 | 설명 |
|------|------|------|
| 기본 슬롯 (`<slot />`) | 필수 | `<Collapsible>` 내부의 자유로운 레이아웃 마크업 전체를 담음. Provider 컨텍스트 아래 `#trigger`·`#content`를 원하는 위치에 분산 배치하는 영역 |
| `#trigger` | 선택 | 해당 위치에 `CollapsibleTrigger`로 래핑되어 렌더됨. 비워두면 기본 아이콘(`<Icon size="sm"><CircularArrowSvg /></Icon>`) 자동 렌더 |
| `#content` | 선택 | 열림 상태에서만 표시되는 박스 영역. `CollapsibleContent`로 래핑됨 |

> **구조 변경 핵심**: `<Collapsible>` 자체가 Provider(CollapsibleRoot) 역할. `#trigger`·`#content` 슬롯은 Collapsible 내부 어느 위치에 놓아도 동작. 헤더 행 레이아웃은 기본 슬롯 안에서 사용처가 직접 구성.

> **`#trigger-icon` 슬롯 폐지**: 기본 아이콘이 `<Icon size="sm"><CircularArrowSvg /></Icon>`으로 변경됨에 따라 별도 아이콘 교체 슬롯은 폐지. 커스텀 아이콘이 필요하면 `#trigger` 슬롯 내부에 직접 배치.

---

## 3. Props

명시적 props와 Radix Vue attrs 위임을 함께 사용한다.

### 명시적 Props 목록

| 항목 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `contentAnimation` | `boolean` | `true` | content 영역 height 슬라이드 애니메이션 적용 여부. `false`이면 즉시 표시/숨김 |
| `triggerAnimation` | `boolean` | `true` | `#trigger` 슬롯 콘텐츠에 아이콘 회전 애니메이션 적용 여부. 트리거 형태를 외부에서 자유롭게 커스터마이징할 경우 `false`로 끄고 사용처에서 별도 제어 |

### Attrs 위임 전략

| 단계 | 대상 컴포넌트 | 전달되는 attrs |
|------|-------------|--------------|
| 1단계 (Root 전용) | `CollapsibleRoot` | `open`, `defaultOpen`, `disabled`, `dir` |
| 2단계 (Trigger 전용) | `CollapsibleTrigger` | `aria-*`, `tabindex`, `data-*` 등 나머지 |

`v-model:open` 바인딩 지원: `open` prop + `update:open` emit.

---

## 4. 이벤트

| 이벤트 | 전달값 | 발생 시점 |
|--------|--------|---------|
| `update:open` | `boolean` | 열림/닫힘 상태 변경 시 (Radix onOpenChange 위임) |

---

## 5. 상태 정의

| 상태 | 시각적 변화 | 동작 |
|------|-----------|------|
| `closed` (default) | 콘텐츠 숨김, 아이콘 오른쪽(→) 방향 (`rotate(90deg)`) | 트리거 클릭 시 open으로 전환 |
| `open` | 콘텐츠 표시, 아이콘 위쪽(↑) 방향 (`rotate(0deg)`) | 트리거 클릭 시 closed로 전환 |

> 아이콘 회전 스타일은 컴포넌트 내부 SCSS에서 처리한다 (`triggerAnimation=true` 일 때).
> `triggerAnimation=false` 인 경우 사용처에서 트리거 형태에 맞게 별도 제어.

---

## 6. 기본 아이콘

- 컴포넌트: `<Icon size="sm"><CircularArrowSvg /></Icon>`
- `#trigger` 슬롯이 비워졌을 때(슬롯 콘텐츠 없을 때) 자동 렌더 (`$slots.trigger` 체크)
- `<Icon>` 컴포넌트가 size="sm" 기준으로 크기 제어
- closed 상태: `rotate(90deg)` — 화살표 오른쪽(→) 방향 (Figma 기준)
- open 상태: `rotate(0deg)` — 화살표 위쪽(↑) 방향 (Figma 기준)
- 회전 애니메이션(`transform transition`)은 **컴포넌트 내부 SCSS**에서 처리
- `triggerAnimation=false` 시 회전 없음 (트리거가 텍스트·복합 버튼 형태일 때)

---

## 7. 애니메이션 (컴포넌트 내부 처리)

애니메이션은 컴포넌트 내부 `<style scoped>`에서 처리한다. 사용처에서 별도 구현 불필요.

### content 애니메이션 (`contentAnimation` prop)

- **`true`(기본)**: `CollapsibleContent`에 `data-state='open'/'closed'` 기반 height 슬라이드 애니메이션 적용
  - Radix Vue가 자동 제공하는 `--radix-collapsible-content-height` CSS 변수 사용
  - open 시: `height: 0 → var(--radix-collapsible-content-height)`
  - close 시: 역방향
- **`false`**: 즉시 표시/숨김 (Radix Vue 기본 동작 유지, 애니메이션 클래스 미부여)

### trigger 애니메이션 (`triggerAnimation` prop)

- **`true`(기본)**: `CollapsibleTrigger` 영역에 `data-state` 기반 아이콘 회전 적용
  - `CollapsibleTrigger[data-state='closed']` 내부 → `rotate(90deg)` (→ 방향)
  - `CollapsibleTrigger[data-state='open']` 내부 → `rotate(0deg)` (↑ 방향)
  - `transition: transform $duration-fast ease`
- **`false`**: 회전 스타일 미적용. 트리거가 아이콘이 아닌 텍스트·복합 버튼 형태일 때 사용하고, 사용처에서 필요한 애니메이션을 직접 구현

> **사용처 SCSS 책임 삭제**: 이전 spec에서 사용처가 담당하던 content height 애니메이션 및 아이콘 회전 구현을 모두 컴포넌트 내부로 이전. 사용처는 레이아웃·색상·간격만 담당.

---

## 8. 접근성

| 항목 | 처리 주체 |
|------|---------|
| `role="button"` + `aria-expanded` | Radix CollapsibleTrigger 자동 |
| `aria-controls` (trigger → content 연결) | Radix 자동 |
| Enter / Space 키보드 토글 | Radix 자동 |
| 포커스 표시 (`focus-visible`) | **사용처 책임** (컴포넌트 내부 SCSS 없음) |
| 아이콘만 있는 트리거 시 `aria-label` | 사용처 책임 |

---

## 9. 사용 예시

> **주의**: scoped slot 변수(`Trigger`, `Content`)는 Vue 템플릿 컴파일러가 등록된 컴포넌트로 인식하지 않으므로 `<Trigger />` 형태로 직접 사용 불가. 반드시 `<component :is="Trigger" />` 패턴을 사용해야 합니다. React의 `const Comp = trigger; return <Comp />`와 동일한 패턴입니다.

### 패턴 A: Provider 패턴 — 헤더 행 전체가 Collapsible 안에 포함 (권장)

```vue
<Collapsible v-slot="{ Trigger, Content }">
  <div class="expiryHeader">
    <span>소비기한</span>
    <span>2027년 05월 13일</span>
    <div class="collapsibleArea">
      <!-- 슬롯 콘텐츠 없이 쓰면 기본 아이콘 자동 렌더 -->
      <component :is="Trigger" />
    </div>
  </div>

  <component :is="Content">
    <ul>
      <li v-for="item in items" :key="item.id">
        <span>{{ item.name }}</span>
        <span>{{ item.date }}</span>
      </li>
    </ul>
  </component>
</Collapsible>
```

### 패턴 B: Trigger에 커스텀 콘텐츠

```vue
<Collapsible v-slot="{ Trigger, Content }">
  <div class="header">
    <component :is="Trigger">
      <span>소비기한</span>
      <!-- 슬롯 콘텐츠가 있으므로 기본 아이콘 렌더 안 됨 -->
    </component>
  </div>
  <component :is="Content">...</component>
</Collapsible>
```

### 외부 제어 (controlled)

```vue
<Collapsible v-model:open="isOpen" v-slot="{ Trigger, Content }">
  <div class="row">
    <component :is="Trigger" />
    <component :is="Content">...</component>
  </div>
</Collapsible>
```

---

## 10. 컴포넌트 구조 (Radix Vue 래핑)

```
CollapsibleRoot (v-bind="rootAttrs", @update:open)  ← Provider 역할
└── slot (기본 슬롯 — 사용처가 내부 레이아웃 전체 자유 구성)
    └── ... (사용처가 배치하는 마크업)
        ├── template #trigger
        │   └── CollapsibleTrigger (v-bind="triggerAttrs")
        │       └── 슬롯 콘텐츠 OR <Icon size="sm"><CircularArrowSvg /></Icon>
        └── template #content
            └── CollapsibleContent
                └── 슬롯 콘텐츠
```

> `defineOptions({ inheritAttrs: false })` 적용 필수.
> `useAttrs()`로 rootAttrs / triggerAttrs 분리.
> 컴포넌트 내부 `<style scoped>` 블록 존재 — content height 애니메이션·트리거 아이콘 회전 처리.
> `contentAnimation` / `triggerAnimation` prop 값에 따라 조건부 적용.
> 레이아웃·색상·간격은 여전히 사용처 책임.
>
> **Vue Scoped Slot 메커니즘**: `#trigger`·`#content`는 `<Collapsible>` 컴포넌트가 렌더하지 않고 사용처 template에서 선언됨. Collapsible은 이를 각각 `CollapsibleTrigger`·`CollapsibleContent`로 래핑한 결과를 해당 위치에 삽입.

---

## 11. 가이드 페이지 예시 구성 (Figma 40004237:4497 기반)

**소비기한 행 패턴** (Provider 패턴 — 헤더 행 전체가 Collapsible 안에 포함):

```
[소비기한]  [2027년 05월 13일]  [→ circularArrow 아이콘 버튼 — CollapsibleTrigger]
                   ↓ 클릭 시 열림
  [수분크림 50ml]  [2027년 05월 13일]
  [오투부스터 미스트]       [2026년 12월 31일]
```

**Figma 토큰 매핑**

| Figma 시각값 | 용도 | 시맨틱 토큰 |
|------------|------|-----------|
| 라벨 텍스트 색상 | 회색 계열 | `$text-secondary` |
| 값 텍스트 색상 | 진한 색 | `$text-strong` |
| 라벨 폰트 | 14px Medium | `$font-size-body3` + `$font-weight-medium` |
| 값 폰트 | 14px Regular | `$font-size-body3` + `$font-weight-regular` |
| 아이콘 | size="sm", `rotate(90deg)` closed | 사용처 SCSS |
| 행 하단 여백 | ~8px | `$spacing-sm` |
