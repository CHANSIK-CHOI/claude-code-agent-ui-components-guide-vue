<template>
  <div class="guideLayout">
    <GuideHeader class="guideLayout__header" />
    <div class="guideLayout__body">
      <GuideSidebar class="guideLayout__sidebar" />
      <main class="guideLayout__main">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GuideHeader, GuideSidebar } from "@nd/components/guide";
</script>

<style lang="scss" scoped>
$b: "guideLayout";
$header-height: 60px;
$sidebar-width: 240px;

.#{$b} {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__header {
    position: sticky;
    left: 0;
    top: 0;
    z-index: $z-sticky;
  }

  &__body {
    display: flex;
    flex: 1;
  }

  &__sidebar {
    flex-shrink: 0;
    width: $sidebar-width;
    position: sticky;
    left: 0;
    top: $header-height;
    align-self: flex-start;
    height: calc(100vh - #{$header-height});
    overflow-y: auto;
  }

  &__main {
    flex: 1;
    min-width: 0;
  }
}
</style>
