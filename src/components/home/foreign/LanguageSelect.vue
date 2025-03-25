<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useForeignStore } from '@/stores/foreignStore'
import { apiGetLanguages } from '@/api/foreign'
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

const foreignStore = useForeignStore()
const items = computed(() => {
  return foreignStore.getLanguageList()?.map((language) => ({
    key: `${language.languageName} - ${language.type}`,
    value: language.languageId
  }))
})

onMounted(async () => {
  if (foreignStore.getLanguageList().length === 0) {
    const { data } = await apiGetLanguages()
    if (data.code !== 200) {
      console.error(data)
      notify({ type: 'error', title: '错误', text: data.message })
      return
    }
    foreignStore.setLanguageList(data.data)
  }
})
</script>
<template>
  <v-select
    v-model="model"
    class="text-indigo"
    color="indigo"
    label="语言"
    :items="items"
    item-title="key"
    item-value="value"
    hide-details
    clearable
    :variant="props.variant"
    :density="props.density"
  >
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-select>
</template>
