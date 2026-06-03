<template>
  <LayerPopup
    v-model:open="open"
    title="배송지 변경"
    :show-close="false"
    ok-label="변경하기"
    cancel-label="취소"
    @ok="open = false"
  >
    <p class="layerPopupDemoNoClose__body">
      닫기(✕) 버튼이 없습니다.<br />
      ok / cancel 버튼 또는 ESC·dim 클릭으로 닫을 수 있습니다.
    </p>
  </LayerPopup>
</template>

<script setup lang="ts">
import { LayerPopup } from '@nd/components/popup'

const open = defineModel<boolean>('open', { required: true })
</script>

<style lang="scss" scoped>
$b: 'layerPopupDemoNoClose';

.#{$b}__body {
  font-size: $font-size-body3;
  color: $text-700;
  line-height: $line-height-base;
}
</style>
