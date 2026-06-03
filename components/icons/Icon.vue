<template>
  <span
    v-bind="$attrs"
    class="icon"
    :class="sizeClass"
    :style="sizeStyle"
    :aria-hidden="label ? undefined : 'true'"
    :aria-label="label"
    :role="label ? 'img' : undefined"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
  import type { IconSize } from '@nd/components/types'

  defineOptions({ inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      size?: IconSize
      color?: string
      label?: string
    }>(),
    {
      size: 'md',
      color: undefined,
      label: undefined,
    }
  )

  // 프리셋 문자열 → CSS class, number → undefined (inline style로 처리)
  const sizeClass = computed(() => (typeof props.size === 'string' ? `icon--${props.size}` : undefined))

  // number size는 inline style로, color는 항상 병합. 둘 다 없으면 undefined
  const sizeStyle = computed(() => {
    const s = typeof props.size === 'number' ? { width: `${props.size}px`, height: `${props.size}px` } : null
    const c = props.color ? { color: props.color } : null
    return s || c ? { ...s, ...c } : undefined
  })
</script>

<style lang="scss" scoped>
  // inline-flex 예외: Icon.vue의 <span>은 인라인 맥락에서 삽입되는 아이콘 래퍼이므로 허용
  $b: 'icon';

  .#{$b} {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    // slot으로 들어온 SVG는 scoped 미적용 → :deep() 필요
    :deep(svg) {
      display: block;
      width: 100%;
      height: 100%;
    }

    &--xs {
      width: 0.8rem;
      height: 0.8rem;
    }

    &--sm {
      width: 1.6rem;
      height: 1.6rem;
    }

    &--md {
      width: 2.4rem;
      height: 2.4rem;
    }

    &--lg {
      width: 4rem;
      height: 4rem;
    }
  }
</style>
