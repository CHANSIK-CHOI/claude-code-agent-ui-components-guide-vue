<template>
  <FullPopup v-model:open="open" title="이용약관 전문" :show-close="false" ok-label="확인" @ok="open = false">
    <p class="fullPopupDemoNoClose__body">
      헤더 닫기(✕) 버튼이 없습니다.<br />
      footer ok 버튼 또는 ESC 키로 닫을 수 있습니다.<br />
      약관 전문 보기 등 반드시 확인을 유도해야 할 때 사용합니다.
    </p>
  </FullPopup>
</template>

<script setup lang="ts">
  import { FullPopup } from '@nd/components/popup';

  const open = defineModel<boolean>('open', { required: true });
</script>

<style lang="scss" scoped>
  $b: 'fullPopupDemoNoClose';

  .#{$b}__body {
    font-size: $font-size-body3;
    color: $text-700;
    line-height: $line-height-base;
  }
</style>
