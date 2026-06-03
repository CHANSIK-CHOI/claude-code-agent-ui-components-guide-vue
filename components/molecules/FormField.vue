<template>
  <div class="formField" v-bind="$attrs">
    <!-- 라벨 영역 -->
    <div v-if="props.showLabel" class="formField__labelArea">
      <!-- inputId 있음 → <label for> 태그, 없음 → <span> 태그 -->
      <label v-if="props.inputId" class="formField__label" :for="props.inputId" @mousedown="handleLabelMousedown">
        {{ props.labelText }}<span v-if="props.required" class="formField__required" aria-hidden="true"> *</span>
      </label>
      <span v-else class="formField__label">
        {{ props.labelText }}<span v-if="props.required" class="formField__required" aria-hidden="true"> *</span>
      </span>
      <div v-if="$slots['tooltip']" class="formField__tooltipSlot">
        <slot name="tooltip" />
      </div>
    </div>

    <!-- 입력 슬롯 (Input, Select, DatePicker 등) -->
    <slot />

    <!-- 도움말 영역 래퍼 (errorText → successText → helperText 순서, 동시 표시) -->
    <!-- inputId 없을 때 id="helper-undefined" 방지 — inputId 있을 때만 id 출력 -->
    <div
      v-if="props.errorText || props.successText || props.helperText"
      :id="props.inputId ? `helper-${props.inputId}` : undefined"
      class="formField__helperArea"
    >
      <p v-if="props.errorText" class="formField__helper formField__helper--error" role="alert">
        {{ props.errorText }}
      </p>
      <p v-if="props.successText" class="formField__helper formField__helper--success" role="status">
        <IcCheckCircle aria-hidden="true" />{{ props.successText }}
      </p>
      <p
        v-if="props.helperText"
        class="formField__helper"
        :class="{ 'formField__helper--helperIcon': props.showHelperIcon }"
      >
        <IcCircularNote v-if="props.showHelperIcon" aria-hidden="true" />{{ props.helperText }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ inheritAttrs: false });

  import IcCheckCircle from '@nd/assets/icons/IcCheckCircle.svg?skipsvgo';
  import IcCircularNote from '@nd/assets/icons/IcCircularNote.svg?skipsvgo';

  function handleLabelMousedown() {
    if (!props.inputId) return;
    const control = document.getElementById(props.inputId);
    if (!control) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(control.tagName)) return;
    control.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        button: 0,
        ctrlKey: false,
        pointerType: 'mouse',
        isPrimary: true,
      })
    );
  }

  const props = withDefaults(
    defineProps<{
      inputId?: string;
      labelText?: string;
      showLabel?: boolean;
      required?: boolean;
      helperText?: string;
      errorText?: string;
      successText?: string;
      showHelperIcon?: boolean;
    }>(),
    {
      labelText: '',
      showLabel: true,
      required: false,
      helperText: '',
      errorText: '',
      successText: '',
      showHelperIcon: false,
    }
  );
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

    &__helperArea {
      margin-top: $spacing-xs;
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
    }

    &__helper {
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

  .#{$b}__helper--success {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: $color-primary-hover;
  }

  .#{$b}__helper--helperIcon {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
</style>
