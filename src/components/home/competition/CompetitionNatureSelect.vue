<script lang="ts" setup>
const model = defineModel<string>()

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
  }>(), { label: "竞赛性质" })

const items = ["团队", "单人"]
</script>

<template>
  <v-select v-model="model" class="text-indigo" color="indigo" :label="props.label" :items="items"
    :variant="props.variant" hide-details clearable>
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-select>
</template>
