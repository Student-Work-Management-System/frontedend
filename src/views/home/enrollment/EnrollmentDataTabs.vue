<script lang="ts" setup>
import { ref } from 'vue'
import EnrollmentData from './tab/EnrollmentData.vue'
import EnrollmentStat from './tab/EnrollmentStat.vue'

const tab = ref(null)
</script>

<template>
  <v-card elevation="10" height="100%" width="100%">
    <v-tabs v-model="tab" color="indigo" align-tabs="start">
      <v-tab :value="1">数据管理</v-tab>
      <v-tab :value="2">数据统计</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <EnrollmentData />
      </v-window-item>
      <v-window-item :value="2">
        <EnrollmentStat />
      </v-window-item>
    </v-window>
  </v-card>
</template>
