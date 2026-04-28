<template>
  <div class="formField">
    <!-- 라벨 영역 -->
    <div v-if="props.showLabel" class="formField__labelArea">
      <label class="formField__label" :for="props.inputId" @mousedown="handleLabelMousedown">
        {{ props.labelText
        }}<span v-if="props.required" class="formField__required" aria-hidden="true"> *</span>
      </label>
      <div v-if="$slots['tooltip']" class="formField__tooltipSlot">
        <slot name="tooltip" />
      </div>
    </div>

    <!-- 입력 슬롯 (Input, Select, DatePicker 등) -->
    <slot />

    <!-- 도움말 텍스트 -->
    <p
      v-if="props.errorText || props.helperText"
      :id="`helper-${props.inputId}`"
      class="formField__helper"
      :class="{ 'formField__helper--error': !!props.errorText }"
      :role="props.errorText ? 'alert' : undefined"
    >
      {{ props.errorText || props.helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
function handleLabelMousedown() {
  const control = document.getElementById(props.inputId)
  if (!control) return
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(control.tagName)) return
  control.dispatchEvent(
    new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
      ctrlKey: false,
      pointerType: 'mouse',
      isPrimary: true,
    })
  )
}

const props = withDefaults(
  defineProps<{
    inputId: string
    labelText?: string
    showLabel?: boolean
    required?: boolean
    helperText?: string
    errorText?: string
  }>(),
  {
    labelText: '',
    showLabel: true,
    required: false,
    helperText: '',
    errorText: '',
  }
)
</script>

<style lang="scss" scoped>
$b: 'formField';

.#{$b} {
  display: flex;
  flex-direction: column;
  width: 100%;

  &__labelArea {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    margin-bottom: 0.6rem; // 6px — Figma 명세 수치
  }

  &__label {
    font-size: $font-size-sm;
    font-weight: $font-weight-regular;
    line-height: $line-height-snug;
    color: $text-500;
  }

  &__required {
    color: $color-danger;
  }

  &__tooltipSlot {
    display: flex;
    align-items: center;
  }

  &__helper {
    margin-top: $spacing-xs;
    font-size: $font-size-xs;
    font-weight: $font-weight-bold;
    line-height: $line-height-snug;
    color: $text-500;
  }
}

// ── Modifier (flat — 모디파이어는 .#{$b} 밖에 선언)
.#{$b}__helper--error {
  color: $color-danger;
}
</style>
