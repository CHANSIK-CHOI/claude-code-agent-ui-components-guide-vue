<template>
  <div class="input">
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
  </div>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    modelValue?: string
    error?: boolean
    disabled?: boolean
    readonly?: boolean
    placeholder?: string
    type?: string
  }>(),
  {
    modelValue: '',
    error: false,
    disabled: false,
    readonly: false,
    placeholder: '',
    type: 'text',
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  focus: []
  blur: [value: string]
  change: [value: string]
}>()
</script>

<style lang="scss" scoped>
$b: 'input';

.#{$b} {
  display: flex;
  flex-direction: column;
  width: 100%;

  &__field {
    height: 4.6rem; // 46px — Figma 명세 고정 높이
    padding: 0 $spacing-input-x;
    border: 1px solid $line-200;
    border-radius: $radius-md;
    background-color: $bg-primary;
    font-size: $font-size-body1;
    font-weight: $font-weight-regular;
    line-height: $line-height-snug;
    color: $text-900;
    outline: none;
    appearance: none;
    width: 100%;

    &:focus {
      border-color: $border-input-focus;
    }

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px rgba($border-input-focus, 0.12);
    }

    &:disabled {
      background-color: $bg-disabled;
      color: $text-300;
      cursor: not-allowed;
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
</style>
