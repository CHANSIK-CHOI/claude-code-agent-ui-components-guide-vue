# BottomSheet 컴포넌트 명세

## 0. Atomic 계층 & 파일 배치

- **계층**: organisms — 전용 폴더 `components/popup/`에 위치
- **배치 경로**: `components/popup/BottomSheet.vue`
- **카테고리 barrel**: `components/popup/index.ts`
- **Base/Wrapper 분리**: Wrapper (`Popup.vue` 기반)

> Popup.vue Base 명세: `.claude/specs/Popup.md`  
> LayerPopup 명세 (open 제어 패턴 참조): `.claude/specs/LayerPopup.md`

---

## 1. 컴포넌트 개요

화면 하단에서 슬라이드업으로 등장하는 팝업. 모바일에서 추가 옵션 선택, 간단한 폼 입력, 리스트 선택 등에 사용한다. LayerPopup과 동일하게 slot 기반 + `v-model:open` 제어 패턴을 사용한다.

하단 핸들바(드래그 힌트) 디자인은 적용하지 않는다.

---

## 2. 영역 구성 (Area Map)

Popup.vue Base 구조 사용. `type="bottomSheet"` 고정으로 다음 시각적 특징을 가진다:

- 화면 **하단 고정**, width 100%
- 상단 모서리만 `2rem 2rem 0 0` (20px, 하단은 0)
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
| `footerLayout` | `'equal' \| 'wide'` | `'equal'` | footer 버튼 비율. `equal`: 50%/50%, `wide`: cancel 37.5% / ok 62.5% (120:200 비율). 내부적으로 Popup의 `narrowCancel` prop에 매핑되어 CSS 변수 방식으로 footer 자식에 적용됨 — `#footer` slot 커스텀 자식에도 동작 |
| `deferContent` | `boolean` | `false` | `true`이면 열림 애니메이션 완료 후에 default slot을 렌더한다. BottomSheet의 슬라이드업 중 무거운 콘텐츠(Tab·이미지 목록 등)가 있을 때 "슬라이드가 안 보이는" 현상을 회피한다. 동작 상세는 `Popup.md` §5-6 참조 |

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

## 4. 팝업 open 제어

팝업 open 제어는 `defineModel('open')` + `v-model:open` 표준을 따른다. `useBottomSheet` / `usePopupState` hook은 삭제됐다. 상세: `rules/popups.md §3`.

### 사용 패턴

```vue
<script setup>
const isSortOpen = ref(false)
</script>

<template>
  <Button @click="isSortOpen = true">정렬 선택</Button>

  <BottomSheet v-model:open="isSortOpen" title="정렬">
    <ul>
      <li v-for="option in sortOptions" :key="option.value">
        <button @click="selectSort(option)">{{ option.label }}</button>
      </li>
    </ul>
    <template #footer>
      <Button @click="isSortOpen = false">닫기</Button>
    </template>
  </BottomSheet>
</template>
```

---

## 5. 시각 스펙

| 항목 | 값 |
|------|-----|
| 위치 | `position: absolute; bottom: 0; left: 0; right: 0; width: 100%` |
| 최대 높이 | `80vh` |
| 상단 모서리 | `2rem 2rem 0 0` (20px 20px 0 0) |
| 하단 모서리 | `0` |
| 컨테이너 padding | `3rem 1.6rem 1rem` (top 30 · left/right 16 · bottom 10) |
| 컨테이너 gap | `2rem` (header↔body, body↔footer 모두 20px) |
| header override | `padding: 0`, `border-bottom: none`, title `text-align: center` |
| body override | `padding: 0` |
| footer override | `padding: 0`, `border-top: none` |
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
| 기본 BottomSheet | title + 짧은 콘텐츠 + ok/cancel + 기본 showClose=true X버튼 |
| 긴 콘텐츠 스크롤 | 80vh 한계까지 채우는 리스트로 body 스크롤 시연 |
| 필터 선택 시나리오 | 라디오 그룹 + #footer slot의 `[초기화]` `[적용]` 패턴 |
| footerLayout="wide" | cancel 37.5% / ok 62.5% 비대칭 버튼 레이아웃 시연 |

**페이지 마크업 포인트**:
- `ref(false)` + `<BottomSheet v-model:open="isXxxOpen" ...>` 패턴
- 모바일 너비를 시뮬레이션할 수 있는 컨테이너 wrapper 권장 (max-width 화면)
- ⑥ Props/Slots/Events 섹션 HTML `<table>`
- `__delegationNote` / `__radixNote` 추가

---

## 구현 복잡도 신호

- BottomSheet.vue = Popup.vue + `type="bottomSheet"` 고정만 하는 얇은 래퍼
- SCSS 포인트: `[data-state="open"]` slideUp / `[data-state="closed"]` slideDown 키프레임
