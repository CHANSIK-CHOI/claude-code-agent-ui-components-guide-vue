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

## 6. 수동 추가 토큰 보존 정책 (재실행 안전성)

`/design:token-scss` 재실행 시 **사용자가 `_variables.scss`에 수동 추가·편집한 토큰을 보존**한다. 자동 생성 영역과 사용자 영역을 구분해 처리한다.

### 6-1. 처리 모드

| 조건 | 모드 |
|---|---|
| `_variables.scss` 부재 | **신규 생성** — design-tokens.json 변환 결과 + §5 추가 토큰 기본값 그대로 출력 |
| `_variables.scss` 존재 | **merge 모드** — 자동 생성 영역만 갱신, 사용자 영역은 절대 건드리지 않음 |

### 6-2. merge 모드 규칙

1. **자동 생성 영역(§5 추가 토큰 + design-tokens.json 변환분)에 동일 키가 있으면 기존 파일의 값을 보존**한다. 예: 기존 파일에 `$spacing-input-x: 1.3rem` 이 있으면 명령이 다시 `1.3rem` 기본값을 시도해도 그대로 둔다 — 사용자가 수치를 조정했을 가능성이 있어 사용자 값을 우선한다.
2. **자동 생성 영역에서 사용자가 직접 추가한 키(예: `$bg-tertiary`, `$bg-accent-light-blue` 등)는 보존**한다. 명령은 자동 생성 영역의 키 목록(매핑 가이드 §4 + §5)에 없는 토큰을 발견하면 사용자 추가로 간주하고 위치·값 그대로 유지한다.
3. **사용자 영역**(`// === USER TOKENS ===` 주석 이후 영역)은 명령 처리 대상에서 완전히 제외한다.

### 6-3. 출력 파일 사용자 영역 표식

`_variables.scss` 파일 끝에 다음 주석 블록을 항상 유지(또는 신규 생성 시 추가)한다. 사용자가 명령 영향 없이 추가하고 싶은 토큰은 이 블록 안에 작성한다.

```scss
// ────────────────────────────────────────────
// === USER TOKENS (수동 추가 — /design:token-scss 재실행 시 보존) ===
// 이 블록 안의 토큰은 명령이 절대 수정·삭제하지 않습니다.
// 자동 생성 영역의 기본 토큰 값을 변경하고 싶다면 자동 생성 영역에서 직접 편집하세요
// (merge 모드가 사용자 값을 우선 보존합니다).
// ────────────────────────────────────────────

// (사용자가 직접 추가한 토큰을 여기에 기록)
```

### 6-4. 사용자 안내 (merge 모드 한정)

merge 모드로 동작 시 변경 적용 직전에 사용자에게 **변경 요약**을 보고한다:

```
_variables.scss 갱신 요약:
- 추가될 토큰: [N개] (자동 생성 영역의 신규 키)
- 보존된 토큰: [M개] (기존 값 그대로 유지)
- USER TOKENS 영역: 미수정 ([K개 토큰 보존])

진행할까요?
```

신규 생성 시는 별도 보고 없이 출력 후 빌드 안내만 한다.

---

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

// ────────────────────────────────────────────
// === USER TOKENS (수동 추가 — /design:token-scss 재실행 시 보존) ===
// 이 블록 안의 토큰은 명령이 절대 수정·삭제하지 않습니다.
// 자동 생성 영역의 기본 토큰 값을 변경하고 싶다면 자동 생성 영역에서 직접 편집하세요
// (merge 모드가 사용자 값을 우선 보존합니다).
// ────────────────────────────────────────────

// (사용자가 직접 추가한 토큰을 여기에 기록)
```

## 규칙

- 입력은 design-tokens.json 단일 출처 (Figma 직접 호출 금지)
- 출력은 `assets/scss/abstracts/_variables.scss` 단일 파일
- raw hex는 `$_*` 원시 토큰에만 등장, 시맨틱 토큰은 항상 변수 참조
- 기존 `_variables.scss`가 있으면 §6 보존 정책에 따라 **merge 모드**로 작동 — 자동 생성 영역만 갱신, 사용자 추가/편집 토큰은 자동 보존하고 변경 요약을 보고한다 (전체 덮어쓰기 금지)
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
