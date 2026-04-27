## 아키텍처 규칙

### Atomic Design 계층

```
components/
├── atoms/       — 최소 단위, 다른 컴포넌트에 의존하지 않음
│                  예) Button, Input, Icon, Badge, Tag, Spinner, Avatar
├── molecules/   — atoms만 조합
│                  예) FormField, SearchBar, Pagination, CardItem
└── organisms/   — atoms + molecules 조합, 독립적인 UI 블록
                   예) Header, Footer, Modal, ProductCard, GNB
```

**계층 의존 규칙**
- atoms → 외부 의존 없음
- molecules → atoms만 import 가능
- organisms → atoms + molecules import 가능
- pages/, layouts/ → organisms를 조합해 화면 구성

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
│   ├── Header.vue
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
export { default as Button } from './Button.vue'
export { default as ButtonLink } from './ButtonLink.vue'
export { default as Input } from './Input.vue'
export { default as InputSearch } from './InputSearch.vue'

// components/molecules/index.ts
export { default as FormField } from './FormField.vue'
```

**사용 방법** — 반드시 카테고리 단위로 import

```ts
// ✅ 카테고리 단위 import
import { Button, Input } from '~/components/atoms'
import { FormField } from '~/components/molecules'
import { GuideHeader, GuideSidebar } from '~/components/guide'

// ❌ 루트 단일 import 금지 — components/index.ts 미존재
import { Button, FormField } from '~/components'

// ❌ 개별 .vue 직접 import 지양 — 카테고리 barrel 우회 금지
import Button from '~/components/atoms/Button.vue'
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

pages/는 Nuxt 파일 기반 라우팅을 따른다. 각 페이지는 폴더로 구성한다.

```
pages/
└── productList/
    ├── index.vue         ← 페이지 컴포넌트
    └── productList.scss  ← 페이지 전용 스타일 (외부 분리)
```

- 페이지 스타일은 SFC 인라인 대신 외부 `.scss` 파일로 분리
- `<style lang="scss" scoped src="./productList.scss"></style>` 로 참조
- `scoped` 효과는 동일하게 적용됨

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

### Composables 위치

| 종류 | 위치 | import 방식 |
|------|------|------------|
| 카테고리 내 공유 (특정 카테고리의 일부 컴포넌트만 사용) | `components/{layer}/use*.ts` | 명시적 import (상대 경로) |
| 앱 전역 (어디서나 호출) | `composables/use*.ts` | Nuxt auto-import |

- 카테고리 내 공유 composable은 해당 카테고리 폴더에 평탄 배치한다 — 예: `useButtonVariant`는 atoms 내 Button/ButtonLink가 공유하므로 `components/atoms/useButtonVariant.ts`에 위치
- 같은 카테고리 안의 .vue에서는 상대 경로로 명시적 import — `import { useButtonVariant } from './useButtonVariant'`
- co-locate한 composable은 Nuxt auto-import 대상이 아니므로 사용처에서 명시적 `import`가 필요하다
- `composables/`는 인증·카트·전역 상태 등 앱 어디서나 호출되는 composable 전용

### Nuxt 라우팅 규칙

- 파일 기반 라우팅 구조 유지 — `pages/` 디렉토리 구조가 곧 URL
- `layouts/`는 페이지 공통 레이아웃만 담당 (Header/Footer 포함 여부 등)
- `ref`, `computed`, `watch` 등 Composition API는 Nuxt auto-import — import 불필요

> React 비교: Next.js의 app/ 라우팅처럼 Nuxt도 pages/ 디렉토리 구조가 곧 URL이 됩니다.
