<script lang="ts" setup>
import { ref } from 'vue'

const model = defineModel<string | null>()
const props = withDefaults(
  defineProps<{
    label: string,
    variant?:
    | 'filled'
    | 'underlined'
    | 'outlined'
    | 'plain'
    | 'solo'
    | 'solo-inverted'
    | 'solo-filled'
    | undefined
  }>(), { label: "年级" })
const items = ref<string[]>([])
const since = 2017
const nowYear = new Date().getFullYear()
items.value = Array.from({ length: nowYear - since + 1 }, (_, index) => (since + index).toString())
items.value = items.value.reverse()
</script>
<template>
  <v-select v-model="model" class="text-indigo" color="indigo" :label="props.label" :items="items"
    :variant="props.variant" hide-details clearable>
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-select>
</template>
