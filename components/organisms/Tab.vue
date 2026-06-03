<template>
  <TabsRoot
    v-bind="$attrs"
    :model-value="modelValue"
    :orientation="orientation"
    class="tab"
    :class="[`tab--${variant}`, { 'tab--grow': effectiveGrow }]"
    @update:model-value="emit('update:modelValue', $event as string)"
  >
    <div class="tab__header">
      <!-- 탭 목록 -->
      <TabsList class="tab__list">
        <TabsTrigger v-for="item in items" :key="item.value" class="tab__trigger" :value="item.value">
          <span class="tab__label">{{ item.label }}</span>
          <span v-if="item.badge" class="tab__badge">{{ item.badge }}</span>
        </TabsTrigger>
      </TabsList>

      <!-- actions 슬롯 (스크롤 영역 밖 고정 배치 — pill-vertical에서는 미렌더링) -->
      <div v-if="$slots.actions && variant !== 'pill-vertical'" class="tab__actions">
        <slot name="actions" />
      </div>
    </div>
  </TabsRoot>
</template>

<script setup lang="ts">
  defineOptions({ inheritAttrs: false });

  export interface TabItem {
    value: string;
    label: string;
    badge?: string;
  }

  export type TabVariant = 'underline-dark' | 'underline-primary' | 'pill' | 'pill-vertical';

  const props = withDefaults(
    defineProps<{
      variant?: TabVariant;
      items: TabItem[];
      modelValue?: string;
      grow?: boolean;
    }>(),
    {
      variant: 'underline-primary',
      modelValue: undefined,
      grow: false,
    }
  );

  const emit = defineEmits<{
    'update:modelValue': [value: string];
  }>();

  // modelValue 기본값: 외부에서 전달되지 않으면 첫 번째 탭의 value
  const modelValue = computed(() => props.modelValue ?? props.items[0]?.value ?? '');

  // pill-vertical이면 Radix TabsRoot에 orientation="vertical" 자동 주입
  const orientation = computed(() => (props.variant === 'pill-vertical' ? 'vertical' : 'horizontal'));

  // pill-vertical에서 grow 무효 처리
  const effectiveGrow = computed(() => props.grow && props.variant === 'underline-dark');
</script>

<style lang="scss" scoped>
  $b: 'tab';

  // ── 공통 ────────────────────────────────────────────────────────────────────

  .#{$b} {
    display: flex;
    width: 100%;
    flex-direction: column;
    background: $bg-primary;
  }

  .#{$b}__header {
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    overflow: hidden;
  }

  .#{$b}__list {
    display: flex;
    flex: 1;
    min-width: 0; // flex 자식에서 overflow 허용
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;

    @media (hover: none) {
      // 모바일(터치): 스크롤바 숨김
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  .#{$b}__trigger {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    cursor: pointer;
    outline: none;
    background: transparent;
    border: none;

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px $color-primary;
      border-radius: $radius-sm;
    }
  }

  .#{$b}__label {
    display: inline-block;
  }

  .#{$b}__badge {
    display: inline-block;
  }

  // actions 슬롯 래퍼 (스크롤 영역 밖, flex-shrink: 0)
  .#{$b}__actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      right: 100%;
      top: -2rem;
      width: 4rem;
      height: calc(100% + 3rem);
      background: linear-gradient(to right, transparent 0%, #ffffff 80%);
      pointer-events: none;
    }
  }

  // ── underline-dark ──────────────────────────────────────────────────────────

  .#{$b}--underline-dark {
    .#{$b}__header {
      border-bottom: 1px solid $line-200;
    }

    .#{$b}__trigger {
      padding: 1.5rem 1.1rem;
      height: 5.2rem;
      font-size: $font-size-body2;
      font-weight: $font-weight-medium;
      color: $text-400;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px; // header border-bottom 위에 인디케이터가 겹치도록

      &:hover {
        color: $text-800;
      }
    }
  }

  .#{$b}--underline-dark .#{$b}__trigger[data-state='active'] {
    color: $text-800;
    border-bottom-color: $text-800;
  }

  // ── underline-primary ───────────────────────────────────────────────────────

  .#{$b}--underline-primary {
    .#{$b}__header {
      padding: 0 $spacing-md;
      border-bottom: 1px solid $line-200;
    }

    .#{$b}__list {
      gap: 2.6rem;
    }

    .#{$b}__trigger {
      padding: 1.6rem 0 1.7rem;
      height: 4.8rem;
      font-size: $font-size-body4;
      font-weight: $font-weight-regular;
      color: $text-700;
      border-bottom: 2px solid transparent;
      margin-bottom: -1px; // header border-bottom 위에 인디케이터가 겹치도록

      &:hover {
        color: $text-800;
      }
    }
  }

  .#{$b}--underline-primary .#{$b}__trigger[data-state='active'] {
    color: $text-800;
    font-weight: $font-weight-bold;
    border-bottom-color: $color-primary;
  }

  // ── pill ────────────────────────────────────────────────────────────────────

  .#{$b}--pill {
    .#{$b}__header {
      padding: 0 $spacing-md;
      // height: 3.6rem;
      gap: $spacing-sm;
    }

    .#{$b}__list {
      gap: $spacing-sm;
      align-items: center;
    }

    .#{$b}__trigger {
      padding: 0.9rem 1.5rem;
      height: 3.6rem;
      font-size: $font-size-body4;
      font-weight: $font-weight-regular;
      color: $text-700;
      background-color: $bg-tertiary;
      border-radius: $radius-full;

      &:hover {
        color: $text-800;
      }
    }
  }

  .#{$b}--pill .#{$b}__trigger[data-state='active'] {
    padding: 0.8rem 1.5rem; // active 상하 패딩 0.8rem (inactive 0.9rem)
    color: $text-white;
    font-weight: $font-weight-medium;
    background-color: $color-primary-hover; // #00addb — primary-hover (primary 아님)
  }

  // ── grow ────────────────────────────────────────────────────────────────────

  .#{$b}--grow .#{$b}__list {
    overflow-x: hidden;
  }

  .#{$b}--grow .#{$b}__trigger {
    flex: 1;
    flex-shrink: 1; // grow 모드에서 flex-shrink: 0 재정의
    justify-content: center;
  }

  // ── pill-vertical ────────────────────────────────────────────────────────────

  .#{$b}--pill-vertical {
    .#{$b}__header {
      padding: 0; // 외부 컨테이너가 여백 담당
    }

    .#{$b}__list {
      flex-direction: column;
      align-items: flex-start;
      overflow-x: visible;
      gap: $spacing-sm;
    }

    .#{$b}__trigger {
      width: auto;
      min-height: 4rem;
      flex-shrink: 0;
      padding: 0 1.4rem;
      font-size: $font-size-body4;
      font-weight: $font-weight-medium;
      color: $text-800;
      background-color: $bg-primary;
      border: 1px solid $line-200;
      border-radius: $radius-full;
    }
  }

  .#{$b}--pill-vertical .#{$b}__trigger[data-state='active'] {
    color: $text-white;
    font-weight: $font-weight-bold;
    background-color: $color-primary-hover;
    border-color: transparent;
  }
</style>
