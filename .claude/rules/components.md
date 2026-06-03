## 컴포넌트 제작 규칙

### Vue SFC 구조 순서

```vue
<template>
  <!-- 마크업 -->
</template>

<script setup lang="ts">
// props / emit / 로직
</script>

<style lang="scss" scoped>
// 스타일
</style>
```

> React 비교: JSX 파일 하나에 마크업+로직+스타일이 분리되던 것이
> Vue SFC에서는 template / script / style 블록으로 한 파일 안에 통합됩니다.

### 컴포넌트 네이밍

- 컴포넌트 파일명: PascalCase — `Button.vue`, `InputField.vue`
- className BEM 규칙은 `rules/style.md` 참조

### Props / Emit 설계

`withDefaults`로 기본값을 설정한다. 타입은 제네릭 방식으로 선언한다.

```vue
<script setup lang="ts">
// 공용 타입은 @nd/components/types에서 import
type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const props = withDefaults(
  defineProps<{
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    variant: "primary",
    size: "md",
    disabled: false,
    loading: false,
  },
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>
```

> React 비교: React의 `interface ButtonProps` + `defaultProps`를
> Vue에서는 `defineProps`(타입) + `withDefaults`(기본값)으로 처리합니다.

### v-model 양방향 바인딩 — `defineModel` 사용 (Vue 3.4+, 단일 출처)

부모와 양방향으로 동기화하는 값(`open`, `modelValue`, `value` 등)은 **`defineModel` 매크로**로 선언한다. `defineProps` + `defineEmits('update:xxx')` + 수동 이벤트 포워딩(`@update:xxx="emit('update:xxx', $event)"`) 3종 세트를 **ref 한 줄**로 대체하는 것이 Vue 3.4 정석이다.

- **Vue 3.4 정식(stable) 매크로** — 프로젝트는 Vue 3.4.19이므로 사용 가능하다. (CLAUDE.md가 금지한 건 `useTemplateRef`·`useId` 같은 **3.5+** API이며 `defineModel`은 3.4라 해당 없음)
- `const model = defineModel<T>('name', { required: true })` → **`Ref<T>` 반환**. `model.value = x` 로 변경하면 Vue가 자동으로 `update:name` 이벤트를 emit한다.
- 부모가 **항상** 값을 주입하는 경우(팝업의 `open` 등) `{ required: true }` 로 선언해 타입에서 `undefined` 를 제거한다. 선택적이면 `{ default: ... }`.
- `update:name` 은 `defineModel` 이 내부적으로 선언하므로 `defineEmits` 에 **다시 적지 않는다**. 그 외 이벤트(`navigate`, `closed` 등)만 `defineEmits` 에 남긴다.

```vue
<!-- ✅ defineModel — Vue 3.4 정석 -->
<script setup lang="ts">
const open = defineModel<boolean>('open', { required: true })
// 닫기: open.value = false  →  자동으로 update:open emit
</script>
<template>
  <!-- 부모가 v-model:open 으로 연결 -->
</template>

<!-- ❌ Before — 보일러플레이트 3종 + 포워딩 누락 시 양방향 끊김 -->
<script setup lang="ts">
defineProps<{ open: boolean }>()
const emit = defineEmits<{ 'update:open': [value: boolean] }>()
// 자식 컴포넌트에 :open + @update:open="emit('update:open', $event)" 를 손으로 연결해야 함
</script>
```

> **왜 수동 포워딩보다 나은가 (함정 회피)**: `update:open` 을 `defineEmits` 로 선언하는 순간, 부모가 `v-model` 로 주입한 `onUpdate:open` 리스너는 **`$attrs` 에서 제외**된다 (Vue 공식 — "declared emits are excluded from fallthrough attributes"). 따라서 `v-bind="$attrs"` 로도 자동 전달되지 않아, 중간 래퍼마다 `@update:open="emit('update:open', $event)"` 한 줄을 **빠짐없이** 적어야 양방향이 이어진다. 한 곳이라도 빠지면 dim 클릭·ESC 닫힘 신호가 거기서 끊긴다. `defineModel` 은 이 연결을 컴파일러가 자동 생성하므로 누락 자체가 구조적으로 불가능하다.

> React 비교: 부모가 `[open, setOpen]=useState` 를 들고 자식엔 `value`/`onChange` 를 내려주던 걸, **자식이 `open` 양방향 ref 를 직접 들고** 부모의 `v-model` 과 자동 동기화하는 것. 중간에서 `onChange={v => onChange(v)}` 로 콜백을 손으로 포워딩할 필요가 사라진다.

> **팝업 적용**: 팝업 래퍼(`popups/*`)의 `open` 제어는 본 메커니즘을 그대로 적용하며, 팝업 특화 규칙(금지 패턴·부모 연결·`v-if` 마운트 금지 등)은 `rules/popups.md §3` 단일 출처를 따른다.

### 네이티브 속성 위임 (Props Delegation)

**모든 컴포넌트**는 Wrapper 여부와 관계없이, 핵심 HTML 요소에 `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"`를 반드시 적용한다.

이렇게 하면 명시된 props 외에도 네이티브 HTML 속성(`aria-label`, `autofocus`, `tabindex`, `data-*` 등)을 사용자가 컴포넌트에 직접 전달할 수 있다.

> React 비교: React의 `{...rest}` props spreading과 동일한 동작이다.

```vue
<!-- Button.vue — 단일(Base) 컴포넌트도 동일하게 적용 -->
<template>
  <button class="button" :disabled="disabled" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = defineProps<{ disabled?: boolean }>();
</script>
```

**`v-bind="$attrs"` 위치 규칙:**

루트가 래퍼 `<div>`인 경우에도 `<div>`가 아닌 **핵심 인터랙티브 요소**에 배치한다.

| 컴포넌트 | `v-bind="$attrs"` 위치                |
| -------- | ------------------------------------- |
| Button   | `<button>`                            |
| Input    | `<input>`                             |
| Select   | `<select>` 또는 Radix `SelectTrigger` |
| Checkbox | `<input type="checkbox">`             |
| Textarea | `<textarea>`                          |
| Anchor   | `<a>`                                 |

**`v-bind="$attrs"` 순서 규칙 — 반드시 먼저 작성**

React에서 `{...rest}`를 명시적 prop 앞에 쓰면 명시적 prop이 우선권을 갖는 것과 동일하다.
Vue 3도 나중에 오는 바인딩이 앞의 바인딩을 덮어쓰므로, `v-bind="$attrs"`는 반드시 **명시적 바인딩보다 먼저** 작성해야 컴포넌트 내부 값이 외부 전달값에 덮어씌워지지 않는다.

> React 비교: `<button {...rest} disabled={disabled}>` — `{...rest}`가 앞에, 명시 prop이 뒤에 오는 패턴과 동일하다.

```vue
<!-- ✅ 올바른 순서 — $attrs 먼저, 명시 바인딩 나중 -->
<button v-bind="$attrs" :type="type" :disabled="disabled || loading">
  <slot />
</button>

<!-- ❌ 금지 — $attrs가 나중에 오면 외부 type/disabled가 내부 값을 덮어씀 -->
<button :type="type" :disabled="disabled || loading" v-bind="$attrs">
  <slot />
</button>
```

**예외 — 덮어쓰지 않고 병합되는 경우:**

| 속성 종류                                | 동작                                   |
| ---------------------------------------- | -------------------------------------- |
| `class`, `style`                         | 순서 무관하게 항상 **병합** (merge)    |
| 이벤트 핸들러 (`@click` 등)              | 순서 무관하게 **양쪽 모두 실행**       |
| 나머지 HTML 속성 (`type`, `disabled` 등) | 나중에 오는 값이 **덮어씀** (override) |

---

### Variant 구성 (class 바인딩)

CVA 대신 Vue의 `:class` 바인딩으로 처리한다. `scoped` 방식이므로 클래스명을 문자열로 직접 사용한다.

```vue
<template>
  <button
    class="button"
    :class="[
      `button--${variant}`,
      `button--${size}`,
      { 'button--disabled': disabled },
      { 'button--loading': loading },
    ]"
    :disabled="disabled || loading"
  >
    <slot />
  </button>
</template>
```

> React 비교: React에서 `cva()`로 variant 클래스를 조합하던 것을
> Vue에서는 `:class` 배열 바인딩으로 동일하게 처리합니다.

상태: `disabled`, `loading`, `error`는 반드시 포함한다.

### Slot 패턴

Vue의 `<slot>`은 React의 `{children}`에 해당한다.

```vue
<!-- 기본 슬롯 (React의 {children}) -->
<button class="button">
  <slot />
</button>
```

```vue
<!-- 네임드 슬롯 (React에서 iconLeft={<Icon />} prop으로 넘기던 것) -->
<template>
  <button class="button">
    <span v-if="$slots.icon" class="button__icon">
      <slot name="icon" />
    </span>
    <span class="button__label">
      <slot />
    </span>
  </button>
</template>

<!-- 사용 시 -->
<Button>
  <template #icon><IconSave /></template>
  저장하기
</Button>
```

### Radix Vue 활용 패턴

접근성이 필요한 복잡한 UI (Dialog, Dropdown, Tooltip 등)는 Radix Vue로 동작 로직을 가져오고, 스타일은 전부 SCSS로 직접 작성한다.

```vue
<template>
  <DialogRoot v-model:open="isOpen">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>
    <DialogPortal>
      <DialogOverlay class="modal__overlay" />
      <DialogContent class="modal__content">
        <slot />
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style lang="scss" scoped>
.modal {
  &__overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
  &__content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
```

### Radix Vue 래핑 컴포넌트 attrs 위임 전략

직접 만든 컴포넌트(Button, Input)는 `v-bind="$attrs"` 하나로 핵심 HTML 요소에 전부 위임하면 된다.
Radix Vue 래핑 컴포넌트는 여러 서브 컴포넌트가 있으므로, attrs를 어디에 배분할지 명시적으로 결정해야 한다.

**3단계 위임 전략:**

| 단계                     | 대상 attrs                                                         | 위임 위치        | 처리 방법                            |
| ------------------------ | ------------------------------------------------------------------ | ---------------- | ------------------------------------ |
| 1단계 — Root 전용 props  | 상태/폼 관련 (`name`, `required`, `dir`, `open`, `defaultOpen` 등) | Root 컴포넌트    | `useAttrs()`로 명시적 리스트 분리    |
| 2단계 — 인터랙티브 attrs | HTML attr + Trigger props (`aria-*`, `tabindex`, `data-*` 등)      | Trigger 컴포넌트 | 1단계 제외 나머지 전부               |
| 3단계 — Content 포지셔닝 | 포지셔닝 (`sideOffset`, `align`, `side` 등)                        | Content 컴포넌트 | 필요한 것만 **명시적 prop**으로 추가 |

> **⚠️ "HTML attr 제외" 금지**: Radix Vue 컴포넌트라도 `aria-label`, `aria-describedby` 같은 접근성 속성은 인터랙티브 요소(Trigger)에 반드시 전달해야 한다. HTML attr과 Radix props를 출처로 구분하지 않는다.

> **Content 포지셔닝 과잉 설계 금지**: `avoidCollisions`, `collisionPadding` 등 고급 포지셔닝은 하드코딩 default로 충분하다. `sideOffset` 처럼 실제로 조정이 필요한 것만 명시적 prop으로 노출한다.

```vue
<!-- Select.vue — Radix Vue attrs 위임 패턴 예시 -->
<script setup lang="ts">
defineOptions({ inheritAttrs: false });

// 1단계: Root 전용 props 명시 목록
const SELECT_ROOT_PROPS = [
  "defaultValue",
  "open",
  "defaultOpen",
  "required",
  "name",
  "autocomplete",
  "dir",
] as const;

const attrs = useAttrs();

// rootAttrs: Root 전용 props만 분리
const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([k]) =>
      (SELECT_ROOT_PROPS as readonly string[]).includes(k),
    ),
  ),
);

// triggerAttrs: 나머지 전부 (2단계 — aria-*, tabindex, data-* 등)
const triggerAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([k]) =>
        !(SELECT_ROOT_PROPS as readonly string[]).includes(k) && k !== "id",
    ),
  ),
);
</script>

<template>
  <SelectRoot v-bind="rootAttrs" v-model="proxyValue">
    <SelectTrigger v-bind="triggerAttrs"
      ><!-- 2단계: aria-*, tabindex 등 전달됨 -->
      ...
    </SelectTrigger>
    <SelectContent position="popper" :side-offset="4"
      ><!-- 3단계: 하드코딩 default -->
      ...
    </SelectContent>
  </SelectRoot>
</template>
```

---

### Base / Wrapper 컴포넌트 패턴

Vue에서도 React와 동일하게 Base/Wrapper 분리가 가능하다.
핵심은 `v-bind="$attrs"` — React의 `{...rest}` props spreading에 해당한다.

**책임 분리 — 무엇을 Base에 두고 무엇을 Wrapper에 둘지**

| 영역                                                         | Base 담당 (공통 로직)                      | Wrapper 담당 (추가 기능)                       |
| ------------------------------------------------------------ | ------------------------------------------ | ---------------------------------------------- |
| v-model / 양방향 바인딩                                      | ✅ `modelValue` / `update:modelValue` 정의 | ❌ Base의 v-model을 그대로 위임                |
| 공통 상태 props                                              | ✅ `disabled`, `error`, `readonly` 등      | ❌ Base에 위임 (재선언 금지)                   |
| `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"` | ✅ 핵심 인터랙티브 요소에 적용             | ✅ Wrapper 자체 루트에도 동일 적용 (이중 위임) |
| 검증·에러 표시 마크업                                        | ✅ `<p class="...__error">` 등             | ❌ Base 슬롯/표시 그대로 사용                  |
| 추가 시각 요소 (검색 버튼, 토글 아이콘 등)                   | ❌                                         | ✅ Base 옆에 형제 요소로 추가                  |
| 추가 이벤트 (`@search`, `@toggle` 등)                        | ❌                                         | ✅ Wrapper에서 정의·emit                       |
| 라벨·헬퍼텍스트 등 데코레이션                                | ❌                                         | ✅ (FormField 같은 molecules가 담당)           |

**판정 기준 한 줄**: 그 로직을 빼면 다른 Wrapper에서도 똑같이 다시 작성해야 한다면 → **Base**. 특정 시나리오(검색·비밀번호 토글 등)에만 필요하면 → **Wrapper**.

> **금지**: Wrapper에서 Base의 v-model 처리·에러 표시·attrs 위임 같은 공통 로직을 다시 구현. Wrapper는 반드시 `<Base v-model="..." :error="..." v-bind="$attrs" />` 형태로 Base를 임포트해 사용하고, 자기만의 추가 요소(버튼·아이콘·이벤트)에만 집중한다.

**Base 컴포넌트** — 공통 로직만 담당

```vue
<!-- Input.vue -->
<template>
  <div class="input" :class="{ 'input--error': !!error }">
    <input
      class="input__field"
      :value="modelValue"
      :disabled="disabled"
      v-bind="$attrs"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <p v-if="error" class="input__error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = defineProps<{
  modelValue?: string;
  disabled?: boolean;
  error?: string;
}>();
const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
</script>
```

**Wrapper 컴포넌트** — Base를 import해서 추가 기능만 구현

```vue
<!-- InputSearch.vue -->
<template>
  <div class="inputSearch">
    <Input
      v-model="internalValue"
      v-bind="$attrs"
      :disabled="disabled"
      :error="error"
    />
    <button
      type="button"
      class="inputSearch__btn"
      :disabled="disabled"
      @click="emit('search', internalValue)"
    >
      <IconSearch />
    </button>
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = defineProps<{
  modelValue?: string;
  disabled?: boolean;
  error?: string;
}>();
const emit = defineEmits<{
  "update:modelValue": [value: string];
  search: [value: string];
}>();

const internalValue = computed({
  get: () => props.modelValue ?? "",
  set: (val) => emit("update:modelValue", val),
});
</script>
```

> React 비교:
>
> - `{...rest}` → `v-bind="$attrs"`
> - `forwardRef` → `defineExpose()` (내부 ref를 외부로 노출할 때)
> - `defineOptions({ inheritAttrs: false })` — attrs가 루트 요소에 자동 적용되는 것을 막고 원하는 위치에 수동으로 `v-bind="$attrs"`를 지정

폴더 구조는 `rules/architecture.md` 참조.

### 금지 사항

- Options API 사용 금지 — 반드시 `<script setup lang="ts">` 사용
- TypeScript `any` 사용 금지 — 모르면 `unknown` 후 정제
- `$style.ClassName` CSS Modules 문법 사용 금지 — scoped 방식으로 통일
- Vuetify 컴포넌트 사용 금지
- 레이아웃 관련 prop(`fullWidth`, `centered` 등) 추가 금지
