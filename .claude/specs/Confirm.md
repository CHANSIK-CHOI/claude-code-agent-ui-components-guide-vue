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

- ③ **Header**: `title` prop. **`showClose=false` 고정** — 일반적인 confirm UX는 cancel/ok 두 버튼만 두는 패턴 (헤더 닫기 버튼 없음)
- ④ **Body**: `message` prop 텍스트를 `DialogDescription`으로 래핑
- ⑤ **Footer**: ok + cancel 버튼 모두 표시 (`showCancel=true` 고정)

---

## 2-1. Props 목록

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `title` | `string` | — | 헤더 타이틀. 생략 가능 |
| `message` | `string` | — (필수) | body 확인 메시지 텍스트 |
| `okLabel` | `string` | `'확인'` | ok 버튼 텍스트 |
| `cancelLabel` | `string` | `'취소'` | cancel 버튼 텍스트 |
| `okDisabled` | `boolean` | `false` | ok 버튼 비활성 |

**내부 고정값** (외부 노출 안 함)

| prop | 고정값 |
|------|--------|
| `type` | `'layer'` |
| `showClose` | **`false`** — confirm은 cancel/ok 버튼만 사용 (사용자 결정, 2026-04-28) |
| `showCancel` | `true` |
| `closeOnOverlay` | `true` |
| `closeOnEscape` | `true` |

### `message` ↔ Popup `description` 전달 구조

Confirm.vue는 `message` prop을 Popup.vue의 `description` prop으로 전달하여 `DialogDescription` aria-describedby 자동 연결을 활용한다. (자세한 패턴은 Alert.md § 2-1 참조)

```vue
<!-- Confirm.vue 구현 패턴 (요약) -->
<Popup
  type="layer"
  :open="true"
  :title="title"
  :description="message"
  :ok-label="okLabel"
  :cancel-label="cancelLabel"
  :ok-disabled="okDisabled"
  :show-close="false"
  :show-cancel="true"
  :close-on-overlay="true"
  :close-on-escape="true"
  @ok="handleOk"
  @cancel="handleCancel"
  @overlay-click="handleCancel"
>
  <p class="confirm__message">{{ message }}</p>
</Popup>
```

---

## 3. useConfirm 인터페이스

### 파일: `components/popup/useConfirm.ts`

두 가지 호출 방식을 **오버로드**로 지원한다.

```ts
interface ConfirmConfig {
  title?: string
  message: string
  okLabel?: string
  cancelLabel?: string
  okDisabled?: boolean
}

interface ConfirmCallbackConfig extends ConfirmConfig {
  onOk: () => void
  onCancel?: () => void
}

// ⚠️ 오버로드 순서 — 더 구체적인 시그니처를 먼저 선언
// (TypeScript 오버로드는 위에서 아래로 매칭하므로, ConfirmCallbackConfig가
//  먼저 와야 onOk 포함 호출이 void로 정확히 추론된다)
function open(config: ConfirmCallbackConfig): void
function open(config: ConfirmConfig): Promise<boolean>

// 구현 시그니처 (외부에 노출되지 않음)
function open(config: ConfirmConfig | ConfirmCallbackConfig): Promise<boolean> | void {
  if ('onOk' in config) {
    // Callback 방식 — void 반환
    // ...
    return
  }
  // Promise 방식
  return new Promise((resolve) => { /* ... */ })
}

export function useConfirm() {
  return { open }
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
const { open } = useConfirm()

// 기본
const result = await open({
  title: '삭제 확인',
  message: '정말 삭제하시겠습니까?',
})
if (result) { await deleteItem() }

// ok 버튼 텍스트 커스터마이징
const agreed = await open({
  title: '이용약관 동의',
  message: '서비스 이용을 위해 동의가 필요합니다.',
  okLabel: '동의',
  cancelLabel: '거부',
})
```

### 4-2. Callback 방식 (기존 이벤트 핸들러와 연계)

```ts
const { open } = useConfirm()

open({
  title: '주문 취소',
  message: '주문을 취소하시겠습니까?',
  onOk: () => cancelOrder(orderId),
  onCancel: () => console.log('취소 안 함'),  // 선택 사항
})
```

---

## 5. Promise resolve/reject 규칙

| 트리거 | Promise resolve 값 | Callback |
|--------|------------------|---------|
| ok 버튼 클릭 | `true` | `onOk()` 호출 |
| cancel 버튼 클릭 | `false` | `onCancel()` 호출 (선택) |
| ESC 키 | `false` | `onCancel()` 호출 (선택) |
| dim 클릭 | `false` | `onCancel()` 호출 (선택) |

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
    message: '되돌릴 수 없습니다.',
    okLabel: '삭제',
  })
  if (!confirmed) return  // 취소 시 early return
  await deleteItem()
  router.back()
}
```

---

## 7. 상태(State) 정의

| 상태 | 설명 |
|------|------|
| 대기 | `useConfirm().open()` 호출 전. 팝업 없음 |
| 표시 | `instances`에 Confirm 항목 존재. 두 버튼 모두 활성 |
| ok-disabled 표시 | `okDisabled=true`. ok 버튼 비활성, cancel은 활성 |
| 닫힘 | ok/cancel/ESC/dim. `instances`에서 제거. Promise resolve 또는 callback 호출 |

---

## 8. 이벤트 목록

useConfirm의 `open()` 호출 시 제공하는 이벤트:

| 이벤트 (콜백 prop) | 발생 시점 | Promise 반환값 |
|------------------|---------|--------------|
| — (Promise 방식) | ok 클릭 | `true` |
| — (Promise 방식) | cancel / ESC / dim | `false` |
| `onOk` (Callback) | ok 클릭 | (반환값 없음) |
| `onCancel` (Callback) | cancel / ESC / dim | (반환값 없음) |

---

## 9. 접근성 요구사항

Popup.vue Base 접근성 기준을 따른다 (`DialogTitle` / `DialogDescription` 항상 마운트 정책).

| 항목 | 요구사항 |
|------|---------|
| `DialogTitle` | `title` 없으면 `VisuallyHidden`으로 감싸 빈 노드라도 항상 마운트. 기본 텍스트("확인") 자동 주입 권장 |
| `DialogDescription` | Confirm은 `message`가 필수이므로 항상 텍스트 존재. `DialogDescription`으로 래핑하여 `aria-describedby` 자동 연결 |
| 포커스 초기화 | open 시 cancel 버튼에 포커스 이동 권장 (취소가 더 안전한 기본 선택) — `@open-auto-focus.prevent` 후 nextTick에서 cancel ref.focus() |
| 키보드 | Tab으로 cancel ↔ ok 순환, Enter로 포커스된 버튼 실행 |

---

## 10. 가이드 페이지

**경로**: `pages/guide/confirm/index.vue`

`rules/guide-page.md`의 가이드 페이지 작성 규칙을 따른다. 아래 시연 시나리오를 포함한다:

| 시나리오 | 설명 |
|---------|------|
| Promise 방식 | `const ok = await confirm.open({...}); console.log(ok)` — true/false resolve 시연 |
| Callback 방식 | `confirm.open({ ..., onOk: () => alert('ok'), onCancel: () => alert('cancel') })` |
| 버튼 라벨 변경 | `okLabel: '동의'`, `cancelLabel: '거부'` 변형 시연 |
| ok 비활성 | `okDisabled: true` (정적) — 추후 동적 제어가 필요하면 별도 prop 패턴 검토 |
| ESC/dim 닫기 | `false` resolve / `onCancel` 호출 동작 확인 |

**페이지 마크업 포인트**:
- `<Confirm />`을 직접 마크업하지 않고 `useConfirm` 훅 호출만
- 결과를 페이지 내 영역에 표시(콘솔/state)하여 Promise/Callback 동작을 사용자가 즉시 확인 가능하게
- ⑥ Props 섹션은 useConfirm config 인터페이스 + 두 오버로드 시그니처 표로 작성

---

## 구현 복잡도 신호

- Confirm.vue 자체는 단순 — Popup.vue에 고정 props 전달 + Alert와 거의 동일
- 핵심 복잡도는 `useConfirm.ts`의 오버로드 시그니처와 Promise/Callback 분기 로직
- TypeScript 오버로드: 구현 시그니처는 하나, 외부 오버로드 선언을 두 개 작성
