<template>
  <component :is="tag" class="buttonLink" :class="rootClass" v-bind="linkAttrs">
    <span
      v-if="$slots['leading-icon']"
      class="buttonLink__icon buttonLink__icon--leading"
    >
      <slot name="leading-icon" />
    </span>
    <span class="buttonLink__label"><slot /></span>
    <span
      v-if="$slots['trailing-icon']"
      class="buttonLink__icon buttonLink__icon--trailing"
    >
      <slot name="trailing-icon" />
    </span>
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs, resolveComponent } from "vue";
import type { ButtonShape, ButtonColor, ButtonSize } from "@nd/components/types";
import { useButtonVariant } from "./useButtonVariant";

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    shape?: ButtonShape;
    color?: ButtonColor;
    size?: ButtonSize;
    round?: boolean;
    disabled?: boolean;
    to?: string | object;
    href?: string;
    target?: "_self" | "_blank" | "_parent" | "_top";
    rel?: string;
  }>(),
  {
    shape: "solid",
    color: "primary",
    size: "md",
    round: false,
    disabled: false,
    target: "_self",
  },
);

const attrs = useAttrs();

const rootClass = useButtonVariant("buttonLink", props);

// target="_blank" 시 rel에 noopener noreferrer 자동 추가
const computedRel = computed(() => {
  if (props.target === "_blank") {
    const parts = (props.rel ?? "").split(" ").filter(Boolean);
    if (!parts.includes("noopener")) parts.push("noopener");
    if (!parts.includes("noreferrer")) parts.push("noreferrer");
    return parts.join(" ");
  }
  return props.rel || undefined;
});

// disabled 시 NuxtLink는 사용하지 않음 (탐색 방지)
const tag = computed(() =>
  props.to && !props.disabled ? resolveComponent("NuxtLink") : "a",
);

const linkAttrs = computed(() => {
  if (props.disabled) {
    return {
      ...attrs,
      "aria-disabled": "true",
      tabindex: "-1",
    };
  }

  const result: Record<string, unknown> = { ...attrs };

  if (props.to) {
    result.to = props.to;
  } else if (props.href) {
    result.href = props.href;
  }

  if (props.target !== "_self") result.target = props.target;
  if (computedRel.value) result.rel = computedRel.value;

  return result;
});
</script>

<style lang="scss" scoped>
@use "@nd/assets/scss/components/button-base" as *;
@include button-base("buttonLink");

$b: "buttonLink";

// <a> 태그는 네이티브 disabled 속성이 없으므로 pointer-events: none 으로 클릭 차단
.#{$b}.#{$b}--disabled {
  pointer-events: none;
}
</style>
