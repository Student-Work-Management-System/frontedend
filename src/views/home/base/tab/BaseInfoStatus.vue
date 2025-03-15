<script lang="ts" setup>
import StatusSelectMenu from '../statusCompones/StatusSelectMenu.vue'
import StatusTable from '../statusCompones/StatusTable.vue'

</script>

<template>
  <div class="status-container">
    <StatusSelectMenu class="status-select-menu" />
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
