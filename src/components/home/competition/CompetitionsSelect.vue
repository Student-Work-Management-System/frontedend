<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useCompetitionStore } from '@/stores/competitionStore'

const model = defineModel<string>()
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
const loading = ref(false)
const competitionStore = useCompetitionStore()
const competitionOptions = computed(() => {
  return competitionStore.getCompetitionList().map((item) => ({
    competitionTitle:
      item.competitionName + ' - ' + item.competitionType + ' - ' + item.competitionNature,
    competitionId: item.competitionId
  }))
})
</script>

<template>
  <v-select
    v-model="model"
    :loading="loading"
    class="text-indigo"
    color="indigo"
    prepend-inner-icon="mdi-trophy"
    label="竞赛列表"
    :items="competitionOptions"
    item-title="competitionTitle"
    item-value="competitionId"
    :variant="props.variant"
    hide-details
    clearable
  >
    <template v-slot:prepend>
      <slot></slot>
    </template>
  </v-select>
</template>
