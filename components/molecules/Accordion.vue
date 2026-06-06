<template>
  <AccordionRoot
    v-bind="rootAttrs"
    @update:modelValue="
      emit('update:modelValue', $event);
      emit('update:value', $event);
    "
  >
    <slot />
  </AccordionRoot>
</template>

<script lang="ts">
import { h } from "vue";
import type { SetupContext } from "vue";
import {
  AccordionItem as RadixAccordionItem,
  AccordionTrigger as RadixAccordionTrigger,
  AccordionContent as RadixAccordionContent,
} from "radix-vue";
import Icon from "@nd/components/icons/Icon.vue";
import SmallChevronDownSvg from "@nd/assets/icons/smallChevronDown.svg?skipsvgo";

// ── AccordionItem — plain object 컴포넌트 (Collapsible 패턴 동일)
// value 필수 / disabled 선택 prop을 setup 첫 파라미터로 수신
// 주의: 부모 SFC scoped 해시가 내부 DOM에 미전달 → :deep() 선택자 유지 필요
export const AccordionItem = {
  props: {
    value: { type: String, required: true },
    disabled: { type: Boolean, default: false },
  },
  setup(
    props: { value: string; disabled?: boolean },
    { slots, attrs }: SetupContext,
  ) {
    return () =>
      h(
        RadixAccordionItem,
        { value: props.value, disabled: props.disabled, ...attrs },
        { default: () => slots.default?.() },
      );
  },
};

// ── AccordionTrigger — plain object 컴포넌트
// headTrigger: false(기본) → 우측 아이콘 버튼 패턴 (accordion__trigger--icon 클래스, 슬롯 비면 기본 아이콘 폴백, 회전 애니메이션)
// headTrigger: true → 헤드 전체 트리거 패턴 (accordion__trigger--head 클래스, 슬롯 콘텐츠 그대로, 회전 없음)
export const AccordionTrigger = {
  props: {
    headTrigger: { type: Boolean, default: false },
  },
  setup(props: { headTrigger?: boolean }, { slots, attrs }: SetupContext) {
    return () => {
      const hasSlot = !!slots.default?.().length;
      const defaultContent = props.headTrigger
        ? slots.default?.()
        : hasSlot
          ? slots.default?.()
          : h(
              Icon,
              { size: "sm" },
              {
                default: () =>
                  h(SmallChevronDownSvg, { "aria-hidden": "true" }),
              },
            );

      return h(
        RadixAccordionTrigger,
        {
          ...attrs,
          class: props.headTrigger
            ? "accordion__trigger--head"
            : "accordion__trigger--icon",
        },
        { default: () => defaultContent },
      );
    };
  },
};

// ── AccordionContent — plain object 컴포넌트
// contentAnimation prop으로 슬라이드 애니메이션 on/off
export const AccordionContent = {
  props: {
    contentAnimation: { type: Boolean, default: true },
  },
  setup(props: { contentAnimation?: boolean }, { slots }: SetupContext) {
    return () =>
      h(
        RadixAccordionContent,
        {
          class: props.contentAnimation
            ? "accordion__content--animated"
            : undefined,
        },
        { default: () => slots.default?.() },
      );
  },
};
</script>

<script setup lang="ts">
import { AccordionRoot } from "radix-vue";

defineOptions({ inheritAttrs: false });

// Radix Vue AccordionRoot의 update:modelValue는 type='single' 미선택 시 undefined를 emit하므로
// 페이로드 타입에 undefined를 포함한다(미포함 시 TS2769 오버로드 불일치).
const emit = defineEmits<{
  "update:modelValue": [value: string | string[] | undefined];
  "update:value": [value: string | string[] | undefined];
}>();

// ── Radix Vue attrs 위임 전략
// 1단계: AccordionRoot 전용 props + Root 이벤트 → rootAttrs
// 2단계: 나머지 attrs(aria-*, tabindex, data-* 등) → AccordionTrigger가 자체 $attrs로 직접 수신
// Vue 3 useAttrs()가 kebab-case를 정규화하지 않으므로 camelCase·kebab-case 모두 포함
const ACCORDION_ROOT_PROPS = [
  "type",
  "value",
  "modelValue",
  "defaultValue",
  "default-value",
  "collapsible",
  "disabled",
  "dir",
  "orientation",
] as const;

const ROOT_EVENT_PROPS = ["onUpdate:modelValue", "onUpdate:value"] as const;

const attrs = useAttrs();

const rootAttrs = computed(() => {
  const filtered = Object.fromEntries(
    Object.entries(attrs).filter(
      ([k]) =>
        (ACCORDION_ROOT_PROPS as readonly string[]).includes(k) ||
        (ROOT_EVENT_PROPS as readonly string[]).includes(k),
    ),
  );
  // v-model:value 대응: AccordionRoot는 modelValue를 사용하므로 value를 리맵
  if ("value" in filtered && !("modelValue" in filtered)) {
    filtered.modelValue = filtered.value;
    delete filtered.value;
  }
  return filtered;
});
</script>

<style lang="scss" scoped>
$b: "accordion";

// AccordionContent 슬라이드 애니메이션 (contentAnimation=true 시 부여되는 클래스)
// plain object 컴포넌트이므로 부모 SFC의 scoped 해시(data-v-xxx)가 내부 DOM에 미전달
// :deep()으로 shadow DOM 경계를 넘어 선택자를 적용한다
:deep(.#{$b}__content--animated) {
  overflow: hidden;
}

:deep(.#{$b}__content--animated[data-state="open"]) {
  animation: accordionSlideDown $duration-fast ease;
}

:deep(.#{$b}__content--animated[data-state="closed"]) {
  animation: accordionSlideUp $duration-fast ease;
}

@keyframes accordionSlideDown {
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
}

@keyframes accordionSlideUp {
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
}

// AccordionTrigger 아이콘 회전 애니메이션 (headTrigger=false 시 부여되는 accordion__trigger--icon 클래스)
// plain object 컴포넌트이므로 동일하게 :deep() 필요
// accordion__trigger--head 클래스(headTrigger=true)는 회전 애니메이션 없음
:deep(.#{$b}__trigger--icon[data-state="closed"]) > * {
  transform: rotate(0deg);
  transition: transform $duration-fast ease;
}

:deep(.#{$b}__trigger--icon[data-state="open"]) > * {
  transform: rotate(180deg);
  transition: transform $duration-fast ease;
}
</style>
