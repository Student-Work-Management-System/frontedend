<script lang="ts" setup>
import { competitionTypeOptions } from '@/model/competitionModel'

const model = defineModel<string>()
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
    label="竞赛类别"
    class="text-indigo"
    color="indigo"
    :items="competitionTypeOptions"
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
