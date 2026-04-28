<template>
  <Popup
    type="layer"
    :open="isOpen"
    :title="title"
    :description="message"
    :ok-label="okLabel"
    :cancel-label="cancelLabel"
    :ok-disabled="okDisabled"
    :show-close="false"
    :show-cancel="true"
    :close-on-overlay="true"
    :close-on-escape="true"
    @update:open="handleUpdateOpen"
    @ok="handleOk"
    @closed="handleClosed"
  >
    <p class="confirm__message">{{ message }}</p>
  </Popup>
</template>

<script setup lang="ts">
import Popup from './Popup.vue'

const props = defineProps<{
  title?: string
  message: string
  okLabel?: string
  cancelLabel?: string
  okDisabled?: boolean
  onOk: () => void
  onCancel: () => void
}>()

const isOpen = ref(true)
// ok 클릭 전까지는 cancel(기본값). ok 클릭 시에만 onOk 호출.
const closeReason = ref<'ok' | 'cancel'>('cancel')

function handleOk() {
  closeReason.value = 'ok'
  isOpen.value = false
}

// cancel 버튼 / ESC / dim 클릭 → update:open(false)로 모두 집약
function handleUpdateOpen(val: boolean) {
  if (!val) isOpen.value = false
}

function handleClosed() {
  if (closeReason.value === 'ok') {
    props.onOk()
  } else {
    props.onCancel()
  }
}
</script>

<style lang="scss" scoped>
$b: 'confirm';

.#{$b}__message {
  color: $text-700;
  font-size: $font-size-body3;
  line-height: $line-height-base;
  white-space: pre-line;
}
</style>
