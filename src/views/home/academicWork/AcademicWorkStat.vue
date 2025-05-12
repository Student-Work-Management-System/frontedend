<template>
  <v-card elevation="8" class="pa-4 d-flex flex-column fill-height">
    <div class="d-flex align-center justify-space-between mb-4">
      <h2 class="text-h5 font-weight-bold">📊 学术著作统计</h2>
      <v-btn
        prepend-icon="mdi-refresh"
        @click="fetchStat"
        :loading="loading"
        text="刷新"
        color="primary"
        variant="flat"
      />
    </div>

    <div class="d-flex flex-column flex-grow-1 stat-card-wrapper" v-if="stat">
      <v-row>
        <v-col cols="12" sm="4">
          <v-sheet class="stat-card bg-paper">
            <h3 class="text-h6 font-weight-medium mb-4">📄 论文统计</h3>
            <div class="stat-item">
              <div class="stat-label">会议论文</div>
              <div class="stat-value">{{ stat.paperStat.meetingNumber }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">中文核心</div>
              <div class="stat-value">{{ stat.paperStat.chineseCoreNumber }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">EI 收录</div>
              <div class="stat-value">{{ stat.paperStat.ei_Number }}</div>
            </div>
          </v-sheet>
        </v-col>

        <v-col cols="12" sm="4">
          <v-sheet class="stat-card bg-patent">
            <h3 class="text-h6 font-weight-medium mb-4">📜 专利统计</h3>
            <div class="stat-item">
              <div class="stat-label">专利数量</div>
              <div class="stat-value">{{ stat.patentStat.number }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">总数</div>
              <div class="stat-value">{{ stat.patentStat.totalNumber }}</div>
            </div>
          </v-sheet>
        </v-col>

        <v-col cols="12" sm="4">
          <v-sheet class="stat-card bg-soft">
            <h3 class="text-h6 font-weight-medium mb-4">💻 软件著作统计</h3>
            <div class="stat-item">
              <div class="stat-label">软件著作数量</div>
              <div class="stat-value">{{ stat.softStat.number }}</div>
            </div>
          </v-sheet>
        </v-col>
      </v-row>
    </div>

    <v-card
      v-else
      class="mt-6 d-flex align-center justify-center pa-6 flex-grow-1"
      color="grey-lighten-4"
    >
      <v-card-title class="text-center text-grey">暂无统计数据</v-card-title>
    </v-card>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { apiGetStat } from '@/api/academicWork'
import type { AcademicWorkStatGroup } from '@/model/academicWorkModel'

const loading = ref(false)
const stat = ref<AcademicWorkStatGroup | null>(null)

const fetchStat = async () => {
  try {
    loading.value = true
    const { data: result } = await apiGetStat()
    if (result.code !== 200) {
      notify({ type: 'error', title: '获取失败', text: result.message })
      return
    }
    stat.value = result.data
  } catch (e) {
    console.error(e)
    notify({ type: 'error', title: '请求错误', text: '请检查网络或稍后重试' })
  } finally {
    loading.value = false
  }
}

onMounted(fetchStat)
</script>

<style scoped>
.stat-card-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-card {
  flex: 1;
  padding: 20px;
  border-radius: 12px;
  overflow: auto;
  display: flex;
  flex-direction: column; /* 使内容上下排列 */
  justify-content: flex-start;
}

.bg-paper {
  background-color: #e3f2fd; /* 蓝色 */
}

.bg-patent {
  background-color: #e8f5e9; /* 绿色 */
}

.bg-soft {
  background-color: #fff8e1; /* 黄色 */
}

.stat-item {
  display: flex;
  flex-direction: column; /* 上下排列 */
  align-items: flex-start;
  padding-left: 8px;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}
</style>
