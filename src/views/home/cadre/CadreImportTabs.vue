<script lang="ts" setup>
import { ref } from 'vue'
import CadreImport from './import-tabs/CadreInfoImport.vue';
import StudentCadreImport from './import-tabs/StudentCadreInfoImpot.vue';


const tab = ref(null)
</script>

<template>
  <v-card elevation="10" height="100%" width="100%">
    <v-tabs v-model="tab" color="indigo" align-tabs="left">
      <v-tab :value="1">任职信息导入</v-tab>
      <v-tab :value="2">职位信息导入</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="1">
        <StudentCadreImport />
      </v-window-item>
      <v-window-item :value="2">
        <CadreImport />
      </v-window-item>
    </v-window>
  </v-card>
</template>
