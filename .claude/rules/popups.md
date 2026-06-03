## 팝업 규칙 (단일 출처, SSOT)

본 프로젝트의 모든 팝업(레이어 팝업·바텀시트·풀 팝업·토스트·얼럿·컨펌) 작성·제어 규칙의 **단일 출처**다. `rules/components.md` 와 팝업 가이드 페이지·데모 팝업(`popups/guide/`)은 팝업 관련 사항을 본 문서로 참조한다.

> React 비교: shadcn/ui 의 Dialog 처럼 headless 동작(Radix Vue)을 base 가 제공하고, 그 base 를 얇게 래핑해 용도별 팝업을 만든다. open 상태는 부모-자식 양방향(`v-model`)으로 동기화한다.

---

### 0. 팝업의 두 종류 — 제어 방식이 다르다 (먼저 구분)

| 종류 | 컴포넌트 | 제어 방식 | open 상태 |
|------|---------|----------|----------|
| **콘텐츠 팝업** | `LayerPopup` / `BottomSheet` / `FullPopup` 래핑 래퍼 | **`defineModel('open')` + `v-model:open`** (§3) | 래퍼가 소유, 양방향 |
| **명령형 팝업** | `Toast` / `Alert` / `Confirm` | **hook 호출** — `useToastPopup()` / `useAlert()` / `useConfirm()` | 없음 (명령형 호출) |

- **콘텐츠 팝업**: 화면 단위 UI(바텀시트·풀팝업·레이어). 마크업이 있는 래퍼를 만들고 `v-model:open` 으로 연다. → 본 문서 §3~§6 의 대상.
- **명령형 팝업**: "저장되었습니다" 토스트, "삭제할까요?" 컨펌처럼 마크업 없이 호출만 하는 팝업. `const toast = useToastPopup(); toast.open({ message })` 형태. **`defineModel('open')` 대상이 아니다.** 별도 래퍼 파일을 만들지 않는다.

> **판정 한 줄**: 팝업 안에 고유 마크업(목록·폼·이미지 등)이 있으면 콘텐츠 팝업(§3), 메시지/확인만이면 명령형 팝업(hook).

---

### 1. 폴더·파일 구조

```
components/popup/    ← base 팝업 컴포넌트 + 제어 hook (barrel: @nd/components/popup)
├── Popup.vue / LayerPopup.vue / BottomSheet.vue / FullPopup.vue
├── Alert.vue / Confirm.vue / ToastPopup.vue (+ PopupRenderer / ToastRenderer)
├── PinPicker.vue / PinDatePicker.vue (vant 래핑 폼 컨트롤형 picker)
└── useAlert.ts / useConfirm.ts / useToastPopup.ts / usePopupNavigate.ts ...

popups/guide/        ← 가이드 페이지 데모용 콘텐츠 팝업 래퍼 (PascalCase + barrel index.ts)
```

- 팝업 SCSS·BEM·토큰 규칙은 `rules/style.md` 를 그대로 따른다(컴포넌트·팝업 동일).

---

### 2. 컴포넌트 계층 — base 래핑

- 콘텐츠 팝업 래퍼는 `@nd/components/popup` 의 **base 컴포넌트(`LayerPopup` / `BottomSheet` / `FullPopup`)만 래핑**해서 만든다.
- popup 카테고리는 atoms / molecules / organisms 를 자유롭게 import 할 수 있다(`rules/architecture.md`).
- **base 팝업 컴포넌트 자체(`components/popup/*`)는 데모 래퍼 작업에서 수정하지 않는다** — base 수정은 컴포넌트 작업(`/component-create` · `/component-revise`)의 영역이다. base 는 이미 `:open` + `update:open` emit 으로 `v-model:open` 을 올바르게 구현하고 있다.

---

### 3. open 제어 — `defineModel('open')` 표준 (BLOCKING) ★핵심

콘텐츠 팝업 래퍼의 열림/닫힘 상태는 **`defineModel`** 로 선언하고 base 팝업에 **`v-model:open`** 으로 연결한다. `defineModel` 의 일반 메커니즘·옵션·React 비교는 `rules/components.md` §"v-model 양방향 바인딩 — defineModel 사용" 단일 출처를 따른다. 본 절은 팝업 적용 규칙이다.

#### 3-1. 표준 패턴

```vue
<!-- 콘텐츠 팝업 래퍼 -->
<template>
  <BottomSheet v-model:open="open" title="...">
    <Button @click="open = false">닫기</Button>   <!-- 내부 닫기 = open = false -->
  </BottomSheet>
</template>

<script setup lang="ts">
  import { BottomSheet } from '@nd/components/popup'
  import { Button } from '@nd/components/atoms'

  const open = defineModel<boolean>('open', { required: true })
  // 'update:open'은 defineModel이 자동 처리 — navigate/closed 등 그 외 이벤트만 defineEmits
  // const emit = defineEmits<{ closed: [] }>()
</script>
```

```vue
<!-- 사용처(부모) — v-model:open 만 연결 -->
<template>
  <button type="button" @click="isSheetOpen = true">시트 열기</button>
  <SomeBottomSheet v-model:open="isSheetOpen" />
</template>
<script setup lang="ts">
  const isSheetOpen = ref(false)
</script>
```

- **닫기**: 내부 버튼 등으로 닫을 때 `open.value = false`(script) / `open = false`(template).
- **dim·ESC·X·취소 닫기**: base 가 `v-model:open` 으로 자동 `false` 처리 → `@close`/`@cancel` 핸들러를 따로 달지 않아도 닫힌다.
- **확인(`@ok`) 닫기**: base 는 `ok` 시 자동으로 닫지 않는다(확인 후 로직 여지). 확인 즉시 닫아야 하면 `@ok="open = false"` 를 명시한다.
- **부모 연결**: 부모는 `<Popup v-model:open="isXxxOpen" />` 로만 연결한다. dim/ESC 닫힘이 부모의 ref 까지 자동 전파된다(누락 지점 없음).

#### 3-2. 금지 패턴 (옛 패턴 — 모두 defineModel 로 전환)

다음 패턴은 모두 금지하며, 발견 시 §3-1 표준으로 전환한다.

| 금지 패턴 | 문제 | 전환 |
|-----------|------|------|
| `defineProps<{ open }>` + `defineEmits<{ 'update:open' }>` + base에 `:open` + 수동 `@update:open="emit('update:open', $event)"` | 선언된 `update:open` 이 `$attrs` 에서 제외돼, 수동 포워딩이 **한 곳만 빠져도 dim·ESC 닫힘이 끊긴다** | `defineModel('open')` + `v-model:open` |
| `defineProps<{ isOpen, isPresent }>` + `v-if="isPresent"` + `:open="isOpen"` + `@close`/`@closed` emit (부모가 `useLayerPopup`/`useFullPopup`/`useBottomSheet` 로 제어) | 외부 마운트 제어 이중화·복잡, base 와 중복 | 팝업: `defineModel('open')` + `v-model:open`, `v-if` 제거 / 부모: `ref(false)` + `v-model:open` |
| `computed localOpen` (`computed({ get: () => props.open, set: (v) => emit('update:open', v) })`) | defineModel 로 한 줄에 대체 가능 | `const open = defineModel<boolean>('open', { required: true })` |
| `defineExpose({ open: () => ... })` + 부모가 `ref?.open()` 호출 | 명령형 제어, v-model 양방향 깨짐 | 팝업: `defineModel('open')` / 부모: `ref(false)` + `v-model:open`, `ref?.open()` → `isXxxOpen = true` |

#### 3-3. `v-if` 로 외부 마운트 제어 금지

팝업 래퍼에서 base 팝업을 `v-if="isPresent"` 같은 외부 상태로 마운트/언마운트 제어하지 않는다. **base 팝업(`Popup.vue`)은 Radix Vue Presence 로 닫힘 애니메이션 재생 후 언마운트를 자체 처리**한다(`DialogRoot :open` + `@animationend` → `closed` emit). 따라서 `v-model:open` 만으로 충분하며, 외부 `v-if` 는 닫힘 애니메이션을 끊거나 이중 제어가 된다.

```vue
<!-- ❌ 금지 — 외부 v-if 마운트 제어 -->
<BottomSheet v-if="isPresent" :open="isOpen" ... />

<!-- ✅ — base 가 Presence 자체 처리 -->
<BottomSheet v-model:open="open" ... />
```

#### 3-4. base 팝업 prop 은 spec 참조

`defer-content`(무거운 콘텐츠를 열림 애니메이션 후 렌더)·`close-on-overlay`·`close-on-escape`·`show-footer`·`footer-layout`·`body-label`·`body-label-align`·`ok-label`·`cancel-label`·`cancel-color` 등 base 팝업이 제공하는 prop 은 본 문서가 아니라 base 컴포넌트 spec/가이드를 단일 출처로 참조한다: `.claude/specs/LayerPopup.md`, 가이드 페이지 `pages/guide/{bottomSheet,fullPopup,layerPopup}/index.vue`. 래퍼는 필요한 base prop 을 그대로 전달하면 된다(미선언 prop 은 `v-bind="$attrs"` 로 base 까지 흘러간다 — `rules/components.md` "네이티브 속성 위임").

#### 3-5. 팝업 제어 hook 정책

| hook | 용도 | 정책 |
|------|------|------|
| `usePopupNavigate` | 콘텐츠 팝업 내부 "닫고 닫힘 완료 후 이동"(§5) | **사용** |
| `useToastPopup` / `useAlert` / `useConfirm` | 명령형 팝업(§0) | **사용** |
| `usePopupManager` | Alert/Confirm 의 내부 큐 관리 (PopupRenderer 연동) | 직접 사용하지 않음 (useAlert/useConfirm 경유) |

> (구) `useLayerPopup`/`useFullPopup`/`useBottomSheet`/`usePopupState` 는 `v-model:open` 표준(§3-1)으로 대체되어 **프로젝트에서 제거 완료**(파일·barrel export 모두 없음). 동일 패턴의 hook 을 재작성하지 않는다.

---

### 4. 배치 규칙 — 비중첩 원칙 (BLOCKING)

- 콘텐츠 팝업은 **사용처(부모 컴포넌트)의 `<template>` 맨 하단에 모아서 배치**한다.
- **팝업 비중첩 원칙**: 팝업 컴포넌트 내부에 다른 팝업/BottomSheet 를 마운트하지 않는다. 팝업 안에서 다른 팝업을 열어야 하면 `emit` 으로 부모에 위임한다.
  - **예외**: 폼 컨트롤형 picker(`PinPicker` · `PinDatePicker`)는 `BottomSheet` 기반이나 실질적으로 폼 입력 컨트롤(네이티브 datepicker 대체)이므로, 다른 팝업 내부에 직접 마운트해도 위반이 아니다. `v-model:open` 으로 직접 제어한다.

```vue
<!-- ✅ 사용처 template 맨 하단 집중 배치 -->
<template>
  <SomeContent @open-restock="isRestockOpen = true" />   <!-- 콘텐츠: emit만 -->

  <RestockDoneSheet v-model:open="isRestockOpen" />       <!-- 팝업은 하단 집중 -->
  <BenefitBottomSheet v-model:open="isBenefitOpen" />
</template>
```

---

### 5. 내부 라우팅 — "닫힘 완료 후 이동" (BLOCKING)

팝업 컴포넌트 내부에서 다른 페이지로 이동할 때 **내부 라우팅 마크업을 쓰지 않는다**: `<NuxtLink>`, `to` 를 쓴 `<ButtonLink>`(내부적으로 NuxtLink 로 렌더), 라우팅용 `<a href="/...">`. 대신 팝업을 **닫고, 닫힘 애니메이션이 끝난 시점(`@closed`)에 `navigateTo()`** 한다. `close()` 직후 즉시 `navigateTo()` 는 닫힘 애니메이션이 잘리므로 금지.

> **이유**: 즉시 라우트 전환은 현재 페이지를 통째로 언마운트해 팝업의 닫힘 애니메이션(`$duration-base` ≈ 300ms)이 재생 도중 잘리고, 오버레이·`body` 스크롤 락·포커스 트랩 정리도 건너뛴다. base 는 닫기(`close`)와 닫힘 완료(`closed`, `@animationend`)를 분리해 emit 하므로, 닫힘 완료 시점에 이동하면 인터랙션이 매끄럽다.

| | 처리 위치 | 언제 |
|---|---|---|
| **패턴 A (권장, 단순 이동)** | 팝업 내부 `usePopupNavigate` | 이동만 하면 됨 |
| **패턴 B (부모 위임)** | 부모의 `@closed` 콜백 | 이동 **전에** 부모가 상태 저장·검증·다른 팝업 연쇄 등 개입이 필요할 때 |

```vue
<!-- ✅ 패턴 A — 팝업 내부 -->
<template>
  <BottomSheet v-model:open="open" @closed="handleClosed">
    <button type="button" @click="navigate('/cart')">장바구니 보기</button>
  </BottomSheet>
</template>
<script setup lang="ts">
  import { BottomSheet, usePopupNavigate } from '@nd/components/popup'
  const open = defineModel<boolean>('open', { required: true })
  // navigate(path): 경로 기억 + open=false / handleClosed: 닫힘 완료 후 navigateTo
  const { navigate, handleClosed } = usePopupNavigate(() => { open.value = false })
</script>
<!-- 부모: <SomeSheet v-model:open="isOpen" /> 만 -->
```

```vue
<!-- ✅ 패턴 B — 팝업은 신호만 emit, 부모가 닫힘 완료 후 이동 -->
<!-- 팝업 -->
<BottomSheet v-model:open="open" @closed="emit('closed')">
  <button type="button" @click="emit('navigate', '/cart')">장바구니 보기</button>
</BottomSheet>
<!-- 부모 -->
<SomeSheet v-model:open="isOpen" @navigate="onNavigate" @closed="onClosed" />
<script setup lang="ts">
  const isOpen = ref(false)
  const pendingPath = ref<string | null>(null)
  function onNavigate(path: string) { pendingPath.value = path; isOpen.value = false }
  function onClosed() {
    if (!pendingPath.value) return     // 일반 닫기(X)는 이동 안 함
    const path = pendingPath.value; pendingPath.value = null
    navigateTo(path)                   // 애니메이션 끝난 뒤 라우팅
  }
</script>
```

> **외부 링크 예외**: 다른 도메인으로 나가는 외부 링크는 새 탭으로 열려 팝업이 유지되므로 `<a href="https://..." target="_blank" rel="noopener">`(또는 `<ButtonLink href target="_blank">`)를 그대로 쓴다.
>
> **적용 범위**: 본 규칙은 팝업 컴포넌트 내부에만 적용된다. 일반 페이지 마크업은 `<NuxtLink to>` 를 그대로 쓴다.

---

### 6. 접근성 · 텍스트 태그

- 닫기/확인/취소 등 인터랙션은 `<button type="button">` 또는 `<a>` 에만 이벤트를 건다(`rules/a11y.md`). `<div>`/`<span>` 에 `@click` 금지.
- 아이콘만 있는 버튼은 `aria-label` 필수(닫기 버튼 등 — base 가 처리하는 부분은 그대로 둔다).
- `role="dialog"` 등 ARIA 역할은 base(Radix Vue)가 자동 부여한다 — 직접 작성하지 않는다(`rules/a11y.md` "role 우회 금지" 예외).
- **텍스트 태그 정책 (단일 출처)**: 팝업 마크업의 텍스트 요소는 `<span>` 을 기본으로 사용한다. `<p>`·`<h1>~<h6>` 의 브라우저 기본 스타일(margin·font-size·font-weight)이 토큰 기반 레이아웃에 간섭하기 때문이다. `<p>` 는 에러 메시지(`aria-describedby` 연결)·실제 문장 단락에만, `<h*>` 는 스크린 리더에 헤딩 계층이 실제로 필요한 경우에만 사용한다. `<span>` 은 인라인 요소이므로 block/flex 배치가 필요하면 SCSS 에 `display` 를 명시한다. (컴포넌트 SFC·가이드 페이지는 본 정책 미적용 — 시맨틱 태그 자유 사용)

---

### 7. 금지 사항 요약

- 콘텐츠 팝업 open 을 `defineProps`+`defineEmits('update:open')`+수동 포워딩 / `isOpen·isPresent`+`useLayerPopup` / `localOpen` computed / `defineExpose({ open })` 로 작성 금지 → `defineModel('open')` + `v-model:open` (§3)
- 팝업을 `v-if="isPresent"` 등 외부 상태로 마운트 제어 금지 — base 가 Presence 자체 처리 (§3-3)
- (구) `useLayerPopup` / `useFullPopup` / `useBottomSheet` 패턴 재작성 금지 — 제거 완료, `v-model:open` 표준 사용 (§3-5)
- 팝업 내부에 다른 팝업 직접 마운트 금지 (§4, picker 예외)
- 팝업 내부 내부 라우팅(`<NuxtLink>`·`<ButtonLink to>`·라우팅 `<a href>`) / `close()` 직후 즉시 `navigateTo()` 금지 (§5)
- base 팝업 컴포넌트(`components/popup/*`)를 데모 래퍼 작업 중 수정 금지 (§2)
