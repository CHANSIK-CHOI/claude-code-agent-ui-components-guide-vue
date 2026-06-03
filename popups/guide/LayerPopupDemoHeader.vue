<template>
  <LayerPopup v-model:open="open" @ok="open = false">
    <template #header>
      <div class="layerPopupDemoHeader__header">
        <span class="layerPopupDemoHeader__title">커스텀 헤더</span>
        <button type="button" class="layerPopupDemoHeader__close" aria-label="닫기" @click="open = false">✕</button>
      </div>
    </template>
    <p>헤더를 완전히 교체했습니다.</p>
  </LayerPopup>
</template>

<script setup lang="ts">
  import { LayerPopup } from '@nd/components/popup';

  const open = defineModel<boolean>('open', { required: true });
</script>

<style lang="scss" scoped>
  $b: 'layerPopupDemoHeader';

  .#{$b}__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: $spacing-md;
    border-bottom: 1px solid $line-300;
  }

  .#{$b}__title {
    font-size: $font-size-body2;
    font-weight: $font-weight-bold;
    color: $text-900;
  }

  .#{$b}__close {
    width: 2.4rem;
    height: 2.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: transparent;
    color: $text-700;
    cursor: pointer;
    font-size: 1.6rem;
  }
</style>
