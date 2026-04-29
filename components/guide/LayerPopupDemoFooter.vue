<template>
  <LayerPopup v-model:open="popup.isOpen.value" title="저장 확인">
    <p>커스텀 푸터를 사용합니다.</p>
    <template #footer>
      <button type="button" class="layerPopupDemoFooter__cancelBtn" @click="popup.close()">취소</button>
      <button type="button" class="layerPopupDemoFooter__okBtn" @click="handleSave">저장</button>
    </template>
  </LayerPopup>
</template>

<script setup lang="ts">
import { LayerPopup, useLayerPopup } from '@nd/components/popup'

const popup = useLayerPopup()

function handleSave() {
  popup.close()
}

defineExpose({ open: popup.open, close: popup.close })
</script>

<style lang="scss" scoped>
$b: 'layerPopupDemoFooter';

.#{$b}__cancelBtn {
  flex: 1;
  height: 4.4rem;
  border: none;
  border-radius: $radius-md;
  background-color: $bg-secondary;
  color: $text-700;
  font-size: $font-size-body3;
  font-weight: $font-weight-bold;
  cursor: pointer;
}

.#{$b}__okBtn {
  flex: 1;
  height: 4.4rem;
  border: none;
  border-radius: $radius-md;
  background-color: $color-primary;
  color: $text-white;
  font-size: $font-size-body3;
  font-weight: $font-weight-bold;
  cursor: pointer;
}
</style>
