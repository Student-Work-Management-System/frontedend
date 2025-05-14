<script setup lang="ts">
import type { StatusBase } from '@/model/studentModel'
import { computed } from 'vue'

const statuses = defineModel<StatusBase[]>()

// 仅按 modifiedTime 从小到大排序
const sortedStatuses = computed(() =>
  [...(statuses.value ?? [])].sort(
    (a, b) => new Date(a.modifiedTime).getTime() - new Date(b.modifiedTime).getTime()
  )
)
</script>

<template>
  <v-container fluid>
    <v-card>
      <v-card-text class="text-center">
        <v-timeline direction="horizontal" line-inset="12">
          <v-timeline-item
            v-for="(s, index) in sortedStatuses"
            :key="index"
            :title="s.log"
            :subtitle="s.modifiedTime"
            dot-color="primary"
          >
            <template v-slot:opposite>
              <div class="text-caption text-grey">{{ s.modifiedTime }}</div>
            </template>
            <div>{{ s.statusName }}</div>
          </v-timeline-item>
        </v-timeline>
        <v-card-subtitle>鼠标放在点上可查看详情</v-card-subtitle>
        <div v-if="sortedStatuses.length === 0" class="text-grey">暂无学籍状态记录</div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.text-grey {
  color: #9e9e9e;
  padding: 8px;
}
</style>
