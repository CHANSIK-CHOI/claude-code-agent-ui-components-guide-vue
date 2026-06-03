# Accordion 컴포넌트 명세

---

## 0. Atomic 계층 & 파일 배치

- **계층**: molecules
- **파일 (단일)**:
  - `components/molecules/Accordion.vue` — dual script block 구조
    - `<script lang="ts">` 블록: `AccordionItem`, `AccordionTrigger`, `AccordionContent` plain object named exports
    - `<script setup lang="ts">` 블록: AccordionRoot 래핑 로직 (rootAttrs 분리, emit)
  - 이유: Vue 3.4 + Nuxt 3.10 SSR 환경에서 `v-for` 루프 변수가 별도 SFC 슬롯 경계를 넘어 전파되지 않는 문제로 단일 파일 패턴 채택 (Collapsible.vue와 동일)
- **Barrel export**: `components/molecules/index.ts` — `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` 4개 모두 named export
- **라이브러리**: Radix Vue `AccordionRoot`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` (Stable)

---

## 1. 컴포넌트 개요

여러 개의 접힘/펼침 패널을 그룹으로 관리하는 아코디언 컴포넌트. `type="single"`로 하나만 열리도록 강제하거나 `type="multiple"`로 여러 패널을 동시에 열 수 있다.

`Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent` 4개 컴포넌트를 개별 import해서 사용처에서 구조를 자유롭게 조합할 수 있다. Radix Vue 원본 패턴과 동일한 사용 방식이며, 컴포넌트 내부는 슬라이드 애니메이션만 담당하고 시각적 스타일(색상, border, 패딩 등)은 사용처에서 결정한다.

---

## 2. 영역 구성 (Area Map)

```
Accordion                             ← AccordionRoot 래핑
└── AccordionItem (:value="...")      ← AccordionItem 래핑, value 필수
    ├── AccordionTrigger              ← AccordionTrigger 래핑, AccordionItem context 자동 inject
    │     트리거 내용 (slot)
    └── AccordionContent             ← AccordionContent 래핑, AccordionItem context 자동 inject
          콘텐츠 내용 (slot)
```

- **Accordion** — AccordionRoot를 래핑. type/collapsible/disabled 등 Root attrs 위임 전략 동일 유지. default slot으로 AccordionItem 컴포넌트를 받는다.
- **AccordionItem** — AccordionItem을 래핑. `value` prop(필수), `disabled` prop. default slot으로 AccordionTrigger와 AccordionContent를 받는다.
- **AccordionTrigger** — AccordionTrigger를 래핑. `headTrigger` prop 추가. AccordionItem이 조상에 있으면 context 자동 inject.
  - `headTrigger: false`(기본): 우측 아이콘 버튼 패턴. 슬롯이 비어있으면 `<Icon size="sm"><SmallChevronDownSvg /></Icon>`이 기본 렌더되고, open/close 시 해당 아이콘이 회전한다. 슬롯에 커스텀 내용을 넣으면 그것으로 대체된다.
  - `headTrigger: true`: 아코디언 헤드 전체가 트리거인 패턴. 슬롯에 헤드 콘텐츠 전체를 넣고, 아이콘 없음, 회전 애니메이션 적용 안 함.
- **AccordionContent** — AccordionContent를 래핑. `contentAnimation` prop 유지. AccordionItem이 조상에 있으면 context 자동 inject.
- **AccordionHeader**: 제외 (사용처에서 heading 구조 자유 결정)

**AccordionItem context 공유 원리**: Radix Vue는 AccordionTrigger·AccordionContent가 가장 가까운 조상 AccordionItem에서 provide/inject로 context를 주입받는다. AccordionItem 안에 AccordionTrigger와 AccordionContent를 배치하면 두 컴포넌트가 동일한 context를 공유하여 정상 연동된다.

---

## 3. Props

### Accordion (Root) Props

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `type` | `'single' \| 'multiple'` | `'single'` | 단일/다중 열림 모드 (rootAttrs 위임) |
| `value` | `string \| string[]` | — | 현재 열린 아이템 값 (`v-model:value`, rootAttrs 위임) |
| `defaultValue` | `string \| string[]` | — | 초기 열린 아이템 (비제어 모드, rootAttrs 위임) |
| `collapsible` | `boolean` | `false` | single 모드에서 재클릭으로 닫기 허용 (rootAttrs 위임) |
| `disabled` | `boolean` | `false` | 전체 아코디언 비활성 (rootAttrs 위임) |
| `dir` | `'ltr' \| 'rtl'` | `'ltr'` | 텍스트 방향 (rootAttrs 위임) |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | 아코디언 방향 (rootAttrs 위임) |

> Root attrs 위임 전략(`ACCORDION_ROOT_PROPS` 분리) 유지. 나머지 attrs(`aria-*`, `tabindex`, `data-*`)는 **AccordionTrigger**가 `$attrs`로 직접 수신한다.

### AccordionItem Props

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `value` | `string` | 필수 | 이 아이템의 식별값. AccordionItem의 `value` prop으로 연결 |
| `disabled` | `boolean` | `false` | 이 아이템만 비활성 (Root의 `disabled`와 독립) |

### AccordionTrigger Props

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `headTrigger` | `boolean` | `false` | `true`이면 헤드 전체 트리거 패턴 — 아이콘 없음, 회전 애니메이션 적용 안 함. `false`이면 우측 아이콘 버튼 패턴 — 슬롯이 비면 기본 `<Icon size="sm"><SmallChevronDownSvg /></Icon>`이 렌더되고 open/close 시 회전. 슬롯에 커스텀 내용을 넣으면 대체됨 |

> `$attrs`는 Radix Vue `AccordionTrigger`에 `v-bind="$attrs"`(`triggerAttrs`)로 위임된다. `aria-*`, `tabindex`, `data-*` 등 인터랙티브 attrs 전달 가능.

### AccordionContent Props

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `contentAnimation` | `boolean` | `true` | Content 슬라이드 애니메이션 on/off |

> attrs 위임 경로 변경 요약: 기존에는 Accordion(Root)이 triggerAttrs를 `provide`로 내려보냈으나, 변경 후 AccordionTrigger가 자체적으로 `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"`로 직접 수신한다. `provide('accordion:ctx')` 패턴은 더 이상 필요 없다.

---

## 4. 이벤트

| 이벤트 | 타입 | 설명 |
|--------|------|------|
| `update:modelValue` | `string \| string[]` | 열린 아이템 변경 시 |
| `update:value` | `string \| string[]` | `v-model:value` 사용 시 필수. `update:modelValue`와 동시 emit |

> **중요**: AccordionRoot가 실제로 emit하는 이벤트명은 `update:modelValue`. 사용처에서 `v-model:value`로 바인딩할 경우 `update:value`도 동시에 필요하므로 두 이벤트를 함께 emit한다. (`@update:modelValue="emit('update:modelValue', $event); emit('update:value', $event)"`)

---

## 5. Variant

Accordion 자체는 시각적 Variant 없음. 모든 시각 처리는 사용처에서 결정.

**type 축** (기능적 모드)

| type | 설명 |
|------|------|
| `"single"` | 한 번에 하나의 아이템만 열림 (기본값) |
| `"multiple"` | 여러 아이템 동시 열림 허용 |

---

## 6. 상태 정의

### Item 레벨 (AccordionItem, data-state 속성)

| 상태 | data-state | 설명 |
|------|-----------|------|
| 닫힘 | `closed` | Content 숨김. `headTrigger: false`일 때 우측 아이콘 버튼 180deg 회전 |
| 열림 | `open` | Content 슬라이드 다운. `headTrigger: false`일 때 우측 아이콘 버튼 0deg 복귀 |
| 비활성 | — | AccordionItem `disabled` → Trigger 클릭 차단 |

---

## 7. 동작 규칙

- `type="single"` + `collapsible: false` → 열린 아이템 재클릭 시 닫히지 않음
- `type="single"` + `collapsible: true` → 열린 아이템 재클릭 시 닫힘 (모두 닫힌 상태 허용)
- `type="multiple"` → 아이템 개별 독립 토글
- Root `disabled` 시 모든 Trigger 클릭 차단
- AccordionItem `disabled` 시 해당 아이템만 비활성 (Trigger + Content 모두)
- `contentAnimation: true` → Content에 `accordion__content--animated` 클래스 적용 (변경 없음)
- `headTrigger: false`(기본) → AccordionTrigger에 `accordion__trigger--icon` 클래스 적용. 슬롯이 비어있으면 `<Icon size="sm"><SmallChevronDownSvg /></Icon>`을 기본 폴백으로 렌더. open/close 시 아이콘 회전
- `headTrigger: true` → AccordionTrigger에 `accordion__trigger--head` 클래스 적용. 슬롯 콘텐츠를 그대로 렌더. 회전 애니메이션 없음.
- 애니메이션은 `--radix-accordion-content-height` CSS 변수 사용

---

## 8. 애니메이션 스타일 (내부 담당)

| 클래스 | 조건 | 효과 |
|--------|------|------|
| `accordion__content--animated` | `contentAnimation: true` | height 슬라이드 (open ↔ closed) |
| `accordion__trigger--icon`     | `headTrigger: false` (기본) | 우측 아이콘 버튼 회전 (180deg ↔ 0deg). `:deep(.accordion__trigger--icon[data-state='closed']) > *` 타겟 |
| `accordion__trigger--head`     | `headTrigger: true` | 헤드 전체 트리거. 회전 애니메이션 없음 |

토큰: `$duration-fast`

---

## 9. 접근성 요구사항

Radix Vue AccordionRoot가 WAI-ARIA Accordion 패턴 내장 지원:

| 항목 | 요구사항 |
|------|---------|
| 키보드 탐색 | Tab으로 Trigger 간 이동, Enter/Space로 토글 |
| 화살표 키 | `orientation="vertical"`: 위/아래 화살표 키로 Trigger 간 이동 (Radix 내장) |
| 비활성 알림 | Radix가 `aria-disabled` 자동 처리 |
| 열림/닫힘 알림 | Radix가 `aria-expanded`, `aria-controls`, `aria-labelledby` 자동 처리 |
| 포커스 스타일 | 사용처에서 `focus-visible` 스타일 제공 |

---

## 10. 사용 예시

```vue
<!-- single 모드 -->
<Accordion v-model:value="openItem" type="single" collapsible>
  <AccordionItem
    v-for="faqItem in faqItems"
    :key="faqItem.value"
    :value="faqItem.value"
  >
    <div class="faq__item">
      <AccordionTrigger>{{ faqItem.label }}</AccordionTrigger>
      <AccordionContent>{{ faqItem.body }}</AccordionContent>
    </div>
  </AccordionItem>
</Accordion>

<!-- Item disabled 개별 제어 -->
<Accordion type="single">
  <AccordionItem value="item-1">
    <AccordionTrigger>열 수 있는 항목</AccordionTrigger>
    <AccordionContent>내용</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2" disabled>
    <AccordionTrigger>비활성 항목</AccordionTrigger>
    <AccordionContent>내용</AccordionContent>
  </AccordionItem>
</Accordion>

<!-- 기본 패턴 — 우측 아이콘 버튼 자동 렌더, open/close 회전 애니메이션 -->
<Accordion v-model:value="openItem" type="single" collapsible>
  <AccordionItem v-for="item in items" :key="item.value" :value="item.value">
    <div class="faq__item">
      <AccordionTrigger><!-- 슬롯 비워도 됨: 기본 아이콘 자동 렌더 --></AccordionTrigger>
      <AccordionContent>{{ item.body }}</AccordionContent>
    </div>
  </AccordionItem>
</Accordion>

<!-- headTrigger 패턴 — 헤드 전체가 트리거, 아이콘 없음, 회전 없음 -->
<Accordion type="single">
  <AccordionItem value="item-1">
    <AccordionTrigger :head-trigger="true">
      <div class="myItem__head">
        <span class="myItem__label">항목 타이틀</span>
        <span class="myItem__price">10,000원</span>
      </div>
    </AccordionTrigger>
    <AccordionContent>내용</AccordionContent>
  </AccordionItem>
</Accordion>
```

---

## 11. 디자인 토큰 매핑

내부 시각 스타일 없음 (애니메이션만).

| 속성 | 토큰 |
|------|------|
| 슬라이드 애니메이션 시간 | `$duration-fast` |
| 아이콘 회전 트랜지션 시간 | `$duration-fast` |

---

## 12. 구현 참고

### 파일 구성 (단일 파일 + dual script block)

`Accordion.vue` 단일 파일 안에 두 개의 `<script>` 블록을 병용한다.

| 블록 | 역할 |
|------|------|
| `<script lang="ts">` | `AccordionItem`, `AccordionTrigger`, `AccordionContent` plain object 컴포넌트를 named export. `h()` 렌더 함수로 Radix Vue 서브 컴포넌트를 직접 래핑. |
| `<script setup lang="ts">` | AccordionRoot 래핑. `defineOptions({ inheritAttrs: false })`, rootAttrs 분리 위임, `emit('update:modelValue', ...)` + `emit('update:value', ...)` 동시 emit. |

> **이 패턴을 선택한 이유**: Vue 3.4 + Nuxt 3.10 SSR 환경에서 별도 SFC로 분리하면 `v-for` 루프 변수가 슬롯 경계를 넘어 전파되지 않아 AccordionItem의 `:value` 바인딩이 undefined가 된다. plain object 컴포넌트는 슬롯 경계가 없어 이 문제가 발생하지 않는다. (Collapsible.vue와 동일한 패턴)

### AccordionRoot v-model 연결 (이벤트명 주의)

- AccordionRoot가 emit하는 이벤트: `update:modelValue`
- `v-model:value` 대응을 위해 `update:value`도 함께 emit 필요
- 구현: `@update:modelValue="emit('update:modelValue', $event); emit('update:value', $event)"`
- `value` prop → `modelValue` 리맵 로직: rootAttrs 계산 시 `value`만 있고 `modelValue`가 없으면 `filtered.modelValue = filtered.value; delete filtered.value`로 변환 (AccordionRoot가 `modelValue`만 인식)

### attrs 위임 구조

```ts
const ACCORDION_ROOT_PROPS = [
  'type', 'value', 'modelValue',
  'defaultValue', 'default-value',
  'collapsible', 'disabled',
  'dir', 'orientation',
] as const
const ROOT_EVENT_PROPS = ['onUpdate:modelValue', 'onUpdate:value'] as const
```

AccordionTrigger는 `provide` inject 없이 자체 `$attrs`를 직접 AccordionTrigger에 위임.

### 애니메이션 스타일 위치

- plain object 컴포넌트는 부모 SFC의 scoped 해시(`data-v-xxx`)가 내부 DOM에 전달되지 않는다.
- 따라서 `Accordion.vue`의 `<style scoped>` 안에서 `:deep()` 선택자로 Content·Trigger 클래스를 타겟해야 한다.
- AccordionTrigger.vue·AccordionContent.vue 별도 파일이 존재하지 않으므로 모든 스타일이 `Accordion.vue` 단일 파일의 `<style scoped>` 안에 집중된다.

```scss
// Accordion.vue <style scoped> 안
:deep(.#{$b}__content--animated) { overflow: hidden; }
:deep(.#{$b}__content--animated[data-state='open']) { animation: accordionSlideDown $duration-fast ease; }
:deep(.#{$b}__content--animated[data-state='closed']) { animation: accordionSlideUp $duration-fast ease; }

:deep(.#{$b}__trigger--icon[data-state='closed']) > * { transform: rotate(180deg); transition: transform $duration-fast ease; }
:deep(.#{$b}__trigger--icon[data-state='open']) > * { transform: rotate(0deg); transition: transform $duration-fast ease; }
```

### Collapsible과의 차이

| 항목 | Collapsible | Accordion |
|------|------------|-----------|
| Root | CollapsibleRoot | AccordionRoot |
| Item 개념 | 없음 | AccordionItem (별도 SFC export) |
| 슬롯 구조 | Root 슬롯 → `{ Trigger, Content }` | Root > Item > Trigger/Content (직접 중첩) |
| 이벤트 | `update:open` | `update:modelValue` |
| CSS 변수 | `--radix-collapsible-content-height` | `--radix-accordion-content-height` |
