<script lang="ts" setup>
import { academicWorkTypes } from '@/api/academicWork'

const model = defineModel<string | null>()
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
</script>

<template>
  <v-select
    v-model="model"
    label="类型"
    class="text-indigo"
    color="indigo"
    :items="academicWorkTypes"
    item-title="key"
    item-value="val"
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
