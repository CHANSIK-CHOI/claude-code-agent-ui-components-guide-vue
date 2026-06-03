<template>
  <LayerPopup v-model:open="open" title="필수 응답" :close-on-overlay="false" @ok="open = false">
    <p>dim을 클릭해도 닫히지 않습니다. 버튼으로만 닫을 수 있습니다.</p>
  </LayerPopup>
</template>

<script setup lang="ts">
  import { LayerPopup } from '@nd/components/popup';

  const open = defineModel<boolean>('open', { required: true });
</script>
