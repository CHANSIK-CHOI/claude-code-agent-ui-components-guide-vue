<template>
  <div
    class="textArea"
    :class="{
      'textArea--error': props.error,
      'textArea--disabled': props.disabled,
      'textArea--has-counter': !!props.maxLength,
    }"
  >
    <textarea
      v-bind="$attrs"
      :id="textareaId"
      class="textArea__field"
      :value="props.modelValue"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :placeholder="props.placeholder"
      :rows="props.rows"
      :maxlength="props.maxLength"
      :aria-invalid="props.error ? 'true' : undefined"
      :aria-describedby="props.maxLength ? `${textareaId}-counter` : undefined"
      :style="{ resize: props.resize }"
      @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      @focus="emit('focus')"
      @blur="emit('blur', ($event.target as HTMLTextAreaElement).value)"
      @change="emit('change', ($event.target as HTMLTextAreaElement).value)"
    />
    <div v-if="props.maxLength" class="textArea__footer">
      <span :id="`${textareaId}-counter`" class="textArea__counter" aria-live="polite">
        {{ currentLength }} / {{ props.maxLength }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ inheritAttrs: false });

  type ResizeDirection = 'none' | 'vertical' | 'horizontal' | 'both';

  const props = withDefaults(
    defineProps<{
      modelValue?: string;
      maxLength?: number;
      placeholder?: string;
      rows?: number;
      resize?: ResizeDirection;
      error?: boolean;
      disabled?: boolean;
      readonly?: boolean;
    }>(),
    {
      modelValue: '',
      placeholder: '',
      resize: 'none',
      error: false,
      disabled: false,
      readonly: false,
    }
  );

  const emit = defineEmits<{
    'update:modelValue': [value: string];
    focus: [];
    blur: [value: string];
    change: [value: string];
  }>();

  const attrs = useAttrs();
  const _nuxtId = useId();
  const textareaId = computed(() => (attrs.id as string | undefined) || `textarea-${_nuxtId}`);
  const currentLength = computed(() => props.modelValue?.length ?? 0);
</script>

<style lang="scss" scoped>
  $b: 'textArea';

  .#{$b} {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 19.6rem; // 196px
    // padding: $spacing-input-x;
    // border: 1px solid $line-200;
    // border-radius: $radius-md;
    background-color: $bg-primary;
    font-size: $font-size-body1;
    font-weight: $font-weight-regular;
    line-height: $line-height-snug;
    color: $text-900;
    outline: none;
    appearance: none;
    box-sizing: border-box;
    // overscroll-behavior: contain;

    &__field {
      width: 100%;
      min-height: 19.6rem; // 120px
      padding: $spacing-input-x;
      border: 1px solid $line-200;
      border-radius: $radius-md;
      background-color: $bg-primary;
      font-size: $font-size-body1;
      font-weight: $font-weight-regular;
      line-height: $line-height-snug;
      color: $text-900;
      outline: none;
      // box-shadow: 0 0 0 3px rgba($border-input-focus, 0.12);
    }

    &__field:focus {
      border-color: $border-input-focus;
    }

    &__field:focus-visible {
      outline: none;
      // box-shadow: 0 0 0 3px rgba($border-input-focus, 0.12);
    }

    &__footer {
      position: absolute;
      bottom: 1.2rem;
      right: 1.2rem;
      pointer-events: none;
    }

    &__counter {
      font-size: $font-size-caption2;
      font-weight: $font-weight-regular;
      color: $text-400;
      line-height: $line-height-snug;
    }
  }

  // ::placeholder — Vue scoped 호환을 위해 flat 선언 (중첩 시 일부 환경에서 미적용)
  .#{$b}__field::placeholder {
    color: $text-700;
    font-size: 1.6rem;
    font-family:
      Pretendard -apple-system,
      BlinkMacSystemFont,
      'Segoe UI',
      Roboto,
      sans-serif;
  }

  .#{$b}__field:disabled::placeholder {
    color: $text-300;
  }

  // modifier — block 밖에 flat 선언

  .#{$b}--has-counter {
    .#{$b}__field {
      padding-bottom: 3.2rem; // 카운터 높이(~1.6rem) + 하단 여백(1.2rem) + 여유(0.4rem)
    }
  }

  .#{$b}--disabled {
    .#{$b}__field {
      background-color: $bg-disabled;
      color: $text-300;
      cursor: not-allowed;
    }
  }

  .#{$b}--error {
    .#{$b}__field {
      border-color: $color-danger;
    }

    .#{$b}__counter {
      color: $color-danger;
    }
  }
</style>
