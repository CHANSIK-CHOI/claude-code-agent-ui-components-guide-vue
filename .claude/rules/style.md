## SCSS 스타일 규칙

### 스코프 전략

| 위치 | 방식 |
|------|------|
| components/ (atoms/molecules/organisms) | `<style lang="scss" scoped>` 인라인 |
| pages/ | `<style lang="scss" scoped src="./pageName.scss">` 외부 파일 |

> `scoped` 효과는 동일하다. 외부 파일의 모든 선택자에 `data-v-xxxxx` 속성이 자동으로 붙어 페이지 간 충돌이 없다.
>
> React 비교: React CSS Modules가 클래스명을 해시로 바꾸는 것과 달리, Vue scoped는 고유 속성 선택자로 격리합니다. 결과는 동일합니다.

### BEM 네이밍

camelCase + BEM 조합을 사용한다.

```
.componentName           ← Block (루트 요소)
.componentName__element  ← Element (자식 요소)
.componentName--modifier ← Modifier (상태/변형)
```

#### Element 접미사 규칙 (필수)

**컴포넌트·가이드 페이지·팝업 모두 동일하게 적용한다.**

element 이름 끝에 아래 접미사를 붙여 역할을 명시한다. 일관성이 가장 중요하므로 모든 마크업에서 동일하게 적용한다.

| 접미사 | 사용 태그/역할 | 예시 |
|--------|--------------|------|
| `...List` | `<ul>`, `<ol>` — 반복 아이템의 컨테이너 | `__benefitCardList` |
| `...Item` | `<li>` — 반복 아이템 단위 | `__benefitCardItem` |
| `...Box` | `<div>` — **같은 성격** 요소끼리 묶는 그룹 | `__heroTitleBox`, `__benefitCardTextBox` |
| `...Wrap` | `<div>` — **다른 성격** 요소들이 모여 하나의 단위를 이루는 래퍼 | `__benefitCardWrap` |

#### 그룹화 원칙 (필수)

성격이 같은 요소는 반드시 `...Box`로 묶는다. 구조가 명확해지고 gap/flex 적용이 쉬워진다.

```html
<!-- ✅ 올바른 패턴 — 같은 성격끼리 Box로 묶음 -->
<div class="card__textBox">
  <span class="card__title">제목</span>
  <span class="card__desc">설명</span>
</div>

<ul class="card__tagList">
  <li class="card__tagItem">태그1</li>
  <li class="card__tagItem">태그2</li>
</ul>

<!-- ❌ 금지 패턴 — 그룹 없이 나열 -->
<span class="card__title">제목</span>
<span class="card__desc">설명</span>
```

```html
<!-- ✅ List + Item + Box + Wrap 조합 예시 -->
<div class="benefitCard__wrap">                         ← Wrap: 아이콘+텍스트 이질 요소 묶음
  <div class="benefitCard__iconBox">                    ← Box: 아이콘 관련 동질 요소
    <img class="benefitCard__icon" src="" alt="" />
  </div>
  <div class="benefitCard__textBox">                    ← Box: 텍스트 관련 동질 요소
    <span class="benefitCard__title">혜택 제목</span>
    <span class="benefitCard__desc">혜택 설명</span>
  </div>
</div>

<ul class="section__benefitList">                       ← List: ul
  <li class="section__benefitItem">                     ← Item: li
    ...
  </li>
</ul>
```

### SCSS 블록 변수 패턴 (필수)

모든 `<style>` 블록 최상단에 `$b` 변수로 블록명을 선언하고, 이후 모든 셀렉터에서 `#{$b}`로 참조한다. **컴포넌트·가이드 페이지·팝업 모두 동일하게 적용한다.**

```scss
$b: 'button';

// ✅ 엘리먼트 — 루트 블록 안에 2뎁스로 중첩
.#{$b} {
  display: flex;
  width: 100%;

  &__label { }
  &__icon { }
}

// ✅ 모디파이어 — 루트 블록 밖에 flat 선언
.#{$b}--primary { }
.#{$b}--disabled { }

// ✅ element modifier — element에 붙는 modifier도 flat 선언 허용
//    (.formField__helper--error 처럼 block이 아닌 element의 modifier)
.#{$b}__helper--error { color: $color-danger; }
.#{$b}__helper--success { color: $color-primary-hover; }

// ✅ 조합 셀렉터 (flat)
.#{$b}--solid.#{$b}--primary { }

// ✅ 상태 pseudo — modifier flat 블록 안에서 3뎁스 허용
.#{$b}--solid.#{$b}--primary {
  &:hover:not(.#{$b}--disabled) { }
}

// ✅ 모디파이어 안에서 엘리먼트 대상 지정 (descendant)
.#{$b}--text {
  .#{$b}__label {   // .button--text .button__label 생성
    text-decoration: underline;
  }
}
```

**`&__label` 패턴 금지** — modifier 안에서 `&__element`를 쓰면 `.button--text__label`이 생성되어 실제 BEM 클래스와 불일치한다. 반드시 `.#{$b}__label`(변수 참조)로 작성한다.

```scss
// ❌ 잘못된 패턴 — .button--text__label 생성됨 (BEM 불일치)
.#{$b}--text {
  &__label { text-decoration: underline; }
}

// ✅ 올바른 패턴 — .button--text .button__label 생성됨
.#{$b}--text {
  .#{$b}__label { text-decoration: underline; }
}
```

### SCSS 변수 자동 주입

`nuxt.config.ts`의 `additionalData` 설정으로 `assets/scss/abstracts/_variables.scss`의 변수가 모든 `<style>` 블록에 자동 주입된다. `@use` 없이 바로 사용 가능하다 (실제 주입 경로: `~/assets/scss/abstracts/variables`).

```scss
// ✅ import 없이 바로 사용 가능
.button {
  background-color: $color-primary;
  color: $text-900;
  border-radius: $radius-sm;
}
```

새 토큰이 필요하면 `assets/scss/abstracts/_variables.scss`에 추가한다.
토큰 네이밍 규칙은 `rules/tokens.md` 참조.

### Mixin 우선 사용 (필수)

**컴포넌트·가이드 페이지·팝업 모두 동일하게 적용한다.**

`_mixins.scss`의 mixin이 존재하는 상황에서는 CSS를 직접 작성하지 않고 **mixin을 우선 사용한다**. `_variables.scss`와 마찬가지로 모든 `<style>` 블록에 자동 주입되므로 `@use` 없이 바로 사용 가능하다.

| 상황 | 사용 방법 |
|------|----------|
| 1줄 말줄임 | `@include truncate;` |
| N줄 말줄임 | `@include truncate(3);` |
| 모바일 미디어 쿼리 (`max-width: 600px`) | `@include mobile { ... }` |
| 데스크톱 미디어 쿼리 (`min-width: 601px`) | `@include desktop { ... }` |
| 초소형 모바일 미디어 쿼리 (`max-width: 320px`) | `@include tiny { ... }` |

```scss
// ✅ mixin 우선 사용
.#{$b}__name {
  @include truncate;       // 1줄 말줄임
}

.#{$b}__desc {
  @include truncate(2);    // 2줄 말줄임
}

// ❌ mixin이 있는데 직접 작성 금지
.#{$b}__name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
```

### 단위 규칙

`html { font-size: 10px }` 기준으로 rem을 사용한다.

```
px ÷ 10 = rem
18px → 1.8rem
14px → 1.4rem
12px → 1.2rem
```

- border, outline, box-shadow 등 **1px 고정값만 예외 허용**
- `px`를 직접 쓰는 경우 반드시 주석으로 이유 명시

### SCSS 중첩 규칙

**핵심 원칙**: element(`__`)는 block(`.#{$b}`) 안에 **2뎁스** 중첩. modifier(`--`)는 block 밖에 flat 선언. **컴포넌트·가이드 페이지·팝업 SCSS 모두 동일하게 적용한다.**

```scss
$b: 'input';

// ✅ 기준 패턴 — $b 블록 안에 element 2뎁스 중첩, 상태 pseudo는 3뎁스 허용
.#{$b} {
  display: flex;
  width: 100%;

  &__field {           // 2뎁스 — .input__field
    border: 1px solid $line-200;

    &:focus {          // 3뎁스 허용 — .input__field:focus (상태 pseudo)
      border-color: $border-input-focus;
    }

    &:disabled {       // 3뎁스 허용 — .input__field:disabled (상태 pseudo)
      background-color: $bg-disabled;
      cursor: not-allowed;
    }
  }
}

// ✅ 모디파이어 — block 밖에 flat 선언
.#{$b}--error { color: $color-danger; }

// ✅ 모디파이어 안에서 element 지정 — .#{$b}__element (descendant selector)
.#{$b}--disabled {
  .#{$b}__field { color: $text-400; }  // ✅ 변수 참조
}

// ✅ ::placeholder — Vue scoped 호환을 위해 반드시 flat 선언 (중첩 금지)
.#{$b}__field::placeholder { color: $text-600; }
.#{$b}__field:disabled::placeholder { color: $text-400; }
```

**페이지/팝업 SCSS도 동일 패턴** — 컴포넌트와 구분 없이 같은 규칙을 따른다.

```scss
// ✅ 페이지 외부 SCSS 예시 (pages/guide/... 외부 SCSS 형태)
$b: 'cartControl';

.#{$b} {
  display: flex;
  flex-direction: column;
  padding: $spacing-md $screen-padding-x;

  &__bar {             // 2뎁스
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__actions {         // 2뎁스
    display: flex;
    gap: 0.2rem;
  }

  &__shipping {        // 2뎁스
    margin-top: 1.2rem;
  }

  &__shippingMessage { // 2뎁스
    font-size: $font-size-body4;
    color: $text-800;
  }
}

// ✅ 모디파이어는 여전히 block 밖 flat
.#{$b}--compact { padding: $spacing-sm $screen-padding-x; }
```

```scss
// ❌ 금지 패턴
.#{$b} {
  &__label {
    span { }          // 태그 선택자 중첩 금지
    .other { }        // 클래스 중첩 금지
    &__text { }       // 4뎁스 금지
  }
}

// ❌ element를 block 밖 flat으로 선언 — 페이지/팝업에서도 금지
.#{$b}__bar { }       // flat element 금지 — .#{$b} { &__bar { } } 로 작성

// ❌ modifier 안에서 &__element — .input--disabled__field 생성됨 (BEM 불일치)
.#{$b}--disabled {
  &__field { }
}

// ❌ ::placeholder 중첩 — 일부 환경에서 미적용
.#{$b}__field {
  &::placeholder { }
}
```

**pseudo-class 3뎁스 허용 목록**: `:hover`, `:focus`, `:focus-visible`, `:active`, `:disabled`, `:not(...)` 등 상태 pseudo-class/pseudo-element에 한해 3뎁스 허용. 일반 클래스·태그 선택자 중첩은 금지.

### 너비 원칙

**컴포넌트는 부모 너비를 100% 채운다. 레이아웃(너비)은 감싸는 부모 div가 결정한다.**

페이지/팝업 마크업 작성 시 "레이아웃 먼저, 컴포넌트 배치 그 다음" 순서를 따른다.

```vue
<!-- ✅ 레이아웃 div를 먼저 잡고, 그 안에 컴포넌트 배치 -->
<template>
  <div class="cartControl">
    <div class="cartControl__selectAll">
      <Checkbox v-model="selectAll">전체 선택</Checkbox>
    </div>
    <div class="cartControl__shippingProgress">
      <Progress :value="80" :max="100" />
    </div>
  </div>
</template>
```

```scss
// ✅ 컴포넌트는 width: 100% (부모를 채움)
// ✅ 레이아웃 div가 실제 너비와 위치를 결정
.cartControl {
  &__selectAll {
    // 여기서 Checkbox의 너비·패딩·정렬을 제어
    padding: $spacing-sm 0;
  }

  &__shippingProgress {
    // 여기서 Progress의 너비·여백을 제어
    margin-top: 0.6rem;
    width: 100%;
  }
}
```

```scss
// ✅ 컴포넌트 자체는 부모를 100% 채우는 패턴
.button {
  display: flex;
  width: 100%;
}

// ❌ 금지 패턴 — 컴포넌트가 자기 너비를 직접 결정
.button {
  display: inline-flex;  // 금지
  width: fit-content;    // 금지
  width: 200px;          // 금지 (고정 width는 부모가 결정)
}
```

**예외 — `text` shape 버튼**: `text` shape은 인라인 보조 액션으로 설계되어 콘텐츠 너비에 맞게 자연스럽게 흐른다. 이 경우에 한해 `display: inline-flex` + `width: fit-content`를 허용한다. 반드시 shape modifier(`--text`) 안에서만 선언하고 기본 block 스타일에는 적용하지 않는다.

**예외 — `Tab` 컴포넌트 `tab__trigger`**: `tablist` 컨텍스트에서 개별 탭 버튼은 가로 흐름 안에서 콘텐츠 너비에 맞게 배치되어야 하므로 `display: inline-flex`를 허용한다. `grow: true` 모드에서는 `flex: 1`이 override되어 균등 분배로 전환된다.

```scss
// ✅ text shape 예외 허용
.#{$b}--text {
  display: inline-flex;   // text shape 전용 예외
  width: fit-content;     // text shape 전용 예외
}
```

### gap 사용 규칙

**컴포넌트·가이드 페이지·팝업 모두 동일하게 적용한다.**

`gap`은 **동일한 성격의 요소들이 동일한 간격으로 나열**될 때만 사용한다. 성격이 다른 요소 간 여백이나 간격이 요소마다 다른 경우에는 `margin`을 사용한다.

**✅ gap 적합한 케이스**

- `ul li` 목록 아이템 (동일 간격으로 반복)
- 버튼 그룹, 태그 목록, 아이콘 그리드 등 **가로로** 동일 컴포넌트 반복

```scss
// ✅ 가로 반복 나열 → gap
.#{$b}__tagList {
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;            // 태그들 모두 같은 간격
}

// ✅ 버튼 그룹 → gap
.#{$b}__btnGroup {
  display: flex;
  gap: 0.4rem;
}
```

**❌ gap 부적합한 케이스 → margin 사용**

- 요소마다 간격이 다른 경우
- 성격이 서로 다른 구역 사이 여백 (이미지 + 텍스트, 헤더 + 본문 등)

```scss
// ❌ 간격이 달라 gap 부적합
.#{$b}__layout {
  display: flex;
  flex-direction: column;
  gap: ???;               // 이미지 아래 2rem, 텍스트 아래 0.4rem — gap 불가
}

// ✅ 간격이 다를 때는 margin
.#{$b}__layout {
  display: flex;
  flex-direction: column;

  &__image { margin-bottom: 2rem; }
  &__title { margin-bottom: 0.4rem; }
  &__desc  { margin-bottom: 1.2rem; }
}
```

### reset.scss 스타일 재적용 금지

`reset.scss`에서 이미 초기화된 스타일을 컴포넌트·페이지 SCSS에 다시 작성하지 않는다.
중복 선언은 코드 노이즈이며, reset이 변경될 때 불일치가 발생한다.

작업 전 `reset.scss`를 확인하고, 이미 적용된 속성은 생략한다.

```scss
// ❌ 금지 — reset.scss에서 이미 처리
li { list-style: none; margin: 0; padding: 0; }
* { box-sizing: border-box; }
a { text-decoration: none; color: inherit; }
```

---

### 임의 hover · focus 스타일 금지

Figma 디자인에 명시되지 않은 `hover` · `focus` · `focus-visible` 스타일을 임의로 추가하지 않는다.
Figma에 해당 상태 디자인이 있는 경우에만 구현한다.

```scss
// ❌ 금지 — Figma에 없는 임의 스타일
&:hover { background-color: $bg-secondary; }
&:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px $color-primary;
  border-radius: $radius-sm;
}
```

---

### 간격 방향 규칙 (권고)

| 방향 | 속성 |
|------|------|
| 좌우(수평) 간격 | `padding` 우선 |
| 상하(수직) 간격 | `margin` 우선 |

```scss
// ✅ 좌우 → padding, 상하 → margin
.#{$b} {
  padding: 0 $screen-padding-x;   // 좌우 여백
}

.#{$b}__head {
  margin-bottom: 2rem;             // 하단 여백
}
```

강제 규칙이 아니나, 일관성 있는 패턴 유지를 권장한다.

---

### flex · gap 최소화 (BLOCKING)

기본값은 `display: block`이다. 세로로 쌓이는 요소는 flex 없이 block 흐름을 활용하고, `margin`으로 간격을 준다. **`flex-direction: column` + `gap` 조합을 금지한다.**

**금지 패턴** — 구조 영역(head/body 등)에 flex+gap 사용:

```scss
// ❌ 금지 — 세로 배치에 flex+gap
.#{$b} {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}
```

**올바른 패턴** — block 흐름 + margin:

```scss
// ✅ block 흐름 활용, margin으로 간격
.#{$b}__head {
  margin-bottom: 2rem;
}

.#{$b}__body { }
```

**금지 케이스 목록**

| 케이스 | 올바른 처리 |
|--------|-----------|
| 구역 head + body 사이 | `margin-bottom` |
| 타이틀 + 부제목 + 설명 수직 나열 | `margin-bottom` |
| 카드 내부 수직 구조 | `margin-bottom` |
| 서로 다른 성격의 구역 사이 | `margin` |

**flex는 가로 정렬이 실제로 필요할 때만** 사용한다:
- 좌우 분할 (`justify-content: space-between`)
- 수평 정렬 (`align-items: center`)
- 가로 반복 나열 (태그, 버튼 그룹 등 — gap과 함께)

---

### 금지 사항

- raw hex 컬러값 직접 사용 금지 — 반드시 토큰 변수 참조
- `inline-flex`, `inline-block` 사용 금지 (`text` shape 버튼 modifier 제외 — 위 예외 참조)
- `<style>` 에 `scoped` 누락 금지 (전역 오염 방지)
- 타이포그래피 수치 직접 입력 금지 — 토큰 변수 사용
- `reset.scss`에 이미 적용된 스타일 재선언 금지
- Figma 미명시 `hover` · `focus` · `focus-visible` 스타일 임의 추가 금지
- `flex-direction: column` + `gap` 조합 금지 — 세로 배치는 block 흐름 + `margin`으로 처리
