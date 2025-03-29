<script lang="ts" setup>
import { competitionNatureOptions } from '@/model/competitionModel'

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
    class="text-indigo"
    color="indigo"
    label="竞赛性质"
    :items="competitionNatureOptions"
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
