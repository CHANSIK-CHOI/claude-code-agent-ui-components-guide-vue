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
│  │  ────────────────────────── │  │
│  │  ③ Header (선택)             │  │  title + 닫기 버튼
│  │  ────────────────────────── │  │
│  │  ④ Body (스크롤 영역)        │  │  default slot
│  │  ────────────────────────── │  │
│  │  ⑤ Footer (선택)             │  │  cancel + ok 버튼 or #footer slot
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

- ① **Overlay** — `DialogOverlay`. dim 배경. `closeOnOverlay=true`면 클릭 시 닫힘
- ② **Container** — `DialogContent`. 팝업 본체. type에 따라 위치/크기/애니메이션 결정
- ③ **Header** — `title` prop 또는 `#header` slot. `title`이 없고 `showClose=false`면 미렌더링
- ④ **Body** — `default slot`. 내부 콘텐츠를 스크롤 가능하게 래핑
- ⑤ **Footer** — `#footer` slot 제공 시 slot 사용. 없으면 `Button` 컴포넌트(size="lg")로 ok/cancel 버튼 렌더링. ok는 항상 `shape="solid" color="primary"`, cancel은 `shape="solid" :color="cancelColor"`. 버튼이 모두 숨겨지거나 slot이 비어 있으면 미렌더링

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
| `cancelFlex` | `number` | `1` | cancel 버튼 wrapper flex 값 (ok와의 너비 비율 조정) |
| `okFlex` | `number` | `1` | ok 버튼 wrapper flex 값 (cancel과의 너비 비율 조정) |
| `closeOnOverlay` | `boolean` | `true` | dim(overlay) 클릭 시 팝업 닫기 여부 |
| `closeOnEscape` | `boolean` | `true` | ESC 키 입력 시 팝업 닫기 여부 |
| `showFooter` | `boolean` | `true` | footer 영역 표시 여부. `false`면 `<footer>` 태그 자체를 렌더링하지 않음. `#footer` slot·ok/cancel 버튼 모두 숨겨짐 |

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
| 닫기(×) 버튼 클릭 | `close` | ✅ 자동 | — |
| **ok 버튼 클릭** | `ok` | ❌ **부모 책임** — 비동기 처리 후 부모가 명시적 close | `okDisabled=false` |
| cancel 버튼 클릭 | `cancel` | ✅ 자동 | — |
| dim 클릭 | `overlayClick` | ✅ 자동 | `closeOnOverlay=true` |
| ESC 키 | — (Radix Vue 자동 처리) | ✅ 자동 (Radix Vue → onOpenChange) | `closeOnEscape=true` |

> **ok만 부모 책임**: `await deleteItem()` 같은 비동기 처리 후 성공 시에만 닫는 패턴(Confirm, LayerPopup)을 위해. 다른 모든 닫기 의도(취소/ESC/dim/×)는 사용자의 "닫기 의지"이므로 즉시 닫는다.

### 5-2. `#footer` slot 우선순위 및 footer 렌더링 조건

footer는 `showFooter` prop이 `true`(기본값)일 때만 렌더링된다. `showFooter=false`면 `#footer` slot 제공 여부와 무관하게 `<footer>` 태그 자체를 렌더링하지 않는다.

`#footer` slot이 제공되면 ok/cancel 기본 버튼 전체를 대체한다. 기본 버튼과 slot을 동시에 렌더링하지 않는다.

### 5-3. Header 렌더링 조건

| 조건 | 시각적 Header 박스 (`.popup__header`) | a11y용 DialogTitle |
|------|--------------------------------------|--------------------|
| `title` 있음 | ✅ | ✅ (visible) |
| `title` 없음 + `showClose=true` | ✅ | ✅ (`VisuallyHidden`으로 hidden DialogTitle 별도 마운트) |
| `title` 없음 + `showClose=false` | ❌ (미렌더링) | ✅ (`VisuallyHidden`으로 마운트 — Radix Vue dev 워닝 회피) |
| `#header` slot 제공 | slot으로 교체 | ⚠️ slot 안에서 `<DialogTitle>` 처리 정책 — 아래 § 5-4 참조 |

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

### 5-4. 중복 팝업

여러 팝업이 동시에 열릴 수 있다. z-index는 `$z-modal(300)` 기준으로 마운트 순서에 따라 자동 쌓임.

---

## 6. 이벤트 목록

| 이벤트 | 발생 시점 | 전달값 |
|--------|---------|--------|
| `update:open` | open 상태 변경 시 (v-model 바인딩) | `boolean` |
| `opened` | 열림 애니메이션 완료 후 | — |
| `closed` | 닫힘 애니메이션 완료 후 | — |
| `close` | 닫기(×) 버튼 클릭 | — |
| `ok` | ok 버튼 클릭 | — |
| `cancel` | cancel 버튼 클릭 | — |
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
   ├─ DialogOverlay  (.popup__overlay, data-state="open|closed")
   └─ DialogContent  (.popup__content .popup--{type})
      │              data-state="open|closed"
      │              @interact-outside  → overlayClick + update:open(false) (closeOnOverlay=true 한정)
      │              @escape-key-down   → 자동 close (closeOnEscape=false면 .prevent)
      │              @open-auto-focus   → 필요 시 .prevent로 초기 포커스 커스터마이징
      │
      ├─ header.popup__header (v-if="title || showClose")    ← title 비어도 showClose=true면 렌더링
      │   ├─ DialogTitle       .popup__title (v-if="title")  ← 텍스트 표시
      │   └─ DialogClose       .popup__closeBtn (v-if="showClose", as-child) — 닫기 버튼
      │
      ├─ VisuallyHidden v-if="!title"                        ← title 없을 때도 a11y 위해 항상 마운트
      │   └─ DialogTitle       (시각적으로 숨김)
      │
      ├─ VisuallyHidden                                       ← description 항상 마운트 (Radix Vue dev 워닝 회피)
      │   └─ DialogDescription                               ← description prop 텍스트 또는 빈 노드
      │
      ├─ .popup__body                                         — default slot
      └─ .popup__footer (v-if="showFooter")                   — #footer slot 또는 기본 버튼 영역
            • cancel wrapper: <span class="popup__footerBtnWrap" :style="{ flex: cancelFlex }"> (v-if="showCancel")
                └─ Button shape="solid" :color="cancelColor" size="lg" @click="handleCancel"
            • ok wrapper: <span class="popup__footerBtnWrap" :style="{ flex: okFlex }">
                └─ Button shape="solid" color="primary" size="lg" :disabled="okDisabled" @click="handleOk"
```

> **DialogTitle/DialogDescription 정책**: Radix Vue Dialog는 둘 다 없으면 dev 콘솔에 워닝을 띄운다. `title`/`description` prop 텍스트가 없어도 `VisuallyHidden`으로 감싸 항상 트리에 마운트한다. `radix-vue`에서 `VisuallyHidden` 컴포넌트가 제공된다 — 별도 sr-only 유틸리티를 만들 필요 없음.

**attrs 위임 전략**: Popup.vue는 Base로 직접 노출되지 않으므로 `inheritAttrs: false`는 필요 시 적용. Wrapper가 Popup.vue를 내부에서 사용할 때 필요한 attrs는 props로 명시 전달.

---

## 9. SCSS 토큰 매핑

| 용도 | 토큰 |
|------|------|
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

> **Footer 버튼 색상/크기 토큰은 `Button` 컴포넌트가 담당한다.**  
> ok 버튼: `color="primary"` / cancel 버튼: `:color="cancelColor"` (기본 `'gray'`) / 공통: `size="lg"`, `shape="solid"`

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
**신규 추가 SCSS**: `.popup__footerBtnWrap { flex: 1; }` (기본값. `:style="{ flex: n }"` 인라인으로 override)

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

## 구현 복잡도 신호

- Radix Vue Dialog (Stable) 래핑 — Select.vue 패턴과 동일
- `data-state` CSS 애니메이션으로 열림/닫힘 처리
- `@interact-outside`로 dim 클릭과 다른 이벤트 분기
- ok/cancel은 `emit`만, 닫기는 Wrapper 책임 — 비동기 처리 패턴 지원
- Base 컴포넌트이므로 직접 사용 없음. 모든 Wrapper가 이 Base를 내부에서 사용
