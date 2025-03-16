<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import StatusSelectMenu from '../statusCompones/StatusSelectMenu.vue'
import StatusTable from '../statusCompones/StatusTable.vue'

// 高度计算相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tabsHeight = ref(0)

const tableHeight = computed(() => {
  if (!containerHeight.value || !selectMenuHeight.value || !tabsHeight.value) return 800
  return containerHeight.value - selectMenuHeight.value - tabsHeight.value
})

const statusContainerHeight = computed(() => {
  if (!containerHeight.value || !tabsHeight.value) return 800
  return containerHeight.value - tabsHeight.value
})

onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.classList.contains('card-container')) {
        containerHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('tabs')) {
        tabsHeight.value = entry.contentRect.height
      }
    }
  })

  // 观察元素
  const container = document.querySelector('.card-container')
  const tabs = document.querySelector('.tabs')

  if (container) resizeObserver.observe(container)
  if (tabs) resizeObserver.observe(tabs)

  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})
</script>

<template>
  <div class="status-container" :style="{ height: statusContainerHeight + 'px' }">
    <StatusSelectMenu class="status-select-menu" />
    <StatusTable class="status-table" :table-height="tableHeight" />
  </div>
</template>

<style scoped>
.status-container {
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.status-select-menu {
  width: 30vw;
  flex: none;
  margin-bottom: 16px;
}

.status-table {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}
</style>
