<script lang="ts" setup>
import { ref } from 'vue'
import CompetitionImport from './manage-tabs/CompetitionImport.vue';
import CompetitionList from './manage-tabs/CompetitionList.vue';


const tab = ref(null)
</script>
<template>
  <v-card elevation="10" height="100%" width="100%">
    <v-tabs v-model="tab" color="indigo" align-tabs="left">
      <v-tab :value="1">数据管理</v-tab>
      <v-tab :value="2">数据导入</v-tab>
    </v-tabs>
    <v-window v-model="tab" class="container">
      <v-window-item :value="1">
        <CompetitionList />
      </v-window-item>
      <v-window-item :value="2">
        <CompetitionImport />
      </v-window-item>
    </v-window>
  </v-card>
</template>

<style scoped>
.container {
  flex: 1;
  width: 100%;
  height: 90vh;
}
</style>
