<template>
  <div v-bind="$attrs" class="paginationSimple" :class="{ 'paginationSimple--disabled': disabled }">
    <button
      type="button"
      class="paginationSimple__btn paginationSimple__prev"
      aria-label="이전 페이지"
      :disabled="isFirstPage || disabled"
      @click="handlePrev"
    >
      <Icon :size="16" aria-hidden="true">
        <ChevronLeftSvg />
      </Icon>
    </button>

    <span class="paginationSimple__text" aria-live="polite" aria-atomic="true">
      <strong class="paginationSimple__current">{{ page }}</strong>
      <span class="paginationSimple__divider" aria-hidden="true">&nbsp;/&nbsp;</span>
      <span class="paginationSimple__total">{{ totalPages }}</span>
    </span>

    <button
      type="button"
      class="paginationSimple__btn paginationSimple__next"
      aria-label="다음 페이지"
      :disabled="isLastPage || disabled"
      @click="handleNext"
    >
      <Icon :size="16" aria-hidden="true">
        <ChevronRightSvg />
      </Icon>
    </button>
  </div>
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
      totalPages?: number
      // [퍼블리셔] UI 제어용
      disabled?: boolean
    }>(),
    {
      page: 1,
      totalPages: 1,
      disabled: false,
    }
  )

  const emit = defineEmits<{
    // [연동] 개발자가 이 이벤트를 수신해 API 호출
    'update:page': [value: number]
  }>()

  const isFirstPage = computed(() => props.page <= 1)
  const isLastPage = computed(() => props.page >= props.totalPages)

  function handlePrev(): void {
    if (isFirstPage.value || props.disabled) return
    emit('update:page', props.page - 1)
  }

  function handleNext(): void {
    if (isLastPage.value || props.disabled) return
    emit('update:page', props.page + 1)
  }
</script>

<style lang="scss" scoped>
  $b: 'paginationSimple';

  .#{$b} {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    width: 100%;
  }

  .#{$b}__btn {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 3rem;
    height: 3rem;
    background-color: transparent;
    border: 1px solid $line-200;
    border-radius: 0.8rem;
    cursor: pointer;
    color: $text-500;
    transition: opacity $duration-fast ease;

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px $color-primary;
      border-radius: $radius-sm;
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  .#{$b}__text {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 5.6rem;
    color: $text-600;
  }

  .#{$b}__current {
    font-size: $font-size-body2;
    font-weight: $font-weight-bold;
    color: $text-600;
  }

  .#{$b}__divider {
    font-size: $font-size-body2;
    font-weight: $font-weight-regular;
    color: $text-600;
  }

  .#{$b}__total {
    font-size: $font-size-body2;
    font-weight: $font-weight-regular;
    color: $text-600;
  }

  .#{$b}--disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
