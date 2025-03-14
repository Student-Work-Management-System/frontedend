<script lang="ts" setup>
import StatusSelectMenu from '@/views/home/base/statusCompones/StatusSelectMenu.vue'
import { type StudentQuery } from '@/model/studentModel'

const props = defineProps<{
  studentQuery: StudentQuery
}>()
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="d-flex flex-column">
    <StatusSelectMenu class="status-select-menu" :student-query="studentQuery" />
  </v-card>
</template>

<style scoped>
.status-select-menu {
  padding: 8px;
  height: 100%;
  width: 40%;
}
</style>
