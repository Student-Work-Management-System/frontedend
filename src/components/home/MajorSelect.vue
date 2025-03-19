<script lang="ts" setup>
import { apiGetMajorList } from '@/api/other'
import { notify } from '@kyvg/vue3-notification'
import { ref, onMounted } from 'vue'
import type { Major } from '@/model/otherModel'

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
const items = ref<Major[]>([])
const getMajorListLogic = async () => {
  const { data: result } = await apiGetMajorList()
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  items.value = result.data
}
onMounted(() => {
  getMajorListLogic()
})
</script>

<template>
  <v-select
    v-model="model"
    class="text-indigo"
    color="indigo"
    label="专业"
    :items="items"
    item-title="majorName"
    item-value="majorId"
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
