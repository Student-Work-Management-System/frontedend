<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useCadreStore } from '@/stores/cadreStore'
import { apiGetCadreList } from '@/api/cadre'
import { notify } from '@kyvg/vue3-notification'

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

const cadreStore = useCadreStore()
const items = computed(() => {
  return cadreStore.getCadreList()?.map((cadre) => ({
    key: `${cadre.cadrePosition} - ${cadre.cadreLevel} - ${cadre.cadreBelong}`,
    value: cadre.cadreId
  }))
})

onMounted(async () => {
  if (cadreStore.getCadreList().length === 0) {
    const { data } = await apiGetCadreList()
    if (data.code !== 200) {
      console.error(data)
      notify({ type: 'error', title: '错误', text: data.message })
      return
    }
    cadreStore.setCadreList(data.data)
  }
})
</script>
<template>
  <v-select
    v-model="model"
    class="text-indigo"
    color="indigo"
    label="职务"
    :items="items"
    item-title="key"
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
