<template>
  <FullPopup v-model:open="popup.isOpen.value" title="상세 필터">
    <div class="fullPopupDemoFilter__form">
      <div class="fullPopupDemoFilter__section">
        <p class="fullPopupDemoFilter__label">카테고리</p>
        <label
          v-for="opt in categoryOptions"
          :key="opt.value"
          class="fullPopupDemoFilter__radio"
        >
          <input type="radio" v-model="tempCategory" :value="opt.value" />
          {{ opt.label }}
        </label>
      </div>
      <div class="fullPopupDemoFilter__section">
        <p class="fullPopupDemoFilter__label">가격대</p>
        <label
          v-for="opt in priceOptions"
          :key="opt.value"
          class="fullPopupDemoFilter__radio"
        >
          <input type="radio" v-model="tempPrice" :value="opt.value" />
          {{ opt.label }}
        </label>
      </div>
    </div>
    <template #footer>
      <Button size="lg" shape="solid" color="gray" @click="reset">초기화</Button>
      <Button size="lg" shape="solid" color="primary" @click="apply">적용</Button>
    </template>
  </FullPopup>
</template>

<script setup lang="ts">
import { FullPopup, useFullPopup } from "@nd/components/popup";
import { Button } from "@nd/components/atoms";

const emit = defineEmits<{
  apply: [result: string];
}>();

const popup = useFullPopup();

const tempCategory = ref("");
const tempPrice = ref("");

const categoryOptions = [
  { value: "all", label: "전체" },
  { value: "skincare", label: "스킨케어" },
  { value: "makeup", label: "메이크업" },
];

const priceOptions = [
  { value: "all", label: "전체" },
  { value: "under10k", label: "1만원 미만" },
  { value: "under50k", label: "5만원 미만" },
  { value: "over50k", label: "5만원 이상" },
];

function reset() {
  tempCategory.value = "";
  tempPrice.value = "";
}

function apply() {
  const parts: string[] = [];
  if (tempCategory.value)
    parts.push(categoryOptions.find((o) => o.value === tempCategory.value)?.label ?? "");
  if (tempPrice.value)
    parts.push(priceOptions.find((o) => o.value === tempPrice.value)?.label ?? "");
  emit("apply", parts.join(", ") || "없음");
  popup.close();
}

defineExpose({ open: popup.open, close: popup.close });
</script>

<style lang="scss" scoped>
$b: "fullPopupDemoFilter";

.#{$b}__form {
  padding: $spacing-sm 0;
}

.#{$b}__section {
  margin-bottom: $spacing-lg;
}

.#{$b}__label {
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
</style>
