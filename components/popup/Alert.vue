<template>
  <Popup
    v-bind="$attrs"
    type="alert"
    :open="isOpen"
    :title="title ?? '안내'"
    :ok-label="okLabel"
    :show-close="false"
    :show-cancel="false"
    :close-on-overlay="true"
    :close-on-escape="true"
    @update:open="handleUpdateOpen"
    @ok="handleOk"
    @closed="handleClosed"
  >
    <div class="alert__body">
      <p v-if="title" class="alert__title">{{ title }}</p>
      <p class="alert__message">{{ message }}</p>
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
  onClose: () => void
}>()

const isOpen = ref(true)

function handleUpdateOpen(val: boolean) {
  if (!val) isOpen.value = false
}

function handleOk() {
  isOpen.value = false
}

function handleClosed() {
  props.onClose()
}
</script>

<style lang="scss" scoped>
$b: 'alert';

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
