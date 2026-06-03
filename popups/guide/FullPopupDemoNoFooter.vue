<template>
  <FullPopup v-model:open="open" title="포토 리뷰" :show-footer="false">
    <p class="fullPopupDemoNoFooter__body">
      footer가 없는 전체화면 팝업입니다.<br />
      헤더 X 버튼으로 닫습니다.
    </p>
  </FullPopup>
</template>

<script setup lang="ts">
  import { FullPopup } from '@nd/components/popup';

  const open = defineModel<boolean>('open', { required: true });
</script>

<style lang="scss" scoped>
  $b: 'fullPopupDemoNoFooter';

  .#{$b}__body {
    font-size: $font-size-body3;
    color: $text-700;
    line-height: $line-height-base;
  }
</style>
