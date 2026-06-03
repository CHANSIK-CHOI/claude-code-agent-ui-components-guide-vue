<template>
  <div
    class="buttonGroup"
    :class="{ 'buttonGroup--narrowFirst': narrowFirst }"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
  defineOptions({ inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      narrowFirst?: boolean
    }>(),
    {
      narrowFirst: false,
    },
  )
</script>

<style lang="scss" scoped>
  $b: 'buttonGroup';

  .#{$b} {
    display: flex;
    width: 100%;
    gap: $spacing-sm;

    :deep(> *) {
      flex: 1;
    }
  }

  .#{$b}--narrowFirst {
    :deep(> :first-child) {
      flex: 120;
      max-width: 12rem;
    }

    :deep(> :nth-child(2)) {
      flex: 200;
    }

    // 2번째 슬롯이 Button(button)/ButtonLink(a)가 아닌 래퍼 컴포넌트(예: Tooltip)일 때
    // 내부 trigger wrapper가 할당된 flex 공간을 채우도록 처리
    :deep(> :nth-child(2):not(button, a) > *) {
      flex: 1;
      min-width: 0;
    }

    :deep(> :nth-child(n + 3)) {
      flex: 1;
    }
  }
</style>
