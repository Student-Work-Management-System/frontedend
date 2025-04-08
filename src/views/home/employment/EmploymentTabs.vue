<script lang="ts" setup>
import { ref } from 'vue'
import EmploymentData from './select-tabs/EmploymentData.vue'
import EmploymentStat from './select-tabs/EmploymentStat.vue'

const tab = ref(null)
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <v-tabs v-model="tab" color="indigo" align-tabs="start">
      <v-tab :value="1">数据管理</v-tab>
      <v-tab :value="2">数据统计</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <EmploymentData />
      </v-window-item>
      <v-window-item :value="2">
        <EmploymentStat />
      </v-window-item>
    </v-window>
  </v-card>
</template>
