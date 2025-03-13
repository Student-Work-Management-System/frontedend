<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { apiGetAllGrades } from '@/api/student'
import { notify } from '@kyvg/vue3-notification'
import type { Grade } from '@/model/studentModel'

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
const items = ref<Grade[]>([])
const loading = ref(true)
const getGradeListLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetAllGrades()
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  items.value = result.data
  loading.value = false
}
onMounted(() => {
  getGradeListLogic()
})
</script>
<template>
  <v-select
    v-model="model"
    :loading="loading"
    class="text-indigo"
    color="indigo"
    label="年级"
    :items="items"
    item-title="gradeName"
    item-value="gradeId"
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
