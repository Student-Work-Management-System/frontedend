<script lang="ts" setup>
import { apiGetAllDegrees } from '@/api/other'
import { computed, onMounted } from 'vue'
import { useBaseStore } from '@/stores/baseStore'
import { notify } from '@kyvg/vue3-notification'

const model = defineModel<string | null>()
const baseStore = useBaseStore()
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
const items = computed(() => {
  return baseStore.getDegreeList()
})

onMounted(async () => {
  if (baseStore.getDegreeList().length <= 0) {
    const { data: result } = await apiGetAllDegrees()
    if (result.code !== 200) {
      notify({ type: 'error', title: '错误', text: result.message })
      result
    }
    baseStore.updateDegreeList(result.data)
  }
})
</script>
<template>
  <v-select
    v-model="model"
    class="text-indigo"
    color="indigo"
    label="学历层次"
    :items="items"
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
