<template>
  <TabsRoot
    v-bind="$attrs"
    :model-value="modelValue"
    class="tab"
    :class="`tab--${variant}`"
    @update:model-value="emit('update:modelValue', $event as string)"
  >
    <div class="tab__header">
      <!-- 탭 목록 -->
      <TabsList class="tab__list">
        <TabsTrigger
          v-for="item in items"
          :key="item.value"
          class="tab__trigger"
          :value="item.value"
        >
          <span class="tab__label">{{ item.label }}</span>
          <span v-if="item.badge" class="tab__badge">{{ item.badge }}</span>
        </TabsTrigger>
      </TabsList>

      <!-- 뷰 토글 (pill + showViewToggle=true 전용) -->
      <div
        v-if="showViewToggle && variant === 'pill'"
        class="tab__viewToggle"
      >
        <!-- viewType='grid'면 → list 버튼 표시 -->
        <button
          v-if="viewType === 'grid'"
          type="button"
          class="tab__viewBtn"
          aria-label="목록 보기"
          @click="emit('update:viewType', 'list')"
        >
          <!-- 목록 아이콘 -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M19 7L10.5 7"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
            <path
              d="M7.5 7L5 7"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
            <path
              d="M19 12L10.5 12"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
            <path
              d="M7.5 12L5 12"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
            <path
              d="M19 17L10.5 17"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
            <path
              d="M7.5 17L5 17"
              stroke="currentColor"
              stroke-width="1.6"
              stroke-linecap="round"
            />
          </svg>
        </button>
        <!-- viewType='list'면 → grid 버튼 표시 -->
        <button
          v-else
          type="button"
          class="tab__viewBtn"
          aria-label="격자 보기"
          @click="emit('update:viewType', 'grid')"
        >
          <!-- 격자 아이콘 -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="5.2"
              y="5.2"
              width="5.45019"
              height="5.56501"
              rx="1.3"
              stroke="currentColor"
              stroke-width="1.4"
            />
            <rect
              x="13.3499"
              y="5.2"
              width="5.45019"
              height="5.56501"
              rx="1.3"
              stroke="currentColor"
              stroke-width="1.4"
            />
            <rect
              x="13.3499"
              y="13.2366"
              width="5.45019"
              height="5.56501"
              rx="1.3"
              stroke="currentColor"
              stroke-width="1.4"
            />
            <rect
              x="5.2"
              y="13.2367"
              width="5.45019"
              height="5.56501"
              rx="1.3"
              stroke="currentColor"
              stroke-width="1.4"
            />
          </svg>
        </button>
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

export type TabVariant = "underline-dark" | "underline-primary" | "pill";
export type ViewType = "grid" | "list";

const props = withDefaults(
  defineProps<{
    variant?: TabVariant;
    items: TabItem[];
    modelValue?: string;
    showViewToggle?: boolean;
    viewType?: ViewType;
  }>(),
  {
    variant: "underline-primary",
    modelValue: undefined,
    showViewToggle: false,
    viewType: "grid",
  },
);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  "update:viewType": [viewType: ViewType];
}>();

// modelValue 기본값: 외부에서 전달되지 않으면 첫 번째 탭의 value
const modelValue = computed(
  () => props.modelValue ?? props.items[0]?.value ?? "",
);
</script>

<style lang="scss" scoped>
$b: 'tab';

// ── 공통 ────────────────────────────────────────────────────────────────────

.#{$b} {
  display: flex;
  width: 100%;
  flex-direction: column;
}

.#{$b}__header {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;
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

// 뷰 토글 — flex flow (스크롤 영역 밖, flex-shrink: 0)
.#{$b}__viewToggle {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: $spacing-xs;

  &::before {
    content: "";
    position: absolute;
    right: 4.4rem;
    top: -1.5rem;
    bottom: 0;
    width: 4rem;
    height: calc(100% + 2rem);
    background: linear-gradient(to right, transparent, #ffffff);
    pointer-events: none;
  }
}

.#{$b}__viewBtn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  color: $text-900; // 아이콘 색상

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px $color-primary;
    border-radius: $radius-sm;
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

.#{$b}--underline-dark .#{$b}__trigger[data-state="active"] {
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

.#{$b}--underline-primary .#{$b}__trigger[data-state="active"] {
  color: $text-800;
  font-weight: $font-weight-bold;
  border-bottom-color: $color-primary;
}

// ── pill ────────────────────────────────────────────────────────────────────

.#{$b}--pill {
  .#{$b}__header {
    padding: 0 $spacing-md;
    height: 3.6rem;
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

.#{$b}--pill .#{$b}__trigger[data-state="active"] {
  padding: 0.8rem 1.5rem; // active 상하 패딩 0.8rem (inactive 0.9rem)
  color: $text-white;
  font-weight: $font-weight-medium;
  background-color: $color-primary-hover; // #00addb — primary-hover (primary 아님)
}
</style>
