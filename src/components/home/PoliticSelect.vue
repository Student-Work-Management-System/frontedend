<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { apiGetAllPolitics } from '@/api/other'
import { notify } from '@kyvg/vue3-notification'
import type { Politics } from '@/model/otherModel'

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
const items = ref<Politics[]>([])
const getPoliticsListLogic = async () => {
  const { data: result } = await apiGetAllPolitics()
  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  items.value = result.data
}
onMounted(() => {
  getPoliticsListLogic()
})
</script>
<template>
  <v-select
    v-model="model"
    class="text-indigo"
    color="indigo"
    label="政治面貌"
    :items="items"
    item-title="politicStatus"
    item-value="politicId"
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
