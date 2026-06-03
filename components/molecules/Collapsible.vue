<template>
  <CollapsibleRoot v-bind="rootAttrs" @update:open="emit('update:open', $event)">
    <slot :Trigger="TriggerComponent" :Content="ContentComponent" />
  </CollapsibleRoot>
</template>

<script setup lang="ts">
  import { h } from 'vue'
  import { CollapsibleTrigger, CollapsibleContent } from 'radix-vue'
  import Icon from '@nd/components/icons/Icon.vue'
  import CircularArrowSvg from '@nd/assets/icons/circularArrow.svg?skipsvgo'

  defineOptions({ inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      contentAnimation?: boolean
      triggerAnimation?: boolean
    }>(),
    {
      contentAnimation: true,
      triggerAnimation: true,
    }
  )

  const emit = defineEmits<{
    'update:open': [value: boolean]
  }>()

  // ── Radix Vue attrs 위임 전략
  // 1단계: CollapsibleRoot 전용 props + Root 이벤트 → rootAttrs
  // 2단계: 나머지 전부 → CollapsibleTrigger (aria-*, tabindex, data-*, @click 등)
  // Vue 3 useAttrs()가 kebab-case를 정규화하지 않으므로 camelCase·kebab-case 모두 포함
  const COLLAPSIBLE_ROOT_PROPS = ['open', 'defaultOpen', 'default-open', 'disabled'] as const
  const ROOT_EVENT_PROPS = ['onUpdate:open'] as const

  const attrs = useAttrs()

  const rootAttrs = computed(() =>
    Object.fromEntries(
      Object.entries(attrs).filter(
        ([k]) =>
          (COLLAPSIBLE_ROOT_PROPS as readonly string[]).includes(k) ||
          (ROOT_EVENT_PROPS as readonly string[]).includes(k)
      )
    )
  )

  const triggerAttrs = computed(() =>
    Object.fromEntries(
      Object.entries(attrs).filter(
        ([k]) =>
          !(COLLAPSIBLE_ROOT_PROPS as readonly string[]).includes(k) &&
          !(ROOT_EVENT_PROPS as readonly string[]).includes(k) &&
          k !== 'id'
      )
    )
  )

  // TriggerComponent: CollapsibleTrigger 래핑 — scoped slot으로 사용처에 전달
  // #trigger 슬롯이 비면 기본 아이콘(<Icon size="sm"><CircularArrowSvg /></Icon>) 자동 렌더
  // plain 함수형 컴포넌트 객체: defineComponent 불필요 (렌더 함수만 존재)
  // 주의: 부모 SFC scoped 해시가 내부 DOM에 미전달 → :deep() 선택자 유지 필요
  const TriggerComponent = {
    setup(_: unknown, { slots }: { slots: Record<string, (() => unknown) | undefined> }) {
      return () =>
        h(
          CollapsibleTrigger,
          {
            ...triggerAttrs.value,
            type: 'button',
            class: props.triggerAnimation ? 'collapsible__trigger--animated' : undefined,
          },
          {
            default: () =>
              (slots.default?.() as unknown[]) ?? [
                h(Icon, { size: 'sm' }, { default: () => h(CircularArrowSvg, { 'aria-hidden': 'true' }) }),
              ],
          }
        )
    },
  }

  // ContentComponent: CollapsibleContent 래핑 — scoped slot으로 사용처에 전달
  const ContentComponent = {
    setup(_: unknown, { slots }: { slots: Record<string, (() => unknown) | undefined> }) {
      return () =>
        h(
          CollapsibleContent,
          { class: props.contentAnimation ? 'collapsible__content--animated' : undefined },
          { default: () => slots.default?.() }
        )
    },
  }
</script>

<style lang="scss" scoped>
  $b: 'collapsible';

  // content 슬라이드 애니메이션 (contentAnimation=true 시 부여되는 클래스)
  // ContentComponent가 defineComponent로 분리된 별도 컴포넌트이므로
  // 부모 SFC의 scoped 해시(data-v-xxx)가 그 내부 DOM에 전달되지 않는다.
  // :deep()으로 shadow DOM 경계를 넘어 선택자를 적용한다.
  :deep(.#{$b}__content--animated) {
    overflow: hidden;
  }

  :deep(.#{$b}__content--animated[data-state='open']) {
    animation: collapsibleSlideDown $duration-fast ease;
  }

  :deep(.#{$b}__content--animated[data-state='closed']) {
    animation: collapsibleSlideUp $duration-fast ease;
  }

  @keyframes collapsibleSlideDown {
    from {
      height: 0;
    }
    to {
      height: var(--radix-collapsible-content-height);
    }
  }

  @keyframes collapsibleSlideUp {
    from {
      height: var(--radix-collapsible-content-height);
    }
    to {
      height: 0;
    }
  }

  // trigger 아이콘 회전 애니메이션 (triggerAnimation=true 시 부여되는 클래스)
  // TriggerComponent도 동일하게 별도 컴포넌트이므로 :deep() 필요
  :deep(.#{$b}__trigger--animated[data-state='closed']) > * {
    transform: rotate(180deg);
    transition: transform $duration-fast ease;
  }

  :deep(.#{$b}__trigger--animated[data-state='open']) > * {
    transform: rotate(0deg);
    transition: transform $duration-fast ease;
  }
</style>
