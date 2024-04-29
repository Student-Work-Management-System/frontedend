<script lang="ts" setup>
import { ref } from 'vue'
import PovertyInfoImport from './import-tabs/PovertyInfoImport.vue';
import StudentPovertyInfoImport from './import-tabs/StudentPovertyInfoImport.vue';


const tab = ref(null)
</script>

<template>
  <v-card elevation="10" height="100%" width="100%">
    <v-tabs v-model="tab" color="indigo" align-tabs="left">
      <v-tab :value="1">学生贫困记录录入</v-tab>
      <v-tab :value="2">贫困类型录入</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <StudentPovertyInfoImport />
      </v-window-item>
      <v-window-item :value="2">
        <PovertyInfoImport />
      </v-window-item>
    </v-window>
  </v-card>
</template>
