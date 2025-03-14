<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { apiGetAllDegrees } from '@/api/student'
import { notify } from '@kyvg/vue3-notification'
import type { Degree } from '@/model/studentModel'

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
const items = ref<Degree[]>([])
const loading = ref(true)
const getDegreeListLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetAllDegrees()
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  items.value = result.data
  loading.value = false
}
onMounted(() => {
  getDegreeListLogic()
})
</script>
<template>
  <v-select
    v-model="model"
    :loading="loading"
    class="text-indigo"
    color="indigo"
    label="学历层次"
    :items="items"
    item-title="degreeName"
    item-value="degreeId"
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
