<script lang="ts" setup>
import { ref } from 'vue'
import StudentScholarshipData from './tab/StudentScholarshipData.vue'
import StudentScholarshipStat from './tab/StudentScholarshipStat.vue'

const tab = ref(1)
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <v-tabs v-model="tab" color="indigo" align-tabs="start" class="tabs">
      <v-tab :value="1">获奖信息</v-tab>
      <v-tab :value="2">获奖统计</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <StudentScholarshipData />
      </v-window-item>
      <v-window-item :value="2">
        <StudentScholarshipStat />
      </v-window-item>
    </v-window>
  </v-card>
</template>
