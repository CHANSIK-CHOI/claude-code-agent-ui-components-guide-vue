<template>
  <div
    class="input"
    :class="{
      'input--error': props.error,
      'input--disabled': props.disabled,
    }"
  >
    <input
      v-bind="$attrs"
      class="input__field"
      :type="props.type"
      :value="props.modelValue"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :placeholder="props.placeholder"
      :aria-invalid="props.error ? 'true' : undefined"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="emit('focus')"
      @blur="emit('blur', ($event.target as HTMLInputElement).value)"
      @change="emit('change', ($event.target as HTMLInputElement).value)"
    />
    <div v-if="showClear || $slots.suffix" class="input__suffix">
      <button
        v-show="showClear"
        type="button"
        class="input__clearBtn"
        aria-label="입력 내용 지우기"
        @click="handleClear"
      >
        <InputClearSvg />
      </button>
      <slot name="suffix" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import InputClearSvg from '@nd/assets/images/common/inputClear.svg?skipsvgo';

  defineOptions({ inheritAttrs: false });

  const props = withDefaults(
    defineProps<{
      modelValue?: string;
      error?: boolean;
      disabled?: boolean;
      readonly?: boolean;
      placeholder?: string;
      type?: string;
      hideClear?: boolean;
    }>(),
    {
      modelValue: '',
      error: false,
      disabled: false,
      readonly: false,
      placeholder: '',
      type: 'text',
      hideClear: false,
    }
  );

  const emit = defineEmits<{
    'update:modelValue': [value: string];
    focus: [];
    blur: [value: string];
    change: [value: string];
    clear: [];
  }>();

  const showClear = computed(
    () => !props.hideClear && !props.disabled && !props.readonly && props.modelValue.length > 0
  );

  function handleClear(): void {
    emit('update:modelValue', '');
    emit('clear');
  }
</script>

<style lang="scss" scoped>
  $b: 'input';

  .#{$b} {
    display: flex;
    align-items: center;
    width: 100%;
    min-width: 0; // ← 이 줄 추가
    border: 1px solid $line-200;
    border-radius: $radius-md;
    background-color: $bg-primary;

    &:focus-within {
      border-color: $border-input-focus;
    }

    &__field {
      flex: 1;
      width: 100%;
      height: 4.6rem; // 46px — Figma 명세 고정 높이
      padding: 0 $spacing-input-x;
      background: transparent;
      font-size: $font-size-body1;
      font-weight: $font-weight-regular;
      line-height: $line-height-snug;
      color: $text-900;
      outline: none;
      appearance: none;
      border: none;

      &:focus-visible {
        outline: none;
      }

      &:disabled {
        color: $text-300;
        cursor: not-allowed;
      }
    }

    &__suffix {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding-right: 1.2rem;
    }

    &__clearBtn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.6rem;
      height: 1.6rem;
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;

      svg {
        width: 1.6rem;
        height: 1.6rem;
      }
    }
  }

  // ::placeholder는 Vue scoped 호환을 위해 flat 선언 (중첩 시 일부 환경에서 미적용)
  .#{$b}__field::placeholder {
    color: $text-600;
  }

  .#{$b}__field:disabled::placeholder {
    color: $text-300;
  }

  .#{$b}--disabled {
    background-color: $bg-disabled;
  }

  .#{$b}--error {
    border-color: $color-danger;

    &:focus-within {
      border-color: $color-danger;
    }
  }
</style>
