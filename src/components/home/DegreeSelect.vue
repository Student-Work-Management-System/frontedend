<script lang="ts" setup>
import type { Degree } from '@/model/otherModel'

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
  chargeDegrees: Degree[] | null
  density?: 'compact' | 'default' | 'comfortable' | undefined
}>()
</script>
<template>
  <v-select
    v-model="model"
    class="text-indigo"
    color="indigo"
    label="学历层次"
    :items="props.chargeDegrees as Degree[]"
    item-title="degreeName"
    item-value="degreeId"
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
