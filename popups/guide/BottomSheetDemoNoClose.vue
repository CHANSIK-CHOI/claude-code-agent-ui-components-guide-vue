<template>
  <BottomSheet
    v-model:open="open"
    title="알림 설정"
    :show-close="false"
    ok-label="저장"
    @ok="open = false"
  >
    <p class="bottomSheetDemoNoClose__body">
      닫기(✕) 버튼이 없습니다.<br />
      ok / cancel 버튼 또는 ESC·dim 클릭으로 닫을 수 있습니다.
    </p>
  </BottomSheet>
</template>

<script setup lang="ts">
import { BottomSheet } from '@nd/components/popup'

const open = defineModel<boolean>('open', { required: true })
</script>

<style lang="scss" scoped>
$b: 'bottomSheetDemoNoClose';

.#{$b}__body {
  font-size: $font-size-body3;
  color: $text-700;
  line-height: $line-height-base;
}
</style>
