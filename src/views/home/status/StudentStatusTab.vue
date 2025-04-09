<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import StudentStatusData from './tab/StudentStatusData.vue'
import StudentStatusStat from './tab/StudentStatusStat.vue'
import { useUserStore } from '@/stores/userStore'
import { useBaseStore } from '@/stores/baseStore'
const tab = ref<number>(1)
const store = useUserStore()
const baseStore = useBaseStore()
onMounted(() => {
  baseStore.updateStudentQuery(
    'gradeId',
    store.getUserData.chargeGrades!![0].gradeId as string | null
  )
})
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <v-tabs v-model="tab" color="indigo" align-tabs="start" class="tabs">
      <v-tab :value="1">学生学籍状态管理</v-tab>
      <v-tab :value="2">数据统计</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <StudentStatusData />
      </v-window-item>
      <v-window-item :value="2">
        <StudentStatusStat />
      </v-window-item>
    </v-window>
  </v-card>
</template>
