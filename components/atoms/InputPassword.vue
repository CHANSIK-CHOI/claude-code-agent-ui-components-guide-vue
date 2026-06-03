<template>
  <div class="inputPassword">
    <Input
      v-bind="$attrs"
      :model-value="modelValue"
      :type="inputType"
      :error="!!error"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="placeholder"
      @update:model-value="emit('update:modelValue', $event)"
      @focus="emit('focus')"
      @blur="emit('blur', $event)"
      @change="emit('change', $event)"
      @clear="emit('clear')"
    >
      <template #suffix>
        <button
          type="button"
          class="inputPassword__toggleBtn"
          :class="{ 'inputPassword__toggleBtn--disabled': disabled }"
          :disabled="disabled"
          :aria-label="isVisible ? '비밀번호 숨기기' : '비밀번호 보기'"
          @click="handleToggle"
        >
          <HideIcon v-if="isVisible" class="inputPassword__toggleIcon" />
          <ShowIcon v-else class="inputPassword__toggleIcon" />
        </button>
      </template>
    </Input>
    <p v-if="error" class="inputPassword__error" aria-live="polite">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
  import Input from './Input.vue';
  import ShowIcon from '@nd/assets/images/common/inputPasswordShow.svg?skipsvgo';
  import HideIcon from '@nd/assets/images/common/inputPasswordHide.svg?skipsvgo';

  defineOptions({ inheritAttrs: false });

  const props = withDefaults(
    defineProps<{
      modelValue?: string;
      error?: string;
      disabled?: boolean;
      readonly?: boolean;
      placeholder?: string;
    }>(),
    {
      modelValue: '',
      error: undefined,
      disabled: false,
      readonly: false,
      placeholder: '',
    }
  );

  const emit = defineEmits<{
    'update:modelValue': [value: string];
    focus: [];
    blur: [value: string];
    change: [value: string];
    clear: [];
    toggle: [isVisible: boolean];
  }>();

  const isVisible = ref(false);

  const inputType = computed(() => (isVisible.value ? 'text' : 'password'));

  function handleToggle(): void {
    if (props.disabled) return;
    isVisible.value = !isVisible.value;
    emit('toggle', isVisible.value);
  }
</script>

<style lang="scss" scoped>
  $b: 'inputPassword';

  .#{$b} {
    display: flex;
    flex-direction: column;
    width: 100%;

    &__toggleBtn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.6rem;
      height: 1.6rem;
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;

      &--disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    &__toggleIcon {
      width: 1.6rem;
      height: 1.6rem;
    }

    &__error {
      margin-top: 0.4rem;
      font-size: $font-size-caption1;
      color: $color-danger;
      line-height: $line-height-base;
    }
  }
</style>
