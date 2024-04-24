<script lang="ts" setup>
import { ref } from 'vue'
import StudentCadreList from './select-tabs/StudentCadreList.vue';
import StudentCadreStats from './select-tabs/StudentCadreStats.vue';


const tab = ref(null)
</script>

<template>
  <v-card elevation="10" height="100%" width="100%">
    <v-tabs v-model="tab" color="indigo" align-tabs="left">
      <v-tab :value="1">任职管理</v-tab>
      <v-tab :value="2">数据统计</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <StudentCadreList />
      </v-window-item>
      <v-window-item :value="2">
        <StudentCadreStats />
      </v-window-item>
    </v-window>
  </v-card>
</template>
