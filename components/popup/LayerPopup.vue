<template>
  <Popup
    v-bind="$attrs"
    type="layer"
    :open="open"
    :title="title"
    :description="description"
    :show-close="showClose"
    :ok-label="okLabel"
    :cancel-label="cancelLabel"
    :cancel-color="cancelColor"
    :ok-color="okColor"
    :show-cancel="showCancel"
    :ok-disabled="okDisabled"
    :close-on-overlay="closeOnOverlay"
    :close-on-escape="closeOnEscape"
    :close-on-close-btn="closeOnCloseBtn"
    :close-on-cancel="closeOnCancel"
    :show-footer="showFooter"
    :body-label="bodyLabel"
    :body-note="bodyNote"
    :narrow-cancel="footerLayout === 'wide'"
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
defineOptions({ inheritAttrs: false })

import Popup from './Popup.vue'

type FooterLayout = 'equal' | 'wide'

const props = withDefaults(
  defineProps<{
    open: boolean
    title?: string
    description?: string
    showClose?: boolean
    okLabel?: string
    cancelLabel?: string
    cancelColor?: 'secondary' | 'gray'
    okColor?: 'secondary' | 'primary' | 'black'
    showCancel?: boolean
    okDisabled?: boolean
    closeOnOverlay?: boolean
    closeOnEscape?: boolean
    closeOnCloseBtn?: boolean
    closeOnCancel?: boolean
    showFooter?: boolean
    bodyLabel?: string
    bodyNote?: string
    footerLayout?: FooterLayout
  }>(),
  {
    showClose: true,
    okLabel: '확인',
    cancelLabel: '취소',
    cancelColor: 'gray',
    okColor: 'primary',
    showCancel: true,
    okDisabled: false,
    closeOnOverlay: true,
    closeOnEscape: true,
    closeOnCloseBtn: true,
    closeOnCancel: true,
    showFooter: true,
    footerLayout: 'equal',
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
