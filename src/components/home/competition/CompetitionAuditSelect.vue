<script setup lang="ts">

const model = defineModel<string>()
const refuseReason = defineModel<string>('reason')
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
  }>(), { label: "审核结果" })
const items = ['已通过', '已拒绝'];
</script>

<template>
  <v-select v-model="model" class="text-indigo" color="indigo" :label="props.label" :items="items"
    :variant="props.variant" hide-details clearable>
    <slot></slot>
  </v-select>
</template>
