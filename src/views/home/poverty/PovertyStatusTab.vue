<script lang="ts" setup>
import { ref } from 'vue'
import StudentPovertyData from './dataTabs/StudentPovertyData.vue'
import StudentPovertyStat from './dataTabs/StudentPovertyStat.vue'
const tab = ref<number>(1)
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <v-tabs v-model="tab" color="indigo" align-tabs="start" class="tabs">
      <v-tab :value="1">贫困信息面板</v-tab>
      <v-tab :value="2">贫困统计</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <StudentPovertyData />
      </v-window-item>
      <v-window-item :value="2">
        <StudentPovertyStat />
      </v-window-item>
    </v-window>
  </v-card>
</template>
