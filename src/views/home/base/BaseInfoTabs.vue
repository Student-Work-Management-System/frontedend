<script lang="ts" setup>
import { ref } from 'vue'
import BaseInfoList from './select-tabs/BaseInfoList.vue'
import BaseInfoStatus from './select-tabs/BaseInfoStatus.vue'

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
        <BaseInfoList />
      </v-window-item>
      <v-window-item :value="2">
        <BaseInfoStatus />
      </v-window-item>
    </v-window>
  </v-card>
</template>
