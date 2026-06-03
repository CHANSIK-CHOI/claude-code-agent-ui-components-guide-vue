# Confirm 컴포넌트 명세

## 0. Atomic 계층 & 파일 배치

- **계층**: organisms — 전용 폴더 `components/popup/`에 위치
- **배치 경로**: `components/popup/Confirm.vue`
- **카테고리 barrel**: `components/popup/index.ts`
- **Base/Wrapper 분리**: Wrapper (`Popup.vue` 기반)
- **함께 작성되는 파일**:
  - `components/popup/useConfirm.ts` — Confirm 훅

> Popup.vue Base 명세: `.claude/specs/Popup.md`  
> Alert 명세 (usePopupManager / PopupRenderer 참조): `.claude/specs/Alert.md`

---

## 1. 컴포넌트 개요

사용자에게 선택을 요구하는 확인 팝업. ok(확인) + cancel(취소) 버튼 두 개를 제공하며, `useConfirm().open()`으로 **프로그래매틱하게만** 사용한다.

React의 `window.confirm()`을 대체하지만, 비동기 처리가 필요한 경우를 위해 **Promise 방식**과 이벤트 핸들러가 이미 있는 경우를 위한 **Callback 방식** 두 가지 모두 지원한다.

---

## 2. 영역 구성 (Area Map)

Popup.vue Base 구조를 사용하며 다음이 고정된다:

- ③ **Header**: `title` prop이 있을 때 Popup 헤더(`popup__header`)에 표시. `title` 없으면 비표시 (`DialogTitle`은 `VisuallyHidden`으로만 존재, a11y)
- ④ **Body**: `message` 텍스트만 (중앙 정렬) — `title`은 Popup 헤더에서 처리
- ⑤ **Footer**: cancel (flex:1, `$border-disabled` 배경, 흰 텍스트) + ok (flex:1, `$color-primary`), border-top 없음, gap: 0.5rem, 버튼 height 5.4rem, border-radius 1rem

---

## 2-1. Props 목록

| prop          | 타입                                  | 기본값      | 설명                               |
| ------------- | ------------------------------------- | ----------- | ---------------------------------- |
| `title`       | `string`                              | — (필수)    | 헤더 타이틀                        |
| `message`     | `string`                              | —           | body 확인 메시지 텍스트. 생략 가능 |
| `okLabel`     | `string`                              | `'확인'`    | ok 버튼 텍스트                     |
| `okColor`     | `'secondary' \| 'primary' \| 'black'` | `'primary'` | ok 버튼 색상                       |
| `cancelLabel` | `string`                              | `'취소'`    | cancel 버튼 텍스트                 |

**내부 고정값** (외부 노출 안 함)

| prop             | 고정값                     |
| ---------------- | -------------------------- |
| `type`           | `'confirm'`                |
| `showClose`      | `false` — 헤더 자체 비표시 |
| `showCancel`     | `true`                     |
| `closeOnOverlay` | `true`                     |
| `closeOnEscape`  | `true`                     |

### `message` ↔ Popup `description` 전달 구조

Confirm.vue는 `message` prop을 body slot 안의 `confirm__message` 단락으로 직접 렌더링한다. Popup에 `:description` prop을 전달하지 않으며, `DialogDescription`은 빈 문자열로 마운트된다.

> **의도적 설계**: `:description="message"`를 전달하면 `aria-describedby`(DialogDescription)와 시각적 메시지 단락이 동시에 노출되어 스크린리더가 같은 내용을 두 번 읽는다. Alert.md § 2-1의 동일한 설계 결정을 따른다.

```vue
<!-- Confirm.vue 구현 패턴 (요약) -->
<Popup
  type="confirm"
  :open="true"
  :title="title"
  :ok-label="okLabel"
  :cancel-label="cancelLabel"
  :show-close="false"
  :show-cancel="true"
  :close-on-overlay="true"
  :close-on-escape="true"
  @ok="handleOk"
  @closed="handleClosed"
>
  <div class="confirm__body">
    <p class="confirm__message">{{ message }}</p>
  </div>
</Popup>
```

> `title` prop이 있으면 Popup의 헤더(`popup__header`)에 직접 렌더링된다. `title` 없으면 Popup.vue가 `VisuallyHidden`에 `'확인'` 기본 텍스트를 주입하여 접근성 요건을 충족시킨다.

---

## 3. useConfirm 인터페이스

### 파일: `components/popup/useConfirm.ts`

두 가지 호출 방식을 **오버로드**로 지원한다.

```ts
interface ConfirmConfig {
  title: string;
  message?: string;
  okLabel?: string;
  cancelLabel?: string;
}

interface ConfirmCallbackConfig extends ConfirmConfig {
  onOk: () => void;
  onCancel?: () => void;
}

// ⚠️ 오버로드 순서 — 더 구체적인 시그니처를 먼저 선언
// (TypeScript 오버로드는 위에서 아래로 매칭하므로, ConfirmCallbackConfig가
//  먼저 와야 onOk 포함 호출이 void로 정확히 추론된다)
function open(config: ConfirmCallbackConfig): void;
function open(config: ConfirmConfig): Promise<boolean>;

// 구현 시그니처 (외부에 노출되지 않음)
function open(config: ConfirmConfig | ConfirmCallbackConfig): Promise<boolean> | void {
  if ('onOk' in config) {
    // Callback 방식 — void 반환
    // ...
    return;
  }
  // Promise 방식
  return new Promise((resolve) => {
    /* ... */
  });
}

export function useConfirm() {
  return { open };
}
```

### 방식 분기 기준

`config.onOk` prop 존재 여부로 분기 (`'onOk' in config`):

- `onOk` **있음** → Callback 방식. 반환값 `void`
- `onOk` **없음** → Promise 방식. 반환값 `Promise<boolean>`

> **주의**: `if (config.onOk)`이 아니라 `if ('onOk' in config)`로 체크. 사용자가 `onOk: undefined`를 명시적으로 넘겼을 때도 Callback 방식으로 분기되도록.

---

## 4. 사용 패턴

### 4-1. Promise 방식 (비동기 처리 권장)

```ts
const { open } = useConfirm();

// 기본
const result = await open({
  title: '삭제 확인',
});
if (result) {
  await deleteItem();
}

// ok 버튼 텍스트 커스터마이징
const agreed = await open({
  title: '이용약관 동의',
  message: '서비스 이용을 위해 동의가 필요합니다.',
  okLabel: '동의',
  cancelLabel: '거부',
});
```

### 4-2. Callback 방식 (기존 이벤트 핸들러와 연계)

```ts
const { open } = useConfirm();

open({
  title: '주문 취소',
  message: '주문을 취소하시겠습니까?',
  onOk: () => cancelOrder(orderId),
  onCancel: () => console.log('취소 안 함'), // 선택 사항
});
```

---

## 5. Promise resolve/reject 규칙

| 트리거           | Promise resolve 값 | Callback                 |
| ---------------- | ------------------ | ------------------------ |
| ok 버튼 클릭     | `true`             | `onOk()` 호출            |
| cancel 버튼 클릭 | `false`            | `onCancel()` 호출 (선택) |
| ESC 키           | `false`            | `onCancel()` 호출 (선택) |
| dim 클릭         | `false`            | `onCancel()` 호출 (선택) |

> 닫기(×) 버튼은 `showClose=false`로 비표시 — 트리거 자체 없음.  
> reject는 사용하지 않는다. 항상 resolve로 처리하여 `try/catch` 없이 `await` 사용 가능.

---

## 6. 동작 규칙

### 6-1. 동일 인스턴스 중복 open

`open()`을 여러 번 호출하면 각각 별도 인스턴스로 스택에 쌓인다. 단, UX 상 하나의 Confirm만 표시되는 것이 일반적이므로 연속 호출을 남용하지 않는다.

### 6-2. Promise 방식 + async/await 패턴

```ts
async function handleDelete() {
  const confirmed = await confirm.open({
    title: '삭제 확인',
    okLabel: '삭제',
  });
  if (!confirmed) return; // 취소 시 early return
  await deleteItem();
  router.back();
}
```

---

## 7. 상태(State) 정의

| 상태 | 설명                                                                        |
| ---- | --------------------------------------------------------------------------- |
| 대기 | `useConfirm().open()` 호출 전. 팝업 없음                                    |
| 표시 | `instances`에 Confirm 항목 존재. 두 버튼 모두 활성                          |
| 닫힘 | ok/cancel/ESC/dim. `instances`에서 제거. Promise resolve 또는 callback 호출 |

---

## 8. 이벤트 목록

useConfirm의 `open()` 호출 시 제공하는 이벤트:

| 이벤트 (콜백 prop)    | 발생 시점          | Promise 반환값 |
| --------------------- | ------------------ | -------------- |
| — (Promise 방식)      | ok 클릭            | `true`         |
| — (Promise 방식)      | cancel / ESC / dim | `false`        |
| `onOk` (Callback)     | ok 클릭            | (반환값 없음)  |
| `onCancel` (Callback) | cancel / ESC / dim | (반환값 없음)  |

---

## 9. 접근성 요구사항

Popup.vue Base 접근성 기준을 따른다 (`DialogTitle` / `DialogDescription` 항상 마운트 정책).

| 항목                | 요구사항                                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `DialogTitle`       | `title` prop 있으면 `popup__header`에 직접 렌더링. `title` 없으면 `VisuallyHidden`으로 기본 텍스트 `"확인"` 주입 (Popup.vue가 `type="confirm"` 분기로 처리). |
| `DialogDescription` | Confirm은 `message`가 필수이므로 항상 텍스트 존재. `DialogDescription`으로 래핑하여 `aria-describedby` 자동 연결                                             |
| 포커스 초기화       | open 시 cancel 버튼에 포커스 이동 권장 (취소가 더 안전한 기본 선택) — `@open-auto-focus.prevent` 후 nextTick에서 cancel ref.focus()                          |
| 키보드              | Tab으로 cancel ↔ ok 순환, Enter로 포커스된 버튼 실행                                                                                                         |

---

## 10. 가이드 페이지

**경로**: `pages/guide/confirm/index.vue`

`rules/guide-page.md`의 가이드 페이지 작성 규칙을 따른다. 아래 시연 시나리오를 포함한다:

| 시나리오       | 설명                                                                              |
| -------------- | --------------------------------------------------------------------------------- |
| Promise 방식   | `const ok = await confirm.open({...}); console.log(ok)` — true/false resolve 시연 |
| Callback 방식  | `confirm.open({ ..., onOk: () => alert('ok'), onCancel: () => alert('cancel') })` |
| 버튼 라벨 변경 | `okLabel: '동의'`, `cancelLabel: '거부'` 변형 시연                                |
| ESC/dim 닫기   | `false` resolve / `onCancel` 호출 동작 확인                                       |

**페이지 마크업 포인트**:

- `<Confirm />`을 직접 마크업하지 않고 `useConfirm` 훅 호출만
- 결과를 페이지 내 영역에 표시(콘솔/state)하여 Promise/Callback 동작을 사용자가 즉시 확인 가능하게
- ⑥ Props 섹션은 useConfirm config 인터페이스 + 두 오버로드 시그니처 표로 작성

---

## 구현 복잡도 신호

- Confirm.vue 자체는 단순 — Popup.vue에 고정 props 전달 + Alert와 거의 동일
- 핵심 복잡도는 `useConfirm.ts`의 오버로드 시그니처와 Promise/Callback 분기 로직
- TypeScript 오버로드: 구현 시그니처는 하나, 외부 오버로드 선언을 두 개 작성
