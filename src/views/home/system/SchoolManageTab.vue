<script lang="ts" setup>
import { ref } from 'vue'
import MajorManage from './tabs/MajorManage.vue'
import CounselorManage from './tabs/CounselorManage.vue'
const tab = ref<number>(1)
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <v-tabs v-model="tab" color="indigo" align-tabs="start" class="tabs">
      <v-tab :value="1">学院辅导员管理</v-tab>
      <v-tab :value="2">学院专业管理</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <CounselorManage />
      </v-window-item>
      <v-window-item :value="2">
        <MajorManage />
      </v-window-item>
    </v-window>
  </v-card>
</template>
