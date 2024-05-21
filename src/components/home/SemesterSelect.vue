<script lang="ts" setup>
import { ref } from 'vue'

const model = defineModel<string>()
const props = withDefaults(
  defineProps<{
    label: string,
    color: string,
    variant?:
    | 'filled'
    | 'underlined'
    | 'outlined'
    | 'plain'
    | 'solo'
    | 'solo-inverted'
    | 'solo-filled'
    | undefined
  }>(), {  label:'学期' })
const items = ref<string[]>([])
const since = 2017
const nowYear = new Date().getFullYear()
for (let year = since; year <= nowYear; year++) {
    items.value.push(`${year}-${year+1}_1`);
    items.value.push(`${year}-${year+1}_2`);
}
items.value = items.value.reverse()


</script>
<template>
  <v-select v-model="model"  :color=props.color :label="props.label" :items="items"
    :variant="props.variant" hide-details clearable>
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-select>
</template>
