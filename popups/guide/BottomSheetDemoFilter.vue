<template>
  <BottomSheet
    v-model:open="open"
    title="필터"
  >
    <div class="bottomSheetDemoFilter__filterGroup">
      <p class="bottomSheetDemoFilter__filterLabel">카테고리</p>
      <label
        v-for="opt in filterOptions"
        :key="opt.value"
        class="bottomSheetDemoFilter__radio"
      >
        <input type="radio" v-model="filterValue" :value="opt.value" />
        {{ opt.label }}
      </label>
    </div>
    <div v-if="appliedFilter" class="bottomSheetDemoFilter__result">
      적용된 필터:
      <strong>{{
        filterOptions.find((o) => o.value === appliedFilter)?.label
      }}</strong>
    </div>
    <template #footer>
      <div class="bottomSheetDemoFilter__footer">
        <span class="bottomSheetDemoFilter__footerBtn">
          <Button size="lg" shape="solid" color="gray" @click="reset">초기화</Button>
        </span>
        <span class="bottomSheetDemoFilter__footerBtn">
          <Button size="lg" shape="solid" color="primary" @click="apply">적용</Button>
        </span>
      </div>
    </template>
  </BottomSheet>
</template>

<script setup lang="ts">
import { BottomSheet } from "@nd/components/popup";
import { Button } from "@nd/components/atoms";

const open = defineModel<boolean>("open", { required: true });

const filterValue = ref("");
const appliedFilter = ref("");

const filterOptions = [
  { value: "all", label: "전체" },
  { value: "skincare", label: "스킨케어" },
  { value: "makeup", label: "메이크업" },
  { value: "haircare", label: "헤어케어" },
];

function reset() {
  filterValue.value = "";
}

function apply() {
  appliedFilter.value = filterValue.value;
  open.value = false;
}
</script>

<style lang="scss" scoped>
$b: "bottomSheetDemoFilter";

.#{$b}__filterGroup {
  padding-bottom: $spacing-sm;
}

.#{$b}__filterLabel {
  font-size: $font-size-body3;
  font-weight: $font-weight-bold;
  color: $text-900;
  margin-bottom: $spacing-sm;
}

.#{$b}__radio {
  display: flex;
  align-items: center;
  gap: $spacing-sm;
  padding: $spacing-xs 0;
  font-size: $font-size-body3;
  color: $text-700;
  cursor: pointer;
}

.#{$b}__footer {
  display: flex;
  gap: $spacing-sm;
  width: 100%;
}

.#{$b}__footerBtn {
  flex: 1;
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
