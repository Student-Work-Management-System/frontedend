<script lang="ts" setup>
import DegreeSelect from '@/components/home/DegreeSelect.vue'
import GradeSelect from '@/components/home/GradeSelect.vue'
import type { EnrollmentQuery } from '@/model/enrollmentModel'
import type { Grade } from '@/model/otherModel'
import { useBaseStore } from '@/stores/baseStore'
import { useUserStore } from '@/stores/userStore'

const store = useUserStore()
const chargeGrades = store.getUserData.chargeGrades
const baseStore = useBaseStore()
const studentQuery = baseStore.getQuery()

const updateQuery = <K extends keyof EnrollmentQuery>(field: K, value: EnrollmentQuery[K]) => {
  baseStore.updateQuery(field, value)
}
</script>

<template>
  <div class="status-select-menu">
    <v-col cols="12" class="d-flex flex-wrap align-center gap-4 pa-0 mb-4">
      <GradeSelect
        :model-value="studentQuery.gradeId"
        :charge-grades="chargeGrades as Grade[]"
        @update:model-value="(v) => updateQuery('gradeId', v as string | null)"
        label="年级"
        variant="underlined"
      />
      <DegreeSelect
        :model-value="studentQuery.degreeId"
        @update:model-value="(v) => updateQuery('degreeId', v as string | null)"
        label="学历层次"
        variant="underlined"
      />
    </v-col>
  </div>
</template>
