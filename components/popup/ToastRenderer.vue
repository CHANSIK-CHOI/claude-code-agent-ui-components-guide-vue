<template>
  <!-- ToastProvider duration을 Infinity로 고정: Radix Vue는 pauseOnHover를 비활성화하는
       prop이 없어 hover/focus 시 자동으로 타이머를 멈춘다. 이를 방지하기 위해 Radix의
       내장 타이머에 의존하지 않고, useToastPopup의 setTimeout으로 직접 타이머를 관리한다. -->
  <ToastProvider :duration="Infinity" swipe-direction="right">
    <template v-for="toast in instances" :key="toast.id">
      <ToastPopup
        :open="toast.open"
        :message="toast.message"
        :show-close="toast.showClose"
        :show-icon="toast.showIcon"
        :type="toast.type"
        @update:open="!$event && close(toast.id)"
        @closed="remove(toast.id)"
      />
    </template>

    <ToastViewport class="toastRenderer__viewport" label="알림" />
  </ToastProvider>
</template>

<script setup lang="ts">
import { ToastProvider, ToastViewport } from 'radix-vue'
import ToastPopup from './ToastPopup.vue'
import { useToastPopup } from './useToastPopup'

const { instances, remove, close } = useToastPopup()
</script>

<style lang="scss">
// ToastViewport는 내부적으로 inheritAttrs: false를 사용하므로
// scoped CSS의 data-v-xxxxx 속성이 실제 <ol> DOM까지 전달되지 않습니다.
// ToastRenderer는 app.vue에 1회만 마운트되는 전역 싱글톤이므로
// non-scoped 전역 CSS를 사용합니다. BEM 고유 네이밍으로 전역 충돌을 방지합니다.
$b: 'toastRenderer';

.#{$b}__viewport {
  position: fixed;
  bottom: $spacing-lg;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 3.2rem);
  max-width: 36rem;
  z-index: $z-toast;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
  outline: none;
}
</style>
