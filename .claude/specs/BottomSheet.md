# BottomSheet 컴포넌트 명세

## 0. Atomic 계층 & 파일 배치

- **계층**: organisms — 전용 폴더 `components/popup/`에 위치
- **배치 경로**: `components/popup/BottomSheet.vue`
- **카테고리 barrel**: `components/popup/index.ts`
- **Base/Wrapper 분리**: Wrapper (`Popup.vue` 기반)
- **함께 작성되는 파일**:
  - `components/popup/useBottomSheet.ts` — 열기/닫기 컨트롤러 훅

> Popup.vue Base 명세: `.claude/specs/Popup.md`  
> LayerPopup 명세 (useLayerPopup 패턴 참조): `.claude/specs/LayerPopup.md`

---

## 1. 컴포넌트 개요

화면 하단에서 슬라이드업으로 등장하는 팝업. 모바일에서 추가 옵션 선택, 간단한 폼 입력, 리스트 선택 등에 사용한다. LayerPopup과 동일하게 slot 기반 + 훅 컨트롤러 패턴을 사용한다.

하단 핸들바(드래그 힌트) 디자인은 적용하지 않는다.

---

## 2. 영역 구성 (Area Map)

Popup.vue Base 구조 사용. `type="bottomSheet"` 고정으로 다음 시각적 특징을 가진다:

- 화면 **하단 고정**, width 100%
- 상단 모서리만 `$radius-lg` (하단은 0)
- 최대 높이 `80vh`, body 영역 오버플로 스크롤
- 슬라이드업(open) / 슬라이드다운(close) 애니메이션

---

## 2-1. Props 목록

LayerPopup.vue와 동일한 props 노출. (`type` 고정값만 다름)

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `open` | `boolean` | — (필수) | v-model:open |
| `title` | `string` | — | 헤더 타이틀 |
| `description` | `string` | — | a11y용 설명 텍스트 (`DialogDescription`으로 자동 래핑) |
| `showClose` | `boolean` | `true` | 닫기(×) 버튼 표시 |
| `okLabel` | `string` | `'확인'` | ok 버튼 텍스트 |
| `cancelLabel` | `string` | `'취소'` | cancel 버튼 텍스트 |
| `showCancel` | `boolean` | `true` | cancel 버튼 표시 |
| `okDisabled` | `boolean` | `false` | ok 버튼 비활성 |
| `closeOnOverlay` | `boolean` | `true` | dim 클릭 시 닫기 |
| `closeOnEscape` | `boolean` | `true` | ESC 키 입력 시 닫기 |

**내부 고정값**

| prop | 고정값 |
|------|--------|
| `type` | `'bottomSheet'` |

---

## 3. Slots

| 슬롯 | 필수 | 설명 |
|------|------|------|
| `default` | 권장 | body 영역 콘텐츠 (최대 80vh 내 스크롤) |
| `#header` | 선택 | 헤더 완전 교체 |
| `#footer` | 선택 | 푸터 완전 교체 |

---

## 4. useBottomSheet 인터페이스

### 파일: `components/popup/useBottomSheet.ts`

`usePopupState`(internal 공통 composable, LayerPopup.md § 4-1 정의)를 래핑한 named export.

```ts
// components/popup/useBottomSheet.ts
import { usePopupState } from './usePopupState'

export function useBottomSheet() {
  return usePopupState()
}
```

### 인터페이스

```ts
const sheet = useBottomSheet()
sheet.isOpen     // Ref<boolean> — v-model:open에 바인딩
sheet.open()     // 열기
sheet.close()    // 닫기
```

> ⚠️ **`isOpen` mutable Ref 필수**: 자세한 이유는 LayerPopup.md § 4-1 참조.

### 사용 패턴

```vue
<script setup>
const sheet = useBottomSheet()
</script>

<template>
  <Button @click="sheet.open()">정렬 선택</Button>

  <BottomSheet v-model:open="sheet.isOpen" title="정렬">
    <ul>
      <li v-for="option in sortOptions" :key="option.value">
        <button @click="selectSort(option)">{{ option.label }}</button>
      </li>
    </ul>
    <template #footer>
      <Button @click="sheet.close()">닫기</Button>
    </template>
  </BottomSheet>
</template>
```

---

## 5. 시각 스펙

| 항목 | 값 |
|------|-----|
| 위치 | `position: fixed; bottom: 0; left: 50%; translate: -50% 0; width: min(60rem, 100%)` |
| 최대 높이 | `80vh` |
| 상단 모서리 | `$radius-lg` |
| 하단 모서리 | `0` |
| body 스크롤 | `overflow-y: auto` |
| 애니메이션 open | slideUp — `$duration-base` |
| 애니메이션 close | slideDown — `$duration-base` |

---

## 6. 동작 규칙

LayerPopup.md § 5. 동작 규칙과 동일. 위치/애니메이션만 다름.

---

## 7. 이벤트 목록

Popup.vue Base emit 그대로 노출. LayerPopup.md § 6. 이벤트 목록과 동일.

### 7-1. emit forward 매커니즘

LayerPopup.md § 6-1과 동일한 패턴. BottomSheet.vue가 `defineEmits`로 7개 이벤트를 명시 재정의하고, `<Popup type="bottomSheet" @opened="emit('opened')" ... />`로 forward한다. 자동 forward는 동작하지 않는다.

---

## 8. 접근성 요구사항

Popup.vue Base 접근성 기준을 따른다.

| 항목 | 요구사항 |
|------|---------|
| `DialogTitle` | 항상 제공 (시각적으로 숨겨도 됨) |
| 닫기 버튼 | `aria-label="닫기"` 필수 |

---

## 9. 가이드 페이지

**경로**: `pages/guide/bottomSheet/index.vue`

`rules/guide-page.md`의 가이드 페이지 작성 규칙을 따른다. 아래 시연 시나리오를 포함한다:

| 시나리오 | 설명 |
|---------|------|
| 기본 BottomSheet | title + 짧은 콘텐츠 + ok/cancel |
| 긴 콘텐츠 스크롤 | 80vh 한계까지 채우는 리스트로 body 스크롤 시연 |
| 필터 선택 시나리오 | 라디오 그룹 + #footer slot의 `[초기화]` `[적용]` 패턴 |
| 슬라이드업 애니메이션 확인 | 열고 닫을 때 slideUp/slideDown 동작 |

**페이지 마크업 포인트**:
- `useBottomSheet()` 훅 + `<BottomSheet v-model:open="sheet.isOpen" ...>` 패턴
- 모바일 너비를 시뮬레이션할 수 있는 컨테이너 wrapper 권장 (max-width 화면)
- ⑥ Props/Slots/Events 섹션 HTML `<table>`
- `__delegationNote` / `__radixNote` 추가

---

## 구현 복잡도 신호

- BottomSheet.vue = Popup.vue + `type="bottomSheet"` 고정만 하는 얇은 래퍼
- useBottomSheet.ts = `usePopupState` 호출 한 줄 — useLayerPopup과 동일 매커니즘
- SCSS 포인트: `[data-state="open"]` slideUp / `[data-state="closed"]` slideDown 키프레임
