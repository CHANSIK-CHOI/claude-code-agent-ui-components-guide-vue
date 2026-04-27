<template>
  <button
    v-bind="$attrs"
    :type="props.type"
    class="ButtonRoot"
    :class="rootClass"
    :disabled="props.disabled"
    @click="handleClick"
  >
    <span
      v-if="$slots['leading-icon']"
      class="ButtonRoot__icon ButtonRoot__icon--leading"
    >
      <slot name="leading-icon" />
    </span>
    <span class="ButtonRoot__label"><slot /></span>
    <span
      v-if="$slots['trailing-icon']"
      class="ButtonRoot__icon ButtonRoot__icon--trailing"
    >
      <slot name="trailing-icon" />
    </span>
  </button>
</template>

<script setup lang="ts">
import type { ButtonShape, ButtonColor, ButtonSize } from '~/types/components'

type ButtonType = 'button' | 'submit'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    shape?: ButtonShape
    color?: ButtonColor
    size?: ButtonSize
    round?: boolean
    disabled?: boolean
    type?: ButtonType
  }>(),
  {
    shape: 'solid',
    color: 'primary',
    size: 'md',
    round: false,
    disabled: false,
    type: 'button',
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const rootClass = useButtonVariant('ButtonRoot', props)

function handleClick(e: MouseEvent): void {
  if (props.disabled) {
    e.preventDefault()
    return
  }
  emit('click', e)
}
</script>

<style lang="scss" scoped>
@use '~/assets/scss/components/button-base' as *;
@include button-base('ButtonRoot');
</style>
