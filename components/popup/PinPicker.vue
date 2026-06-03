<template>
  <BottomSheet
    v-bind="$attrs"
    :open="open"
    :title="title"
    :ok-label="okLabel"
    :show-cancel="showCancel"
    :ok-disabled="okDisabled"
    :close-on-overlay="closeOnOverlay"
    @update:open="(v) => emit('update:open', v)"
    @ok="handleOk"
    @cancel="handleCancel"
    @close="handleClose"
  >
    <div ref="bodyRef" class="pinPicker__body">
      <van-picker
        :model-value="pendingValue"
        :show-toolbar="false"
        :columns="columns"
        :columns-field-names="columnsFieldNames"
        :loading="loading"
        :readonly="readonly"
        :option-height="optionHeight"
        :visible-option-num="visibleOptionNum"
        :swipe-duration="swipeDuration"
        :allow-html="allowHtml"
        @change="handleChange"
      />
    </div>
  </BottomSheet>
</template>

<script setup lang="ts">
  import type { PickerOption, PickerConfirmEventParams, PickerChangeEventParams } from 'vant';
  import BottomSheet from './BottomSheet.vue';

  defineOptions({ inheritAttrs: false });

  // ── Props ─────────────────────────────────────────
  const props = withDefaults(
    defineProps<{
      modelValue?: string[];
      open: boolean;
      title?: string;
      okLabel?: string;
      showCancel?: boolean;
      okDisabled?: boolean;
      closeOnOverlay?: boolean;
      columns?: PickerOption[] | PickerOption[][];
      columnsFieldNames?: { text?: string; value?: string; children?: string };
      loading?: boolean;
      readonly?: boolean;
      optionHeight?: number | string;
      visibleOptionNum?: number;
      swipeDuration?: number;
      allowHtml?: boolean;
    }>(),
    {
      modelValue: () => [],
      open: false,
      title: '',
      okLabel: '확인',
      showCancel: true,
      okDisabled: false,
      closeOnOverlay: true,
      columns: () => [],
      loading: false,
      readonly: false,
      optionHeight: 44,
      visibleOptionNum: 6,
      swipeDuration: 1000,
      allowHtml: false,
    }
  );

  // ── Emits ─────────────────────────────────────────
  const emit = defineEmits<{
    'update:modelValue': [value: string[]];
    'update:open': [value: boolean];
    confirm: [payload: Pick<PickerConfirmEventParams, 'selectedValues' | 'selectedOptions' | 'selectedIndexes'>];
    cancel: [payload: Pick<PickerConfirmEventParams, 'selectedValues' | 'selectedOptions' | 'selectedIndexes'>];
    change: [payload: PickerChangeEventParams];
  }>();

  // ── 내부 상태 ──────────────────────────────────────
  const pendingValue = ref<string[]>([...props.modelValue]);

  watch(
    () => props.modelValue,
    (next) => {
      pendingValue.value = [...next];
    }
  );

  // ── iOS 3D 드럼 롤 ────────────────────────────────
  // 각 아이템에 거리 비례 rotateX를 실시간으로 적용해 원통 위에 올려진 느낌을 만든다.
  // 원리: 중앙에서 N칸 떨어진 아이템 → rotateX(N × ROTATION_PER_ITEM)
  //       perspective는 column 요소에 CSS로 설정 (style 블록 참조)

  const ROTATION_PER_ITEM = 20; // 한 칸당 회전 각도 (도). 작을수록 완만, 클수록 급격한 곡면
  const bodyRef = ref<HTMLElement | null>(null);
  let drum3dObservers: MutationObserver[] = [];
  let rafId: number | null = null;
  let animateUntil = 0;

  function apply3D(column: Element) {
    const wrapper = column.querySelector<HTMLElement>('.van-picker-column__wrapper');
    const items = column.querySelectorAll<HTMLElement>('.van-picker-column__item');
    if (!wrapper || !items.length) return;

    const translateY = new DOMMatrix(getComputedStyle(wrapper).transform).m42;
    const colHeight = (column as HTMLElement).clientHeight;
    const centerY = colHeight / 2;
    const itemH = typeof props.optionHeight === 'number' ? props.optionHeight : 44;

    items.forEach((item, i) => {
      // 아이템 중심의 현재 Y 위치 (컬럼 기준)
      const itemCenterY = i * itemH + itemH / 2 + translateY;
      // 컬럼 중심까지의 거리 (px)
      const dist = itemCenterY - centerY;
      // 거리를 아이템 높이 단위로 환산 → 각도 계산
      const angle = -(dist / itemH) * ROTATION_PER_ITEM;
      // 중심에서 멀수록 흐리게
      const opacity = Math.max(0.12, 1 - (Math.abs(dist) / (colHeight / 2)) * 0.88);

      item.style.transform = `rotateX(${angle}deg)`;
      item.style.opacity = opacity.toFixed(2);
    });
  }

  function applyAll3D() {
    bodyRef.value?.querySelectorAll('.van-picker-column').forEach(apply3D);
  }

  // 스크롤 애니메이션(관성) 동안 RAF 루프로 매 프레임 업데이트
  function scheduleRaf() {
    animateUntil = Date.now() + props.swipeDuration + 200;
    if (rafId !== null) return; // 이미 실행 중

    const loop = () => {
      applyAll3D();
      if (Date.now() < animateUntil) {
        rafId = requestAnimationFrame(loop);
      } else {
        rafId = null;
      }
    };
    rafId = requestAnimationFrame(loop);
  }

  function setup3D() {
    teardown3D();
    const root = bodyRef.value;
    if (!root) return;

    // 초기 상태 즉시 적용
    applyAll3D();

    // 각 컬럼 wrapper의 style 변경(translateY) 감지 → RAF 루프 재시작
    root.querySelectorAll('.van-picker-column').forEach((col) => {
      const wrapper = col.querySelector<HTMLElement>('.van-picker-column__wrapper');
      if (!wrapper) return;

      const obs = new MutationObserver(scheduleRaf);
      obs.observe(wrapper, { attributes: true, attributeFilter: ['style'] });
      drum3dObservers.push(obs);
    });
  }

  function teardown3D() {
    drum3dObservers.forEach((o) => o.disconnect());
    drum3dObservers = [];
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

  watch(
    () => props.open,
    (isOpen) => {
      if (isOpen) {
        // flush: 'post'로 Vue DOM 반영 후 실행. vant 자체 초기화(컬럼 높이 계산 등)는
        // Vue 렌더링과 별개로 진행되므로 추가 대기가 필요하다.
        // 저사양 기기에서는 50ms 이상 소요될 수 있음.
        setTimeout(setup3D, 50);
      } else {
        teardown3D();
      }
    },
    { flush: 'post' }
  );

  onUnmounted(teardown3D);

  // ── vant Picker 이벤트 핸들러 ─────────────────────
  function handleChange(params: PickerChangeEventParams) {
    pendingValue.value = params.selectedValues.map(String);
    emit('change', params);
  }

  // ── BottomSheet 이벤트 핸들러 ─────────────────────
  function resetPending() {
    pendingValue.value = [...props.modelValue];
  }

  function handleOk() {
    emit('update:modelValue', [...pendingValue.value]);
    emit('confirm', {
      selectedValues: [...pendingValue.value],
      // BottomSheet @ok 시점에서는 vant confirm 파라미터에 접근 불가
      // selectedOptions, selectedIndexes는 항상 빈 배열 반환
      selectedOptions: [],
      selectedIndexes: [],
    });
  }

  function handleCancel() {
    const cancelledValues = [...pendingValue.value];
    resetPending();
    emit('cancel', {
      selectedValues: cancelledValues,
      selectedOptions: [],
      selectedIndexes: [],
    });
  }

  function handleClose() {
    resetPending();
  }
</script>

<style lang="scss" scoped>
  $b: 'pinPicker';

  .#{$b} {
    &__body {
      display: flex;
      width: 100%;

      --van-picker-background: #{$bg-primary};
      --van-picker-option-text-color: #{$text-900};
      --van-picker-option-font-size: #{$font-size-body2};
      --van-picker-loading-icon-color: #{$color-primary};
      --van-picker-loading-mask-color: rgba(255, 255, 255, 0.9);

      :deep(.van-picker) {
        width: 100%;
        overflow: hidden;
      }

      // perspective는 column(뷰포트) 에 적용해야 rotateX 곡면이 올바르게 보임
      :deep(.van-picker-column) {
        perspective: 200px;
        perspective-origin: 50% 50%;
      }

      // 아이템에 3D 변환 가속 및 뒷면 숨김
      :deep(.van-picker-column__item) {
        backface-visibility: hidden;
        will-change: transform, opacity;
        // vant 기본 transition 제거 — JS RAF 루프가 매 프레임 처리
        transition: none !important;
        cursor: grab;

        &:active {
          cursor: grabbing;
        }
      }

      // 선택 강조 띠 — box-shadow 제거, border-top / border-bottom / border-radius만 유지
      :deep(.van-picker__frame) {
        border-top: 1px solid $line-300;
        border-bottom: 1px solid $line-300;
        border-radius: 0.4rem;
        z-index: 2;
      }

      :deep(.van-picker-column__item--selected) {
        font-weight: bold;
      }

      // 마스크는 가볍게만 — 3D opacity가 깊이를 이미 표현하므로
      :deep(.van-picker__mask) {
        background-image: linear-gradient(
          to bottom,
          rgba($bg-primary, 0.6) 0%,
          rgba($bg-primary, 0) 40%,
          rgba($bg-primary, 0) 60%,
          rgba($bg-primary, 0.6) 100%
        );
        z-index: 3;
      }
    }
  }
</style>
