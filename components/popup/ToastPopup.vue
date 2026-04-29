<template>
  <ToastRoot
    v-bind="$attrs"
    :open="open"
    :type="type"
    :force-mount="forceMount"
    class="toastPopup"
    :class="{ 'toastPopup--withIcon': showIcon || hasIconSlot }"
    @update:open="emit('update:open', $event)"
    @animationend="handleAnimationEnd"
  >
    <!-- 아이콘 영역 -->
    <span v-if="showIcon || hasIconSlot" class="toastPopup__icon" aria-hidden="true">
      <slot name="icon">
        <!-- 기본 알림 아이콘 -->
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="none" aria-hidden="true">
          <circle cx="15" cy="15" r="15" fill="white"/>
          <path d="M12.6981 20.0771H17.2999C17.2079 20.6148 16.9264 21.1029 16.5052 21.4549C16.0841 21.8069 15.5504 22 14.999 22C14.4476 22 13.914 21.8069 13.4928 21.4549C13.0716 21.1029 12.7901 20.6148 12.6981 20.0771ZM14.999 7C16.5463 7 18.0301 7.60784 19.1242 8.68979C20.2183 9.77174 20.8329 11.2392 20.8329 12.7693V15.8463L21.9359 18.2771C21.9861 18.3882 22.0073 18.51 21.9978 18.6314C21.9882 18.7528 21.9482 18.8699 21.8813 18.972C21.8143 19.0742 21.7227 19.1582 21.6146 19.2165C21.5065 19.2747 21.3854 19.3053 21.2623 19.3055H8.73884C8.61558 19.3055 8.49427 19.275 8.38598 19.2168C8.27769 19.1585 8.18584 19.0745 8.11881 18.9721C8.05178 18.8698 8.01169 18.7526 8.0022 18.6311C7.9927 18.5095 8.0141 18.3876 8.06444 18.2763L9.16511 15.8455V12.7593L9.16899 12.567C9.2222 11.073 9.85973 9.65779 10.9472 8.61947C12.0348 7.58116 13.4874 7.00007 14.999 7Z" fill="url(#paint0_linear_40004130_10061)"/>
          <defs>
            <linearGradient id="paint0_linear_40004130_10061" x1="12" y1="7" x2="15" y2="23.5" gradientUnits="userSpaceOnUse">
              <stop stop-color="#0CB5E2"/>
              <stop offset="1" stop-color="#7363FF"/>
            </linearGradient>
          </defs>
        </svg>
      </slot>
    </span>

    <!-- 텍스트 -->
    <ToastDescription class="toastPopup__message">{{ message }}</ToastDescription>

    <!-- 닫기 버튼 -->
    <ToastClose v-if="showClose" as-child>
      <button
        type="button"
        class="toastPopup__closeBtn"
        aria-label="닫기"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" fill="#111111"/>
          <path d="M15 9L9 15" stroke="white" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M9 9L15 15" stroke="white" stroke-width="1.05" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </ToastClose>
  </ToastRoot>
</template>

<script setup lang="ts">
import { ToastRoot, ToastDescription, ToastClose } from 'radix-vue'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    open: boolean
    message: string
    showClose?: boolean
    showIcon?: boolean
    type?: 'foreground' | 'background'
    forceMount?: boolean
  }>(),
  {
    showClose: false,
    showIcon: false,
    type: 'foreground',
  }
)

const emit = defineEmits<{
  'update:open': [value: boolean]
  closed: []
}>()

const slots = useSlots()
const hasIconSlot = computed(() => !!slots.icon)

function handleAnimationEnd(event: AnimationEvent): void {
  // 버블링된 자식 애니메이션은 무시 — ToastRoot 자신의 애니메이션만 처리
  if (event.target !== event.currentTarget) return
  const el = event.currentTarget as HTMLElement
  if (el.dataset.state === 'closed') emit('closed')
}
</script>

<style lang="scss">
// ToastRoot는 내부적으로 inheritAttrs: false를 사용하므로
// scoped CSS의 data-v-xxxxx 속성이 실제 <li> DOM까지 전달되지 않습니다.
// ToastRenderer는 app.vue에 1회만 마운트되는 전역 싱글톤이므로
// non-scoped 전역 CSS를 사용합니다. BEM 고유 네이밍으로 전역 충돌을 방지합니다.
$b: 'toastPopup';

.#{$b} {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 1.4rem;
  background-color: rgba($text-900, 0.8);
  border-radius: $radius-full;
  box-shadow: 0 0.2rem 0.4rem rgba(0, 0, 0, 0.3);
  font-size: $font-size-body3;
  font-weight: $font-weight-medium;
  color: $text-white;
  line-height: $line-height-snug;
  outline: none;

  &[data-state='open'] {
    animation: toastSlideIn $duration-base ease-out;
  }

  &[data-state='closed'] {
    animation: toastSlideOut $duration-base ease-out forwards;
  }

  &[data-swipe='move'] {
    transform: translateX(var(--radix-toast-swipe-move-x));
  }

  &[data-swipe='cancel'] {
    transform: translateX(0);
    transition: transform $duration-fast ease-out;
  }

  &[data-swipe='end'] {
    animation: toastSwipeOut $duration-base ease-out forwards;
  }
}

.#{$b}--withIcon {
  font-size: 1.3rem; // $font-size-body5 동일값(13px) — 아이콘 포함 시 폰트 축소
}

.#{$b}__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
}

.#{$b}__message {
  flex: 1;
  min-width: 0;
}

.#{$b}__closeBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  flex-shrink: 0;
  padding: 0;
  border: none;
  background: transparent;
  color: $text-white;
  cursor: pointer;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px $color-primary;
    border-radius: $radius-sm;
  }
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes toastSlideOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100%);
  }
}

@keyframes toastSwipeOut {
  from {
    opacity: 1;
    transform: translateX(var(--radix-toast-swipe-end-x));
  }
  to {
    opacity: 0;
    transform: translateX(calc(var(--radix-toast-swipe-end-x) + 100%));
  }
}
</style>
