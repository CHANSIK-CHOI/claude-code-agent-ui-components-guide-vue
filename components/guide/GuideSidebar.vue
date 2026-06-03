<template>
  <aside class="guideSidebar" v-bind="$attrs">
    <nav class="guideSidebar__nav" aria-label="가이드 네비게이션">
      <div
        v-for="group in navigation"
        :key="group.label"
        class="guideSidebar__group"
      >
        <p class="guideSidebar__groupTitle">{{ group.label }}</p>
        <ul class="guideSidebar__list">
          <li
            v-for="item in group.items"
            :key="item.to"
            class="guideSidebar__item"
          >
            <NuxtLink
              :to="item.to"
              class="guideSidebar__link"
              active-class="guideSidebar__link--active"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false });

interface GuideNavItem {
  label: string;
  to: string;
}

interface GuideNavGroup {
  label: string;
  items: GuideNavItem[];
}

const navigation: GuideNavGroup[] = [
  {
    label: "OVERVIEW",
    items: [{ label: "Home", to: "/guide" }],
  },
  {
    label: "ATOMS",
    items: [
      { label: "Button", to: "/guide/button" },
      { label: "ButtonLink", to: "/guide/button-link" },
      { label: "Input", to: "/guide/input" },
      { label: "InputAuth", to: "/guide/input-auth" },
      { label: "InputPassword", to: "/guide/inputPassword" },
      { label: "Select", to: "/guide/select" },
      { label: "TextArea", to: "/guide/textarea" },
      { label: "Stepper", to: "/guide/stepper" },
      { label: "Checkbox", to: "/guide/checkbox" },
      { label: "Switch", to: "/guide/switch" },
      { label: "Popover", to: "/guide/popover" },
      { label: "Tooltip", to: "/guide/tooltip" },
      { label: "Progress", to: "/guide/progress" },
      { label: "RadioGroup", to: "/guide/radioGroup" },
    ],
  },
  {
    label: "MOLECULES",
    items: [
      { label: "FormField", to: "/guide/form-field" },
      { label: "ButtonGroup", to: "/guide/buttonGroup" },
      { label: "Accordion", to: "/guide/accordion" },
      { label: "Collapsible", to: "/guide/collapsible" },
      // { label: "Pagination", to: "/guide/pagination" },
      // { label: "PaginationSimple", to: "/guide/pagination-simple" },
      // { label: "OptionButtonGroup", to: "/guide/optionButtonGroup" },
      // { label: "TermsAgreement", to: "/guide/termsAgreement" },
      // TODO: swiper v12 호환 작업 완료 후 복구 — Marquee 동작 불안정으로 임시 숨김 (2026-06-03)
      // { label: "Marquee", to: "/guide/marquee" },
    ],
  },
  // {
  //   label: "ICONS",
  //   items: [{ label: "Icon", to: "/guide/icon" }],
  // },
  {
    label: "ORGANISMS",
    items: [{ label: "Tab", to: "/guide/tab" }],
  },
  {
    label: "POPUP",
    items: [
      { label: "Alert", to: "/guide/alert" },
      { label: "Confirm", to: "/guide/confirm" },
      { label: "LayerPopup", to: "/guide/layerPopup" },
      { label: "BottomSheet", to: "/guide/bottomSheet" },
      { label: "FullPopup", to: "/guide/fullPopup" },
      { label: "ToastPopup", to: "/guide/toastPopup" },
      { label: "PinDatePicker", to: "/guide/pinDatePicker" },
      { label: "PinPicker", to: "/guide/pinPicker" },
    ],
  },
  {
    label: "GLOBALS",
    items: [
      { label: "Table", to: "/guide/table" },
      { label: "Skeleton", to: "/guide/skeleton" },
    ],
  },
  {
    label: "POLICY",
    items: [{ label: "외부 라이브러리 정책", to: "/guide/libraries" }],
  },
];
</script>

<style lang="scss" scoped>
$b: "guideSidebar";

.#{$b} {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: $spacing-lg;
  background-color: $bg-secondary;
  border-right: 1px solid $line-200;

  &__nav {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }

  &__group {
    display: flex;
    flex-direction: column;
    gap: $spacing-xs;
  }

  &__groupTitle {
    margin: 0 0 $spacing-xs $spacing-md;
    font-size: $font-size-caption1;
    font-weight: $font-weight-bold;
    color: $text-400;
    letter-spacing: 0.05em;
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  &__item {
    list-style: none;
  }

  &__link {
    display: flex;
    align-items: center;
    padding: $spacing-sm $spacing-md;
    border-radius: $radius-sm;
    font-size: $font-size-body3;
    font-weight: $font-weight-regular;
    color: $text-900;
    text-decoration: none;
    transition:
      background-color $duration-fast ease,
      color $duration-fast ease;

    &:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px $color-primary;
    }
  }
}

.#{$b}__link:hover:not(.#{$b}__link--active) {
  background-color: $bg-tertiary;
}

.#{$b}__link--active {
  background-color: $bg-accent-light-blue;
  color: $color-primary;
  font-weight: $font-weight-bold;
}
</style>
