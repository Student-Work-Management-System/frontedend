<script lang="ts" setup>
import { ref } from 'vue'
import BaseInfoData from './tab/BaseInfoData.vue'
import BaseInfoStatus from './tab/BaseInfoStatus.vue'
import { type StudentQuery } from '@/model/studentModel'

const tab = ref<number>(1)
const studentQuery = ref<StudentQuery>({
  search: '' as string,
  gradeId: null as string | null,
  majorId: null as string | null,
  degreeId: '1' as string | null,
  statusId: '1' as string | null,
  gender: null as string | null,
  nation: null as string | null,
  politicsStatus: null as string | null,
  classNo: null as string | null,
  dormitory: null as string | null,
  householdRegistration: null as string | null,
  householdType: null as string | null,
  address: null as string | null,
  examId: null as string | null,
  admissionBatch: null as string | null,
  nativePlace: null as string | null,
  highSchool: null as string | null,
  totalExamScore: null as string | null,
  foreignLanguage: null as string | null,
  foreignScore: null as string | null,
  hobbies: null as string | null,
  joiningTime: null as string | null,
  isStudentLoans: null as boolean | null,
  religiousBeliefs: null as string | null,
  location: null as string | null,
  familyPopulation: null as string | null,
  isOnlyChild: null as boolean | null,
  disability: false as boolean,
  otherNotes: null as string | null,
  enabled: true as boolean,
  pageNo: 1 as number,
  pageSize: 25 as number
})
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <v-tabs v-model="tab" color="indigo" align-tabs="start" class="tabs">
      <v-tab :value="1">学生管理</v-tab>
      <v-tab :value="2">数据统计</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <BaseInfoData :student-query="studentQuery" />
      </v-window-item>
      <v-window-item :value="2">
        <BaseInfoStatus :student-query="studentQuery" />
      </v-window-item>
    </v-window>
  </v-card>
</template>
