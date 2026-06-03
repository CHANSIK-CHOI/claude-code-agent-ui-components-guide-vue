## 디자인 토큰 규칙

디자인 토큰은 `assets/scss/abstracts/_variables.scss`에 정의한다.
모든 색상, 타이포그래피, 간격은 토큰을 통해서만 참조한다.

### 토큰 네이밍 구조

```
$카테고리-역할-상태(선택)
```

```scss
// ✅ 올바른 패턴
$color-primary          // 카테고리-역할
$color-primary-hover    // 카테고리-역할-상태
$text-900               // 카테고리-단계 (텍스트는 숫자 단계)
$line-200               // 카테고리-단계 (선/테두리는 $line-*)

// ❌ 잘못된 패턴
$cyan                   // 원시 색상값 그대로 — 금지
$blue1                  // 의미 없는 숫자 — 금지
$mainColor              // camelCase — 금지
```

### 카테고리 목록

| 카테고리 | 예시 | 설명 |
|---------|------|------|
| `$color-` | `$color-primary`, `$color-accent` | 브랜드/UI 색상 |
| `$text-` | `$text-900`, `$text-600` | 텍스트 색상 (숫자 단계: 100~900, white — 클수록 진함) |
| `$bg-` | `$bg-primary`, `$bg-secondary` | 배경 색상 |
| `$line-` | `$line-100`, `$line-200`, `$line-300` | 선/테두리 색상 (일반 border에 사용) |
| `$border-` | `$border-focus`, `$border-input-focus`, `$border-disabled` | 상태별 테두리 색상 (포커스·비활성 전용) |
| `$font-size-` | `$font-size-sm`, `$font-size-lg` | 글자 크기 |
| `$font-weight-` | `$font-weight-regular`, `$font-weight-bold` | 글자 굵기 |
| `$line-height-` | `$line-height-tight`, `$line-height-base` | 줄 높이 |
| `$radius-` | `$radius-sm`, `$radius-md` | 모서리 둥글기 |
| `$spacing-` | `$spacing-xs`, `$spacing-md` | 간격 (padding, margin) |
| `$z-` | `$z-modal`, `$z-tooltip` | z-index 레이어 |
| `$duration-` | `$duration-fast`, `$duration-base` | 애니메이션 시간 |

### 레이어 구조

토큰은 2단계로 관리한다.

```scss
// 1단계: 원시 토큰 (직접 사용 금지)
$_brand-cyan: #0cb5e2;
$_neutral-900: #1a1a1a;

// 2단계: 시맨틱 토큰 (컴포넌트에서 이것만 사용)
$color-primary: $_brand-cyan;
$text-900: $_neutral-900;
```

원시 토큰은 `_` 접두사로 구분하고 컴포넌트에서 직접 참조하지 않는다.

### z-index 레이어 관리

z-index는 반드시 토큰으로 관리한다. 임의의 숫자 직접 사용 금지.

```scss
$z-base:    0;
$z-dropdown:  100;
$z-sticky:  200;
$z-modal:   300;
$z-toast:   400;
$z-tooltip: 500;
```

```scss
// ✅
.ModalRoot { z-index: $z-modal; }

// ❌
.ModalRoot { z-index: 9999; }
```

### 토큰이 없을 때 처리 기준

Figma 디자인 수치가 토큰 시스템과 100% 정합하지 않을 수 있다.
토큰이 없다고 신규 추가하지 않는다. 아래 순서로 대체한다.

1. **의미가 같은 기존 토큰**을 찾아 대체 — `#535e66`(입력 텍스트)이 없으면 `$text-700`처럼 가장 가까운 단계 토큰 사용
2. **값이 가장 가까운 기존 토큰**으로 대체 — `#c0c6cc`(스크롤바 thumb)는 `$line-300`으로 근사
3. 위 두 방법이 모두 불가하면 `rem` 수치를 직접 사용 — 색상 raw hex는 절대 직접 사용 금지

```scss
// ✅ 의미로 대체
color: $text-700;          // Figma #535e66 → 가장 가까운 단계 $text-700 사용

// ✅ 값으로 근사
background-color: $line-300; // Figma #c0c6cc → 가장 가까운 $line-300 사용

// ✅ 수치 직접 사용 (spacing만 허용, 색상 제외)
padding: 1.2rem;              // $spacing-textarea 토큰 미존재 시

// ❌ raw hex 직접 사용 — 절대 금지
background-color: #c0c6cc;
```

### 금지 사항

- raw hex 컬러값 직접 사용 금지 — `#0cb5e2` ❌, `$color-primary` ✅
- magic number z-index 금지 — `999`, `9999` ❌
- 원시 토큰(`$_brand-cyan`) 컴포넌트에서 직접 참조 금지
- 토큰 미존재를 이유로 신규 토큰 임의 추가 금지 — 기존 토큰으로 대체

---

### 사용 가능한 전체 토큰 참조표 (BLOCKING — 이 목록에 없는 토큰 사용 금지)

SCSS 작성 전 반드시 이 목록에서 토큰 존재 여부를 확인한다.
목록에 없는 변수명은 절대 사용하지 않는다 (컴파일 에러 발생).

#### Color
`$color-primary` `$color-primary-hover` `$color-primary-soft`
`$color-danger` `$color-warning` `$color-success`

#### Text (숫자가 클수록 진함)
`$text-900` `$text-800` `$text-700` `$text-600` `$text-500`
`$text-400` `$text-300` `$text-200` `$text-100` `$text-white`

#### Background
`$bg-primary` `$bg-secondary` `$bg-tertiary` `$bg-disabled`
`$bg-accent-purple` `$bg-accent-sky-blue` `$bg-accent-light-blue`
`$bg-accent-orange` `$bg-accent-light-pink` `$bg-accent-beige` `$bg-accent-pink`

#### Border / Line
`$line-100` `$line-200` `$line-300`
`$border-focus` `$border-input-focus` `$border-disabled`

#### Font Size — Heading
`$font-size-h1` `$font-size-h2` `$font-size-h3` `$font-size-h4` `$font-size-h5`

#### Font Size — Body
`$font-size-body1` `$font-size-body2` `$font-size-body3` `$font-size-body4` `$font-size-body5`

#### Font Size — Caption
`$font-size-caption1` `$font-size-caption2` `$font-size-caption3`

#### Font Size — Alias
`$font-size-md` `$font-size-sm` `$font-size-xs`

#### Font Weight
`$font-weight-regular` `$font-weight-medium` `$font-weight-bold`

#### Line Height
`$line-height-tight` `$line-height-snug` `$line-height-base` `$line-height-loose`

#### Spacing
`$spacing-xs` `$spacing-sm` `$spacing-md` `$spacing-lg` `$spacing-xl` `$spacing-2xl`
`$spacing-input-x`

#### Radius
`$radius-sm` `$radius-md` `$radius-lg` `$radius-full`

#### Z-Index
`$z-base` `$z-quickmenu` `$z-dropdown` `$z-sticky` `$z-modal` `$z-toast` `$z-tooltip`

#### Duration
`$duration-fast` `$duration-base` `$duration-slow`

#### Layout
`$screen-padding-x` `$screen-max-widht` `$header-height`

#### 자주 혼동하는 토큰명 (존재하지 않는 이름 → 올바른 이름)

| ❌ 존재하지 않음 | ✅ 올바른 토큰 |
|---|---|
| `$text-strong` | `$text-900` |
| `$text-secondary` | `$text-600` |
| `$text-disabled` | `$text-400` |
| `$text-placeholder` | `$text-400` |
| `$text-muted` | `$text-500` |
| `$border-default` | `$line-200` |
| `$border-normal` | `$line-200` |
| `$border-strong` | `$line-300` |
