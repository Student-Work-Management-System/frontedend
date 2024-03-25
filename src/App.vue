<script setup lang="ts">
import { RouterView } from 'vue-router'
import { Notifications } from '@kyvg/vue3-notification'
</script>

<template>
  <notifications classs="notification" position="top right" />
  <RouterView />
</template>

<style scoped>
.notification {
  font-size: large !important;
}
</style>
