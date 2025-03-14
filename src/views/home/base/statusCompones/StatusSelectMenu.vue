<script lang="ts" setup>
import DegreeSelect from '@/components/home/DegreeSelect.vue'
import GradeSelect from '@/components/home/GradeSelect.vue'
import { type StudentQuery } from '@/model/studentModel'
const props = defineProps<{
  studentQuery: StudentQuery
}>()

const emit = defineEmits(['update:studentQuery'])

const updateQuery = (field: keyof StudentQuery, value: any) => {
  emit('update:studentQuery', { ...props.studentQuery, [field]: value })
}
</script>

<template>
  <div class="status-select-menu">
    <v-col cols="12" class="d-flex flex-wrap align-center gap-4 pa-0 mb-4">
      <DegreeSelect
        :model-value="studentQuery.degreeId"
        @update:model-value="(v) => updateQuery('degreeId', v)"
        label="学历层次"
        variant="underlined"
      />
      <GradeSelect
        :model-value="studentQuery.gradeId"
        @update:model-value="(v) => updateQuery('gradeId', v)"
        label="年级"
        variant="underlined"
      />
    </v-col>
  </div>
</template>
