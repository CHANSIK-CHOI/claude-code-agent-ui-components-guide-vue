<template>
  <div class="GuideLayout">
    <GuideHeader class="GuideLayout__header" />
    <div class="GuideLayout__body">
      <GuideSidebar class="GuideLayout__sidebar" />
      <main class="GuideLayout__main">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GuideHeader, GuideSidebar } from "@/components/guide";
</script>

<style lang="scss" scoped>
$b: "GuideLayout";
$header-height: 6rem;
$sidebar-width: 24rem;

.#{$b} {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__header {
    position: sticky;
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
    top: $header-height;
    align-self: flex-start;
    height: calc(100vh - #{$header-height});
    overflow-y: auto;
  }

  &__main {
    flex: 1;
    min-width: 0;
    overflow-x: auto;
  }
}
</style>
