<template>
  <PaginationRoot
    v-bind="rootAttrs"
    v-model:page="proxyPage"
    :total="total"
    :items-per-page="itemsPerPage"
    :sibling-count="siblingCount"
    :disabled="disabled"
    as="nav"
    :aria-label="'페이지 네비게이션'"
  >
    <PaginationList v-slot="{ items }">
      <ul class="pagination__list">
        <li class="pagination__item pagination__item--prev">
          <PaginationPrev as-child>
            <button
              type="button"
              class="pagination__btn pagination__btn--nav"
              aria-label="이전 페이지"
            >
              <Icon :size="16" aria-hidden="true">
                <ChevronLeftSvg />
              </Icon>
            </button>
          </PaginationPrev>
        </li>

        <template v-for="(item, index) in items" :key="item.type === 'page' ? item.value : `ellipsis-${index}`">
          <li v-if="item.type === 'page'" class="pagination__item">
            <PaginationListItem :value="item.value" as-child>
              <button
                type="button"
                class="pagination__btn pagination__btn--page"
                :class="{ 'pagination__btn--active': item.value === page }"
                :aria-current="item.value === page ? 'page' : undefined"
              >
                {{ item.value }}
              </button>
            </PaginationListItem>
          </li>

          <li v-else class="pagination__item pagination__item--ellipsis">
            <PaginationEllipsis as-child>
              <span class="pagination__ellipsis" aria-hidden="true">&#8230;</span>
            </PaginationEllipsis>
          </li>
        </template>

        <li class="pagination__item pagination__item--next">
          <PaginationNext as-child>
            <button
              type="button"
              class="pagination__btn pagination__btn--nav"
              aria-label="다음 페이지"
            >
              <Icon :size="16" aria-hidden="true">
                <ChevronRightSvg />
              </Icon>
            </button>
          </PaginationNext>
        </li>
      </ul>
    </PaginationList>
  </PaginationRoot>
</template>

<script setup lang="ts">
import Icon from '@nd/components/icons/Icon.vue'
import ChevronLeftSvg from '@nd/assets/icons/chevronLeft.svg?component'
import ChevronRightSvg from '@nd/assets/icons/chevronRight.svg?component'

defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    // [연동] 개발자가 API 응답으로 채울 항목
    page?: number
    total?: number
    itemsPerPage?: number
    // [퍼블리셔] UI 제어용
    siblingCount?: number
    disabled?: boolean
  }>(),
  {
    page: 1,
    total: 0,
    itemsPerPage: 10,
    siblingCount: 2,
    disabled: false,
  },
)

const emit = defineEmits<{
  // [연동] 개발자가 이 이벤트를 수신해 API 호출
  'update:page': [value: number]
}>()

// PaginationRoot 전용 props — useAttrs()로 분리 후 rootAttrs에 전달
// page, total, itemsPerPage, siblingCount, disabled는 명시적 prop으로 처리하므로
// 나머지 attrs(aria-*, data-* 등)만 PaginationRoot에 전달
const PAGINATION_ROOT_DENY_LIST = [
  'defaultPage',
  'default-page',
  'showEdges',
  'show-edges',
] as const

const attrs = useAttrs()

const rootAttrs = computed(() =>
  Object.fromEntries(
    Object.entries(attrs).filter(([k]) =>
      !(PAGINATION_ROOT_DENY_LIST as readonly string[]).includes(k),
    ),
  ),
)

const proxyPage = computed({
  get: () => props.page,
  set: (val: number) => emit('update:page', val),
})
</script>

<style lang="scss" scoped>
$b: 'pagination';

.#{$b} {
  display: flex;
  width: 100%;
  justify-content: center;
}

.#{$b}__list {
  display: flex;
  align-items: center;
  gap: 0;
  list-style: none;
  padding: 0;
  margin: 0;
}

.#{$b}__item {
  display: flex;
  align-items: center;
}

.#{$b}__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.0rem;
  height: 3.0rem;
  background-color: transparent;
  border: none;
  border-radius: $radius-md;
  cursor: pointer;
  color: $text-900;
  font-size: $font-size-body1;
  font-weight: $font-weight-regular;
  transition: background-color $duration-fast ease;

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px $color-primary;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.3;
    pointer-events: none;
  }
}

.#{$b}__btn--nav {
  color: $text-900;

  &:hover:not(:disabled) {
    background-color: $bg-secondary;
  }
}

.#{$b}__btn--page {
  &:hover:not(:disabled):not(.#{$b}__btn--active) {
    background-color: $bg-secondary;
  }
}

.#{$b}__btn--active {
  background-color: $bg-accent-light-blue;
  color: $color-primary-hover;
  font-weight: $font-weight-bold;
  cursor: default;
}

.#{$b}__ellipsis {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.0rem;
  height: 3.0rem;
  color: $text-900;
  font-size: $font-size-body1;
}

.#{$b}--disabled {
  opacity: 0.4;
  pointer-events: none;
}
</style>
