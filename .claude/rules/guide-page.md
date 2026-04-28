## 가이드 페이지 작성 규칙

`pages/guide/[componentName]/index.vue` 작성 시 본 규칙을 따른다. **사용자가 가이드 페이지 작성을 명시적으로 요청한 경우에만 사용**한다 (publisher 에이전트는 컴포넌트 구현 후 자동 생성하지 않는다).

---

### Props / Slots / Events 섹션 — HTML `<table>` 필수

마지막 섹션(`⑥ Props`)은 반드시 HTML `<table>` 형태로 구현한다. `<pre>` 코드 블록 금지.

#### 테이블 컬럼

- **Props**: 이름 / 타입 / 기본값 / 설명
- **Slots**: 이름 / 필수 / 설명
- **Events**: 이름 / 페이로드 / 설명

#### 마크업 구조

```html
<section class="[componentName]GuidePage__section">
  <h2 class="[componentName]GuidePage__sectionTitle">⑥ Props</h2>

  <h3 class="[componentName]GuidePage__tableTitle">Props</h3>
  <table class="[componentName]GuidePage__propsTable">
    <thead>
      <tr><th>이름</th><th>타입</th><th>기본값</th><th>설명</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><code>shape</code></td>
        <td><code>'solid' | 'line' | 'text'</code></td>
        <td><code>'solid'</code></td>
        <td>버튼 외형 스타일</td>
      </tr>
    </tbody>
  </table>

  <h3 class="[componentName]GuidePage__tableTitle">Slots</h3>
  <!-- Slots 테이블 -->

  <h3 class="[componentName]GuidePage__tableTitle">Events</h3>
  <!-- Events 테이블 -->
</section>
```

#### 페이지 SCSS

```scss
&__tableTitle {
  font-size: $font-size-body2;
  font-weight: $font-weight-bold;
  color: $text-strong;
  margin-top: $spacing-lg;
  margin-bottom: $spacing-sm;
}

&__propsTable {
  width: 100%;
  border-collapse: collapse;
  font-size: $font-size-body3;

  th, td {
    border: 1px solid $border-default;
    padding: $spacing-sm $spacing-md;
    text-align: left;
    vertical-align: top;
  }

  th {
    background-color: $bg-secondary;
    font-weight: $font-weight-medium;
    color: $text-secondary;
    white-space: nowrap;
  }

  td { color: $text-strong; }

  code {
    background-color: $bg-tertiary;
    padding: 0.1rem 0.4rem;
    border-radius: $radius-sm;
    font-size: $font-size-caption1;
    white-space: nowrap;
  }
}
```

---

### Props 위임 안내 — `v-bind="$attrs"` 사용 시 필수

테이블 아래에 위임 안내 단락(`__delegationNote`)을 반드시 추가한다.

#### 위임 대상 매핑

| 컴포넌트 | 위임 대상 | 예시 속성 |
|---|---|---|
| Button | `<button>` | `aria-label`, `autofocus`, `tabindex`, `data-*` |
| Input | `<input>` | `maxlength`, `pattern`, `autocomplete`, `inputmode`, `data-*` |
| Select (Radix Vue) | `SelectTrigger` (2단계) + `SelectRoot` (1단계 분리) | `aria-label`, `aria-describedby`, `tabindex`, `name`, `required` |
| **복합 컴포넌트** (Stepper 등) | 기본 `$attrs` → 핵심 입력 요소 (`<input>`). 각 버튼 등 개별 요소는 `decrementAttrs`/`incrementAttrs` 같은 **별도 prop**으로 위임 | `id`, `name`, `aria-label`, `aria-describedby` → input. `data-*`, 추가 이벤트 → 버튼 prop |

> **복합 컴포넌트 delegationNote 작성 규칙**: `$attrs`가 input 등 하나의 요소로만 가고 나머지 요소는 별도 prop으로 위임하는 구조면 두 가지 위임 경로를 모두 안내한다.

#### 단순 컴포넌트 (Button, Input 등)

```html
<p class="[componentName]GuidePage__delegationNote">
  <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로
  위 Props 외에도 <code>&lt;[핵심요소]&gt;</code> 요소의 모든 네이티브 HTML 속성
  (<code>aria-label</code>, <code>autofocus</code>, <code>tabindex</code>, <code>data-*</code> 등)을
  그대로 전달할 수 있습니다.<br />
  React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
</p>
```

#### 복합 컴포넌트 (Stepper 등 — `$attrs` 목적지가 여러 요소로 분산)

```html
<p class="[componentName]GuidePage__delegationNote">
  <strong>네이티브 속성 위임</strong>: 이 컴포넌트는 <code>v-bind="$attrs"</code>를 사용하므로
  위 Props 외에도 <code>&lt;input&gt;</code> 요소의 모든 네이티브 HTML 속성
  (<code>id</code>, <code>name</code>, <code>aria-label</code>, <code>aria-describedby</code>, <code>data-*</code> 등)을
  그대로 전달할 수 있습니다.<br />
  각 버튼에 attrs를 전달하려면 <code>decrementAttrs</code> / <code>incrementAttrs</code> prop을 사용합니다.<br />
  React의 <code>{...rest}</code> props spreading과 동일한 동작입니다.
</p>
```

#### delegationNote SCSS

```scss
&__delegationNote {
  margin-top: $spacing-lg;
  padding: $spacing-sm $spacing-md;
  background-color: $bg-accent-light-blue;
  border-left: 3px solid $color-primary;
  border-radius: $radius-sm;
  font-size: $font-size-body3;
  color: $text-secondary;
  line-height: $line-height-base;

  code {
    background-color: $bg-tertiary;
    padding: 0.1rem 0.4rem;
    border-radius: $radius-sm;
    font-size: $font-size-caption1;
  }
}
```

---

### Radix Vue 기반 컴포넌트 추가 API 안내 — `__radixNote` 필수

Radix Vue를 래핑한 컴포넌트의 가이드 페이지에는, 본 가이드에서 다루는 props 외에 Radix Vue가 지원하는 추가 props를 사용하려면 공식 API 문서를 확인하라는 안내 문구를 **반드시** 추가한다.

```html
<p class="[componentName]GuidePage__radixNote">
  이 컴포넌트는 <strong>Radix Vue</strong>를 기반으로 합니다.
  위 Props 외에도 Radix Vue가 지원하는 추가 props를 사용할 수 있습니다.
  전체 API는
  <a href="https://www.radix-vue.com" target="_blank" rel="noopener noreferrer">radix-vue.com 공식 문서</a>
  또는 Context7 MCP(<code>mcp__context7__query-docs</code>)를 통해 확인하세요.
</p>
```

#### radixNote SCSS

```scss
&__radixNote {
  margin-top: $spacing-md;
  padding: $spacing-sm $spacing-md;
  background-color: $bg-secondary;
  border-left: 3px solid $border-default;
  border-radius: $radius-sm;
  font-size: $font-size-body3;
  color: $text-secondary;
  line-height: $line-height-base;

  a { color: $color-primary; }

  code {
    background-color: $bg-tertiary;
    padding: 0.1rem 0.4rem;
    border-radius: $radius-sm;
    font-size: $font-size-caption1;
  }
}
```

---

### FormField 사용 컴포넌트의 가이드 페이지 — Props/Slots 표 중복 금지

**FormField 상세 설명(Props/Slots 표)은 `pages/guide/input/index.vue` 한 곳에만 작성**한다. Select·DatePicker 등 FormField를 사용하는 다른 가이드 페이지는 Props/Slots 표를 중복 작성하지 않고 아래 안내문만 추가한다.

```html
<p class="[componentName]GuidePage__note">
  FormField Props/Slots 상세 설명은 <a href="/guide/input">Input 가이드 페이지</a>를 참조하세요.
</p>
```
