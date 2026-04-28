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

### SCSS 블록 변수 패턴 (필수)

모든 컴포넌트 `<style>` 블록 최상단에 `$b` 변수로 블록명을 선언하고, 이후 모든 셀렉터에서 `#{$b}`로 참조한다.

```scss
$b: 'button';

// ✅ 블록
.#{$b} { }

// ✅ 엘리먼트
.#{$b}__label { }
.#{$b}__icon { }

// ✅ 모디파이어
.#{$b}--primary { }
.#{$b}--disabled { }

// ✅ 조합 셀렉터 (flat)
.#{$b}--solid.#{$b}--primary { }

// ✅ 상태 pseudo — & 안에서 참조
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

`nuxt.config.ts`의 `additionalData` 설정으로 `assets/scss/abstracts/_variables.scss`의 변수가 모든 `<style>` 블록에 자동 주입된다. `@use` 없이 바로 사용 가능하다.

```scss
// ✅ import 없이 바로 사용 가능
.button {
  background-color: $color-primary;
  color: $text-strong;
  border-radius: $radius-sm;
}
```

새 토큰이 필요하면 `assets/scss/abstracts/_variables.scss`에 추가한다.
토큰 네이밍 규칙은 `rules/tokens.md` 참조.

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

**핵심 원칙**: element(`__`)는 block(`.#{$b}`) 안에 중첩. modifier(`--`)는 block 밖에 flat 선언.

```scss
$b: 'input';

// ✅ 기준 패턴 — $b 블록 안에 element 중첩, pseudo-class 3뎁스 허용
.#{$b} {
  display: flex;
  width: 100%;

  &__field {           // 2뎁스 — .input__field
    border: 1px solid $border-default;

    &:focus {          // 3뎁스 허용 — .input__field:focus
      border-color: $border-input-focus;
    }

    &:disabled {       // 3뎁스 허용 — .input__field:disabled
      background-color: $bg-disabled;
      cursor: not-allowed;
    }
  }
}

// ✅ 모디파이어 — block 밖에 flat 선언
.#{$b}--error { color: $color-danger; }

// ✅ 모디파이어 안에서 element 지정 — .#{$b}__element (descendant selector)
.#{$b}--disabled {
  .#{$b}__field { color: $text-disabled; }  // ✅ 변수 참조
}

// ✅ ::placeholder — Vue scoped 호환을 위해 반드시 flat 선언 (중첩 금지)
.#{$b}__field::placeholder { color: $text-secondary; }
.#{$b}__field:disabled::placeholder { color: $text-disabled; }
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

컴포넌트는 부모 너비를 100% 채운다. 레이아웃은 부모가 결정한다.

```scss
// ✅ 올바른 패턴
.button {
  display: flex;
  width: 100%;
}

// ❌ 금지 패턴
.button {
  display: inline-flex;  // 금지
  width: fit-content;    // 금지
  width: 200px;          // 금지 (고정 width는 부모가 결정)
}
```

**예외 — `text` shape 버튼**: `text` shape은 인라인 보조 액션으로 설계되어 콘텐츠 너비에 맞게 자연스럽게 흐른다. 이 경우에 한해 `display: inline-flex` + `width: fit-content`를 허용한다. 반드시 shape modifier(`--text`) 안에서만 선언하고 기본 block 스타일에는 적용하지 않는다.

```scss
// ✅ text shape 예외 허용
.#{$b}--text {
  display: inline-flex;   // text shape 전용 예외
  width: fit-content;     // text shape 전용 예외
}
```

### 금지 사항

- raw hex 컬러값 직접 사용 금지 — 반드시 토큰 변수 참조
- `inline-flex`, `inline-block` 사용 금지 (`text` shape 버튼 modifier 제외 — 위 예외 참조)
- `<style>` 에 `scoped` 누락 금지 (전역 오염 방지)
- 타이포그래피 수치 직접 입력 금지 — 토큰 변수 사용
