<template>
  <BottomSheet v-model:open="open" title="긴 목록" @ok="open = false">
    <ul class="bottomSheetDemoLongContent__list">
      <li v-for="i in 30" :key="i" class="bottomSheetDemoLongContent__item">항목 {{ i }}</li>
    </ul>
  </BottomSheet>
</template>

<script setup lang="ts">
  import { BottomSheet } from '@nd/components/popup';

  const open = defineModel<boolean>('open', { required: true });
</script>

<style lang="scss" scoped>
  $b: 'bottomSheetDemoLongContent';

  .#{$b}__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .#{$b}__item {
    padding: $spacing-sm 0;
    border-bottom: 1px solid $line-300;
    font-size: $font-size-body3;
    color: $text-700;
  }
</style>
