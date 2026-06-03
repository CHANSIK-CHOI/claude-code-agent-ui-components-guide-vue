# LayerPopup 컴포넌트 명세

## 0. Atomic 계층 & 파일 배치

- **계층**: organisms — 전용 폴더 `components/popup/`에 위치
- **배치 경로**: `components/popup/LayerPopup.vue`
- **카테고리 barrel**: `components/popup/index.ts`
- **Base/Wrapper 분리**: Wrapper (`Popup.vue` 기반)
- **함께 작성되는 파일**:
  - `components/popup/usePopupNavigate.ts` — 팝업 내부 "닫고 이동" 전용 hook (살아있음)

> Popup.vue Base 명세: `.claude/specs/Popup.md`

---

## 1. 컴포넌트 개요

범용 레이어 팝업. 헤더/바디/푸터 모두 slot으로 자유롭게 구성하며, `v-model:open`으로 열기/닫기를 외부에서 제어한다. 배송지 변경, 필터 선택, 이미지 확대, 약관 내용 표시 등 다양한 콘텐츠 팝업에 사용한다.

Alert/Confirm과 달리 프로그래매틱이 아닌 **템플릿 마크업** 방식을 사용한다. open 제어는 `defineModel('open')` + `v-model:open` 표준을 따른다. 상세: `rules/popups.md §3`.

---

## 2. 영역 구성 (Area Map)

Popup.vue Base 구조를 그대로 사용. 모든 영역이 slot으로 커스터마이징 가능하다.

- ③ **Header**: `title` prop 또는 `#header` slot
- ④ **Body**: `default` slot — 임의 콘텐츠 삽입
- ⑤ **Footer**: `#footer` slot 권장. 없으면 Popup.vue 기본 ok/cancel 버튼

### 2-2. layer 타입 디자인 사양 (Figma 기준)

| 영역 | 스타일 |
|------|--------|
| Content | `border-radius: 20px`, `padding: 30px 10px 10px 10px`, flex-col, `gap: 10px`, `position: relative` |
| Close 버튼 | `position: absolute`, `top: 10px`, `right: 10px`, `size: 24px`; 아이콘: `<CloseIcon />` 사용 |
| Header | border-bottom 없음, `padding: 0 6px` (컨테이너 10px + 헤더 6px = 16px 들여쓰기) |
| Body | `padding: 0` (컨테이너 padding이 좌우 처리) |
| Footer | border-top 없음, `padding: 0`, `gap: 5px`, 버튼 높이 `54px`, `border-radius: 10px` |

> **Close 버튼 위치**: layer 타입의 close 버튼은 header 내부 flex item이 아닌, DialogContent 안에 `position: absolute`로 별도 배치한다. 이를 위해 Popup.vue에서 `type === 'layer'`일 때 header와 분리된 absolute 버튼을 렌더링한다.
>
> **type별 스타일 분기**: Popup.vue의 `.popup--layer` modifier selector에서 header·body·footer를 오버라이드한다.

---

## 2-1. Props 목록

Popup.vue props 전체를 그대로 노출한다 (type 제외).

| prop             | 타입      | 기본값   | 설명                                                   |
| ---------------- | --------- | -------- | ------------------------------------------------------ |
| `open`           | `boolean` | — (필수) | v-model:open                                           |
| `title`          | `string`  | —        | 헤더 타이틀                                            |
| `description`    | `string`  | —        | a11y용 설명 텍스트 (`DialogDescription`으로 자동 래핑) |
| `showClose`      | `boolean` | `true`   | 닫기(×) 버튼 표시                                      |
| `okLabel`        | `string`  | `'확인'` | ok 버튼 텍스트                                         |
| `cancelLabel`    | `string`  | `'취소'` | cancel 버튼 텍스트                                     |
| `showCancel`     | `boolean` | `true`   | cancel 버튼 표시                                       |
| `cancelColor`    | `'secondary' \| 'gray'` | `'gray'` | cancel 버튼 색상 variant. `gray`: 회색 보조 액션, `secondary`: 스카이블루 계열 |
| `okDisabled`     | `boolean` | `false`  | ok 버튼 비활성                                         |
| `showFooter`     | `boolean` | `true`   | footer 영역(기본 ok/cancel 버튼 또는 `#footer` slot) 표시 여부. `false`로 설정하면 footer 자체를 숨김 |
| `footerLayout`   | `'equal' \| 'wide'` | `'equal'` | footer 버튼 비율. `equal`: 50%/50%, `wide`: cancel max-width 12rem + cancel:120 / ok:200 비율. 내부적으로 Popup의 `narrowCancel` prop에 매핑되어 CSS 변수 방식으로 footer 자식에 적용됨 — `#footer` slot 커스텀 자식에도 동작 |
| `closeOnOverlay` | `boolean` | `true`   | dim 클릭 시 닫기                                       |
| `closeOnEscape`  | `boolean` | `true`   | ESC 키 입력 시 닫기                                    |
| `deferContent`   | `boolean` | `false`  | `true`이면 열림 애니메이션 완료 후에 default slot을 렌더한다. LayerPopup은 fade+scale 타입이므로 필요성은 낮으나 사용 가능. 슬라이드 타입(BottomSheet·FullPopup)이 주 사용처. 동작 상세는 `Popup.md` §5-6 참조 |

**내부 고정값**

| prop   | 고정값    |
| ------ | --------- |
| `type` | `'layer'` |

---

## 3. Slots

| 슬롯      | 필수 | 설명                                                 |
| --------- | ---- | ---------------------------------------------------- |
| `default` | 권장 | body 영역 콘텐츠                                     |
| `#header` | 선택 | 헤더 완전 교체. 제공 시 title/showClose prop 무시    |
| `#footer` | 선택 | 푸터 완전 교체. 제공 시 ok/cancel 기본 버튼 미렌더링 |

---

## 4. 팝업 open 제어

팝업 open 제어는 `defineModel('open')` + `v-model:open` 표준을 따른다. `useLayerPopup` / `usePopupState` hook은 삭제됐다. 상세: `rules/popups.md §3`.

### 사용 패턴

```vue
<script setup>
const isAddressOpen = ref(false)
</script>

<template>
  <Button @click="isAddressOpen = true">배송지 변경</Button>

  <LayerPopup v-model:open="isAddressOpen" title="배송지 변경">
    <AddressForm />
    <template #footer>
      <Button shape="line" color="gray" @click="isAddressOpen = false">취소</Button>
      <Button @click="handleSave">저장</Button>
    </template>
  </LayerPopup>
</template>
```

여러 팝업이 필요하면 각각 독립적인 `ref(false)`를 선언한다.

```ts
const isAddressOpen = ref(false)
const isFilterOpen = ref(false)
```

### 4-1. usePopupNavigate (팝업 내부 "닫고 이동" 제어)

**파일**: `components/popup/usePopupNavigate.ts`

페이지 전용 팝업(`popups/{routeName}/*.vue`) 내부에서 "다른 페이지로 이동" 액션을 처리하는 hook. 팝업 내부에서는 `<NuxtLink>`·`<ButtonLink to>` 등 즉시 라우팅 마크업을 쓸 수 없으므로(클릭 즉시 라우트가 전환되어 팝업 닫힘 애니메이션이 잘림 — `rules/pages.md` §5-1), **경로를 기억하고 팝업을 닫은 뒤 닫힘 완료(`@closed`) 시점에 `navigateTo`** 한다.

hub의 `v-model:open` 제어가 **hub(부모)에서 팝업을 여닫는** 방식이라면, `usePopupNavigate`는 **팝업 컴포넌트 자신이 "닫고 이동"을 자체 처리**하는 hook이다. 이 hook을 쓰면 hub는 `v-model:open`만 연결하면 되고 `@navigate`/`@closed` 핸들러가 불필요하다.

#### 인터페이스

```ts
const { navigate, handleClosed, pendingPath } = usePopupNavigate(close);
// close          — 팝업을 닫는 콜백 (보통 () => emit('update:open', false))
// navigate(path) — 경로를 기억하고 close() 실행 (즉시 이동하지 않음)
// handleClosed   — base 팝업의 @closed(닫힘 완료)에 연결. 예약 경로가 있으면 navigateTo
// pendingPath    — 이동 예약 경로 Ref<string | null>
```

#### 사용 패턴 (페이지 전용 팝업 내부)

```vue
<template>
  <BottomSheet :open="open" @close="emit('update:open', false)" @closed="handleClosed">
    <button type="button" @click="navigate('/cart')">장바구니 보기</button>
  </BottomSheet>
</template>

<script setup lang="ts">
import { BottomSheet, usePopupNavigate } from "@nd/components/popup";

defineProps<{ open: boolean }>();
const emit = defineEmits<{ "update:open": [value: boolean] }>();

const { navigate, handleClosed } = usePopupNavigate(() => emit("update:open", false));
</script>
```

> **패턴 선택 (`rules/pages.md` §5-1 단일 출처)**: 단순 페이지 이동은 `usePopupNavigate`(패턴 A, 권장). 이동 **전에** hub가 추가 작업(상태 저장·유효성 검사·다른 팝업 연쇄)을 해야 하면 팝업이 `emit('navigate', path)`로 hub에 위임하고 hub의 `onClosed` 콜백에서 `navigateTo`(패턴 B).
>
> **일반 닫기와 구분**: X 버튼·ESC·dim 클릭으로 닫으면 `pendingPath`가 비어 있어 이동하지 않는다. `navigate()`를 거친 경우에만 이동한다.

---

## 5. 동작 규칙

### 5-1. 열기 / 닫기

| 트리거                           | 동작                                               |
| -------------------------------- | -------------------------------------------------- |
| `isOpen = true` (hub에서)        | v-model:open → 팝업 표시                           |
| `isOpen = false` (hub에서)       | v-model:open → 팝업 닫힘                           |
| 닫기(×) 버튼                     | Popup.vue `update:open(false)` → `isOpen = false`  |
| ESC                              | Popup.vue → `isOpen = false`                       |
| dim 클릭 (`closeOnOverlay=true`) | Popup.vue → `isOpen = false`                       |
| `#footer` slot의 취소 버튼 클릭  | `isOpen = false` 직접 할당                         |

### 5-2. 여러 팝업 동시 사용

```ts
const isAddressOpen = ref(false)
const isFilterOpen = ref(false)
// 각각 독립적인 ref
```

---

## 6. 이벤트 목록

Popup.vue Base emit을 그대로 노출한다.

| 이벤트         | 발생 시점            | 전달값    |
| -------------- | -------------------- | --------- |
| `update:open`  | open 상태 변경       | `boolean` |
| `opened`       | 열림 애니메이션 완료 | —         |
| `closed`       | 닫힘 애니메이션 완료 | —         |
| `close`        | 닫기(×) 버튼 클릭    | —         |
| `ok`           | ok 버튼 클릭         | —         |
| `cancel`       | cancel 버튼 클릭     | —         |
| `overlayClick` | dim 클릭             | —         |

### 6-1. emit forward 매커니즘 (구현 시 주의)

**Vue는 emit을 자동 forward하지 않는다.** LayerPopup.vue가 Popup.vue를 내부에서 사용하더라도, Popup.vue가 emit한 이벤트를 외부 사용자가 받으려면 LayerPopup.vue가 **명시적으로 emit을 재정의하고 forward**해야 한다.

```vue
<!-- LayerPopup.vue 구현 패턴 -->
<template>
  <Popup
    type="layer"
    :open="open"
    :title="title"
    :show-close="showClose"
    :ok-label="okLabel"
    :cancel-label="cancelLabel"
    :show-cancel="showCancel"
    :ok-disabled="okDisabled"
    :close-on-overlay="closeOnOverlay"
    :close-on-escape="closeOnEscape"
    @update:open="(v) => emit('update:open', v)"
    @opened="emit('opened')"
    @closed="emit('closed')"
    @close="emit('close')"
    @ok="emit('ok')"
    @cancel="emit('cancel')"
    @overlay-click="emit('overlayClick')"
  >
    <template v-if="$slots.header" #header><slot name="header" /></template>
    <slot />
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </Popup>
</template>

<script setup lang="ts">
defineProps<{
  /* ... Popup props 그대로 ... */
}>();
const emit = defineEmits<{
  "update:open": [value: boolean];
  opened: [];
  closed: [];
  close: [];
  ok: [];
  cancel: [];
  overlayClick: [];
}>();
</script>
```

> **slot forward**: `$slots.header` / `$slots.footer` 존재 여부를 체크해 조건부로 `<template>`을 전달해야, slot 미사용 시 Popup.vue Base의 default slot/footer 폴백이 정상 동작.

---

## 7. 접근성 요구사항

Popup.vue Base 접근성 기준을 따른다.

| 항목         | 요구사항                                                 |
| ------------ | -------------------------------------------------------- |
| `title` 제공 | 권장. 없으면 `#header` slot에서 `DialogTitle` 직접 래핑  |
| 포커스 관리  | 팝업 열릴 때 첫 포커스 가능 요소로 자동 이동 (Radix Vue) |
| 닫기 버튼    | `aria-label="닫기"` 필수                                 |

---

## 8. 가이드 페이지

**경로**: `pages/guide/layerPopup/index.vue`

`rules/guide-page.md`의 가이드 페이지 작성 규칙을 따른다. 아래 시연 시나리오를 포함한다:

| 시나리오               | 설명                                                                              |
| ---------------------- | --------------------------------------------------------------------------------- |
| 기본 LayerPopup        | title + body slot + 기본 ok/cancel 버튼                                           |
| `#footer` slot 커스텀  | 취소/저장 버튼을 직접 마크업, 비동기 저장 후 close                                |
| `#header` slot 커스텀  | 시각적 헤더 자유 마크업 (title prop 비우면 hidden DialogTitle 자동 마운트)        |
| `showCancel=false`     | ok 버튼만 노출                                                                    |
| `closeOnOverlay=false` | dim 클릭으로 닫히지 않는 강제 응답 시나리오                                       |
| 비동기 ok 처리         | `@ok="async () => { await save(); isOpen = false }"` — ok가 부모 책임임을 보여주기 |

**페이지 마크업 포인트**:

- `ref(false)` + `<LayerPopup v-model:open="isXxxOpen" ...>` 패턴
- ⑥ Props/Slots/Events 섹션 HTML `<table>` 작성
- `__delegationNote` (Popup이 Radix Dialog 기반이므로 추가 props 사용 안내)
- `__radixNote` (Radix Vue 공식 문서 참조 안내)

---

## 구현 복잡도 신호

- LayerPopup.vue 자체는 Popup.vue에 `type="layer"` 고정만 하는 얇은 래퍼
- 복잡도 없음 — 간단하게 유지
