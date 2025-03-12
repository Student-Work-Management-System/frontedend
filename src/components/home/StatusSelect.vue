<script lang="ts" setup>
import { type Status, apiGetAllStatus } from '@/api/status.ts'
import { notify } from '@kyvg/vue3-notification'
import { ref } from 'vue'
import { onMounted } from 'vue'

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
const items = ref<Status[]>([])
const loading = ref(true)
const getAllStatusLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetAllStatus()
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  items.value = result.data
  loading.value = false
}
onMounted(() => {
  getAllStatusLogic()
})
</script>

<template>
  <v-select
    v-model="model"
    :loading="loading"
    class="text-indigo"
    color="indigo"
    label="学籍状态"
    :items="items"
    item-title="statusName"
    item-value="statusId"
    :variant="props.variant"
    hide-details
    clearable
    density="compact"
  >
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-select>
</template>
