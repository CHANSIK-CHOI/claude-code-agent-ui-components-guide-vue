## 아키텍처 규칙

### Atomic Design 계층 + 보조 카테고리

본 프로젝트의 `components/`는 **Atomic 3계층 + 보조 1카테고리(popup)**로 구성되며, 가이드 전용 폴더(guide)와 아이콘 폴더(icons)가 별도로 존재한다. 컴포넌트 조합 시 import 가능한 카테고리는 atoms / molecules / organisms / popup 4개이며, 그 외 위치의 컴포넌트는 사용 금지.

```
components/
├── atoms/       — 최소 단위, 다른 컴포넌트에 의존하지 않음 (Atomic)
│                  예) Button, Input, Checkbox, Switch
├── molecules/   — atoms만 조합 (Atomic)
│                  예) FormField, Accordion, Pagination, ButtonGroup
├── organisms/   — atoms + molecules 조합, 독립적인 UI 블록 (Atomic)
│                  예) Tab
├── popup/       — 팝업 기반 컴포넌트 + 제어 hooks (Atomic 외 보조 카테고리)
│                  예) LayerPopup, BottomSheet, ToastPopup, useAlert, useConfirm
├── guide/       — 컴포넌트 가이드 페이지 전용 (Atomic 계층 외)
│                  예) GuideHeader, GuideSidebar
└── icons/       — SVG 아이콘 시스템 (Atomic 계층 외 — `.claude/specs/Icon.md` 참조)
                   예) Icon
```

**계층/카테고리 의존 규칙**

- atoms → 외부 의존 없음
- molecules → atoms만 import 가능
- organisms → atoms + molecules import 가능
- **popup** → atoms + molecules + organisms 자유 import. 콘텐츠 팝업은 base 컴포넌트(`LayerPopup`, `BottomSheet` 등)를 래핑하고 `v-model:open` 으로 제어 — `rules/popups.md` 단일 출처 참조
- pages/, layouts/ → 위 카테고리를 조합해 화면 구성. 어떤 카테고리든 자유롭게 import 가능

> **popup이 Atomic 3계층과 분리된 이유**: UI 패턴(오버레이) 관점의 묶음으로, Atomic의 "구성 단위 단계"와는 분류 축이 다르다. 동일 폴더 구조 안에 두되 의존 규칙만 별도로 명시한다.

### 컴포넌트 파일 구조

모든 카테고리는 **flat 구조**로 통일한다. 컴포넌트별 하위 폴더를 만들지 않고, `.vue` 파일을 카테고리 폴더에 직접 둔다. barrel export는 **카테고리 단일 `index.ts`** 한 곳에서만 관리한다.

```
components/
├── atoms/
│   ├── Button.vue
│   ├── ButtonLink.vue
│   ├── Input.vue
│   ├── InputSearch.vue       ← Wrapper도 같은 카테고리에 평탄 배치
│   ├── InputPassword.vue     ← Wrapper도 같은 카테고리에 평탄 배치
│   ├── useButtonVariant.ts   ← co-located composable (필요 시 카테고리 내 평탄 배치)
│   └── index.ts              ← atoms 카테고리 barrel
├── molecules/
│   ├── FormField.vue
│   └── index.ts              ← molecules 카테고리 barrel
├── organisms/
│   ├── Tab.vue
│   └── index.ts              ← organisms 카테고리 barrel
├── guide/                    ← 가이드 페이지 전용 컴포넌트 (atomic 계층 외)
│   ├── GuideHeader.vue
│   ├── GuideSidebar.vue
│   └── index.ts
└── types.ts                  ← 컴포넌트 공용 타입
```

> **루트 `components/index.ts`는 사용하지 않는다.** 카테고리 단위 import만 허용하여 사용처가 어떤 계층의 컴포넌트인지 명시되도록 강제한다.

**카테고리 `index.ts`** — `.vue` 파일을 직접 named export

```ts
// components/atoms/index.ts
export { default as Button } from "./Button.vue";
export { default as ButtonLink } from "./ButtonLink.vue";
export { default as Input } from "./Input.vue";
export { default as InputSearch } from "./InputSearch.vue";

// components/molecules/index.ts
export { default as FormField } from "./FormField.vue";
```

**사용 방법** — 반드시 카테고리 단위로 import

```ts
// ✅ 카테고리 단위 import
import { Button, Input } from "@nd/components/atoms";
import { FormField } from "@nd/components/molecules";
import { GuideHeader, GuideSidebar } from "@nd/components/guide";

// ❌ 루트 단일 import 금지 — components/index.ts 미존재
import { Button, FormField } from "@nd/components";

// ❌ 개별 .vue 직접 import 지양 — 카테고리 barrel 우회 금지
import Button from "@nd/components/atoms/Button.vue";
```

> **Nuxt auto-import 참고**: `<template>` 안에서는 Nuxt가 `components/` 하위 `.vue` 파일을 자동 전역 등록하므로 import 없이 `<Button />`을 바로 쓸 수 있습니다. 위 barrel export는 `<script>` 블록에서 명시적으로 import할 때 사용합니다.

### Base / Wrapper 컴포넌트 패턴

같은 카테고리 폴더 안에서 Base와 Wrapper를 분리한다 (별도 하위 폴더를 만들지 않는다).

```
components/atoms/
├── Input.vue           ← Base: v-model, disabled, error 등 공통 로직
├── InputSearch.vue     ← Wrapper: Input을 내부에서 사용 + 검색 버튼 추가
└── InputPassword.vue   ← Wrapper: Input을 내부에서 사용 + 토글 버튼 추가
```

- Base는 공통 로직과 마크업만 담당
- Wrapper는 Base를 import해서 추가 기능만 구현 (`import Input from './Input.vue'`)
- 카테고리 `index.ts`에 Base와 Wrapper 모두 명시적으로 export
- 코드 패턴은 `rules/components.md` 참조

### Pages 폴더 구조

pages/는 Nuxt 파일 기반 라우팅을 따른다. 본 프로젝트의 pages/는 **컴포넌트 가이드 페이지**(`pages/guide/[componentName]/`)가 중심이다. 각 페이지는 폴더로 구성한다.

```
pages/
└── guide/
    └── button/
        ├── index.vue              ← 가이드 페이지 컴포넌트
        └── buttonGuidePage.scss   ← 페이지 전용 스타일 (외부 분리)
```

- 페이지 스타일은 SFC 인라인 대신 외부 `.scss` 파일로 분리
- `<style lang="scss" scoped src="./buttonGuidePage.scss"></style>` 로 참조
- `scoped` 효과는 동일하게 적용됨
- 가이드 페이지 작성 규칙은 `rules/guide-page.md` 참조

### TypeScript 타입 위치

```
components/
├── types.ts        ← 컴포넌트 공용 타입 (Variant, Size, ButtonShape 등)
├── atoms/
├── molecules/
└── organisms/

types/
├── api.ts          ← API 응답 타입 (향후)
└── ...             ← 앱 전역 도메인 타입
```

- 한 컴포넌트에서만 쓰는 타입은 해당 `.vue` 파일 안에 인라인 선언
- 2개 이상 컴포넌트가 공유하는 타입은 `components/types.ts`로 이동
- API 응답·도메인 타입은 `types/`에 위치 (컴포넌트 타입과 분리)

**컴포넌트 전용 타입의 공개(public) export 규칙**

`.vue` 안에 정의된 타입이라도 외부(pages, layouts 등)에서 사용해야 한다면 카테고리 `index.ts`에서 re-export한다. `components/types.ts`로 옮기지 않는다 — 공유 타입(2개 이상 컴포넌트 사용)과 섞이지 않도록 역할을 분리한다.

```ts
// organisms/index.ts
export { default as Tab } from "./Tab.vue";
export type { TabItem, TabVariant } from "./Tab.vue"; // ✅ .vue에서 직접 re-export
```

```ts
// 사용 측 (pages, layouts)
import type { TabItem } from "@nd/components/organisms"; // ✅ 카테고리 경유
```

| 타입 종류                       | 정의 위치             | export 방법                       |
| ------------------------------- | --------------------- | --------------------------------- |
| 단일 컴포넌트 전용, 외부 미사용 | `.vue` 인라인         | 없음                              |
| 단일 컴포넌트 전용, 외부 사용   | `.vue` 인라인         | 카테고리 `index.ts`에서 re-export |
| 2개 이상 컴포넌트 공유          | `components/types.ts` | `types.ts`에서 직접 import        |

### Composables 위치

본 프로젝트의 모든 composable은 **`components/{layer}/use*.ts` (co-located)** 한 곳에 둔다. 별도의 루트 `composables/` 폴더는 사용하지 않고, 컴포넌트와 같은 카테고리 폴더에 함께 배치한다.

| 종류                                                    | 위치                                       | import 방식               |
| ------------------------------------------------------- | ------------------------------------------ | ------------------------- |
| 카테고리 내 공유 (특정 카테고리의 일부 컴포넌트만 사용) | `components/{layer}/use*.ts`  | 명시적 import (상대 경로) |

- 카테고리 내 공유 composable은 해당 카테고리 폴더에 평탄 배치한다 — 예: `useButtonVariant`는 atoms 내 Button/ButtonLink가 공유하므로 `components/atoms/useButtonVariant.ts`에 위치
- 같은 카테고리 안의 .vue에서는 상대 경로로 명시적 import — `import { useButtonVariant } from './useButtonVariant'`
- co-locate한 composable은 Nuxt auto-import 대상이 아니므로 사용처에서 명시적 `import`가 필요하다
- popup 제어 hook(`useAlert`, `useConfirm`, `useToastPopup`, `usePopupNavigate` 등)은 `components/popup/`에 함께 위치하며 popup barrel(`@nd/components/popup`)로 export 된다 — 사용처는 `import { useAlert } from '@nd/components/popup'` (hook 별 사용 정책은 `rules/popups.md` §3-5 참조)

### Nuxt 라우팅 규칙

- 파일 기반 라우팅 구조 유지 — `pages/` 디렉토리 구조가 곧 URL
- `layouts/`는 페이지 공통 레이아웃만 담당 (가이드 페이지는 `layouts/guide.vue` 사용)
- `ref`, `computed`, `watch` 등 Composition API는 Nuxt auto-import — import 불필요

> React 비교: Next.js의 app/ 라우팅처럼 Nuxt도 pages/ 디렉토리 구조가 곧 URL이 됩니다.
