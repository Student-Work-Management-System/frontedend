<script setup lang="ts">
import { computed } from 'vue'

const model = defineModel<string | null>()
const showWaiting = defineModel<boolean>('showWaiting')
const props = defineProps<{
  variant?:
    | 'filled'
    | 'underlined'
    | 'outlined'
    | 'plain'
    | 'solo'
    | 'solo-inverted'
    | 'solo-filled'
    | undefined
  density?: 'compact' | 'default' | 'comfortable' | undefined
}>()
const items = computed(() => {
  if (showWaiting.value) return ['审核中', '通过', '拒绝']
  return ['通过', '拒绝']
})
</script>

<template>
  <v-select
    v-model="model"
    class="text-indigo"
    color="indigo"
    label="审核状态"
    :items="items"
    :variant="props.variant"
    hide-details
    clearable
    :density="props.density"
  >
    <slot></slot>
  </v-select>
</template>
