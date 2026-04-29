# LayerPopup 컴포넌트 명세

## 0. Atomic 계층 & 파일 배치

- **계층**: organisms — 전용 폴더 `components/popup/`에 위치
- **배치 경로**: `components/popup/LayerPopup.vue`
- **카테고리 barrel**: `components/popup/index.ts`
- **Base/Wrapper 분리**: Wrapper (`Popup.vue` 기반)
- **함께 작성되는 파일**:
  - `components/popup/useLayerPopup.ts` — 열기/닫기 컨트롤러 훅
  - `components/popup/usePopupState.ts` — internal 공통 composable (LayerPopup/BottomSheet/FullPopup 공유)

> Popup.vue Base 명세: `.claude/specs/Popup.md`

---

## 1. 컴포넌트 개요

범용 레이어 팝업. 헤더/바디/푸터 모두 slot으로 자유롭게 구성하며, `useLayerPopup()` 훅으로 열기/닫기를 외부에서 제어한다. 배송지 변경, 필터 선택, 이미지 확대, 약관 내용 표시 등 다양한 콘텐츠 팝업에 사용한다.

Alert/Confirm과 달리 프로그래매틱이 아닌 **템플릿 마크업 + 훅 컨트롤러** 방식을 사용한다.

---

## 2. 영역 구성 (Area Map)

Popup.vue Base 구조를 그대로 사용. 모든 영역이 slot으로 커스터마이징 가능하다.

- ③ **Header**: `title` prop 또는 `#header` slot
- ④ **Body**: `default` slot — 임의 콘텐츠 삽입
- ⑤ **Footer**: `#footer` slot 권장. 없으면 Popup.vue 기본 ok/cancel 버튼

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
| `okDisabled`     | `boolean` | `false`  | ok 버튼 비활성                                         |
| `closeOnOverlay` | `boolean` | `true`   | dim 클릭 시 닫기                                       |
| `closeOnEscape`  | `boolean` | `true`   | ESC 키 입력 시 닫기                                    |

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

## 4. useLayerPopup 인터페이스 + usePopupState 공통 추출

### 4-1. usePopupState (internal 공통 composable)

**파일**: `components/popup/usePopupState.ts`

LayerPopup / BottomSheet / FullPopup이 공유하는 단순 열기/닫기 상태 관리 composable. 세 wrapper hook이 동일한 인터페이스를 갖는 DRY 위반을 방지하기 위해 추출한다.

```ts
// components/popup/usePopupState.ts

interface PopupStateController {
  isOpen: Ref<boolean>; // ⚠️ mutable Ref — v-model:open 바인딩 위해 필수
  open: () => void;
  close: () => void;
}

export function usePopupState(): PopupStateController {
  const isOpen = ref(false);
  return {
    isOpen,
    open: () => {
      isOpen.value = true;
    },
    close: () => {
      isOpen.value = false;
    },
  };
}
```

> ⚠️ **`isOpen`은 mutable Ref여야 한다**: `v-model:open="popup.isOpen"`은 내부적으로 `update:open` emit 시 `popup.isOpen.value = newVal`을 시도한다. `Readonly<Ref<boolean>>`로 감싸면 외부 닫기(닫기 버튼/ESC/dim 클릭)가 동작하지 않는다.
>
> **컨벤션**: 직접 변경(`popup.isOpen.value = true`) 대신 `open()` / `close()` 메서드 사용을 권장 — 의도가 명확하고 추후 hook을 확장하기 쉽다.
>
> **호출별 독립 인스턴스**: 호출마다 새 `ref(false)`를 생성하므로 여러 팝업이 각각 독립된 상태를 가진다 (module-level reactive 아님).

> React 비교: `useState(false)`로 `isOpen`을 관리하고, `setIsOpen(true)` / `setIsOpen(false)`를 `open` / `close`로 래핑한 것과 동일하다. Vue의 `ref`는 React의 `useState`와 달리 mutable 객체를 그대로 노출 가능.

### 4-2. useLayerPopup

**파일**: `components/popup/useLayerPopup.ts`

`usePopupState`를 래핑한 named export. 의미적 명확성을 위해 wrapper별 이름을 분리하지만 내부 구현은 동일.

```ts
// components/popup/useLayerPopup.ts
import { usePopupState } from "./usePopupState";

export function useLayerPopup() {
  return usePopupState();
}

// 또는 alias로 더 단순히
// export const useLayerPopup = usePopupState
```

### 4-3. 인터페이스

```ts
const popup = useLayerPopup();
popup.isOpen; // Ref<boolean> — v-model:open에 바인딩
popup.open(); // 열기
popup.close(); // 닫기
```

### 사용 패턴

```vue
<script setup>
import { useLayerPopup } from "@nd/components/popup";

const popup = useLayerPopup();
</script>

<template>
  <Button @click="popup.open()">배송지 변경</Button>

  <LayerPopup v-model:open="popup.isOpen" title="배송지 변경">
    <AddressForm />
    <template #footer>
      <Button shape="line" color="gray" @click="popup.close()">취소</Button>
      <Button @click="handleSave">저장</Button>
    </template>
  </LayerPopup>
</template>
```

### v-model vs 훅 혼용

훅이 반환하는 `isOpen`과 `v-model:open`을 동시에 연결한다. 팝업 내부에서 닫기(×) 버튼, ESC, dim 클릭으로 닫혀도 `isOpen`이 자동으로 `false`가 된다 (Radix Vue `onOpenChange`가 `update:open` emit → `isOpen` 업데이트).

---

## 5. 동작 규칙

### 5-1. 열기 / 닫기

| 트리거                           | 동작                                              |
| -------------------------------- | ------------------------------------------------- |
| `popup.open()`                   | `isOpen = true` → 팝업 표시                       |
| `popup.close()`                  | `isOpen = false` → 팝업 닫힘                      |
| 닫기(×) 버튼                     | Popup.vue `update:open(false)` → `isOpen = false` |
| ESC                              | Popup.vue → `isOpen = false`                      |
| dim 클릭 (`closeOnOverlay=true`) | Popup.vue → `isOpen = false`                      |
| `#footer` slot의 취소 버튼 클릭  | `popup.close()` 직접 호출                         |

### 5-2. 여러 팝업 동시 사용

```ts
const addressPopup = useLayerPopup();
const filterPopup = useLayerPopup();
// 각각 독립적인 isOpen ref
```

`useLayerPopup()`은 호출마다 독립된 `ref(false)`를 생성한다 — module-level reactive가 아니라 **컴포넌트 로컬 ref**.

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
| 비동기 ok 처리         | `@ok="async () => { await save(); popup.close() }"` — ok가 부모 책임임을 보여주기 |

**페이지 마크업 포인트**:

- `useLayerPopup()` 훅 + `<LayerPopup v-model:open="popup.isOpen" ...>` 패턴
- ⑥ Props/Slots/Events 섹션 HTML `<table>` 작성
- `__delegationNote` (Popup이 Radix Dialog 기반이므로 추가 props 사용 안내)
- `__radixNote` (Radix Vue 공식 문서 참조 안내)

---

## 구현 복잡도 신호

- LayerPopup.vue 자체는 Popup.vue에 `type="layer"` 고정만 하는 얇은 래퍼
- useLayerPopup.ts는 `usePopupState` 호출 한 줄
- 복잡도 없음 — 간단하게 유지
