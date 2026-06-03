<template>
  <FullPopup v-model:open="open" title="상세 정보" @ok="open = false">
    <p class="fullPopupDemoBasic__body">
      전체화면 팝업의 바디 영역입니다.<br />
      레이아웃 오른쪽 끝에서 슬라이드 인 하는 애니메이션과, 팝업 뒤에 깔리는 dim을 확인하세요.
    </p>
  </FullPopup>
</template>

<script setup lang="ts">
  import { FullPopup } from '@nd/components/popup';

  const open = defineModel<boolean>('open', { required: true });
</script>

<style lang="scss" scoped>
  $b: 'fullPopupDemoBasic';

  .#{$b}__body {
    font-size: $font-size-body3;
    color: $text-700;
    line-height: $line-height-base;
  }
</style>
