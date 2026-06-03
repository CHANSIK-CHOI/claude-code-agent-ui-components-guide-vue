<template>
  <LayerPopup v-model:open="open" title="안내" :show-cancel="false" @ok="open = false">
    <p>취소 버튼 없이 ok 버튼만 표시됩니다.</p>
  </LayerPopup>
</template>

<script setup lang="ts">
  import { LayerPopup } from '@nd/components/popup';

  const open = defineModel<boolean>('open', { required: true });
</script>
