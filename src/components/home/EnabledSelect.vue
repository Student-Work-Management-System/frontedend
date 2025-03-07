<script lang="ts" setup>
const model = defineModel<string>()
const props = withDefaults(
  defineProps<{
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
  }>(),
  { label: '状态' }
)
const items = [
  { key: '正常', value: true },
  { key: '已删除', value: false }
]
</script>

<template>
  <v-select
    v-model="model"
    class="text-indigo"
    color="indigo"
    :label="props.label"
    :items="items"
    item-title="key"
    item-value="value"
    :variant="props.variant"
    hide-details
  >
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-select>
</template>
