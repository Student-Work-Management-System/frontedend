<script lang="ts" setup>
import { competitionOptions } from '@/api/competition';

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
  }>(), { label: "竞赛等级" })

</script>

<template>
  <v-select v-model="model" class="text-indigo" color="indigo" :label="props.label" :items="competitionOptions"
    :variant="props.variant" hide-details clearable>
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-select>
</template>
