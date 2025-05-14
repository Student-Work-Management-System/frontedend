<script setup lang="ts">
import type { ScholarshipBase, PunishmentBase } from '@/model/studentModel'
import { computed } from 'vue'

const scholarshipAndPunshiment = defineModel<{
  scholarships: ScholarshipBase[]
  punishments: PunishmentBase[]
}>()

const sortedScholarships = computed(() =>
  [...(scholarshipAndPunshiment.value?.scholarships ?? [])].sort(
    (a, b) => Number(a.awardYear) - Number(b.awardYear)
  )
)

const sortedPunishments = computed(() =>
  [...(scholarshipAndPunshiment.value?.punishments ?? [])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
)
</script>

<template>
  <v-container fluid>
    <!-- 奖学金 -->
    <v-card class="mb-2">
      <v-card-title class="text-center">奖学金记录</v-card-title>
      <v-card-text>
        <v-list v-if="sortedScholarships.length > 0" class="pt-0 pb-0">
          <template v-for="(s, index) in sortedScholarships" :key="'scholarship-' + index">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  {{ s.scholarshipName }}（{{ s.scholarshipLevel }}）
                </v-list-item-title>
                <div class="text-body-2 text">获奖年份：{{ s.awardYear }}</div>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="index < sortedScholarships.length - 1" />
          </template>
        </v-list>
        <div v-else class="text-grey">暂无奖学金记录</div>
      </v-card-text>
    </v-card>

    <!-- 处分 -->
    <v-card>
      <v-card-title class="text-center">处分记录</v-card-title>
      <v-card-text>
        <v-list v-if="sortedPunishments.length > 0">
          <template v-for="(p, index) in sortedPunishments" :key="'punishment-' + index">
            <v-list-item class="pt-0 pb-0">
              <v-list-item-content>
                <v-list-item-title>{{ p.punishmentName }}</v-list-item-title>
                <div class="text-body-2 text">
                  <div>处分日期：{{ p.date }}</div>
                  <div>原因：{{ p.reason }}</div>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-divider v-if="index < sortedPunishments.length - 1" />
          </template>
        </v-list>
        <div v-else class="text-grey">暂无处分记录</div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<style scoped>
.text {
  padding: 8px;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>
