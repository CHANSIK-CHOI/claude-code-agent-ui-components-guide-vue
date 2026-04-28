# FullPopup 컴포넌트 명세

## 0. Atomic 계층 & 파일 배치

- **계층**: organisms — 전용 폴더 `components/popup/`에 위치
- **배치 경로**: `components/popup/FullPopup.vue`
- **카테고리 barrel**: `components/popup/index.ts`
- **Base/Wrapper 분리**: Wrapper (`Popup.vue` 기반)
- **함께 작성되는 파일**:
  - `components/popup/useFullPopup.ts` — 열기/닫기 컨트롤러 훅

> Popup.vue Base 명세: `.claude/specs/Popup.md`  
> LayerPopup 명세 (훅 패턴 참조): `.claude/specs/LayerPopup.md`

---

## 1. 컴포넌트 개요

화면 전체를 덮는 팝업. 모바일에서 상세 필터 설정, 이미지 뷰어, 긴 약관 전문 보기, 전체화면 폼 입력 등에 사용한다. 오른쪽에서 슬라이드 인 하는 애니메이션으로 네이티브 앱의 화면 전환 느낌을 준다.

LayerPopup/BottomSheet와 동일하게 slot 기반 + 훅 컨트롤러 패턴을 사용한다.

---

## 2. 영역 구성 (Area Map)

Popup.vue Base 구조 사용. `type="full"` 고정으로 다음 시각적 특징을 가진다:

- **전체화면** (`100dvw × 100dvh`)
- 모서리 없음 (`border-radius: 0`)
- Overlay(dim) 없음 — 전체화면이므로 불필요
- 헤더 닫기(×) 버튼이 **뒤로가기** 역할
- 슬라이드-인-라이트(open) / 슬라이드-아웃-라이트(close) 애니메이션

---

## 2-1. Props 목록

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `open` | `boolean` | — (필수) | v-model:open |
| `title` | `string` | — | 헤더 타이틀 |
| `description` | `string` | — | a11y용 설명 텍스트 (`DialogDescription`으로 자동 래핑) |
| `showClose` | `boolean` | `true` | 헤더 닫기(뒤로가기) 버튼 표시 |
| `okLabel` | `string` | `'확인'` | ok 버튼 텍스트 |
| `cancelLabel` | `string` | `'취소'` | cancel 버튼 텍스트 |
| `showCancel` | `boolean` | `false` | cancel 버튼 표시. 전체화면은 기본 숨김 |
| `okDisabled` | `boolean` | `false` | ok 버튼 비활성 |
| `closeOnOverlay` | `boolean` | `false` | dim 없으므로 기본 false |
| `closeOnEscape` | `boolean` | `true` | ESC 키 입력 시 닫기 |

**내부 고정값**

| prop | 고정값 |
|------|--------|
| `type` | `'full'` |

> `showCancel` 기본값이 LayerPopup/BottomSheet와 다름 (`false`). 전체화면 팝업은 헤더의 닫기 버튼으로 나가는 패턴이 일반적이므로.

---

## 3. Slots

| 슬롯 | 필수 | 설명 |
|------|------|------|
| `default` | 권장 | body 영역 콘텐츠 (전체화면 기준 스크롤) |
| `#header` | 선택 | 헤더 완전 교체 |
| `#footer` | 선택 | 푸터 완전 교체 |

---

## 4. useFullPopup 인터페이스

### 파일: `components/popup/useFullPopup.ts`

`usePopupState`(internal 공통 composable, LayerPopup.md § 4-1 정의)를 래핑한 named export.

```ts
// components/popup/useFullPopup.ts
import { usePopupState } from './usePopupState'

export function useFullPopup() {
  return usePopupState()
}
```

### 인터페이스

```ts
const filterPopup = useFullPopup()
filterPopup.isOpen     // Ref<boolean> — v-model:open에 바인딩
filterPopup.open()     // 열기
filterPopup.close()    // 닫기
```

> ⚠️ **`isOpen` mutable Ref 필수**: 자세한 이유는 LayerPopup.md § 4-1 참조.

### 사용 패턴

```vue
<script setup>
const filterPopup = useFullPopup()
</script>

<template>
  <Button @click="filterPopup.open()">상세 필터</Button>

  <FullPopup v-model:open="filterPopup.isOpen" title="상세 필터">
    <FilterForm />
    <template #footer>
      <Button shape="line" color="gray" @click="filterPopup.close()">초기화</Button>
      <Button @click="applyFilter">적용</Button>
    </template>
  </FullPopup>
</template>
```

---

## 5. 시각 스펙

| 항목 | 값 |
|------|-----|
| 위치 | `position: fixed; top: 0; left: 0` |
| 크기 | `width: 100dvw; height: 100dvh` |
| 모서리 | `border-radius: 0` |
| Overlay | 없음 (`DialogOverlay` 미렌더링 또는 투명) |
| 애니메이션 open | slideInRight — `$duration-slow` |
| 애니메이션 close | slideOutRight — `$duration-slow` |
| body 스크롤 | `overflow-y: auto` |

> `100dvh`: 모바일 브라우저 주소창을 제외한 실제 뷰포트 높이. `100vh` 대신 `dvh` 사용.

---

## 6. 동작 규칙

### 6-1. Overlay 처리

`type="full"`이면 Popup.vue Base에서 `DialogOverlay`를 렌더링하지 않거나 완전 투명으로 처리한다. 전체화면이 이미 dim 역할을 하기 때문이다.

### 6-2. 닫기 버튼 아이콘

`showClose=true`일 때 일반 × 아이콘 대신 **← 뒤로가기 아이콘** 사용을 권장한다. 전체화면 팝업이 새 화면처럼 동작하기 때문이다. FullPopup.vue가 닫기 버튼 아이콘을 교체한다.

---

## 7. 이벤트 목록

Popup.vue Base emit 그대로 노출. LayerPopup.md § 6. 이벤트 목록과 동일.

### 7-1. emit forward 매커니즘

LayerPopup.md § 6-1과 동일한 패턴. FullPopup.vue가 `defineEmits`로 7개 이벤트를 명시 재정의하고, `<Popup type="full" @opened="emit('opened')" ... />`로 forward한다. 자동 forward는 동작하지 않는다.

---

## 8. 접근성 요구사항

| 항목 | 요구사항 |
|------|---------|
| `DialogTitle` | 항상 제공 |
| 닫기 버튼 | `aria-label="뒤로가기"` (전체화면 맥락에서 더 명확) |
| 포커스 관리 | 열릴 때 본문 첫 포커스 가능 요소로 이동 |

---

## 9. 가이드 페이지

**경로**: `pages/guide/fullPopup/index.vue`

`rules/guide-page.md`의 가이드 페이지 작성 규칙을 따른다. 아래 시연 시나리오를 포함한다:

| 시나리오 | 설명 |
|---------|------|
| 기본 FullPopup | title + 본문 콘텐츠 + 헤더 뒤로가기 버튼 |
| 폼 입력 시나리오 | 상세 필터 form + #footer slot의 `[초기화]` `[적용]` 패턴 |
| 슬라이드-인-라이트 애니메이션 확인 | 열고 닫을 때 오른쪽에서 들어오고 나가는 동작 |
| 뒤로가기 vs ok 액션 분리 | 헤더 ← 버튼은 cancel(close) 의미, footer ok는 적용 의미 |

**페이지 마크업 포인트**:
- `useFullPopup()` 훅 + `<FullPopup v-model:open="filterPopup.isOpen" ...>` 패턴
- 모바일 너비 시뮬레이션 컨테이너 권장
- ⑥ Props/Slots/Events 섹션 HTML `<table>`
- `__delegationNote` / `__radixNote` 추가
- 닫기 버튼 aria-label이 `"뒤로가기"`임을 명시

---

## 구현 복잡도 신호

- FullPopup.vue = Popup.vue + `type="full"` 고정 + 닫기 아이콘 교체
- useFullPopup.ts = `usePopupState` 호출 한 줄 — useLayerPopup과 동일 매커니즘
- SCSS 포인트: `[data-state="open"]` slideInRight / `[data-state="closed"]` slideOutRight 키프레임, Overlay 투명 처리
