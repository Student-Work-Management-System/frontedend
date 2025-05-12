<script lang="ts" setup>
import { ref } from 'vue'
import PrecautionData from './tabs/PrecautionData.vue'
import PrecautionStat from './tabs/PrecautionStat.vue'
const tab = ref<number>(1)
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <v-tabs v-model="tab" color="indigo" align-tabs="start" class="tabs">
      <v-tab :value="1">学业预警数据面板</v-tab>
      <v-tab :value="2">学业预警信息统计</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <PrecautionData />
      </v-window-item>
      <v-window-item :value="2">
        <PrecautionStat />
      </v-window-item>
    </v-window>
  </v-card>
</template>
