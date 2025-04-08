<script lang="ts" setup>
const model = defineModel<string | null>()
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
  density?: 'compact' | 'default' | 'comfortable' | undefined
  items: string[]
}>()
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
    :density="density"
  >
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-select>
</template>
