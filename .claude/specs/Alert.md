# Alert 컴포넌트 명세

## 0. Atomic 계층 & 파일 배치

- **계층**: organisms — 전용 폴더 `components/popup/`에 위치
- **배치 경로**: `components/popup/Alert.vue`
- **카테고리 barrel**: `components/popup/index.ts`
- **Base/Wrapper 분리**: Wrapper (`Popup.vue` 기반)
- **함께 작성되는 파일**:
  - `components/popup/useAlert.ts` — Alert 훅
  - `components/popup/usePopupManager.ts` — Alert/Confirm 공유 전역 인스턴스 관리
  - `components/popup/PopupRenderer.vue` — 전역 렌더러 (app.vue에 단 한 번 삽입)

> Popup.vue Base 명세 참조: `.claude/specs/Popup.md`

---

## 1. 컴포넌트 개요

단순 안내 메시지를 표시하는 팝업. ok 버튼(확인) 하나만 있으며, `useAlert().open()`으로 **프로그래매틱하게만** 사용한다. 템플릿에 `<Alert />`를 직접 마크업하지 않는다.

React의 `window.alert()`을 대체하는 커스텀 구현이지만, 비동기 처리 없이 fire-and-forget 방식으로 단순하게 사용한다. 필요 시 `onClose` 콜백으로 확인 후 로직을 실행할 수 있다.

---

## 2. 영역 구성 (Area Map)

Popup.vue Base 구조를 그대로 사용하며, 다음 사항이 고정된다:

- ① **Overlay**: 항상 표시
- ② **Container**: `type="alert"` 고정 (중앙 위치, max-width 32.8rem)
- ③ **Header**: `title` prop이 있을 때 Popup 헤더(`popup__header`)에 표시. `title` 없으면 비표시 (`DialogTitle`은 `VisuallyHidden`으로만 존재, a11y)
- ④ **Body**: `message` 텍스트만 (중앙 정렬) — `title`은 Popup 헤더에서 처리
- ⑤ **Footer**: ok 버튼 하나, full width, border-top 없음

---

## 2-1. Props 목록

Popup.vue props 중 다음만 외부 노출한다.

| prop      | 타입                                  | 기본값      | 설명                               |
| --------- | ------------------------------------- | ----------- | ---------------------------------- |
| `title`   | `string`                              | — (필수)    | 헤더 타이틀                        |
| `message` | `string`                              | —           | body 안내 메시지 텍스트. 생략 가능 |
| `okLabel` | `string`                              | `'확인'`    | ok 버튼 텍스트                     |
| `okColor` | `'secondary' \| 'primary' \| 'black'` | `'primary'` | ok 버튼 색상                       |

**내부 고정값** (외부 노출 안 함)

| prop             | 고정값                                     |
| ---------------- | ------------------------------------------ |
| `type`           | `'alert'`                                  |
| `showClose`      | `false` — 헤더 자체 비표시, 닫기 버튼 없음 |
| `showCancel`     | `false`                                    |
| `closeOnOverlay` | `true`                                     |
| `closeOnEscape`  | `true`                                     |

### `message` 표시 구조

Alert.vue는 `message` prop을 body slot 안의 `alert__message` 단락으로 직접 렌더링한다. Popup에 `:description` prop을 전달하지 않으며, `DialogDescription`은 빈 문자열로 마운트된다.

> **의도적 설계**: `:description="message"`를 전달하면 `aria-describedby`(DialogDescription)와 시각적 메시지 단락이 동시에 노출되어 스크린리더가 같은 내용을 두 번 읽는다. 시각적 body 안의 메시지 단락이 이미 접근성 트리에 노출되므로 `description` 전달을 생략한다.

```vue
<!-- Alert.vue 구현 패턴 -->
<template>
  <Popup
    type="alert"
    :open="true"
    :title="title"
    :ok-label="okLabel"
    :show-close="false"
    :show-cancel="false"
    :close-on-overlay="true"
    :close-on-escape="true"
    @ok="handleOk"
    @closed="handleClosed"
  >
    <div class="alert__body">
      <p class="alert__message">{{ message }}</p>
    </div>
  </Popup>
</template>
```

> `title` prop이 있으면 Popup의 헤더(`popup__header`)에 직접 렌더링된다. `title` 없으면 Popup.vue가 `VisuallyHidden`에 `'안내'` 기본 텍스트를 주입하여 접근성 요건을 충족시킨다.

---

## 3. useAlert 인터페이스

### 파일: `components/popup/useAlert.ts`

```ts
interface AlertConfig {
  title: string;
  message?: string;
  okLabel?: string;
  onClose?: () => void;
}

export function useAlert() {
  function open(config: AlertConfig): void;
  return { open };
}
```

### 사용 패턴

```ts
const { open } = useAlert();

// fire-and-forget (가장 일반적)
open({ title: '저장됐습니다.' });
open({ title: '안내', message: '처리가 완료됐습니다.' });

// 확인 후 처리 (onClose 콜백)
open({
  title: '오류',
  message: '로그인이 필요합니다.',
  onClose: () => router.push('/login'),
});
```

- `open()` 반환값: `void`
- ok 버튼 / 닫기(×) 버튼 / ESC / dim 클릭 → 모두 `onClose` 호출 후 팝업 인스턴스 제거

---

## 4. usePopupManager (Nuxt `useState` 기반 — SSR-safe)

### 파일: `components/popup/usePopupManager.ts`

Alert과 Confirm이 공유하는 전역 인스턴스 관리 composable.

> ⚠️ **SSR-safe 설계 필수**: 모듈 최상위 `reactive([])`는 Nuxt가 모듈을 캐싱하므로 **여러 사용자 요청 간 메모리가 공유**된다. 서버에서 누군가 `alert.open()`을 호출하면 다른 사용자에게도 표시된다. 이를 방지하기 위해 Nuxt의 `useState()`를 사용한다 — request-scope로 자동 격리되고 hydration도 안전하다.
>
> React 비교: Zustand의 `create(() => ({ ... }))`는 모듈 캐싱 싱글턴이지만 React 앱은 클라이언트만 동작하므로 문제 없음. Nuxt SSR 환경에서는 `useState()`가 동등한 역할.

```ts
interface PopupInstance {
  id: string;
  component: 'alert' | 'confirm';
  props: Record<string, unknown>;
}

export function usePopupManager() {
  // useState는 Nuxt가 자동 import. SSR에서 request-scoped, CSR에서 싱글턴.
  const instances = useState<PopupInstance[]>('popup-instances', () => []);

  function mount(instance: PopupInstance): void {
    instances.value.push(instance);
  }
  function unmount(id: string): void {
    const idx = instances.value.findIndex((i) => i.id === id);
    if (idx !== -1) instances.value.splice(idx, 1);
  }

  // readonly는 외부 직접 변형을 막기 위함. PopupRenderer는 이걸 v-for 순회.
  return { instances: readonly(instances), mount, unmount };
}
```

### Client-only 호출 가드

`useAlert().open()` / `useConfirm().open()`은 **클라이언트에서만 호출**해야 한다. 서버 사이드에서 호출하면 다음 요청까지 인스턴스가 남아 hydration mismatch 발생 가능.

```ts
// useAlert.ts 내부 가드 패턴
function open(config: AlertConfig): void {
  if (import.meta.server) return; // 서버에서는 무시
  // ... mount 로직
}
```

### ID 생성

`crypto.randomUUID()` 사용 (Node 19+, 모든 모던 브라우저 지원). 폴리필 불필요.

---

## 5. PopupRenderer.vue

### 파일: `components/popup/PopupRenderer.vue`

usePopupManager의 `instances`를 순회하며 Alert/Confirm을 렌더링. `app.vue`에 단 한 번 삽입한다.

```vue
<!-- app.vue 수정 -->
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <PopupRenderer />
</template>
```

PopupRenderer 내부는 `<template v-for>` + 컴포넌트 분기 구조. Radix Vue DialogPortal이 body에 직접 마운트하므로 별도 Teleport 불필요.

---

## 6. 동작 규칙

### 6-1. 닫기 조건

다음 모두 팝업을 닫고 `onClose` 실행:

- ok 버튼 클릭
- ESC 키
- dim 클릭

### 6-2. 다중 Alert 동시 표시

동시에 여러 `open()`을 호출하면 인스턴스 배열에 순서대로 쌓이며, z-index 마운트 순서로 자동 쌓임. 각각 독립적으로 닫힌다.

---

## 7. 상태(State) 정의

| 상태 | 설명                                                        |
| ---- | ----------------------------------------------------------- |
| 대기 | `useAlert().open()` 호출 전. 팝업 없음                      |
| 표시 | `instances`에 Alert 항목 존재. PopupRenderer가 Alert 렌더링 |
| 닫힘 | ok/ESC/dim 클릭. `instances`에서 제거. `onClose` 호출       |

---

## 8. 이벤트 목록

useAlert의 `open()` 호출 시 제공하는 이벤트:

| 이벤트 (콜백 prop) | 발생 시점                                                 |
| ------------------ | --------------------------------------------------------- |
| `onClose`          | ok / ESC / dim 클릭 — 팝업이 닫히고 인스턴스 제거 후 호출 |

> 별도 emit 없음. Alert.vue는 내부적으로 Popup.vue의 emit을 처리한다.

---

## 9. 접근성 요구사항

Popup.vue Base 접근성 기준을 그대로 따른다 (`DialogTitle` / `DialogDescription` 항상 마운트 정책).

| 항목                | 요구사항                                                                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DialogTitle`       | `title` prop 있으면 `popup__header`에 직접 렌더링. `title` 없으면 `VisuallyHidden`으로 기본 텍스트 `"안내"` 주입 (Popup.vue가 `type="alert"` 분기로 처리). |
| `DialogDescription` | Alert는 `message`가 필수이므로 항상 텍스트 존재. `DialogDescription`으로 래핑하여 `aria-describedby` 자동 연결                                             |
| 포커스 초기화       | open 시 ok 버튼에 포커스 이동 권장 (`@open-auto-focus.prevent` 후 nextTick에서 ref.focus())                                                                |
| 색상 대비           | message 텍스트와 팝업 배경 대비 4.5:1 이상                                                                                                                 |

---

## 10. 가이드 페이지

**경로**: `pages/guide/alert/index.vue`

`rules/guide-page.md`의 가이드 페이지 작성 규칙을 따른다. 아래 시연 시나리오를 포함한다:

| 시나리오     | 설명                                                                                                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------- |
| 기본 호출    | `useAlert().open({ title: '저장됐습니다.' })` 트리거 버튼                                                        |
| 메시지 포함  | `open({ title: '안내', message: '처리가 완료됐습니다.' })`                                                       |
| onClose 콜백 | `open({ title: '알림', message: '닫으면 콘솔 로그', onClose: () => console.log('dismissed') })` — 콜백 동작 시연 |
| 다중 표시    | 버튼 연속 클릭 시 여러 Alert이 z-index 순으로 쌓이는 모습                                                        |

**페이지 마크업 포인트**:

- `<Alert />`를 직접 마크업하지 않고 `useAlert` 훅 호출만 페이지에 작성
- `<PopupRenderer />`가 app.vue에 이미 삽입되어 있어 별도 작업 불필요
- ⑥ Props 섹션은 useAlert config 인터페이스를 표로 작성 (`rules/guide-page.md` HTML `<table>` 형식 따름)

---

## 구현 복잡도 신호

- Alert.vue 자체는 단순 — Popup.vue에 고정 props 전달
- 복잡도는 usePopupManager + PopupRenderer 조합에 있음
- **SSR-safe 핵심**: `useState('popup-instances', () => [])` 사용 (모듈 최상위 reactive 금지)
- **Client-only 가드**: `open()` 내부에서 `import.meta.server` 체크
- PopupRenderer는 SSR 첫 렌더 시 instances가 비어 있으므로 `<template v-for>` 빈 배열 렌더링 — hydration mismatch 없음
