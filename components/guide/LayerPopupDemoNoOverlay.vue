<template>
  <LayerPopup
    v-model:open="popup.isOpen.value"
    title="필수 응답"
    :close-on-overlay="false"
    @ok="popup.close()"
  >
    <p>dim을 클릭해도 닫히지 않습니다. 버튼으로만 닫을 수 있습니다.</p>
  </LayerPopup>
</template>

<script setup lang="ts">
import { LayerPopup, useLayerPopup } from '@nd/components/popup'

const popup = useLayerPopup()

defineExpose({ open: popup.open, close: popup.close })
</script>
