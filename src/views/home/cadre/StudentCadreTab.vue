<script lang="ts" setup>
import { ref } from 'vue'
import StudentCadreData from './tab/StudentCadreData.vue'
import StudentCadreStatus from './tab/StudentCadreStatus.vue'
const tab = ref<number>(1)
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <v-tabs v-model="tab" color="indigo" align-tabs="start" class="tabs">
      <v-tab :value="1">学生任职</v-tab>
      <v-tab :value="2">任职统计</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <StudentCadreData />
      </v-window-item>
      <v-window-item :value="2">
        <StudentCadreStatus />
      </v-window-item>
    </v-window>
  </v-card>
</template>
