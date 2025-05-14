<script setup lang="ts">
import { type PovertyAssistanceBase } from '@/model/studentModel'
import { computed } from 'vue'

const povertyAssistance = defineModel<PovertyAssistanceBase[]>()

// 按资助学年升序排序
const sortedAssistances = computed(() =>
  [...(povertyAssistance.value ?? [])].sort(
    (a, b) => Number(a.assistanceYear) - Number(b.assistanceYear)
  )
)
</script>

<template>
  <v-card>
    <v-card-text>
      <v-list v-if="sortedAssistances.length > 0" class="pt-0 pb-0">
        <template v-for="(item, index) in sortedAssistances" :key="'assist-' + index">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.povertyLevel }}（{{ item.povertyType }}）
              </v-list-item-title>
              <!-- 将多行信息移出 subtitle -->
              <div class="text-body-2 text-grey-darken-1">
                资助标准：{{ item.povertyAssistanceStandard }}
              </div>
              <div class="text-body-2 text-grey-darken-1">资助学年：{{ item.assistanceYear }}</div>
            </v-list-item-content>
          </v-list-item>
          <v-divider v-if="index < sortedAssistances.length - 1" />
        </template>
      </v-list>
      <div v-else class="text-grey">暂无贫困补助记录</div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.text-grey {
  color: #9e9e9e;
  padding: 8px;
}
</style>
