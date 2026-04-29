<template>
  <NuxtLayout>
    <div id="wrap">
      <NuxtPage />
    </div>
  </NuxtLayout>
  <ClientOnly>
    <PopupRenderer />
    <ToastRenderer />
    <div id="popup-container" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { PopupRenderer, ToastRenderer } from "@nd/components/popup";
</script>
