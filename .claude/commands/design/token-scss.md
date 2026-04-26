---
description: "design-tokens.json을 프로젝트 SCSS 변수 파일(_variables.scss)로 변환합니다."
---

## 사용법

```
/design:token-scss
```

## 입력

- 프로젝트 루트의 `design-tokens.json` (단일 출처)
- 파일이 없으면 즉시 중단하고 안내:
  > "design-tokens.json이 없습니다. `/design:token-scaffold`를 먼저 실행해주세요."

## 출력

- 파일 경로: `assets/scss/abstracts/_variables.scss` (단일 파일, 고정)
- 이 파일은 `nuxt.config.ts`의 `additionalData`로 모든 SCSS `<style>` 블록에 자동 주입된다
- `@use`/`@import` 없이 컴포넌트에서 바로 변수 사용 가능

## 변환 규칙

`.claude/rules/tokens.md`를 우선 준수한다. 핵심 요약:

### 1. 2단계 토큰 구조

원시 토큰(raw)은 `_` 접두사로 비공개 처리하고, 컴포넌트에서는 시맨틱 토큰만 참조한다.

```scss
// 1단계 — 원시 토큰 (직접 사용 금지)
$_brand-cyan: #0cb5e2;
$_brand-cyan-dark: #00addb;
$_neutral-100: #f6f7f9;
$_neutral-900: #111111;

// 2단계 — 시맨틱 토큰 (컴포넌트에서 이것만 사용)
$color-primary: $_brand-cyan;
$color-primary-hover: $_brand-cyan-dark;
$bg-secondary: $_neutral-100;
$text-strong: $_neutral-900;
```

### 2. 카테고리 네이밍

`rules/tokens.md`의 카테고리 표를 그대로 따른다.

### 3. 단위 규칙

- `html { font-size: 10px }` 기준 → `px ÷ 10 = rem`
- 모든 typography font-size는 rem으로 변환 (예: `16px` → `1.6rem`)
- raw hex 직접 사용 금지 — 시맨틱 토큰만 참조

### 4. 매핑 가이드 (design-tokens.json → _variables.scss)

design-tokens.json의 구조에 따라 아래 규칙으로 변환한다.

#### color

```
color.primary.main      → $_brand-cyan         → $color-primary
color.primary.dark      → $_brand-cyan-dark    → $color-primary-hover
color.primary.light     → $_brand-cyan-light   → $color-primary-soft
color.gray.100~900      → $_neutral-100~900    → $bg-secondary, $text-strong, $border-default 등 시맨틱 매핑
color.line.100~300      → $_line-100~300       → $border-default, $border-subtle
color.accent.red        → $_accent-red         → $color-danger
color.accent.yellow     → $_accent-yellow      → $color-warning
color.accent.green      → $_accent-green       → $color-success
color.accent.{기타}     → $_accent-{name}      → $bg-accent-{name} (배경 톤만)
```

시맨틱 매핑이 모호한 색은 `$_*` 원시 토큰만 만들고 시맨틱 토큰 추가는 보류 — 사용자에게 보고만 한다.

#### typography

```
typography.font-family.base → $font-family-base
typography.heading.h1.font-size  → $font-size-h1 (rem 변환)
typography.heading.h1.font-weight → $font-weight-bold (값이 700이면 bold, 500이면 medium, 400이면 regular로 시맨틱화)
typography.body.body1~body5 → $font-size-body1 ~ $font-size-body5
typography.caption.caption1~3 → $font-size-caption1 ~ $font-size-caption3
```

font-weight 시맨틱 토큰 매핑:
- `400` → `$font-weight-regular`
- `500` → `$font-weight-medium`
- `700` → `$font-weight-bold`

### 5. 추가 토큰 (design-tokens.json에 없지만 항상 포함)

기본 spacing/radius/z-index/duration은 design-tokens.json에 없을 수 있으므로 아래 기본값을 함께 출력한다(이미 정의돼 있으면 보존).

```scss
// spacing (rem 기준)
$spacing-xs: 0.4rem;
$spacing-sm: 0.8rem;
$spacing-md: 1.6rem;
$spacing-lg: 2.4rem;
$spacing-xl: 3.2rem;
$spacing-input-x: 1.3rem; // 입력 필드 좌우 패딩 (Figma: 13px)

// radius
$radius-sm: 0.4rem;
$radius-md: 0.8rem;
$radius-lg: 1.6rem;
$radius-full: 9999px;

// z-index (rules/tokens.md와 동일)
$z-base: 0;
$z-dropdown: 100;
$z-sticky: 200;
$z-modal: 300;
$z-toast: 400;
$z-tooltip: 500;

// duration
$duration-fast: 150ms;
$duration-base: 250ms;
$duration-slow: 400ms;

// line-height
$line-height-tight: 1.2;
$line-height-snug: 1.3;  // 라벨/도움말 텍스트용 (FormField)
$line-height-base: 1.5;
$line-height-loose: 1.8;
```

## 출력 파일 형식 (전체 구조)

```scss
// ============================================
// _variables.scss (자동 생성 — design-tokens.json 기반)
// 수정 시 design-tokens.json을 갱신한 뒤 /design:token-scss 재실행
// ============================================

// ────────────────────────────────────────────
// 1단계: 원시 토큰 (raw — 직접 사용 금지)
// ────────────────────────────────────────────
$_brand-cyan: #0cb5e2;
$_brand-cyan-dark: #00addb;
$_brand-cyan-light: #8ad9ee;

$_neutral-100: #f6f7f9;
// ...

$_accent-red: #ff5146;
// ...

// ────────────────────────────────────────────
// 2단계: 시맨틱 토큰 (컴포넌트에서 이것만 참조)
// ────────────────────────────────────────────

// color
$color-primary: $_brand-cyan;
$color-primary-hover: $_brand-cyan-dark;
$color-primary-soft: $_brand-cyan-light;
$color-danger: $_accent-red;
$color-warning: $_accent-yellow;
$color-success: $_accent-green;

// text
$text-strong: $_neutral-900;
$text-default: $_neutral-800;
$text-secondary: $_neutral-600;
$text-tertiary: $_neutral-400;
$text-disabled: $_neutral-300;
$text-label: $_neutral-600;   // 라벨 텍스트 (FormField)
$text-helper: $_neutral-600;  // 도움말 텍스트 (FormField)

// bg
$bg-primary: #ffffff;
$bg-secondary: $_neutral-100;
$bg-disabled: $_neutral-200;
$bg-accent-light-blue: $_brand-cyan-light; // 가이드 안내 박스 배경 (uiux-publisher-agents §7)

// border
$border-default: $_line-200;
$border-subtle: $_line-300;
$border-input-focus: $_neutral-900; // 입력 포커스 테두리 (Figma: #111111)

// typography
$font-family-base: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

$font-size-h1: 2.6rem;
$font-size-h2: 2.2rem;
$font-size-h3: 2.0rem;
$font-size-h4: 1.8rem;
$font-size-h5: 1.6rem;

$font-size-body1: 1.6rem;
$font-size-body2: 1.5rem;
$font-size-body3: 1.4rem;
$font-size-body4: 1.4rem;
$font-size-body5: 1.3rem;

$font-size-caption1: 1.2rem;
$font-size-caption2: 1.2rem;
$font-size-caption3: 1.1rem;

// font-size 별칭 (편의용)
$font-size-md: $font-size-body1;
$font-size-sm: $font-size-body4;
$font-size-xs: $font-size-caption1; // 도움말/캡션 텍스트 (FormField)

$font-weight-regular: 400;
$font-weight-medium: 500;
$font-weight-bold: 700;

$line-height-tight: 1.2;
$line-height-snug: 1.3;
$line-height-base: 1.5;
$line-height-loose: 1.8;

// spacing / radius / z-index / duration
// (위 "추가 토큰" 섹션 그대로)
```

## 규칙

- 입력은 design-tokens.json 단일 출처 (Figma 직접 호출 금지)
- 출력은 `assets/scss/abstracts/_variables.scss` 단일 파일
- raw hex는 `$_*` 원시 토큰에만 등장, 시맨틱 토큰은 항상 변수 참조
- 기존 `_variables.scss`가 있으면 덮어쓰기 전 사용자에게 확인 (덮어쓰기 = 수동 편집한 시맨틱 매핑 손실 가능)
- 매핑이 모호한 항목(예: accent의 sky-blue, beige 등)은 원시 토큰만 만들고 시맨틱 매핑은 사용자에게 보고
- 출력 후 안내:
  > "_variables.scss 생성 완료. `npm run dev`로 빌드를 확인하세요."

## 금지 사항

- CSS Modules(`.module.scss`) 문법 사용 금지 — 프로젝트는 `<style scoped>` 통일
- `display: inline-flex` / `inline-block` 등의 예시 코드 포함 금지 (`rules/style.md` 위배)
- `pointer-events: none` 정책은 `rules/a11y.md` "클릭 차단 처리" 섹션 참조 (요소 종류별로 처리 방식이 다름)
- CSS 변수 + SCSS 변수 병행 정의 금지 — Nuxt `additionalData` 자동 주입 환경에선 SCSS 변수만 정의
- 토큰 카테고리 이외의 임의 네이밍 금지 (`rules/tokens.md` 카테고리 표 준수)
- 스케일형 네이밍(`$color-primary-500`) 금지 — 시맨틱(`$color-primary`, `$color-primary-hover`)으로 변환
