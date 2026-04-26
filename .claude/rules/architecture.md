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

```
components/
├── atoms/
│   ├── Button/
│   │   ├── Button.vue    ← Base 컴포넌트
│   │   └── index.ts
│   ├── Input/
│   │   ├── Input.vue         ← Base 컴포넌트 (공통 로직)
│   │   ├── InputSearch.vue   ← Wrapper (Input + 검색 버튼) ← co-locate
│   │   ├── InputPassword.vue ← Wrapper (Input + 토글 버튼) ← co-locate
│   │   └── index.ts
│   └── index.ts          ← atoms 계층 barrel export
├── molecules/
│   ├── ButtonGroup/
│   │   ├── ButtonGroup.vue      ← 레이아웃 담당
│   │   ├── ButtonGroupItem.vue  ← 종속 컴포넌트 ← co-locate
│   │   └── index.ts
│   ├── FormField/
│   │   ├── FormField.vue
│   │   └── index.ts
│   └── index.ts          ← molecules 계층 barrel export
├── organisms/
│   ├── Header/
│   │   ├── Header.vue
│   │   └── index.ts
│   └── index.ts          ← organisms 계층 barrel export
└── index.ts              ← 전체 barrel export
```

**co-locate 기준**: 단독으로 쓰이지 않고 특정 컴포넌트에 항상 종속되는 경우 같은 폴더에 둔다.

**각 컴포넌트 `index.ts`** — 개별 컴포넌트 export (co-located 포함)
```ts
// components/atoms/Input/index.ts
export { default as Input } from './Input.vue'
export { default as InputSearch } from './InputSearch.vue'
export { default as InputPassword } from './InputPassword.vue'

// components/molecules/ButtonGroup/index.ts
export { default as ButtonGroup } from './ButtonGroup.vue'
export { default as ButtonGroupItem } from './ButtonGroupItem.vue'
```

**계층별 `index.ts`** — 해당 계층 전체 re-export
```ts
// components/atoms/index.ts
export * from './Button'
export * from './Input'
export * from './Icon'
```

**루트 `index.ts`** — 전체 한 번에 re-export
```ts
// components/index.ts
export * from './atoms'
export * from './molecules'
export * from './organisms'
```

**사용 방법**
```ts
// 계층별 import
import { Button, Input } from '~/components/atoms'
import { FormField } from '~/components/molecules'

// 전체에서 한 번에 import
import { Button, FormField, Header } from '~/components'
```

> **Nuxt auto-import 참고**: `<template>` 안에서는 Nuxt가 `components/` 하위 `.vue` 파일을 자동 전역 등록하므로 import 없이 `<Button />`을 바로 쓸 수 있습니다. 위 barrel export는 `<script>` 블록에서 명시적으로 import할 때 사용합니다.

### Base / Wrapper 컴포넌트 패턴

같은 폴더 안에서 Base와 Wrapper를 분리한다.

```
Input.vue           ← Base: v-model, disabled, error 등 공통 로직
InputSearch.vue     ← Wrapper: Input을 내부에서 사용 + 검색 버튼 추가
InputPassword.vue   ← Wrapper: Input을 내부에서 사용 + 토글 버튼 추가
```

- Base는 공통 로직과 마크업만 담당
- Wrapper는 Base를 import해서 추가 기능만 구현
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
types/
├── components.ts   ← 공용 컴포넌트 타입 (Variant, Size 등)
├── api.ts          ← API 응답 타입
└── index.ts        ← re-export
```

- 한 컴포넌트에서만 쓰는 타입은 해당 `.vue` 파일 안에 인라인 선언
- 2개 이상 공유되는 타입은 `types/components.ts`로 이동

### Nuxt 라우팅 규칙

- 파일 기반 라우팅 구조 유지 — `pages/` 디렉토리 구조가 곧 URL
- `layouts/`는 페이지 공통 레이아웃만 담당 (Header/Footer 포함 여부 등)
- `ref`, `computed`, `watch` 등 Composition API는 Nuxt auto-import — import 불필요

> React 비교: Next.js의 app/ 라우팅처럼 Nuxt도 pages/ 디렉토리 구조가 곧 URL이 됩니다.
