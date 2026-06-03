<template>
  <NuxtLayout>
    <div id="wrap">
      <NuxtPage />
    </div>
  </NuxtLayout>
  <ClientOnly>
    <div id="popup-container" />
    <div id="toast-container" />
    <PopupRenderer />
    <ToastRenderer />
  </ClientOnly>
</template>

<script setup lang="ts">
import { PopupRenderer, ToastRenderer } from "@nd/components/popup";
</script>
