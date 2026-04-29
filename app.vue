<template>
  <NuxtLayout>
    <div id="wrap">
      <NuxtPage />
    </div>
  </NuxtLayout>
  <PopupRenderer />
  <ToastRenderer />
  <div id="popup-container" />
</template>

<script setup lang="ts">
import { PopupRenderer, ToastRenderer } from "@nd/components/popup";
</script>
