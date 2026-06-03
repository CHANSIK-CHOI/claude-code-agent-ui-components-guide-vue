<template>
  <DialogRoot :open="open" @update:open="handleOpenChange">
    <DialogPortal to="#popup-container">
      <!-- forceMount + <Transition appear>: 마운트 첫 프레임=enter-from(off) → 다음 프레임 enter-to(on) -->
      <Transition name="popup-overlay" appear>
        <DialogOverlay
          v-if="open"
          :force-mount="true"
          class="popup__overlay"
          :style="zStyle"
          @pointerdown="handleOverlayPointerDown"
        />
      </Transition>

      <Transition :name="transitionName" appear @after-enter="handleAfterEnter" @after-leave="handleAfterLeave">
        <DialogContent
          v-if="open"
          v-bind="$attrs"
          :force-mount="true"
          class="popup__content"
          :class="`popup--${type}`"
          :style="zStyle"
          @interact-outside="handleInteractOutside"
          @escape-key-down="handleEscapeKeyDown"
        >
          <div class="popup__content-wrap">
            <!-- a11y: title 없으면 VisuallyHidden으로만 마운트 -->
            <!-- title 있으면 header 안의 DialogTitle이 직접 렌더하므로 VisuallyHidden 불필요 -->
            <VisuallyHidden v-if="!title">
              <DialogTitle>{{ type === 'alert' ? '안내' : type === 'confirm' ? '확인' : '' }}</DialogTitle>
            </VisuallyHidden>

            <!-- a11y: description 항상 마운트 -->
            <VisuallyHidden>
              <DialogDescription>{{ description ?? '' }}</DialogDescription>
            </VisuallyHidden>

            <!-- 닫기 버튼: 모든 type 공통 — DialogContent 바로 안 absolute 배치 -->
            <!-- closeOnCloseBtn=true(기본): Radix DialogClose 래핑 → 자동 닫힘 포함 -->
            <DialogClose v-if="showAbsoluteClose && closeOnCloseBtn !== false" as-child>
              <button type="button" class="popup__closeBtn" aria-label="닫기" @click="handleCloseBtn">
                <Icon v-if="type !== 'full'" size="sm" aria-hidden="true" color="#838B92"><SmallCloseSvg /></Icon>
                <Icon v-else aria-hidden="true"><CloseSvg /></Icon>
              </button>
            </DialogClose>
            <!-- closeOnCloseBtn=false: DialogClose 없이 순수 button → Radix 자동 닫기 차단 -->
            <button
              v-else-if="showAbsoluteClose"
              type="button"
              class="popup__closeBtn"
              aria-label="닫기"
              @click="handleCloseBtn"
            >
              <Icon v-if="type !== 'full'" size="sm" aria-hidden="true" color="#838B92"><SmallCloseSvg /></Icon>
              <Icon v-else aria-hidden="true"><CloseSvg /></Icon>
            </button>

            <!-- 커스텀 header slot (alert/confirm 제외) -->
            <template v-if="hasCustomHeader && type !== 'alert' && type !== 'confirm'">
              <slot name="header" />
            </template>

            <!-- 타이틀 헤더: title 있을 때만 렌더링 (alert/confirm 제외, 커스텀 header 없을 때) -->
            <div v-if="showTitleHeader" class="popup__header">
              <DialogTitle class="popup__title">{{ title }}</DialogTitle>
            </div>

            <!-- Body -->
            <div class="popup__body">
              <div
                v-if="bodyLabel || $slots['body-label-icon']"
                class="popup__bodyLabel"
                :class="{ 'popup__bodyLabel--center': bodyLabelAlign === 'center' }"
              >
                <span v-if="$slots['body-label-icon']" class="popup__bodyLabelIcon">
                  <slot name="body-label-icon" />
                </span>
                <span class="popup__bodyLabelText" v-html="bodyLabel" />
              </div>
              <!-- deferContent=true: 열림 애니메이션 완료 후에만 렌더 (무거운 콘텐츠가 슬라이드를 막는 문제 회피) -->
              <slot v-if="!deferContent || contentVisible" />
              <div v-if="bodyNote" class="popup__bodyNote">
                <Icon size="sm" aria-hidden="true"><CircularNoteSvg /></Icon>
                <span class="popup__bodyNoteText" v-html="bodyNote" />
              </div>
            </div>

            <!-- Footer: #footer slot 또는 기본 ok/cancel 버튼 -->
            <div v-if="showFooter" class="popup__footer" :style="footerStyle">
              <template v-if="$slots.footer">
                <slot name="footer" />
              </template>
              <template v-else>
                <span v-if="showCancel" class="popup__footerBtnWrap">
                  <Button shape="solid" :color="cancelColor" size="lg" @click="handleCancel">{{ cancelLabel }}</Button>
                </span>
                <span class="popup__footerBtnWrap">
                  <Button shape="solid" :color="okColor" size="lg" :disabled="okDisabled" @click="handleOk">{{
                    okLabel
                  }}</Button>
                </span>
              </template>
            </div>
          </div>
        </DialogContent>
      </Transition>
    </DialogPortal>
  </DialogRoot>
</template>

<script setup lang="ts">
  defineOptions({ inheritAttrs: false });

  import type { ButtonColor } from '@nd/components/types';
  import Icon from '@nd/components/icons/Icon.vue';
  import SmallCloseSvg from '@nd/assets/icons/smallClose.svg?component';
  import CloseSvg from '@nd/assets/icons/close.svg?component';
  import CircularNoteSvg from '@nd/assets/icons/circularNote.svg?skipsvgo';
  import { useZIndexStack } from './useZIndexStack';

  type PopupType = 'layer' | 'bottomSheet' | 'full' | 'alert' | 'confirm';

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
      okColor?: Extract<ButtonColor, 'secondary' | 'primary' | 'black'>;
      narrowCancel?: boolean;
      closeOnOverlay?: boolean;
      closeOnEscape?: boolean;
      closeOnCloseBtn?: boolean;
      closeOnCancel?: boolean;
      showFooter?: boolean;
      bodyLabel?: string;
      bodyLabelAlign?: 'left' | 'center';
      bodyNote?: string;
      deferContent?: boolean;
    }>(),
    {
      type: 'layer',
      showClose: true,
      okLabel: '확인',
      cancelLabel: '취소',
      showCancel: true,
      okDisabled: false,
      cancelColor: 'gray',
      okColor: 'primary',
      narrowCancel: false,
      closeOnOverlay: true,
      closeOnEscape: true,
      closeOnCloseBtn: true,
      closeOnCancel: true,
      showFooter: true,
      deferContent: false,
    }
  );

  const slots = useSlots();

  // 커스텀 header slot 사용 여부
  const hasCustomHeader = computed(() => !!slots.header);

  // 닫기 버튼 표시 여부: 모든 type 공통 (alert/confirm 제외)
  const showAbsoluteClose = computed(
    () => props.showClose && !hasCustomHeader.value && props.type !== 'alert' && props.type !== 'confirm'
  );

  // 타이틀 헤더 표시 여부: title 있을 때만 (커스텀 header 없을 때)
  const showTitleHeader = computed(() => !hasCustomHeader.value && !!props.title);

  // Vue <Transition> 이름 — type 별 enter/leave 클래스 매핑
  // layer / alert / confirm → fade+scale, bottomSheet → slideUp, full → slideRight
  const transitionName = computed(() => {
    if (props.type === 'bottomSheet') return 'popup-slideUp';
    if (props.type === 'full') return 'popup-slideRight';
    return 'popup-fade';
  });

  const footerStyle = computed(() =>
    props.narrowCancel
      ? { '--footer-cancel-flex': '120', '--footer-cancel-max': '12rem', '--footer-ok-flex': '200' }
      : undefined
  );

  const emit = defineEmits<{
    'update:open': [value: boolean];
    opened: [];
    closed: [];
    close: [];
    ok: [];
    cancel: [];
    overlayClick: [];
  }>();

  // z-index 스택: 여러 팝업이 겹쳐 열릴 때 "띄워진 순서"로 쌓이게 한다.
  // alert/confirm 은 system 그룹 → 콘텐츠 팝업(content)보다 항상 위. (useZIndexStack 주석 참조)
  const zGroup = props.type === 'alert' || props.type === 'confirm' ? 'system' : 'content';
  const { zIndex, activate, deactivate } = useZIndexStack(zGroup);

  // 열릴 때 스택에 등록(activate). 제거(deactivate)는 닫힘 애니메이션 완료(handleAfterLeave) 시점 —
  // 닫히는 동안에도 z-index 를 유지해 다른 팝업과 순간적으로 뒤바뀌는 것을 막는다.
  watch(
    () => props.open,
    (val) => {
      if (val) activate();
    },
    { immediate: true }
  );

  // 스택에 있을 때만 inline z-index 적용. 없으면 undefined → SCSS 의 z-index 가 fallback.
  const zStyle = computed(() => (zIndex.value !== undefined ? { zIndex: String(zIndex.value) } : undefined));

  // deferContent: 열림 애니메이션 완료(@after-enter) 후에만 default slot 렌더.
  // 무거운 콘텐츠가 슬라이드 중 함께 렌더되면 transform 애니메이션이 화면에 그려지지 않고
  // 최종 위치로 스냅되는 문제가 있어, 슬라이드 동안은 가벼운 셸만 움직이게 한다.
  const contentVisible = ref(false);

  function handleAfterEnter() {
    contentVisible.value = true;
    emit('opened');
  }

  function handleAfterLeave() {
    contentVisible.value = false; // 다음 열림을 위해 리셋
    deactivate(); // 닫힘 애니메이션 완료 후 z-index 스택에서 제거
    emit('closed');
  }

  function handleOpenChange(val: boolean) {
    emit('update:open', val);
  }

  function handleInteractOutside(event: Event) {
    // 다중 Dialog 열림 시 다른 Dialog 영역 클릭이 interact-outside로 전파되는 것을 차단.
    // Overlay 닫기는 @pointerdown(handleOverlayPointerDown)으로 별도 처리.
    event.preventDefault();
  }

  function handleOverlayPointerDown(event: PointerEvent) {
    // 좌클릭(button === 0)에 한해서만 닫힘 처리.
    // 우클릭(button === 2)·중간 버튼(button === 1)은 무시.
    // 터치 이벤트(pointerType === 'touch')는 button === 0으로 설정되므로 터치 닫힘에는 영향 없음.
    if (event.button !== 0) return;

    // @click 대신 @pointerdown 사용:
    // 모바일에서 Radix Vue DismissableLayer가 touch 이벤트를 click으로 처리하는 과정에서
    // Select 드롭다운 열기 시 synthetic click이 overlay에 도달해 팝업이 닫히는 버그 회피.
    // pointerdown은 SelectTrigger 탭 시 DialogOverlay(sibling)에 전달되지 않으므로 안전함.

    // Select 등 Radix Vue 드롭다운이 열려있을 때 overlay 클릭으로 팝업 닫지 않음.
    // 이유: Select 열림 중 Radix Vue가 DialogContent에 pointer-events:none을 인라인으로 적용해
    // dialog 영역 클릭이 overlay까지 투과됨. Select 닫힘은 SelectContent DismissableLayer에 위임.
    const hasOpenDropdown = !!document.querySelector('[role="listbox"][data-state="open"]');
    if (hasOpenDropdown) return;

    if (props.closeOnOverlay) {
      emit('overlayClick');
      emit('update:open', false);
    }
  }

  function handleEscapeKeyDown(event: KeyboardEvent) {
    if (!props.closeOnEscape) {
      event.preventDefault();
    }
  }

  function handleCloseBtn() {
    emit('close');
    if (props.closeOnCloseBtn !== false) {
      emit('update:open', false);
    }
  }

  function handleCancel() {
    emit('cancel');
    if (props.closeOnCancel !== false) {
      emit('update:open', false);
    }
  }

  function handleOk() {
    emit('ok');
  }
</script>

<style lang="scss" scoped>
  $b: 'popup';

  // ── Overlay ──────────────────────────────────────────────────────────
  .#{$b}__overlay {
    position: fixed;
    inset: 0;
    pointer-events: auto;
    background-color: rgba($text-900, 0.5);
    z-index: $z-modal;
  }

  // ── Content 공통 ──────────────────────────────────────────────────────
  .#{$b}__content {
    position: fixed;
    pointer-events: auto;
    background-color: $bg-primary;
    z-index: $z-modal;
    outline: none;
    // overflow: hidden;
  }
  .#{$b}__content-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
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

    .#{$b}__content-wrap {
      padding: 3rem 1rem 1rem 1rem;
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
      gap: 0.5rem;
    }
  }

  // ── type: bottomSheet ────────────────────────────────────────────────
  .#{$b}--bottomSheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 80vh;
    border-radius: 2rem 2rem 0 0;

    .#{$b}__content-wrap {
      padding: 3rem 1.6rem 1rem;
      max-height: 80vh;
    }

    .#{$b}__header {
      padding: 0;
      border-bottom: none;
    }

    .#{$b}__closeBtn {
      top: 1.4rem;
      right: 1.6rem;
    }

    .#{$b}__title {
      text-align: center;
    }

    .#{$b}__body {
      padding: 0;
    }

    .#{$b}__footer {
      border-top: none;
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

    .#{$b}__header {
      min-height: 5.2rem;
    }
    .#{$b}__header,
    .#{$b}__footer {
      padding: 1.4rem 1.6rem;
    }
    .#{$b}__closeBtn {
      width: 2.4rem;
      height: 2.4rem;
      top: 1.4rem;
      right: 1.6rem;
    }
    .#{$b}__title {
      padding: 0 3rem;
    }

    .#{$b}__body {
      padding: 2rem 1.6rem 4rem 1.6rem;
    }
    .#{$b}__bodyLabel {
      margin-top: 0;
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

    .#{$b}__header {
      border-bottom: none;
      padding: 0 0.6rem;
      justify-content: center;
    }

    .#{$b}__body {
      flex: unset;
      overflow-y: visible;
      padding: 0.6rem 0;
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
    padding: $spacing-md;
    border-bottom: 1px solid $line-300;
    flex-shrink: 0;
  }

  .#{$b}__title {
    font-size: $font-size-body1;
    font-weight: $font-weight-bold;
    color: $text-900;
    line-height: $line-height-snug;
    flex: 1;
    text-align: center;
    padding: 0.6rem 0;
    white-space: pre-line;
  }

  .#{$b}__closeBtn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.6rem;
    height: 1.6rem;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px $color-primary;
      border-radius: $radius-sm;
    }
  }

  // ── Body ─────────────────────────────────────────────────────────────
  .#{$b}__body {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: $spacing-md;
    color: $text-700;
    font-size: $font-size-body3;
    line-height: $line-height-base;
  }
  .#{$b}__bodyLabel {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 1.2rem;
    background-color: $bg-secondary;
    border-radius: 1.2rem;
    margin: 1.2rem 0;
  }
  .#{$b}__bodyLabel--center {
    justify-content: center;
    text-align: center;
  }
  .#{$b}__bodyLabelIcon {
    display: inline-flex;
    flex-shrink: 0;
  }
  .#{$b}__bodyLabelText {
    color: $text-700;
    font-size: $font-size-body5;
    font-weight: $font-weight-medium;
    :deep(em) {
      font-weight: $font-weight-bold;
    }
  }

  .#{$b}__bodyNote {
    display: flex;
    gap: 0.4rem;
    margin-top: 1.4rem;

    :deep(.icon) {
      margin-top: 0.2rem;
    }
  }
  .#{$b}__bodyNoteText {
    flex-grow: 1;
    color: $text-700;
    font-size: $font-size-caption1;
    font-weight: $font-weight-regular;
    white-space: pre-line;
  }

  // ── Footer ───────────────────────────────────────────────────────────
  .#{$b}__footer {
    display: flex;
    gap: $spacing-sm;
    border-top: 1px solid $line-300;
    flex-shrink: 0;
    padding-top: 2rem;
  }

  .#{$b}__footerBtnWrap {
    flex: 1;
  }

  .#{$b}__footer {
    :deep(> :first-child) {
      flex: var(--footer-cancel-flex, 1);
      max-width: var(--footer-cancel-max, none);
    }
    :deep(> :last-child) {
      flex: var(--footer-ok-flex, 1);
    }
  }

  // ── Vue <Transition> 클래스 ───────────────────────────────────────────
  // forceMount + <Transition appear>: 마운트 첫 프레임에 enter-from(off)가 적용되고
  // 다음 프레임에 enter-to(=base 휴지 상태)로 transition 된다. enter-to 는 별도 클래스를 두지 않고
  // 각 type 의 base 휴지 상태(transform 없음 / translate(-50%,-50%))로 자연 복귀시킨다.

  // overlay (fade)
  .popup-overlay-enter-active,
  .popup-overlay-leave-active {
    transition: opacity $duration-base ease-out;
  }
  .popup-overlay-enter-from,
  .popup-overlay-leave-to {
    opacity: 0;
  }

  // fade + scale (layer / alert / confirm) — 중앙 정렬 translate 유지
  .popup-fade-enter-active,
  .popup-fade-leave-active {
    transition:
      opacity $duration-base ease-out,
      transform $duration-base ease-out;
  }
  .popup-fade-enter-from,
  .popup-fade-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }

  // slideUp (bottomSheet)
  .popup-slideUp-enter-active,
  .popup-slideUp-leave-active {
    transition: transform $duration-base ease-out;
  }
  .popup-slideUp-enter-from,
  .popup-slideUp-leave-to {
    transform: translateY(100%);
  }

  // slideRight (full)
  .popup-slideRight-enter-active,
  .popup-slideRight-leave-active {
    transition: transform $duration-base ease-out;
  }
  .popup-slideRight-enter-from,
  .popup-slideRight-leave-to {
    transform: translateX(100%);
  }
</style>
