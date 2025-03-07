<script lang="ts" setup>
import { type Major, apiGetMajorList } from '@/api/major'
import { notify } from '@kyvg/vue3-notification'
import { ref } from 'vue'
import { onMounted } from 'vue'

const model = defineModel<string | null>()
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
  { label: '专业' }
)
const items = ref<Major[]>([])
const loading = ref(true)
const getMajorListLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetMajorList()
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  items.value = result.data
  loading.value = false
}
onMounted(() => {
  getMajorListLogic()
})
</script>

<template>
  <v-select
    v-model="model"
    :loading="loading"
    class="text-indigo"
    color="indigo"
    :label="props.label"
    :items="items"
    item-title="majorName"
    item-value="majorId"
    :variant="props.variant"
    hide-details
    clearable
  >
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-select>
</template>
