<template>
  <div class="Layout">
    <GuideHeader class="Layout__header" />
    <div class="Layout__body">
      <GuideSidebar class="Layout__sidebar" />
      <main class="Layout__main">
        <slot />
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$b: 'Layout';
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
  }
}
</style>
