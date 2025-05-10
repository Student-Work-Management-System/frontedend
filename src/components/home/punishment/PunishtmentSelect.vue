<script lang="ts" setup>
import { apiGetPunishments } from '@/api/punishment'
import { usePunishmentStore } from '@/stores/punishmentStore'
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
  prependIcon?: string
}>()
const punishmentStore = usePunishmentStore()
const items = computed(() => {
  return punishmentStore.getPunsihments()
})
onMounted(async () => {
  if (punishmentStore.getPunsihments().length <= 0) {
    const { data: result } = await apiGetPunishments({ pageNo: 1, pageSize: 25 })
    if (result.code !== 200) {
      console.error('请求出现错误' + result.message)
    }
    punishmentStore.setPunishments(result.data.records)
  }
})
</script>
<template>
  <v-select
    v-model="model"
    class="text-indigo"
    color="indigo"
    label="处分级别"
    :items="items"
    item-title="punishmentName"
    item-value="punishmentId"
    :variant="props.variant"
    :prepend-inner-icon="prependIcon"
    hide-details
    clearable
    :density="density"
  >
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-select>
</template>
