<template>
  <Popup
    type="full"
    :open="open"
    :title="title"
    :description="description"
    :show-close="showClose"
    :ok-label="okLabel"
    :cancel-label="cancelLabel"
    :show-cancel="showCancel"
    :ok-disabled="okDisabled"
    :close-on-overlay="false"
    :close-on-escape="closeOnEscape"
    @update:open="(v) => emit('update:open', v)"
    @opened="emit('opened')"
    @closed="emit('closed')"
    @close="emit('close')"
    @ok="emit('ok')"
    @cancel="emit('cancel')"
    @overlay-click="emit('overlayClick')"
  >
    <template v-if="$slots.header" #header><slot name="header" /></template>
    <slot />
    <template v-if="$slots.footer" #footer><slot name="footer" /></template>
  </Popup>
</template>

<script setup lang="ts">
import Popup from './Popup.vue'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    description?: string
    showClose?: boolean
    okLabel?: string
    cancelLabel?: string
    showCancel?: boolean
    okDisabled?: boolean
    closeOnEscape?: boolean
  }>(),
  {
    showClose: true,
    okLabel: '확인',
    cancelLabel: '취소',
    showCancel: false,
    okDisabled: false,
    closeOnEscape: true,
  },
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  opened: []
  closed: []
  close: []
  ok: []
  cancel: []
  overlayClick: []
}>()
</script>
