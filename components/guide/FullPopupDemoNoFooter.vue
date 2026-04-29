<template>
  <FullPopup
    v-model:open="popup.isOpen.value"
    title="포토 리뷰"
    :show-footer="false"
  >
    <p class="fullPopupDemoNoFooter__body">
      footer가 없는 전체화면 팝업입니다.<br />
      헤더 X 버튼으로 닫습니다.
    </p>
  </FullPopup>
</template>

<script setup lang="ts">
import { FullPopup, useFullPopup } from "@nd/components/popup";

const popup = useFullPopup();

defineExpose({ open: popup.open, close: popup.close });
</script>

<style lang="scss" scoped>
$b: "fullPopupDemoNoFooter";

.#{$b}__body {
  font-size: $font-size-body3;
  color: $text-700;
  line-height: $line-height-base;
}
</style>
