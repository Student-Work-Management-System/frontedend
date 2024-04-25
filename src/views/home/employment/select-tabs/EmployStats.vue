<script lang="ts" setup>
import { ref } from 'vue'
import { VChart, type ISpec } from '@visactor/vchart';
import { notify } from '@kyvg/vue3-notification'
import { apiStatsEmploy, apiDownloadStatsEmploy, type EmployStats } from '@/api/employ'

const loading = ref(false)
const selectedMajor = ref<string | null>(null)
const selectedYear = ref<string | null>(null)
const majorName = ref('')
const salary = ref("")
const statusChartRef = ref()
const locationChartRef = ref()
const industryChartRef = ref()

const stats = ref<EmployStats>()

const checkQueryField = () => {
  if (selectedYear.value == null) {
    notify({ type: "warn", title: "提示", text: "请至少选择一个年份！" })
    loading.value = false
    return false
  }
  if (selectedMajor.value == null) {
    notify({ type: "warn", title: "提示", text: "请至少选择一个专业！" })
    loading.value = false
    return false
  }
  return true
}

const getStatsDataHandler = async () => {
  loading.value = true

  if (!checkQueryField()) return
  const { data: result } = await apiStatsEmploy({
    graduationYears: [selectedYear.value as string],
    majorIds: selectedMajor.value === null ? [] : [selectedMajor.value]
  })
  if (result.code !== 200) {
    console.error(result)
    notify({ title: '错误', text: result.message, type: 'error' })
    loading.value = false
    return
  }
  majorName.value = Object.keys(result.data)[0]

  if (result.data[majorName.value] === undefined) {
    stats.value = {
      graduationStatus: [],
      jobLocation: {},
      jobIndustry: {},
      salary: "0"
    }
    notify({ type: "warn", title: "提示", text: "没有数据返回！" })
    loading.value = false
    return
  }
  stats.value = result.data[majorName.value]
  salary.value = stats.value?.salary as string
  stats.value.graduationStatus = Object.keys(stats.value?.graduationStatus).map((key) => ({ type: key, value: stats.value?.graduationStatus[key] }))
  stats.value.jobLocation = Object.keys(stats.value?.jobLocation).map((key) => ({ type: key, value: stats.value?.jobLocation[key] }))
  stats.value.jobIndustry = Object.keys(stats.value?.jobIndustry).map((key) => ({ type: key, value: stats.value?.jobIndustry[key] }))

  const statusTotal = stats.value.graduationStatus?.reduce((total: number, item: { key: string, value: number }) => total + item.value, 0)
  const localtionTotal = stats.value.jobLocation?.reduce((total: number, item: { key: string, value: number }) => total + item.value, 0)
  const industryTotal = stats.value.jobIndustry?.reduce((total: number, item: { key: string, value: number }) => total + item.value, 0)

  stats.value.graduationStatus = stats.value.graduationStatus.map((item: { key: string, value: number }) => ({ ...item, value: item.value * 100 / statusTotal, number: item.value }))
  stats.value.jobLocation = stats.value.jobLocation.map((item: { key: string, value: number }) => ({ ...item, value: item.value * 100 / localtionTotal, number: item.value }))
  stats.value.jobIndustry = stats.value.jobIndustry.map((item: { key: string, value: number }) => ({ ...item, value: item.value * 100 / industryTotal, number: item.value }))

  notify({ title: '成功', text: '获取统计成功！', type: 'success' })
  updateChart()
  console.log(stats.value)
  loading.value = false
}
const exportStatsExeclHandler = async () => {
  if (!checkQueryField()) return
  loading.value = true
  const { data: result } = await apiDownloadStatsEmploy({
    graduationYears: [selectedYear.value as string],
    majorIds: selectedMajor.value === null ? [] : [selectedMajor.value]
  })
  notify({ title: '成功', text: '下载已开始！', type: 'success' })

  const url = URL.createObjectURL(result);
  const a = document.createElement('a');
  a.href = url;
  a.download = selectedYear.value as string + '-学生就业信息-就业情况统计.xlsx';
  a.click();
  URL.revokeObjectURL(url);
  loading.value = false
}

const parseISpec = (title: string, data: { type: string, value: any }[]): ISpec => ({
  type: 'pie',
  data: {
    values: data
  },
  outerRadius: 0.8,
  valueField: 'value',
  categoryField: 'type',
  title: {
    visible: true,
    text: majorName.value + "-" + title
  },
  legends: {
    visible: true,
    orient: 'left',
  },
  label: {
    visible: true,
  },
  tooltip: {
    mark: {
      content: [
        {
          key: datum => datum['type'],
          value: datum => datum['number'] + `(${datum['value']}%)`
        }
      ]
    }
  }
});

let statusChart: VChart;
let jobIndustryChart: VChart;
let jobLocationChart: VChart;
const updateChart = () => {
  loading.value = true
  if (statusChart === undefined) {
    statusChart = new VChart(parseISpec("就业状态", stats.value?.graduationStatus), { dom: statusChartRef.value })
    statusChart.renderSync()

    jobIndustryChart = new VChart(parseISpec("所处产业", stats.value?.jobIndustry), { dom: industryChartRef.value })
    jobIndustryChart.renderSync()

    jobLocationChart = new VChart(parseISpec("工作地点", stats.value?.jobLocation), { dom: locationChartRef.value })
    jobLocationChart.renderSync()
    loading.value = false
    return
  }
  statusChart?.updateSpec(parseISpec("就业分析", stats.value?.graduationStatus));
  statusChart?.renderAsync();
  loading.value = false
}

</script>
<template>
  <section class="h-100 d-flex flex-column">
    <section class="menu">
      <span class="w-20">
        <MajorSelect v-model="selectedMajor" variant="underlined" />
      </span>
      <span class="w-20">
        <GradeSelect v-model="selectedYear" label="毕业年份" variant="underlined" />
      </span>

      <v-btn prepend-icon="mdi-poll" color="indigo" :loading="loading" @click="getStatsDataHandler">统计分析</v-btn>
      <v-btn prepend-icon="mdi-export" :loading="loading" @click="exportStatsExeclHandler">导出表格</v-btn>
    </section>
    <v-card :loading="loading" class="chart-container">
      <h1 v-if="salary.length > 0" class="text-indigo ma-8 text-weigh-black font-weight-medium">平均月薪：{{ salary }}</h1>
      <span class="d-flex justify-space-evenly mb-4">
        <v-card>
          <div ref="statusChartRef"></div>
        </v-card>
        <v-card>
          <div ref="locationChartRef"></div>
        </v-card>
      </span>
      <div class="box">
        <v-card>
          <div ref="industryChartRef"></div>
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
