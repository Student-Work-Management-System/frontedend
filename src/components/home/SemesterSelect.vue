<script lang="ts" setup>
import { ref } from 'vue'

const model = defineModel<string | null>()
const props = withDefaults(
  defineProps<{
    label: string
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
  }>(),
  { label: '学期' }
)
const items = ref<string[]>([])
const since = 2017
const nowYear = new Date().getFullYear()
for (let year = since; year <= nowYear; year++) {
  let term = `${year}-${year + 1}`
  items.value.push(`${term}_1`)
  items.value.push(`${term}_2`)
}
items.value = items.value.reverse()
</script>
<template>
  <v-select
    v-model="model"
    class="text-indigo"
    color="indigo"
    :label="props.label"
    :items="items"
    :variant="props.variant"
    hide-details
    clearable
    :density="props.density"
  >
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-select>
</template>
