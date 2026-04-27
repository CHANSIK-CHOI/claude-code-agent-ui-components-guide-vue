<template>
  <aside class="GuideSidebar" v-bind="$attrs">
    <nav class="GuideSidebar__nav" aria-label="가이드 네비게이션">
      <div
        v-for="group in navigation"
        :key="group.label"
        class="GuideSidebar__group"
      >
        <p class="GuideSidebar__groupTitle">{{ group.label }}</p>
        <ul class="GuideSidebar__list">
          <li
            v-for="item in group.items"
            :key="item.to"
            class="GuideSidebar__item"
          >
            <NuxtLink
              :to="item.to"
              class="GuideSidebar__link"
              active-class="GuideSidebar__link--active"
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
defineOptions({ inheritAttrs: false })

interface GuideNavItem {
  label: string
  to: string
}

interface GuideNavGroup {
  label: string
  items: GuideNavItem[]
}

const navigation: GuideNavGroup[] = [
  {
    label: 'ATOMS',
    items: [
      { label: 'Button', to: '/guide/button' },
      { label: 'ButtonLink', to: '/guide/button-link' },
      { label: 'Input', to: '/guide/input' },
      { label: 'Select', to: '/guide/select' },
      { label: 'TextArea', to: '/guide/textarea' },
    ],
  },
  {
    label: 'POLICY',
    items: [
      { label: '외부 라이브러리 정책', to: '/guide/libraries' },
    ],
  },
]
</script>

<style lang="scss" scoped>
$b: 'GuideSidebar';

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
