<template>
  <DialogRoot :open="open" @update:open="handleOpenChange">
    <DialogPortal to="#popup-container">
      <DialogOverlay
        class="popup__overlay"
        @click="handleOverlayClick"
      />

      <DialogContent
        v-bind="$attrs"
        class="popup__content"
        :class="`popup--${type}`"
        @interact-outside="handleInteractOutside"
        @escape-key-down="handleEscapeKeyDown"
        @animationend="handleAnimationEnd"
      >
        <!-- a11y: alert/confirm 타입 또는 title 없으면 VisuallyHidden으로만 마운트 -->
        <!-- layer/bottomSheet/full + title 있으면 header 안의 DialogTitle이 직접 렌더하므로 VisuallyHidden 불필요 -->
        <VisuallyHidden v-if="!title || type === 'alert' || type === 'confirm'">
          <DialogTitle>{{ title ?? '' }}</DialogTitle>
        </VisuallyHidden>

        <!-- a11y: description 항상 마운트 -->
        <VisuallyHidden>
          <DialogDescription>{{ description ?? "" }}</DialogDescription>
        </VisuallyHidden>

        <!-- layer 타입 전용: absolute close 버튼 (header 바깥 배치) -->
        <DialogClose v-if="showLayerAbsoluteClose" as-child>
          <button
            type="button"
            class="popup__closeBtn popup__closeBtn--absolute"
            aria-label="닫기"
            @click="handleCloseBtn"
          >
            <CloseIcon aria-hidden="true" />
          </button>
        </DialogClose>

        <!-- 커스텀 header slot (alert/confirm 제외) -->
        <template v-if="hasCustomHeader && type !== 'alert' && type !== 'confirm'">
          <slot name="header" />
        </template>

        <!-- 비-layer 기본 헤더 (bottomSheet, full 타입용) — 독립 v-if -->
        <header v-if="showDefaultHeader" class="popup__header">
          <DialogTitle v-if="title" class="popup__title">{{ title }}</DialogTitle>
          <DialogClose v-if="showClose" as-child>
            <button
              type="button"
              class="popup__closeBtn"
              :aria-label="type === 'full' ? '뒤로가기' : '닫기'"
              @click="handleCloseBtn"
            >
              <span class="popup__closeBtnIcon" aria-hidden="true">
                <template v-if="type === 'full'">←</template>
                <template v-else>✕</template>
              </span>
            </button>
          </DialogClose>
        </header>

        <!-- layer 전용 타이틀 헤더 — 독립 v-if -->
        <header v-if="showLayerTitleHeader" class="popup__header">
          <DialogTitle class="popup__title">{{ title }}</DialogTitle>
        </header>

        <!-- Body -->
        <div class="popup__body">
          <slot />
        </div>

        <!-- Footer: #footer slot 또는 기본 ok/cancel 버튼 -->
        <footer class="popup__footer">
          <template v-if="$slots.footer">
            <slot name="footer" />
          </template>
          <template v-else>
            <span
              v-if="showCancel"
              class="popup__footerBtnWrap"
              :style="{ flex: cancelFlex }"
            >
              <Button
                shape="solid"
                :color="cancelColor"
                size="lg"
                @click="handleCancel"
              >{{ cancelLabel }}</Button>
            </span>
            <span
              class="popup__footerBtnWrap"
              :style="{ flex: okFlex }"
            >
              <Button
                shape="solid"
                color="primary"
                size="lg"
                :disabled="okDisabled"
                @click="handleOk"
              >{{ okLabel }}</Button>
            </span>
          </template>
        </footer>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

import type { ButtonColor } from '@nd/components/types';
import { CloseIcon } from '@nd/components/icons';

type PopupType = "layer" | "bottomSheet" | "full" | "alert" | "confirm";

const props = withDefaults(
  defineProps<{
    open: boolean;
    type?: PopupType;
    title?: string;
    description?: string;
    showClose?: boolean;
    okLabel?: string;
    cancelLabel?: string;
    showCancel?: boolean;
    okDisabled?: boolean;
    cancelColor?: Extract<ButtonColor, 'secondary' | 'gray'>;
    cancelFlex?: number;
    okFlex?: number;
    closeOnOverlay?: boolean;
    closeOnEscape?: boolean;
  }>(),
  {
    type: "layer",
    showClose: true,
    okLabel: "확인",
    cancelLabel: "취소",
    showCancel: true,
    okDisabled: false,
    cancelColor: 'gray',
    cancelFlex: 1,
    okFlex: 1,
    closeOnOverlay: true,
    closeOnEscape: true,
  },
);

const slots = useSlots();

// 커스텀 header slot 사용 여부
const hasCustomHeader = computed(() => !!slots.header);

// layer 타입: absolute close 버튼 표시 여부
const showLayerAbsoluteClose = computed(
  () => props.type === 'layer' && props.showClose && !hasCustomHeader.value,
);

// 비-layer 기본 헤더 표시 여부 (bottomSheet, full 타입용) — 독립 v-if
const showDefaultHeader = computed(
  () =>
    !hasCustomHeader.value &&
    (!!props.title || props.showClose) &&
    props.type !== 'alert' &&
    props.type !== 'confirm' &&
    props.type !== 'layer',
);

// layer 전용 타이틀 헤더 표시 여부
const showLayerTitleHeader = computed(
  () => !hasCustomHeader.value && !!props.title && props.type === 'layer',
);

const emit = defineEmits<{
  "update:open": [value: boolean];
  opened: [];
  closed: [];
  close: [];
  ok: [];
  cancel: [];
  overlayClick: [];
}>();

function handleOpenChange(val: boolean) {
  emit("update:open", val);
}

function handleInteractOutside(event: Event) {
  // 다중 Dialog 열림 시 다른 Dialog 영역 클릭이 interact-outside로 전파되는 것을 차단.
  // Overlay 클릭은 DialogOverlay @click(handleOverlayClick)으로 별도 처리.
  event.preventDefault();
}

function handleOverlayClick() {
  if (props.closeOnOverlay) {
    emit("overlayClick");
    emit("update:open", false);
  }
}

function handleEscapeKeyDown(event: KeyboardEvent) {
  if (!props.closeOnEscape) {
    event.preventDefault();
  }
}

function handleAnimationEnd(event: AnimationEvent) {
  // 버블링된 자식 애니메이션은 무시 — DialogContent 자신의 애니메이션만 처리
  if (event.target !== event.currentTarget) return;
  const el = event.currentTarget as HTMLElement;
  const state = el.dataset.state;
  if (state === "open") emit("opened");
  else if (state === "closed") emit("closed");
}

function handleCloseBtn() {
  emit("close");
  emit("update:open", false);
}

function handleCancel() {
  emit("cancel");
  emit("update:open", false);
}

function handleOk() {
  emit("ok");
}
</script>

<style lang="scss" scoped>
$b: "popup";

// ── Overlay ──────────────────────────────────────────────────────────
.#{$b}__overlay {
  position: fixed;
  inset: 0;
  pointer-events: auto;
  background-color: rgba($text-900, 0.5);
  z-index: $z-modal;

  &[data-state="open"] {
    animation: overlayFadeIn $duration-base ease-out;
  }
  &[data-state="closed"] {
    animation: overlayFadeOut $duration-base ease-out forwards;
  }
}

// ── Content 공통 ──────────────────────────────────────────────────────
.#{$b}__content {
  position: fixed;
  pointer-events: auto;
  background-color: $bg-primary;
  z-index: $z-modal;
  display: flex;
  flex-direction: column;
  outline: none;
  overflow: hidden;
}

// ── type: layer ──────────────────────────────────────────────────────
.#{$b}--layer {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 3.2rem);
  max-width: 48rem;
  max-height: calc(100dvh - 6.4rem);
  border-radius: 2rem;
  padding: 3rem 1rem 1rem 1rem;
  gap: 1rem;

  &[data-state="open"] {
    animation: fadeScaleIn $duration-base ease-out;
  }
  &[data-state="closed"] {
    animation: fadeScaleOut $duration-base ease-out forwards;
  }

  .#{$b}__header {
    border-bottom: none;
    padding: 0 0.6rem;
  }

  .#{$b}__body {
    padding: 0;
  }

  .#{$b}__footer {
    border-top: none;
    padding: 0;
    gap: 0.5rem;
  }
}

// ── type: bottomSheet ────────────────────────────────────────────────
.#{$b}--bottomSheet {
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  max-height: 80vh;
  border-radius: $radius-lg $radius-lg 0 0;

  &[data-state="open"] {
    animation: slideUp $duration-base ease-out;
  }
  &[data-state="closed"] {
    animation: slideDown $duration-base ease-out forwards;
  }
}

// ── type: full ───────────────────────────────────────────────────────
.#{$b}--full {
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100dvh;
  border-radius: 0;

  &[data-state="open"] {
    animation: slideInRight $duration-slow ease-out;
  }
  &[data-state="closed"] {
    animation: slideOutRight $duration-slow ease-out forwards;
  }
}

// ── type: alert / confirm ────────────────────────────────────────────
.#{$b}--alert,
.#{$b}--confirm {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 3.2rem);
  max-width: 32.8rem;
  border-radius: 2rem;
  padding: 3rem 1rem 1rem;

  &[data-state="open"] {
    animation: fadeScaleIn $duration-base ease-out;
  }
  &[data-state="closed"] {
    animation: fadeScaleOut $duration-base ease-out forwards;
  }

  .#{$b}__body {
    flex: unset;
    overflow-y: visible;
    padding: 0;
  }

  .#{$b}__footer {
    border-top: none;
    padding: 2rem 0 0;
    gap: 0.5rem;
  }
}

// ── Header ───────────────────────────────────────────────────────────
.#{$b}__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md;
  border-bottom: 1px solid $line-300;
  flex-shrink: 0;
}

.#{$b}__title {
  font-size: $font-size-body2;
  font-weight: $font-weight-bold;
  color: $text-900;
  line-height: $line-height-tight;
  flex: 1;
}

.#{$b}__closeBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  padding: 0;
  border: none;
  background: transparent;
  color: $text-700;
  cursor: pointer;
  flex-shrink: 0;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px $color-primary;
    border-radius: $radius-sm;
  }
}

.#{$b}__closeBtnIcon {
  font-size: 1.6rem;
  line-height: 1;
}

.#{$b}__closeBtn--absolute {
  position: absolute;
  top: 1rem;
  right: 1rem;
}

// ── Body ─────────────────────────────────────────────────────────────
.#{$b}__body {
  flex: 1;
  overflow-y: auto;
  padding: $spacing-md;
  color: $text-700;
  font-size: $font-size-body3;
  line-height: $line-height-base;
}

// ── Footer ───────────────────────────────────────────────────────────
.#{$b}__footer {
  display: flex;
  gap: $spacing-sm;
  padding: $spacing-md;
  border-top: 1px solid $line-300;
  flex-shrink: 0;
}

.#{$b}__footerBtnWrap {
  flex: 1;
}

// ── Keyframes ────────────────────────────────────────────────────────
@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes overlayFadeOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes fadeScaleIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}
@keyframes fadeScaleOut {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes slideDown {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(100%);
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes slideOutRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}
</style>
