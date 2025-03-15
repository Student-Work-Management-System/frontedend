<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import BaseInfoData from './tab/BaseInfoData.vue'
import BaseInfoStatus from './tab/BaseInfoStatus.vue'
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
  baseStore.updateStudentQuery(
    'degreeId',
    store.getUserData.chargeDegrees!![0].degreeId as string | null
  )
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
        <BaseInfoData />
      </v-window-item>
      <v-window-item :value="2">
        <BaseInfoStatus />
      </v-window-item>
    </v-window>
  </v-card>
</template>
