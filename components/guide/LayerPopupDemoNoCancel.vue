<template>
  <LayerPopup
    v-model:open="popup.isOpen.value"
    title="안내"
    :show-cancel="false"
    @ok="popup.close()"
  >
    <p>취소 버튼 없이 ok 버튼만 표시됩니다.</p>
  </LayerPopup>
</template>

<script setup lang="ts">
import { LayerPopup, useLayerPopup } from '@nd/components/popup'

const popup = useLayerPopup()

defineExpose({ open: popup.open, close: popup.close })
</script>
