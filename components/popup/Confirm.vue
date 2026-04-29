<template>
  <Popup
    v-bind="$attrs"
    type="confirm"
    :open="isOpen"
    :title="title ?? '확인'"
    :ok-label="okLabel"
    :cancel-label="cancelLabel"
    :show-close="false"
    :show-cancel="true"
    :close-on-overlay="true"
    :close-on-escape="true"
    @update:open="handleUpdateOpen"
    @ok="handleOk"
    @closed="handleClosed"
  >
    <div class="confirm__body">
      <p v-if="title" class="confirm__title">{{ title }}</p>
      <p class="confirm__message">{{ message }}</p>
    </div>
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

.#{$b}__body {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  text-align: center;
}

.#{$b}__title {
  font-size: $font-size-h5;
  font-weight: $font-weight-bold;
  color: $text-800;
  line-height: $line-height-snug;
}

.#{$b}__message {
  font-size: $font-size-body3;
  font-weight: $font-weight-medium;
  color: $text-700;
  line-height: $line-height-snug;
  white-space: pre-line;
}
</style>
