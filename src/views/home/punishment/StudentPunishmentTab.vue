<script lang="ts" setup>
import { ref } from 'vue'
import StudentPunishmentData from './tab/StudentPunishmentData.vue'
import StudentPunishmentStat from './tab/StudentPunishmentStat.vue'

const tab = ref(1)
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <v-tabs v-model="tab" color="indigo" align-tabs="start" class="tabs">
      <v-tab :value="1">处分信息</v-tab>
      <v-tab :value="2">处分统计</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <StudentPunishmentData />
      </v-window-item>
      <v-window-item :value="2">
        <StudentPunishmentStat />
      </v-window-item>
    </v-window>
  </v-card>
</template>
