<template>
  <BottomSheet
    v-model:open="popup.isOpen.value"
    title="정렬 선택"
    @ok="popup.close()"
  >
    <ul class="bottomSheetDemoBasic__optionList">
      <li
        v-for="opt in sortOptions"
        :key="opt.value"
        class="bottomSheetDemoBasic__optionItem"
      >
        <button
          type="button"
          @click="
            selectedSort = opt.value;
            popup.close();
          "
        >
          {{ opt.label }}
          <span
            v-if="selectedSort === opt.value"
            class="bottomSheetDemoBasic__check"
            >✓</span
          >
        </button>
      </li>
    </ul>
    <div v-if="selectedSort" class="bottomSheetDemoBasic__result">
      선택된 정렬:
      <strong>{{
        sortOptions.find((o) => o.value === selectedSort)?.label
      }}</strong>
    </div>
  </BottomSheet>
</template>

<script setup lang="ts">
import { BottomSheet, useBottomSheet } from "@nd/components/popup";

const popup = useBottomSheet();

const selectedSort = ref("");

const sortOptions = [
  { value: "popular", label: "인기순" },
  { value: "newest", label: "최신순" },
  { value: "price_asc", label: "낮은 가격순" },
  { value: "price_desc", label: "높은 가격순" },
];

defineExpose({ open: popup.open, close: popup.close });
</script>

<style lang="scss" scoped>
$b: "bottomSheetDemoBasic";

.#{$b}__optionList {
  list-style: none;
  padding: 0;
  margin: 0;
}

.#{$b}__optionItem {
  border-bottom: 1px solid $line-300;

  &:last-child {
    border-bottom: none;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: $spacing-md 0;
    border: none;
    background: transparent;
    font-size: $font-size-body3;
    color: $text-700;
    cursor: pointer;
    text-align: left;

    &:hover {
      color: $text-900;
    }
  }
}

.#{$b}__check {
  color: $color-primary;
  font-weight: $font-weight-bold;
}

.#{$b}__result {
  margin-top: $spacing-sm;
  padding: $spacing-sm $spacing-md;
  background-color: $bg-secondary;
  border-radius: $radius-md;
  font-size: $font-size-body3;
  color: $text-700;
}
</style>
