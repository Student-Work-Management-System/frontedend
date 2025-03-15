<script lang="ts" setup>
import { ref } from 'vue'
import BaseInfoData from './tab/BaseInfoData.vue'
import BaseInfoStatus from './tab/BaseInfoStatus.vue'
const tab = ref<number>(1)
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
