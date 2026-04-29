<template>
  <Popup
    v-bind="$attrs"
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
defineOptions({ inheritAttrs: false })

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
const isOkClicked = ref(false)

function handleOk() {
  isOkClicked.value = true
  isOpen.value = false
}

// cancel 버튼 / ESC / dim 클릭 → update:open(false)로 모두 집약
function handleUpdateOpen(val: boolean) {
  if (!val) isOpen.value = false
}

function handleClosed() {
  if (isOkClicked.value) {
    props.onOk()
  } else {
    props.onCancel()
  }
  isOkClicked.value = false
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
