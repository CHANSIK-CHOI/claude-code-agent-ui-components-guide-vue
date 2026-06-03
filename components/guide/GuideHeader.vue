<template>
  <header class="guideHeader" v-bind="$attrs">
    <h1 class="guideHeader__title">Vue 3.4.19 & Nuxt 3.10.3 컴포넌트 가이드</h1>
  </header>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });
</script>

<style lang="scss" scoped>
$b: "guideHeader";

.#{$b} {
  display: flex;
  align-items: center;
  width: 100%;
  height: 6rem;
  padding: 0 $spacing-lg;
  background-color: $bg-primary;
  border-bottom: 1px solid $line-200;

  &__title {
    margin: 0;
    font-size: $font-size-h4;
    font-weight: $font-weight-bold;
    color: $text-900;
  }
}
</style>
