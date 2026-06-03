# Popup 컴포넌트 명세 (Base)

## 0. Atomic 계층 & 파일 배치

- **계층**: organisms — 전용 폴더 `components/popup/`에 위치
- **배치 경로**: `components/popup/Popup.vue`
- **카테고리 barrel**: `components/popup/index.ts`
- **Base/Wrapper 분리**: Base만 (`Popup.vue`). **직접 사용하지 않음** — Alert/Confirm/LayerPopup/BottomSheet/FullPopup Wrapper가 내부에서 사용
- **헤드리스 기반**: Radix Vue **Dialog** (Stable)

---

## 1. 컴포넌트 개요

팝업 계열 전체(Alert, Confirm, LayerPopup, BottomSheet, FullPopup)의 공통 구조를 담당하는 Base 컴포넌트. Radix Vue Dialog를 래핑하여 접근성(포커스 트랩, ESC, ARIA 연결), body scroll lock, Portal 마운트를 자동 처리한다.

헤더(타이틀 + 닫기 버튼) / 스크롤 바디 / 푸터(ok + cancel) 3구역 레이아웃을 제공하며, 모든 구역은 slot으로 교체 가능하다. `type` prop으로 레이어 팝업 / 바텀시트 / 전체화면 세 가지 시각 variant를 구분한다.

---

## 2. 영역 구성 (Area Map)

```
┌────────────────────────────────────┐
│  ① Overlay (Dim)                   │  DialogOverlay — 배경 어둠
│  ┌──────────────────────────────┐  │
│  │  ② Container                │  │  DialogContent — 팝업 박스
│  │  [⑥ CloseBtn] (absolute)    │  │  position: absolute; top: 1rem; right: 1rem
│  │  ────────────────────────── │  │
│  │  ③ Header (선택)             │  │  title 텍스트만 담당 (닫기 버튼 없음)
│  │  ────────────────────────── │  │
│  │  ④ Body (스크롤 영역)        │  │  default slot
│  │     └─ [bodyNote — Wrapper 전용] │  아이콘+텍스트 도움말 (slot 아래)
│  │  ────────────────────────── │  │
│  │  ⑤ Footer (선택)             │  │  cancel + ok 버튼 or #footer slot
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

- ① **Overlay** — `DialogOverlay`. dim 배경. `closeOnOverlay=true`면 **좌클릭(마우스 버튼 0)** 시 닫힘.
  - `@click` 대신 `@pointerdown` 사용: 모바일 터치에서 Select 드롭다운 열기 시 synthetic click이 overlay에 도달하는 버그 회피.
  - **좌클릭 전용**: `pointerdown` 이벤트의 `button === 0`인 경우에만 닫힘 처리. 우클릭(`button === 2`)·중간 버튼 클릭(`button === 1`)은 무시한다. 터치 이벤트(`pointerType === 'touch'`)는 `button === 0`으로 설정되므로 터치 닫힘에는 영향 없음.
  - **드롭다운 열림 시 overlay 닫기 차단**: Select 등 Radix Vue 드롭다운(`role="listbox"`)이 열려 있는 동안에는 overlay를 클릭해도 팝업이 닫히지 않는다. 이유: Select 열림 중 Radix Vue가 `DialogContent`에 `pointer-events: none`을 인라인으로 적용해 dialog 영역 클릭이 overlay까지 투과된다. Select 닫힘 처리는 Select의 DismissableLayer에 위임. `handleOverlayPointerDown`에서 `document.querySelector('[role="listbox"][data-state="open"]')` 존재 여부로 감지.
- ② **Container** — `DialogContent`. 팝업 본체. type에 따라 위치/크기/애니메이션 결정
- ③ **Header** — `title` prop 또는 `#header` slot. `title`이 없으면 미렌더링. **닫기 버튼은 ⑥으로 분리**. `<div class="popup__header">` 태그 사용 (`<header>` 아님)
- ④ **Body** — `default slot`. 내부 콘텐츠를 스크롤 가능하게 래핑.
  `bodyLabel` prop이 있으면 slot 위에 안내 레이블 텍스트를 렌더링 (가이드라인·주의문구·소제목 등 body 콘텐츠 머리에 붙는 고정 텍스트).
  `bodyNote` prop(Wrapper 전용 — LayerPopup / BottomSheet / FullPopup에서만 노출)이 있으면 slot 아래에 아이콘(CircularNoteSvg, size="sm") + 텍스트 조합의 도움말 문구를 렌더링.
- ⑤ **Footer** — `#footer` slot 제공 시 slot 사용. 없으면 `Button` 컴포넌트(size="lg")로 ok/cancel 버튼 렌더링. ok는 `shape="solid" :color="okColor"`, cancel은 `shape="solid" :color="cancelColor"`. 버튼이 모두 숨겨지거나 slot이 비어 있으면 미렌더링. `<div class="popup__footer">` 태그 사용 (`<footer>` 아님). **`narrowCancel=true` 시 footer `<div>`에 CSS 변수(`--footer-cancel-flex`, `--footer-cancel-max`, `--footer-ok-flex`)를 설정하여 SCSS `> :first-child / > :last-child` 선택자로 적용** — custom `#footer` slot 자식에도 동작함
- ⑥ **CloseBtn** — `showClose=true`일 때 DialogContent 바로 안에 `position: absolute; top: 1rem; right: 1rem` 배치. 모든 type(layer / bottomSheet / full) 공통 적용. 크기 `width: 1.6rem; height: 1.6rem` 고정.

---

## 2-1. Props 목록

| prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `open` | `boolean` | — (필수) | v-model:open 바인딩 |
| `type` | `'layer' \| 'bottomSheet' \| 'full'` | `'layer'` | 팝업 종류 — CSS variant 및 애니메이션 결정 |
| `title` | `string` | — | 헤더 타이틀 텍스트. 시각적 표시 여부와 별개로 `DialogTitle`은 항상 렌더링 (a11y) |
| `description` | `string` | — | 팝업 설명 텍스트. `DialogDescription`은 항상 렌더링 (a11y) |
| `showClose` | `boolean` | `true` | 헤더 닫기(×) 버튼 표시 여부 |
| `okLabel` | `string` | `'확인'` | ok 버튼 텍스트 |
| `cancelLabel` | `string` | `'취소'` | cancel 버튼 텍스트 |
| `showCancel` | `boolean` | `true` | cancel 버튼 표시 여부 |
| `okDisabled` | `boolean` | `false` | ok 버튼 비활성. `Button` 컴포넌트의 `disabled` prop으로 위임 |
| `cancelColor` | `'secondary' \| 'gray'` | `'gray'` | cancel 버튼 Button color prop |
| `okColor` | `'secondary' \| 'primary' \| 'black'` | `'primary'` | ok 버튼 Button color prop |
| `narrowCancel` | `boolean` | `false` | `true`이면 footer `<div>` 컨테이너에 CSS 변수(`--footer-cancel-flex: 120`, `--footer-cancel-max: 12rem`, `--footer-ok-flex: 200`)를 설정. SCSS `> :first-child / > :last-child` 선택자로 cancel/ok 모두에 비율 적용. **`#footer` slot 커스텀 자식에도 동작함.** 기본값(false)이면 양쪽 모두 `flex: 1` (50:50 균등) |
| `closeOnOverlay` | `boolean` | `true` | dim(overlay) 클릭 시 팝업 닫기 여부 |
| `closeOnEscape` | `boolean` | `true` | ESC 키 입력 시 팝업 닫기 여부 |
| `closeOnCloseBtn` | `boolean` | `true` | 닫기(×) 버튼 클릭 시 내부 자동 닫기 여부. `false`이면 `update:open(false)` 자동 호출을 막고 Radix `DialogClose` 래핑도 제거되어 부모가 `close` 이벤트 수신 후 직접 닫아야 함 |
| `closeOnCancel` | `boolean` | `true` | cancel 버튼 클릭 시 내부 자동 닫기 여부. `false`이면 `update:open(false)` 자동 호출을 막고 부모가 `cancel` 이벤트 수신 후 직접 닫아야 함 |
| `showFooter` | `boolean` | `true` | footer 영역 표시 여부. `false`면 `<div class="popup__footer">` 태그 자체를 렌더링하지 않음. `#footer` slot·ok/cancel 버튼 모두 숨겨짐 |
| `bodyLabel` | `string` | — | body 콘텐츠 상단에 표시되는 안내 레이블 텍스트. slot 위에 렌더링되며, 없으면 미표시. 스타일은 Wrapper(LayerPopup 등)가 담당. **Alert / Confirm Wrapper는 이 prop을 외부에 노출하지 않는다** |
| `bodyNote` | `string` | — | body 콘텐츠 하단에 표시되는 도움말 문구. `<Icon size="sm"><CircularNoteSvg /></Icon>` + 텍스트 조합으로 렌더링. slot 아래에 렌더링되며, 없으면 미표시. 스타일은 Wrapper가 담당. **Alert / Confirm Wrapper는 이 prop을 외부에 노출하지 않는다** |
| `deferContent` | `boolean` | `false` | `true`이면 default slot(본문 콘텐츠)을 열림 애니메이션 완료 시점(`@after-enter`) 이후에만 렌더한다. 닫힘 완료(`@after-leave`) 시 내부 렌더 상태를 리셋한다. `title`·`bodyLabel`·footer 등 "셸"은 항상 즉시 렌더되고, **default slot만 지연**된다. 주로 `bottomSheet`·`full` slide 타입에서 사용. 상세 설명은 §5-6 참조 |

> `title`이 비어 있어도 `DialogTitle`은 항상 마운트되며 시각적으로만 숨긴다 (Radix Vue가 dev 워닝을 띄우기 때문). `description`도 동일.  
> `title`이 없고 `showClose=false`이면 시각적 Header 박스(`.popup__header`)는 렌더링하지 않되, `DialogTitle`은 `VisuallyHidden`으로 트리에 포함시킨다.

---

## 3. Variant 목록

### 3-1. type (팝업 종류 축)

| type | 위치 | 크기 | 애니메이션 | 사용 맥락 |
|------|------|------|-----------|---------|
| `layer` | 컨테이너 중앙 | max-width 48rem | fadeScaleIn/Out | 일반 레이어 팝업, Alert, Confirm |
| `bottomSheet` | 컨테이너 하단 | width 100% (컨테이너 = 60rem), max-height 80vh | slideUp/Down | 모바일 바텀시트 |
| `full` | 컨테이너 전체 | 100% × 100dvh (컨테이너 = 60rem) | slideInRight/OutRight | 모바일 전체화면 레이어 |

---

## 4. 상태(State) 정의

| 상태 | 시각적 변화 | 기능적 변화 |
|------|------------|------------|
| closed (default) | 팝업 숨김 (`display: none` 또는 미마운트) | 포커스 트랩 해제, body scroll 복원 |
| open | 팝업 표시, Overlay 표시, 열림 애니메이션 | 포커스 트랩 활성, body scroll lock |
| ok-disabled | ok 버튼 회색, cursor: not-allowed | ok 버튼 클릭 불가 |

---

## 5. 동작 규칙

### 5-1. 열기 / 닫기 트리거 (자동 닫힘 vs 부모 책임)

**원칙**: 사용자의 "닫기 의도" 트리거(닫기/ESC/dim/cancel)는 자동 닫기. **ok 버튼만** 비동기 처리 후 조건부 닫기를 위해 부모 책임으로 둔다.

| 트리거 | emit | `update:open(false)` 자동 발생 여부 | 조건 |
|--------|------|-------------|------|
| `open=true` prop | — | — (외부 제어) | — |
| `open=false` prop | — | — (외부 제어) | — |
| 닫기(×) 버튼 클릭 | `close` | `closeOnCloseBtn=true`이면 ✅ 자동 / `false`이면 ❌ **부모 책임** | — |
| **ok 버튼 클릭** | `ok` | ❌ **부모 책임** — 비동기 처리 후 부모가 명시적 close | `okDisabled=false` |
| cancel 버튼 클릭 | `cancel` | `closeOnCancel=true`이면 ✅ 자동 / `false`이면 ❌ **부모 책임** | — |
| dim 클릭 | `overlayClick` | ✅ 자동 | `closeOnOverlay=true` + **좌클릭(`pointerdown button === 0`)에 한함** |
| ESC 키 | — (Radix Vue 자동 처리) | ✅ 자동 (Radix Vue → onOpenChange) | `closeOnEscape=true` |

> **ok + 조건부 × 가 부모 책임**: `await deleteItem()` 같은 비동기 처리 후 성공 시에만 닫는 패턴(Confirm, LayerPopup)을 위해 `ok`는 항상 부모 책임. `closeOnCloseBtn=false` 시 ×를 눌러도 `update:open(false)` 자동 호출 없음 — Radix Vue의 `DialogClose` 래핑도 제거되므로 부모가 `@close` 수신 후 명시적으로 닫아야 함.

### 5-2. `#footer` slot 우선순위 및 footer 렌더링 조건

footer는 `showFooter` prop이 `true`(기본값)일 때만 렌더링된다. `showFooter=false`면 `#footer` slot 제공 여부와 무관하게 `<div class="popup__footer">` 태그 자체를 렌더링하지 않는다.

`#footer` slot이 제공되면 ok/cancel 기본 버튼 전체를 대체한다. 기본 버튼과 slot을 동시에 렌더링하지 않는다.

`narrowCancel` prop은 footer `<div>` 컨테이너에 CSS 변수로 설정되므로, `#footer` slot을 사용해 커스텀 마크업을 넣더라도 slot의 첫 번째 자식(`:first-child`)과 마지막 자식(`:last-child`)에 비율이 동일하게 적용된다. slot의 각 자식이 `flex` 아이템이 되도록 마크업을 구성해야 한다.

### 5-3. Header 렌더링 조건

닫기 버튼은 Header 박스 외부(DialogContent 안 absolute)에 위치하므로, Header 박스 렌더링은 `title` 유무로만 결정한다.

| 조건 | 시각적 Header 박스 (`.popup__header`) | a11y용 DialogTitle | 닫기 버튼 (absolute) |
|------|--------------------------------------|--------------------|---------------------|
| `title` 있음 | ✅ | ✅ (visible) | `showClose=true`면 렌더링 |
| `title` 없음 + `showClose=true` | ❌ (미렌더링) | ✅ (`VisuallyHidden`으로 마운트) | 렌더링 (absolute 위치) |
| `title` 없음 + `showClose=false` | ❌ (미렌더링) | ✅ (`VisuallyHidden`으로 마운트 — Radix Vue dev 워닝 회피) | 미렌더링 |
| `#header` slot 제공 | slot으로 교체 | ⚠️ slot 안에서 `<DialogTitle>` 처리 정책 — 아래 § 5-4 참조 | 미렌더링 (`showClose` prop 무시 — slot에서 직접 구현) |

### 5-4. `#header` slot 사용 시 DialogTitle 처리

`#header` slot은 시각적 헤더 영역(`.popup__header`)을 완전 교체하므로 slot 안에서 어떻게 헤더 마크업을 작성할지 publisher가 결정해야 한다. **DialogTitle은 a11y 위해 항상 마운트되어야 한다** — Radix Vue가 dev 워닝을 띄우기 때문.

**권장 패턴**: slot을 사용할 때도 `title` prop을 비워두면 Popup.vue가 `VisuallyHidden DialogTitle`을 자동 마운트한다 (§ 8 트리 구조의 `v-if="!title"` 조건). 따라서 slot 안에서 별도로 `<DialogTitle>`을 작성할 필요 없음.

```vue
<!-- ✅ 권장 — title prop 비우고 slot에서 자유롭게 마크업 -->
<LayerPopup>
  <template #header>
    <div class="customHeader">
      <img src="hero.jpg" />
      <h2>커스텀 타이틀</h2>  <!-- 시각용. DialogTitle은 Popup이 자동 hidden 마운트 -->
    </div>
  </template>
  <slot />
</LayerPopup>

<!-- ❌ 비권장 — slot 안에서 또 DialogTitle을 직접 래핑하면 중복 발생 가능 -->
<LayerPopup>
  <template #header>
    <DialogTitle>...</DialogTitle>  <!-- title prop이 없어 Popup이 hidden DialogTitle도 마운트 → 중복 -->
  </template>
</LayerPopup>
```

> publisher가 slot 안에서 `<DialogTitle>`을 직접 래핑해야 하는 경우(예: 시각적 타이틀 텍스트를 DialogTitle 자체로 만들고 싶을 때): `title` prop도 함께 제공하거나, 별도 prop으로 "외부 DialogTitle 사용 모드" 플래그를 추가하는 것은 현재 명세에 포함하지 않는다. 필요 시 후속 명세에서 검토.

### 5-5. 닫기 버튼 배치 규칙

- 모든 type(layer / bottomSheet / full)에서 통일: DialogContent 바로 안에 `position: absolute; top: 1rem; right: 1rem` 배치
- Header 박스(`.popup__header`) 안에 닫기 버튼을 인라인으로 두지 않는다 — Header는 타이틀 텍스트만 담당
- 크기: `width: 1.6rem; height: 1.6rem` — Popup.vue SCSS `.popup__closeBtn`에 고정값 선언
- `popup__closeBtn--absolute` modifier는 제거. 기본 `.popup__closeBtn`에 absolute 포지셔닝 통합
- alert / confirm type은 닫기 버튼 없음 (`showClose` prop 기본값 무관)

### 5-6. deferContent — 슬라이드 애니메이션 중 콘텐츠 지연 렌더

**문제 상황**: 팝업 안에 Tab·이미지 등 노드가 많은 무거운 콘텐츠가 열림 슬라이드(`transform`) 애니메이션과 동시에 렌더되면, 브라우저가 transform 계산과 대규모 DOM 삽입을 한 프레임에 처리하지 못하고 최종 위치로 스냅한다 — "슬라이드가 안 보이는" 현상.

**해결 방식**: `deferContent=true`이면 열림 애니메이션 완료(`@after-enter`) 전까지 default slot을 렌더링하지 않는다. 슬라이드 동안은 가벼운 셸(헤더·footer)만 움직이고, 완료 후 콘텐츠를 채워 넣는다.

| 조건 | 렌더 대상 |
|------|---------|
| 팝업 열리는 중 (애니메이션 진행) | 셸(헤더 `title`, `bodyLabel`, footer)만 |
| 열림 완료(`@after-enter`) 이후 | 셸 + default slot |
| 닫힘 완료(`@after-leave`) 이후 | default slot 렌더 상태 리셋 |

**트레이드오프**: 콘텐츠가 열림 완료 후 붙으므로 팝업 높이가 한 번 커지는 시각적 변화가 생긴다(셸 높이 → 콘텐츠 포함 높이). 스켈레톤·`min-height` 처리로 완화 가능하나 현재 명세에는 포함하지 않는다.

**적용 권장 시나리오**:
- `type="bottomSheet"` — 슬라이드업 중 무거운 리스트·Tab 콘텐츠가 있을 때 (주 사용처)
- `type="full"` — 슬라이드-인-라이트 중 무거운 콘텐츠가 있을 때
- `type="layer"` — fade+scale이므로 필요성은 낮으나 사용 자체는 가능

**사용 예**: `<BottomSheet :defer-content="true">…무거운 콘텐츠…</BottomSheet>`

### 5-4. 중복 팝업

여러 팝업이 동시에 열릴 수 있다. z-index는 `$z-modal(300)` 기준으로 마운트 순서에 따라 자동 쌓임.

---

## 6. 이벤트 목록

| 이벤트 | 발생 시점 | 전달값 |
|--------|---------|--------|
| `update:open` | open 상태 변경 시 (v-model 바인딩) | `boolean` |
| `opened` | 열림 애니메이션 완료 후 | — |
| `closed` | 닫힘 애니메이션 완료 후 | — |
| `close` | 닫기(×) 버튼 클릭. `closeOnCloseBtn=false`이면 `update:open` 자동 호출 없음 — 부모가 직접 닫아야 함 | — |
| `ok` | ok 버튼 클릭 | — |
| `cancel` | cancel 버튼 클릭. `closeOnCancel=false`이면 `update:open` 자동 호출 없음 — 부모가 직접 닫아야 함 | — |
| `overlayClick` | dim(overlay) 영역 클릭 | — |

> `opened` / `closed`: `DialogContent`의 `animationend` 이벤트 + `data-state` 조합으로 감지.

---

## 7. Slots

| 슬롯 | 필수 | 설명 |
|------|------|------|
| `default` | 권장 | body 영역 콘텐츠. 스크롤 영역 안에 배치됨 |
| `#header` | 선택 | 헤더 영역 완전 교체. 제공 시 title/showClose prop 무시 |
| `#footer` | 선택 | 푸터 영역 완전 교체. 제공 시 ok/cancel 기본 버튼 미렌더링 |

---

## 7-1. 팝업 컨테이너 (#popup-container)

모든 팝업은 `app.vue`에 삽입된 `<div id="popup-container">` 안에 렌더링된다. `DialogPortal`의 `to="#popup-container"` prop으로 지정.

**컨테이너 속성 (global.scss)**:
```
position: fixed; top: 0; bottom: 0;
left: 50%; transform: translateX(-50%);
width: min(60rem, 100%);
overflow: hidden;
pointer-events: none;
z-index: $z-modal;
```

**핵심 동작**:
- `transform`이 있는 조상은 하위 `position: fixed` 요소의 containing block이 된다(CSS 스펙). 따라서 내부 `position: fixed` 자식들은 뷰포트가 아닌 컨테이너 기준으로 배치됨.
- `overflow: hidden`이 slideInRight / slideDown 애니메이션 시작 위치(컨테이너 바깥)를 숨김 → 60rem 레이아웃 바깥에서 팝업이 보이는 문제 방지.
- `pointer-events: none`으로 팝업이 없을 때 하위 페이지 클릭을 통과시킴. overlay / content에는 `pointer-events: auto`를 명시해 클릭 이벤트 복원.
- bottomSheet / full 타입 포지셔닝이 단순화됨: `left: 0; right: 0; width: 100%` (기존의 `left:50%; transform:translateX(-50%); width:min(60rem,100%)` 불필요).

---

## 8. Radix Vue 구조 및 attrs 위임

```
DialogRoot (v-model:open, @update:open)
└─ DialogPortal (to="#popup-container")
   ├─ DialogOverlay  (.popup__overlay, data-state="open|closed", @pointerdown="handleOverlayPointerDown")
      └─ handleOverlayPointerDown(e: PointerEvent): button !== 0이면 early return (우클릭·중간 버튼 무시)
   └─ DialogContent  (.popup__content .popup--{type})
      │              data-state="open|closed"
      │              @interact-outside  → 항상 event.preventDefault() — 다중 Dialog 영역·Select portal 등 외부 상호작용 차단
      │              @escape-key-down   → 자동 close (closeOnEscape=false면 .prevent)
      │              @open-auto-focus   → 필요 시 .prevent로 초기 포커스 커스터마이징
      │
      ├─ DialogClose       .popup__closeBtn (v-if="showAbsoluteClose && closeOnCloseBtn !== false", as-child)
      │                    position: absolute; top: 1rem; right: 1rem; width: 1.6rem; height: 1.6rem
      │                    (DialogContent 바로 안 — Header 외부, closeOnCloseBtn=true일 때)
      │
      ├─ button            .popup__closeBtn (v-else-if="showAbsoluteClose")
      │                    (closeOnCloseBtn=false → DialogClose 없이 순수 button, Radix Vue 자동 닫기 차단)
      │
      ├─ div.popup__header (v-if="title && !isAlertConfirm")  ← title 있을 때만 (태그: <div>, <header> 아님)
      │   └─ DialogTitle       .popup__title                  ← 타이틀 텍스트만
      │
      ├─ VisuallyHidden v-if="!title"                        ← title 없을 때도 a11y 위해 항상 마운트
      │   └─ DialogTitle       (시각적으로 숨김)
      │
      ├─ VisuallyHidden                                       ← description 항상 마운트 (Radix Vue dev 워닝 회피)
      │   └─ DialogDescription                               ← description prop 텍스트 또는 빈 노드
      │
      ├─ .popup__body
      │   ├─ div.popup__bodyLabel (v-if="bodyLabel")          — bodyLabel prop 텍스트 (slot 위)
      │   ├─ <slot />                                         — default slot
      │   └─ div.popup__bodyNote (v-if="bodyNote")            — bodyNote prop 아이콘+텍스트 (slot 아래)
      │       ├─ Icon(size="sm", aria-hidden="true") > CircularNoteSvg
      │       └─ span.popup__bodyNoteText
      └─ div.popup__footer (v-if="showFooter")   ← 태그: <div>, <footer> 아님
            :style="footerStyle"  — narrowCancel=true이면 CSS 변수 설정:
                                     { '--footer-cancel-flex': '120', '--footer-cancel-max': '12rem', '--footer-ok-flex': '200' }
                                    narrowCancel=false이면 undefined (style 미적용)
            • (slot 사용 시) <slot name="footer" />
                narrowCancel=true이면 SCSS > :first-child { flex: var(--footer-cancel-flex, 1); max-width: var(--footer-cancel-max, none) }
                                             > :last-child  { flex: var(--footer-ok-flex, 1) }
                로 slot 자식에도 비율 적용됨
            • (slot 미사용 시) cancel wrapper: <span class="popup__footerBtnWrap"> (v-if="showCancel")
                └─ Button shape="solid" :color="cancelColor" size="lg" @click="handleCancel"
                   (handleCancel: emit('cancel') → closeOnCancel=true이면 emit('update:open', false) / false이면 자동 닫기 없음)
              ok wrapper: <span class="popup__footerBtnWrap">
                └─ Button shape="solid" :color="okColor" size="lg" :disabled="okDisabled" @click="handleOk"
              (SCSS 기본) .popup__footerBtnWrap { flex: 1 } — CSS 변수로 override됨
```

> **DialogTitle/DialogDescription 정책**: Radix Vue Dialog는 둘 다 없으면 dev 콘솔에 워닝을 띄운다. `title`/`description` prop 텍스트가 없어도 `VisuallyHidden`으로 감싸 항상 트리에 마운트한다. `radix-vue`에서 `VisuallyHidden` 컴포넌트가 제공된다 — 별도 sr-only 유틸리티를 만들 필요 없음.

**attrs 위임 전략**: Popup.vue는 Base로 직접 노출되지 않으므로 `inheritAttrs: false`는 필요 시 적용. Wrapper가 Popup.vue를 내부에서 사용할 때 필요한 attrs는 props로 명시 전달.

---

## 9. SCSS 토큰 매핑

| 용도 | 토큰 / 값 |
|------|-----------|
| Overlay 배경 | `rgba($text-900, 0.5)` (60rem 프레임 너비, 뷰포트 높이) |
| 팝업 배경 | `$bg-primary` |
| 타이틀 텍스트 | `$text-900` |
| 본문 텍스트 | `$text-700` |
| 헤더/푸터 구분선 | `$_line-300` |
| z-index | `$z-modal` (300) |
| 모서리 — layer | `$radius-lg` |
| 모서리 — bottomSheet | `$radius-lg` 상단, `0` 하단 |
| 모서리 — full | `0` |
| 최대 너비 — layer | `48rem` |
| body 최대 높이 | `calc(80vh - 헤더높이 - 푸터높이)` |
| 열림/닫힘 — layer/bottomSheet | `$duration-base` |
| 열림/닫힘 — full | `$duration-slow` |
| **닫기 버튼 width / height** | **`1.6rem` (16px 고정값)** |
| **닫기 버튼 top / right** | **`1rem` (10px 고정값)** |

> **Footer 버튼 색상/크기 토큰은 `Button` 컴포넌트가 담당한다.**  
> ok 버튼: `:color="okColor"` (기본 `'primary'`) / cancel 버튼: `:color="cancelColor"` (기본 `'gray'`) / 공통: `size="lg"`, `shape="solid"`

### 9-1. SCSS 제거 대상 (Button 컴포넌트 교체로 불필요)

| 제거 대상 선택자 | 이유 |
|----------------|------|
| `.popup__footerBtn` (공통) | Button 컴포넌트가 height, border-radius, font, cursor, border, transition 담당 |
| `.popup__footerBtn--cancel` | Button `color` prop 스타일로 대체 |
| `.popup__footerBtn--ok` | Button `color="primary"` + `disabled` 처리로 대체 |
| `.popup--layer .popup__footerBtn` | Button이 height/border-radius 담당, type별 재정의 불필요 |
| `.popup--alert .popup__footerBtn`, `.popup--confirm .popup__footerBtn` | 동일 이유 |
| `.popup--alert .popup__footerBtn--cancel`, `.popup--confirm .popup__footerBtn--cancel` | Button color prop으로 대체 |

**유지되는 SCSS**: `.popup__footer` 레이아웃 (display:flex, gap, padding, border-top), type별 footer gap/padding 재정의  
**신규 추가 SCSS**:
```scss
.popup__footerBtnWrap { flex: 1; }  // 기본 50:50

// CSS 변수를 사용한 narrowCancel 제어 (footer <div> 컨테이너에 설정, 자식에 적용)
.popup__footer {
  > :first-child { flex: var(--footer-cancel-flex, 1); max-width: var(--footer-cancel-max, none); }
  > :last-child  { flex: var(--footer-ok-flex, 1); }
}
```
narrowCancel=true 시 footer `<div>`에 CSS 변수 인라인 스타일을 설정하면, 기본 버튼 wrapper와 `#footer` slot 커스텀 자식 모두에 동일하게 비율이 적용된다.

### 애니메이션 매커니즘 (Radix Vue Presence)

Radix Vue Dialog는 내부적으로 `Presence` 컴포넌트를 사용해 닫기 시 즉시 unmount하지 않고 `data-state="closed"` 상태로 잠시 머무르며 CSS animation/transition 종료를 기다린 뒤 unmount한다. **CSS `animation` 또는 `transition`이 정의되어 있어야 이 동작이 작동**한다.

```scss
// 공통 패턴 — open/closed 양쪽 모두 animation 정의 + fill-mode
.popup__content[data-state="open"]  { animation: fadeScaleIn  $duration-base ease-out; }
.popup__content[data-state="closed"] { animation: fadeScaleOut $duration-base ease-out forwards; }

// layer
@keyframes fadeScaleIn  {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
  to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
@keyframes fadeScaleOut {
  from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  to   { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
}

// bottomSheet — 컨테이너 내 left:0 기준이므로 Y축만 이동
@keyframes slideUp   { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes slideDown { from { transform: translateY(0);    } to { transform: translateY(100%); } }

// full — 컨테이너 내 left:0 기준이므로 X축만 이동 (overflow:hidden이 시작 위치 숨김)
@keyframes slideInRight  { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes slideOutRight { from { transform: translateX(0);    } to { transform: translateX(100%); } }
```

> **`forwards`** (closed 측만): animation 종료 후에도 마지막 프레임을 유지하여 unmount 직전 깜빡임 방지.  
> **Overlay도 동일 정책**: `.popup__overlay[data-state="open"]` / `[data-state="closed"]` 각각에 `fadeIn` / `fadeOut` 적용.

---

## 10. 접근성 요구사항

| 항목 | 조건 | 요구사항 |
|------|------|---------|
| 시맨틱 | 항상 | Radix Vue `DialogContent`가 `role="dialog"` 자동 부여 |
| 레이블 | 항상 | `DialogTitle` **항상 마운트** (`title` 비어 있으면 `VisuallyHidden`으로 감쌈) — `aria-labelledby` 자동 연결 |
| 설명 | 항상 | `DialogDescription` **항상 마운트** (`description` 비어도 `VisuallyHidden` + 빈 노드) — `aria-describedby` 자동 연결. Radix Vue dev 워닝 회피 목적 |
| 포커스 트랩 | open 시 | Radix Vue 자동 처리 — Tab 키가 팝업 내부만 순환 |
| 초기 포커스 | open 시 | `DialogContent` 기본 포커스. 커스터마이징 시 `@open-auto-focus.prevent` 후 명시적 ref.focus() |
| ESC 닫기 | `closeOnEscape=true` | Radix Vue 자동 처리. false면 `@escape-key-down.prevent` |
| body scroll lock | open 시 | Radix Vue 자동 처리 |
| 닫기 버튼 | `showClose=true` | `aria-label="닫기"` 필수 (아이콘 버튼이므로) |
| 색상 대비 | 항상 | 타이틀/본문 텍스트와 배경 대비 4.5:1 이상 |

---

## 11. Wrapper별 추가 Props

> `bodyNote`는 Popup.vue(Base)에 직접 구현되므로 이 섹션의 Wrapper별 별도 정의는 없다. `bodyLabel`과 동일한 패턴으로 Base에서 관리하며, LayerPopup / BottomSheet / FullPopup은 prop을 pass-through하여 외부에 노출한다. **Alert / Confirm은 노출하지 않는다.**

---

## 구현 복잡도 신호

- Radix Vue Dialog (Stable) 래핑 — Select.vue 패턴과 동일
- `data-state` CSS 애니메이션으로 열림/닫힘 처리
- `@interact-outside`로 dim 클릭과 다른 이벤트 분기
- ok/cancel은 `emit`만, 닫기는 Wrapper 책임 — 비동기 처리 패턴 지원
- Base 컴포넌트이므로 직접 사용 없음. 모든 Wrapper가 이 Base를 내부에서 사용
