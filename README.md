# Vue UI Components Guide

Vue 3 + Nuxt 3 기반의 UI 컴포넌트 라이브러리 가이드 페이지입니다.  
Claude Code 에이전트(`/component-create`, `/component-audit`, `/component-revise`)로 컴포넌트를 제작하고, 각 컴포넌트의 사용법과 Props를 브라우저에서 확인할 수 있습니다.

## 스택

| 항목 | 버전 |
|------|------|
| Vue | 3.4.19 |
| Nuxt | 3.10.3 |
| TypeScript | 6.x |
| Radix Vue | 1.9.17 |
| @vuepic/vue-datepicker | ^11 |
| sass | 1.85.0 |

## 시작하기

```bash
npm install
npm run dev       # http://localhost:5000
```

```bash
npm run typecheck # 타입 체크
npm run generate  # 정적 빌드 (GitHub Pages)
```

## 컴포넌트 목록

| 계층 | 컴포넌트 | 가이드 URL |
|------|---------|------------|
| atoms | Button | `/guide/button` |
| atoms | ButtonLink | `/guide/button-link` |
| atoms | Input | `/guide/input` |
| atoms | Select | `/guide/select` |
| atoms | TextArea | `/guide/textarea` |
| atoms | Stepper | `/guide/stepper` |
| atoms | Checkbox | `/guide/checkbox` |
| atoms | Switch | `/guide/switch` |
| icons | Icon | `/guide/icon` |
| organisms | Tab | `/guide/tab` |
| organisms | Alert | `/guide/alert` |
| organisms | Confirm | `/guide/confirm` |
| organisms | LayerPopup | `/guide/layerPopup` |
| organisms | BottomSheet | `/guide/bottomSheet` |
| organisms | FullPopup | `/guide/fullPopup` |
| organisms | ToastPopup | `/guide/toastPopup` |

## 프로젝트 구조

```
components/
├── atoms/          # 최소 단위 컴포넌트 (Button, Input, Select 등)
├── molecules/      # atoms 조합 (FormField)
├── organisms/      # atoms + molecules 조합 (Tab)
├── popup/          # 팝업 계열 전체 + composable API
├── icons/          # Icon.vue (nuxt-svgo 기반 SVG 래퍼)
├── guide/          # 가이드 페이지 전용 레이아웃 컴포넌트
└── types.ts        # 공용 타입 (Variant, Size, ButtonShape 등)

pages/guide/[componentName]/index.vue   # 컴포넌트별 가이드 페이지
assets/scss/abstracts/_variables.scss   # 디자인 토큰 (모든 SCSS에 자동 주입)
```

## 팝업 시스템

Alert / Confirm은 composable로 호출합니다. 컴포넌트를 직접 `<template>`에 쓰지 않습니다.

```ts
import { useAlert } from '@nd/components/popup'
import { useConfirm } from '@nd/components/popup'

const { open: openAlert } = useAlert()
openAlert({ message: '저장되었습니다.', onClose: () => {} })

const { open: openConfirm } = useConfirm()
openConfirm({ message: '삭제하시겠습니까?', onConfirm: handleDelete, onCancel: () => {} })
```

Toast도 동일하게 `useToastPopup()`으로 호출합니다.

## 디자인 토큰 업데이트

Figma에서 토큰을 추출해 `_variables.scss`를 갱신하는 워크플로우입니다.

```
/design:token-scaffold  →  design-tokens.json 생성
/design:token-scss      →  assets/scss/abstracts/_variables.scss 갱신
```

`_variables.scss`는 `nuxt.config.ts`의 `additionalData`로 전체 SCSS에 자동 주입되므로 `@use` 없이 바로 사용 가능합니다.

## 신규 컴포넌트 추가

Claude Code 슬래시 명령으로 진행합니다.

```
/component-create   # 명세(spec) → SFC 구현 → 가이드 페이지 → QA → 리뷰
/component-revise   # 기존 컴포넌트 기획 수정
/component-audit    # 기존 컴포넌트 검수
```

1단계(명세 승인) 후 `Shift+Tab`으로 accept mode 전환 필요. 자세한 워크플로우는 `.claude/CLAUDE.md` 참조.

## 외부 라이브러리 정책

Radix Vue는 **Stable 컴포넌트만** 사용합니다. DatePicker 등 Alpha 컴포넌트는 `@vuepic/vue-datepicker`로 대체합니다. 전체 stability 매트릭스는 `.claude/rules/libraries.md` 참조.
