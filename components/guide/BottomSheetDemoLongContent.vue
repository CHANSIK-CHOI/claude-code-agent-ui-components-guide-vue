<template>
  <BottomSheet
    v-model:open="popup.isOpen.value"
    title="긴 목록"
    @ok="popup.close()"
  >
    <ul class="bottomSheetDemoLongContent__list">
      <li
        v-for="i in 30"
        :key="i"
        class="bottomSheetDemoLongContent__item"
      >
        항목 {{ i }}
      </li>
    </ul>
  </BottomSheet>
</template>

<script setup lang="ts">
import { BottomSheet, useBottomSheet } from "@nd/components/popup";

const popup = useBottomSheet();

defineExpose({ open: popup.open, close: popup.close });
</script>

<style lang="scss" scoped>
$b: "bottomSheetDemoLongContent";

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
