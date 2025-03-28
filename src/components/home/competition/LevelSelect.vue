<script lang="ts" setup>
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
}>()
const items = [
  '国家一等奖',
  '国家二等奖',
  '国家三等奖',
  '省部一等奖',
  '省部二等奖',
  '省部三等奖',
  '校级一等奖',
  '校级二等奖',
  '校级三等奖',
  '院级一等奖',
  '院级二等奖',
  '院级三等奖',
  '其他'
]
</script>
<template>
  <v-select
    v-model="model"
    class="text-indigo"
    color="indigo"
    label="奖项级别"
    :items="items"
    :variant="props.variant"
    hide-details
    clearable
  >
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-select>
</template>
