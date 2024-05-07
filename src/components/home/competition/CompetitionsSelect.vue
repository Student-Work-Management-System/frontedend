<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { notify } from '@kyvg/vue3-notification'

import { apiGetCompetitions, type Competition } from '@/api/competition';

const model = defineModel<Competition>()
const props = withDefaults(
  defineProps<{
    label: string,
    variant?:
    | 'filled'
    | 'underlined'
    | 'outlined'
    | 'plain'
    | 'solo'
    | 'solo-inverted'
    | 'solo-filled'
    | undefined
  }>(), { label: "竞赛选择" })

const loading = ref(false)
const items = ref<Competition[]>([])


const fetchCompetitions = async () => {
  loading.value = true
  const { data: result } = await apiGetCompetitions({ pageNo: 1, pageSize: 999 })
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    return
  }
  items.value = result.data.records
  loading.value = false
}

onMounted(fetchCompetitions)
</script>

<template>
  <v-select v-model="model" :loading="loading" class="text-indigo" color="indigo" prepend-inner-icon="mdi-trophy"
    :label="props.label" :items="items" item-title="competitionName" item-value="item" :variant="props.variant"
    return-object hide-details clearable>
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-select>
</template>
