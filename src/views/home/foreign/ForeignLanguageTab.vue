<script lang="ts" setup>
import { ref } from 'vue'
import ForeignLanguageData from './status-tab/ForeignLanguageData.vue'
import ForeignLanguageStat from './status-tab/ForeignLanguageStat.vue'
const tab = ref<number>(1)
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <v-tabs v-model="tab" color="indigo" align-tabs="start" class="tabs">
      <v-tab :value="1">成绩信息</v-tab>
      <v-tab :value="2">成绩统计</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <ForeignLanguageData />
      </v-window-item>
      <v-window-item :value="2">
        <ForeignLanguageStat />
      </v-window-item>
    </v-window>
  </v-card>
</template>
