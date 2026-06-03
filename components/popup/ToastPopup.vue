<template>
  <ToastRoot
    v-bind="$attrs"
    :open="open"
    :type="type"
    :force-mount="forceMount"
    class="toastPopup"
    :class="{ 'toastPopup--withIcon': showIcon || !!$slots.icon }"
    @update:open="emit('update:open', $event)"
    @animationend="handleAnimationEnd"
  >
    <!-- 아이콘 영역 -->
    <span v-if="showIcon || !!$slots.icon" class="toastPopup__icon" aria-hidden="true">
      <slot name="icon">
        <!-- iconComponent prop이 있으면 렌더링 (hasIconSlot 없을 때) -->
        <component :is="iconComponent" v-if="iconComponent" />
        <ToastPopupIconBell v-else aria-hidden="true" />
      </slot>
    </span>

    <!-- 텍스트 -->
    <ToastDescription class="toastPopup__message">{{ message }}</ToastDescription>

    <!-- 닫기 버튼 -->
    <ToastClose v-if="showClose" as-child>
      <button type="button" class="toastPopup__closeBtn" aria-label="닫기">
        <ToastPopupIconCloseBtn aria-hidden="true" />
      </button>
    </ToastClose>
  </ToastRoot>
</template>

<script setup lang="ts">
  import type { Component } from 'vue';
  import { ToastRoot, ToastDescription, ToastClose } from 'radix-vue';
  import ToastPopupIconBell from '@nd/assets/images/common/toastPopupIcon_bell.svg?skipsvgo';
  import ToastPopupIconCloseBtn from '@nd/assets/images/common/toastPopupIcon_closeBtn.svg?skipsvgo';

  defineOptions({ inheritAttrs: false });

  const props = withDefaults(
    defineProps<{
      open: boolean;
      message: string;
      showClose?: boolean;
      showIcon?: boolean;
      type?: 'foreground' | 'background';
      forceMount?: boolean;
      iconComponent?: Component | null;
    }>(),
    {
      showClose: false,
      showIcon: false,
      type: 'foreground',
    }
  );

  const emit = defineEmits<{
    'update:open': [value: boolean];
    closed: [];
  }>();

  function handleAnimationEnd(event: AnimationEvent): void {
    // 버블링된 자식 애니메이션은 무시 — ToastRoot 자신의 애니메이션만 처리
    if (event.target !== event.currentTarget) return;
    const el = event.currentTarget as HTMLElement;
    if (el.dataset.state === 'closed') emit('closed');
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
    gap: 0.8rem;
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
    pointer-events: auto;

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
    white-space: pre-line;
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
