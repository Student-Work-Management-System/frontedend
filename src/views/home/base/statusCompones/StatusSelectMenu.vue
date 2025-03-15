<script lang="ts" setup>
import DegreeSelect from '@/components/home/DegreeSelect.vue'
import GradeSelect from '@/components/home/GradeSelect.vue'
import type { Degree, Grade } from '@/model/otherModel'
import { type StudentQuery } from '@/model/studentModel'
import { useBaseStore } from '@/stores/baseStore'
import { useUserStore } from '@/stores/userStore'

const store = useUserStore()
const chargeDegrees = store.getUserData.chargeDegrees
const chargeGrades = store.getUserData.chargeGrades
const baseStore = useBaseStore()
const studentQuery = baseStore.getStudentQuery

const updateQuery = <K extends keyof StudentQuery>(field: K, value: StudentQuery[K]) => {
  baseStore.updateStudentQuery(field, value)
}
</script>

<template>
  <div class="status-select-menu">
    <v-col cols="12" class="d-flex flex-wrap align-center gap-4 pa-0 mb-4">
      <DegreeSelect
        :model-value="studentQuery.degreeId"
        :charge-degrees="chargeDegrees as Degree[]"
        @update:model-value="(v) => updateQuery('degreeId', v as string | null)"
        label="学历层次"
        variant="underlined"
      />
      <GradeSelect
        :model-value="studentQuery.gradeId"
        :charge-grades="chargeGrades as Grade[]"
        @update:model-value="(v) => updateQuery('gradeId', v as string | null)"
        label="年级"
        variant="underlined"
      />
    </v-col>
  </div>
</template>
