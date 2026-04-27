<template>
  <main class="DefaultLayout">
    <slot />
  </main>
</template>

<style lang="scss" scoped>
$b: 'DefaultLayout';

.#{$b} {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}
</style>
