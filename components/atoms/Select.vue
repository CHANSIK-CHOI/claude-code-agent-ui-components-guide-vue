<template>
  <SelectRoot
    v-bind="rootAttrs"
    v-model="proxyValue"
    :disabled="disabled"
    @update:open="emit('open-change', $event)"
  >
    <SelectTrigger
      v-bind="triggerAttrs"
      :id="selectId"
      class="SelectRoot__trigger"
      :class="{
        'SelectRoot__trigger--disabled': disabled,
        'SelectRoot__trigger--error': error,
      }"
      :aria-invalid="error ? 'true' : undefined"
    >
      <SelectValue class="SelectRoot__value" :placeholder="placeholder" />
      <SelectIcon as-child>
        <span class="SelectRoot__icon">
          <svg
            class="SelectRoot__iconSvg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M13.7598 10.1057L7.99977 5.30571L2.23977 10.1057"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </span>
      </SelectIcon>
    </SelectTrigger>

    <SelectPortal>
      <SelectContent
        class="SelectRoot__content"
        position="popper"
        :side-offset="4"
      >
        <SelectScrollUpButton
          class="SelectRoot__scrollBtn SelectRoot__scrollBtn--up"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            width="16"
            height="16"
          >
            <path
              d="M13.7598 10.1057L7.99977 5.30571L2.23977 10.1057"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </SelectScrollUpButton>

        <SelectViewport class="SelectRoot__viewport">
          <SelectItem
            v-for="option in options"
            :key="option.value"
            class="SelectRoot__item"
            :value="option.value"
            :disabled="option.disabled"
          >
            <SelectItemText class="SelectRoot__itemText">
              {{ option.label }}
            </SelectItemText>
          </SelectItem>
        </SelectViewport>

        <SelectScrollDownButton
          class="SelectRoot__scrollBtn SelectRoot__scrollBtn--down"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            width="16"
            height="16"
          >
            <path
              d="M13.7598 10.1057L7.99977 5.30571L2.23977 10.1057"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              transform="rotate(180 8 8)"
            />
          </svg>
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
  }>(),
  {
    modelValue: undefined,
    placeholder: "",
    disabled: false,
    error: false,
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "open-change": [open: boolean];
}>();

// SelectRoot가 받는 Radix Vue 전용 props — 나머지는 SelectTrigger(button)로 위임
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
const _uid = Math.random().toString(36).slice(2, 8);
const selectId = computed(
  () => (attrs.id as string | undefined) || `select-${_uid}`,
);

const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([k]) =>
      (SELECT_ROOT_PROPS as readonly string[]).includes(k),
    ),
  ),
);

const triggerAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(
      ([k]) =>
        !(SELECT_ROOT_PROPS as readonly string[]).includes(k) && k !== "id",
    ),
  ),
);

const proxyValue = computed({
  get: () => props.modelValue ?? "",
  set: (val: string) => emit("update:modelValue", val),
});
</script>

<!-- ──────────────────────────────────────────────────────────────────
  scoped 한 블록으로 통합:
  - Trigger 등 SFC 직접 요소 → 일반 scoped 선택자
  - SelectPortal(<body> 마운트) 내부 요소 → :deep() pseudo-class 사용
    :deep(.Foo)는 컴파일 시 [data-v-xxxxx] .Foo 로 변환됨
    Portal이 body에 마운트되어도 조상 중 data-v 속성이 있으면 매칭
  - position="popper" 시 --radix-select-trigger-width CSS 변수가
    SelectContent에 자동 주입됨 → width에 직접 참조
──────────────────────────────────────────────────────────────────── -->
<style lang="scss" scoped>
$b: "SelectRoot";

.#{$b} {
  &__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 4.6rem; // 46px — Figma 명세 고정 높이
    padding: 0 $spacing-input-x;
    border: 1px solid $line-200;
    border-radius: $radius-md;
    background-color: $bg-primary;
    font-size: $font-size-body1;
    font-weight: $font-weight-regular;
    color: $text-900;
    cursor: pointer;
    outline: none;

    &:focus-visible {
      outline: none;
      border-color: $border-input-focus;
      box-shadow: 0 0 0 3px rgba(17, 17, 17, 0.12);
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.6rem;
    height: 1.6rem;
    flex-shrink: 0;
    color: $text-900;
    transform: rotate(180deg); // 기본(닫힌 상태) → 아래(↓) 방향
    transition: transform $duration-fast ease;
  }

  &__iconSvg {
    width: 100%;
    height: 100%;
  }
}

// Trigger 열린 상태 — Radix Vue가 data-state="open" 적용
.#{$b}__trigger[data-state="open"] {
  border-color: $border-input-focus;

  .#{$b}__icon {
    transform: rotate(0deg); // 열린 상태 → 위(↑) 방향
  }
}

// Trigger disabled modifier
.#{$b}__trigger--disabled {
  background-color: $bg-disabled;
  color: $text-300;
  cursor: not-allowed;

  .#{$b}__icon {
    color: $text-300;
  }
}

// SelectValue placeholder 상태 — Radix Vue가 data-placeholder 속성 추가
.#{$b}__value[data-placeholder] {
  color: $text-600;
}

// ── SelectPortal 내부 요소 (:deep) ──────────────────────────────────
// SelectContent 등은 Radix Vue 컴포넌트가 내부에서 렌더링하므로
// 부모 scoped 속성(data-v-xxxxx)이 직접 붙지 않음.
// :deep()을 쓰면 [data-v-xxxxx] .SelectRoot__content 로 컴파일되어
// Portal이 <body>에 마운트되어도 DOM 트리상 조상에 data-v가 있으면 매칭됨.
// $z-sticky(200): $z-dropdown(100)으로는 가이드 페이지 stacking context보다 낮을 수 있음
:deep(.#{$b}__content) {
  background-color: $bg-primary;
  border: 1px solid $line-200;
  border-radius: $radius-md;
  overflow: hidden;
  width: var(--radix-select-trigger-width);
  max-height: var(--radix-select-content-available-height);
  z-index: $z-sticky;
}

:deep(.#{$b}__viewport) {
  padding: 0;
}

:deep(.#{$b}__item) {
  display: flex;
  align-items: center;
  height: 4.4rem; // 44px — Figma 명세 고정 높이
  padding: 0 $spacing-input-x;
  font-size: $font-size-body1;
  font-weight: $font-weight-regular;
  color: $text-600;
  cursor: pointer;
  outline: none;
  user-select: none;

  &[data-highlighted] {
    background-color: $bg-secondary;
    color: $text-900;
    outline: none;
  }

  &[data-state="checked"] {
    background-color: $bg-disabled;
    color: $text-900;
  }

  &[data-disabled] {
    background-color: $bg-disabled;
    color: $text-300;
    cursor: not-allowed;
    pointer-events: none;
  }
}

:deep(.#{$b}__itemText) {
  flex: 1;
}

:deep(.#{$b}__scrollBtn) {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.4rem;
  color: $text-600;
  cursor: default;
}
</style>
