<script lang="ts" setup>
import { ref } from 'vue'
import { VChart, type ISpec } from '@visactor/vchart';
import { useUserStore } from '@/stores/user';
import { notify } from '@kyvg/vue3-notification'
import { apiDownloadStatsEnroll, apiStatsEnroll, type EnrollStats } from '@/api/enroll';

const selectedMajor = ref<string | null>(null)
const selectedYear = ref<string | null>(null)
const majorName = ref('')
const loading = ref(false)
const stats = ref<EnrollStats>()
const enrollStateChartRef = ref()
const originChartRef = ref()
const scoreChartRef = ref()

const checkQueryField = () => {
  if (selectedMajor.value == null) {
    notify({ type: "warn", title: "提示", text: "请至少选择一个专业！" })
    loading.value = false
    return false
  }
  if (selectedYear.value == null) {
    notify({ type: "warn", title: "提示", text: "请至少选择一个年份！" })
    loading.value = false
    return false
  }
  return true
}
const getStatsDataHandler = async () => {
  if (!checkQueryField()) return
  loading.value = true
  const { data: result } = await apiStatsEnroll({
    enrollmentYears: [selectedYear.value as string],
    majorIds: selectedMajor.value === null ? [] : [selectedMajor.value]
  })
  if (result.code !== 200) {
    console.error(result)
    notify({ title: '错误', text: result.message, type: 'error' })
    loading.value = false
    return
  }

  if (result.data === null) {
    stats.value = {
      origin: {},
      enrollmentState: {},
      regionScores: {},
    }
    notify({ type: "warn", title: "提示", text: "没有数据返回！" })
    loading.value = false
    return
  }

  majorName.value = Object.keys(result.data)[0]
  stats.value = result.data[majorName.value]
  stats.value.enrollmentState = [{
    type: "第一志愿录取",
    number: stats.value.enrollmentState["第一志愿录取人数"],
    value: stats.value.enrollmentState["第一志愿录取人数"] * 100 / stats.value.enrollmentState["总录取人数"]
  }, {
    type: "第一志愿未录取",
    number: stats.value.enrollmentState["总录取人数"] - stats.value.enrollmentState["第一志愿录取人数"],
    value: 100 - (stats.value.enrollmentState["第一志愿录取人数"] * 100 / stats.value.enrollmentState["总录取人数"])
  },
  ]
  stats.value.origin = Object.keys(stats.value.origin).map((key) => ({ type: key, value: stats.value?.origin[key] }))
  const originTotal = stats.value.origin?.reduce((total: number, item: { key: string, value: number }) => total + item.value, 0)
  stats.value.origin = stats.value.origin.map((item: { key: string, value: number }) => ({ ...item, value: item.value * 100 / originTotal, number: item.value }))

  console.log(stats.value.regionScores)
  stats.value.regionScores = Object.keys(stats.value.regionScores)
    .map((key) => ({ type: key, value: stats.value?.regionScores[key] }))
    .flatMap(pItem => Object.keys(pItem.value).map((key) => ({ type: pItem.type, level: key, value: pItem.value[key] })))

  notify({ title: '成功', text: '获取统计成功！', type: 'success' })
  updateChart()
  loading.value = false
}
const exportStatsExeclHandler = async () => {
  if (!checkQueryField()) return
  loading.value = true
  const { data: result } = await apiDownloadStatsEnroll({
    enrollmentYears: [selectedYear.value as string],
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

const parsePieISpec = (title: string, data: { type: string, value: any }[]): ISpec => ({
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

const parseBarISpec = (title: string, data: { type: string, level: string, value: any }[]): ISpec => ({
  type: 'bar',
  data: {
    values: data
  },
  xField: ['type', 'level'],
  yField: 'value',
  seriesField: 'level',
  title: {
    visible: true,
    text: majorName.value + "-" + title
  },
  animationAppear: {
    duration: 1500,
    easing: 'linear'
  },
  legends: [{ visible: true, position: 'middle', orient: 'bottom' }],
  axes: [
    {
      orient: 'left',
      label: {
        formatMethod(val) {
          return val;
        }
      }
    }
  ]
});


let enrollStateChart: VChart;
let originChart: VChart;
let scoreChart: VChart;
const updateChart = () => {
  loading.value = true
  if (enrollStateChart === undefined) {
    enrollStateChart = new VChart(parsePieISpec("录取人数", stats.value?.enrollmentState), { dom: enrollStateChartRef.value })
    enrollStateChart.renderSync()

    originChart = new VChart(parsePieISpec("生源地", stats.value?.origin), { dom: originChartRef.value })
    originChart.renderSync()

    scoreChart = new VChart(parseBarISpec("工作地点", stats.value?.regionScores), { dom: scoreChartRef.value })
    scoreChart.renderSync()
    loading.value = false
    return
  }
  enrollStateChart?.updateSpec(parsePieISpec("就业分析", stats.value?.enrollmentState));
  enrollStateChart?.renderAsync();
  originChart?.updateSpec(parsePieISpec("生源地", stats.value?.origin));
  originChart.renderSync()
  scoreChart?.updateSpec(parseBarISpec("工作地点", stats.value?.regionScores))
  scoreChart.renderSync()
  loading.value = false
}

const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
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

      <v-btn v-if="has('enrollment:select')" prepend-icon="mdi-poll" color="indigo" :loading="loading"
        @click="getStatsDataHandler">统计分析</v-btn>
      <v-btn v-if="has('enrollment:select') && has('file:download')" prepend-icon="mdi-export" :loading="loading"
        @click="exportStatsExeclHandler">导出表格</v-btn>
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
