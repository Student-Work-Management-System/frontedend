<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(false)
const selectedMajor = ref<string | null>()
const selectedYear = ref<string | null>()
const getStatsDataHandler = () => { }
const exportStatsExeclHandler = () => { }

</script>

<template>
  <section class="h-100 d-flex flex-column">
    <section class="menu">
      <span class="w-20">
        <MajorSelect v-model="selectedMajor" variant="underlined" />
      </span>
      <span class="w-20">
        <GradeSelect v-model="selectedYear" label="招生年份" variant="underlined" />
      </span>

      <v-btn prepend-icon="mdi-poll" color="indigo" :loading="loading" @click="getStatsDataHandler">统计分析</v-btn>
      <v-btn prepend-icon="mdi-export" :loading="loading" @click="exportStatsExeclHandler">导出表格</v-btn>
    </section>
    <v-card :loading="loading" class="chart-container pt-8">
      <span class="d-flex justify-space-evenly">
        <v-card>
          <div ref="enrollStateChartRef"></div>
        </v-card>
        <v-card>
          <div ref="originChartRef"></div>
        </v-card>
      </span>
      <div class="box">
        <v-card>
          <div ref="scoreChartRef"></div>
        </v-card>
      </div>
    </v-card>
  </section>
</template>

<style scoped>
.menu {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0rem 1rem 0 1rem;
}

.menu>* {
  margin-right: 0.5rem;
}

.w-20 {
  width: 15% !important;
}

.chart-container {
  height: 79vh;
  overflow: hidden;
  overflow-y: auto;
}

.box {
  padding: 3rem 5.2rem 3rem 5.2rem;
}
</style>
