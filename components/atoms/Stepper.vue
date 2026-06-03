<template>
  <div class="stepper" :class="{ 'stepper--disabled': props.disabled }">
    <!-- 제거 버튼 -->
    <button
      v-bind="props.decrementAttrs"
      type="button"
      class="stepper__btn stepper__btn--decrement"
      :disabled="props.disabled || isAtMin"
      aria-label="수량 감소"
      @click="handleDecrement"
    >
      <span class="stepper__icon" aria-hidden="true">
        <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </span>
    </button>

    <!-- 숫자 표시 영역 -->
    <input
      v-bind="$attrs"
      class="stepper__value"
      type="text"
      inputmode="numeric"
      :value="displayValue"
      :readonly="props.readonly"
      :disabled="props.disabled"
      :aria-valuemin="props.min"
      :aria-valuemax="props.max"
      :aria-valuenow="props.modelValue"
      @input="handleInput"
      @blur="handleBlur"
      @keydown="handleKeydown"
    />

    <!-- 추가 버튼 -->
    <button
      v-bind="props.incrementAttrs"
      type="button"
      class="stepper__btn stepper__btn--increment"
      :disabled="props.disabled || isAtMax"
      aria-label="수량 증가"
      @click="handleIncrement"
    >
      <span class="stepper__icon" aria-hidden="true">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 1V11M1 6H11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ inheritAttrs: false });

  const props = withDefaults(
    defineProps<{
      modelValue?: number;
      min?: number;
      max?: number | undefined;
      step?: number;
      readonly?: boolean;
      disabled?: boolean;
      decrementAttrs?: Record<string, unknown>;
      incrementAttrs?: Record<string, unknown>;
    }>(),
    {
      modelValue: 1,
      min: 1,
      max: undefined,
      step: 1,
      readonly: true,
      disabled: false,
      decrementAttrs: () => ({}),
      incrementAttrs: () => ({}),
    }
  );

  const emit = defineEmits<{
    'update:modelValue': [value: number];
    change: [value: number];
  }>();

  // 직접 입력 중 표시용 임시 값 (readonly=false 시에만 사용)
  const inputBuffer = ref<string | null>(null);

  const displayValue = computed(() => {
    if (inputBuffer.value !== null) return inputBuffer.value;
    return String(props.modelValue);
  });

  const isAtMin = computed(() => props.modelValue <= props.min);

  const isAtMax = computed(() => {
    if (props.max === undefined) return false;
    return props.modelValue >= props.max;
  });

  function clamp(value: number): number {
    const clamped = Math.max(props.min, value);
    if (props.max !== undefined) return Math.min(props.max, clamped);
    return clamped;
  }

  function emitValue(value: number): void {
    emit('update:modelValue', value);
    emit('change', value);
  }

  function handleDecrement(): void {
    if (props.disabled || isAtMin.value) return;
    const next = clamp(props.modelValue - props.step);
    emitValue(next);
  }

  function handleIncrement(): void {
    if (props.disabled || isAtMax.value) return;
    const next = clamp(props.modelValue + props.step);
    emitValue(next);
  }

  // readonly=false 시 직접 입력 처리
  function handleInput(e: Event): void {
    if (props.readonly) return;
    const raw = (e.target as HTMLInputElement).value;
    // 숫자와 마이너스 부호만 허용
    const numeric = raw.replace(/[^0-9]/g, '');
    inputBuffer.value = numeric;
    (e.target as HTMLInputElement).value = numeric;
  }

  function handleBlur(e: Event): void {
    if (props.readonly) return;
    const raw = (e.target as HTMLInputElement).value;
    inputBuffer.value = null;

    if (raw === '' || raw === undefined) {
      emitValue(props.min);
      return;
    }

    const parsed = parseInt(raw, 10);
    if (isNaN(parsed)) {
      emitValue(props.min);
      return;
    }

    const next = clamp(parsed);
    emitValue(next);
  }

  function handleKeydown(e: KeyboardEvent): void {
    if (props.readonly || props.disabled) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      handleIncrement();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      handleDecrement();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      (e.target as HTMLInputElement).blur();
    }
  }
</script>

<style lang="scss" scoped>
  $b: 'stepper';

  .#{$b} {
    display: flex;
    width: 100%;
    height: 3rem;
    align-items: center;

    &__btn {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      padding: 0;
      border: 1px solid $line-100;
      border-radius: $radius-md;
      background-color: $bg-primary;
      color: $text-800;
      cursor: pointer;
      transition: background-color $duration-fast ease;
      outline: none;

      &:hover:not(:disabled) {
        background-color: $bg-secondary;
      }

      &:active:not(:disabled) {
        background-color: $bg-tertiary;
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 3px rgba($color-primary, 0.3);
      }

      &:disabled {
        color: $text-300;
        cursor: not-allowed;
      }
    }

    &__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.2rem;
      height: 1.2rem;
    }

    &__value {
      flex: 1;
      min-width: 4.2rem;
      max-width: 4.2rem;
      height: 3rem;
      padding: 0;
      border: none;
      background-color: transparent;
      font-size: $font-size-body3;
      font-weight: $font-weight-medium;
      line-height: $line-height-snug;
      color: $text-800;
      text-align: center;
      outline: none;
      appearance: none;

      &[readonly] {
        cursor: default;
      }

      &:focus-visible {
        outline: none;
        // box-shadow: inset 0 0 0 2px $color-primary;
      }

      &:disabled {
        // color: $text-300;
        cursor: not-allowed;
      }
    }
  }

  // disabled 전체 상태
  .#{$b}--disabled {
    .#{$b}__btn {
      color: $text-300;
      cursor: not-allowed;
    }

    .#{$b}__value {
      // color: $text-300;
      cursor: not-allowed;
    }
  }
</style>
