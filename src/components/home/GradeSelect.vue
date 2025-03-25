<script lang="ts" setup>
import type { Grade } from '@/model/otherModel'

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
  chargeGrades: Grade[] | null
  density?: 'compact' | 'default' | 'comfortable' | undefined
}>()
</script>
<template>
  <v-select
    v-model="model"
    class="text-indigo"
    color="indigo"
    label="年级"
    :items="props.chargeGrades as Grade[]"
    item-title="gradeName"
    item-value="gradeId"
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
