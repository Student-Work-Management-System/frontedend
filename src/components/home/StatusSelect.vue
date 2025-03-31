<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { apiGetAllStatus } from '@/api/status'
import { notify } from '@kyvg/vue3-notification'
import { useBaseStore } from '@/stores/baseStore'

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

const baseStore = useBaseStore()
const items = computed(() => baseStore.getStatusList())
onMounted(async () => {
  if (baseStore.getStatusList.length > 0) return
  const { data: result } = await apiGetAllStatus()
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
  }
  baseStore.updateStatusList(result.data)
})
</script>
<template>
  <v-select
    v-model="model"
    class="text-indigo"
    color="indigo"
    label="学籍状态"
    :items="items"
    item-title="statusName"
    item-value="statusId"
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
