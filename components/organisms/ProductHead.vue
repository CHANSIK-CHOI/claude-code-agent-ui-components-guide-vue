<script setup>
  defineProps({
    caption: String,
    title: String,
  })
</script>

<template>
  <div class="product-head">
    <span class="product-head__caption">{{ caption }}</span>
    <h1 class="product-head__title">{{ title }}</h1>
  </div>
</template>

<style lang="scss" scoped>
  .product-head {
    padding: 0 1.6rem 1.6rem;
    &__caption {
      color: $color-primary;
      font-size: $font-size-caption1;
      font-weight: $font-weight-bold;
    }
    &__title {
      color: $text-900;
      font-size: $font-size-h1;
      font-weight: $font-weight-bold;
    }
  }
</style>
