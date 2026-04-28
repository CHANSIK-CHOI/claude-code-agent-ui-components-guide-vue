<template>
  <Popup
    type="layer"
    :open="isOpen"
    :title="title"
    :description="message"
    :ok-label="okLabel"
    :show-close="true"
    :show-cancel="false"
    :close-on-overlay="true"
    :close-on-escape="true"
    @update:open="handleUpdateOpen"
    @ok="handleOk"
    @closed="handleClosed"
  >
    <p class="alert__message">{{ message }}</p>
  </Popup>
</template>

<script setup lang="ts">
import Popup from './Popup.vue'

const props = defineProps<{
  title?: string
  message: string
  okLabel?: string
  onClose: () => void
}>()

const isOpen = ref(true)

function handleUpdateOpen(val: boolean) {
  if (!val) isOpen.value = false
}

function handleOk() {
  // 닫기 애니메이션 시작 — unmount는 @closed(애니메이션 종료) 이후
  isOpen.value = false
}

function handleClosed() {
  // 닫기 애니메이션이 완전히 끝난 뒤 unmount
  props.onClose()
}
</script>

<style lang="scss" scoped>
$b: 'alert';

.#{$b}__message {
  color: $text-700;
  font-size: $font-size-body3;
  line-height: $line-height-base;
  white-space: pre-line;
}
</style>
