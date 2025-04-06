<script lang="ts" setup>
import { apiGetScholarships } from '@/api/scholarship'
import { useScholarshipStore } from '@/stores/scholarshipStore'
import { notify } from '@kyvg/vue3-notification'
import { computed, onMounted } from 'vue'

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

const store = useScholarshipStore()
const items = computed(() =>
  store.getScholarshipList().map((item) => ({
    title: `${item.scholarshipName} - ${item.scholarshipLevel}`,
    value: item.scholarshipId
  }))
)
onMounted(async () => {
  if (store.getScholarshipList().length <= 0) {
    const { data: result } = await apiGetScholarships()
    if (result.code !== 200) {
      notify({ type: 'error', text: result.message, title: '错误' })
    }
    store.setScholarshipList(result.data)
  }
})
</script>
<template>
  <v-select
    v-model="model"
    class="text-indigo"
    color="indigo"
    label="奖学金"
    :items="items"
    item-title="title"
    item-value="value"
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
