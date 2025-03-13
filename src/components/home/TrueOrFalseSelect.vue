<script lang="ts" setup>
const model = defineModel<boolean | string>()
const props = defineProps<{
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
  items: { key: string; value: boolean | string }[]
}>()
</script>

<template>
  <v-select
    v-model="model"
    class="text-indigo"
    color="indigo"
    :label="props.label"
    :items="props.items"
    item-title="key"
    item-value="value"
    :variant="props.variant"
    hide-details
    clearable
    density="compact"
  >
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-select>
</template>
