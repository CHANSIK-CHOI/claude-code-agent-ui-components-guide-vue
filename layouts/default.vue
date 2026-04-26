<template>
  <div class="Layout">
    <main class="Layout__main">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.Layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  &__main {
    flex: 1;
    width: 100%;
  }
}
</style>
