<script lang="ts" setup>
import { type StudentQuery } from '@/model/studentModel'
import StatusSelectMenu from '../statusCompones/StatusSelectMenu.vue'
import StatusTable from '../statusCompones/StatusTable.vue'

const props = defineProps<{
  studentQuery: StudentQuery
}>()

const emit = defineEmits(['update:studentQuery'])
</script>

<template>
  <div class="status-container">
    <StatusSelectMenu
      class="status-select-menu"
      :student-query="studentQuery"
      @update:student-query="(v) => emit('update:studentQuery', v)"
    />
    <StatusTable />
  </div>
</template>

<style scoped>
.status-container {
  padding: 16px;
  height: 100%;
}
.status-select-menu {
  width: 30vw;
}
</style>
