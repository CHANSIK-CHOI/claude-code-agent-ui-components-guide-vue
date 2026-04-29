<template>
  <template v-for="instance in instances" :key="instance.id">
    <Alert
      v-if="instance.component === 'alert'"
      v-bind="instance.props"
    />
    <Confirm
      v-else-if="instance.component === 'confirm'"
      v-bind="instance.props"
    />
  </template>
</template>

<script setup lang="ts">
import Alert from './Alert.vue'
import Confirm from './Confirm.vue'
import { usePopupManager } from './usePopupManager'

const { instances } = usePopupManager()
</script>
