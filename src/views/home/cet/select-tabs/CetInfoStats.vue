<script setup lang="ts">
import { ref } from 'vue'
import { VChart, type ISpec } from '@visactor/vchart'
import { notify } from '@kyvg/vue3-notification'
import { apiCetStats, apiCetDownloadStatExcel } from '@/api/cet'
import SemesterSelect from '@/components/home/SemesterSelect.vue'

const loading = ref(false)
const selectedMajor = ref<string | null>(null)
const selectedTerm = ref<string | null>(null)
const majorName = ref('')
import { useUserStore } from '@/stores/user'

const stats = ref<any>({
  cet4: {},
  cet6: {},
  score: {}
})
const cet4ParticipateChartRef = ref()
const cet6ParticipateChartRef = ref()
const scoreChartRef = ref()

// 检验用户权限用的
const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const parsePieISpec = (title: string, data: { type: string; value: any }[]): ISpec => ({
  type: 'pie',
  data: {
    values: data
  },
  outerRadius: 0.8,
  valueField: 'value',
  categoryField: 'type',
  title: {
    visible: true,
    text: majorName.value + '-' + title
  },
  legends: {
    visible: true,
    orient: 'left'
  },
  label: {
    visible: true
  },
  tooltip: {
    mark: {
      content: [
        {
          key: (datum) => datum['type'],
          value: (datum) => datum['number'] + `(${datum['value']}%)`
        }
      ]
    }
  }
})

const parseBarISpec = (
  title: string,
  data: { type: string; level: string; value: any }[]
): ISpec => ({
  type: 'bar',
  data: {
    values: data
  },
  xField: ['type'],
  yField: 'value',
  seriesField: 'level',
  title: {
    visible: true,
    text: majorName.value + '-' + title
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
          return val
        }
      }
    }
  ]
})

const checkQueryField = () => {
  if (selectedMajor.value == null) {
    notify({ type: 'warn', title: '提示', text: '请至少选择一个专业！' })
    loading.value = false
    return false
  }
  if (selectedTerm.value == null) {
    notify({ type: 'warn', title: '提示', text: '请至少选择一个年份！' })
    loading.value = false
    return false
  }
  return true
}

const getStatsDataHandler = async () => {
  if (!checkQueryField()) return
  loading.value = true
  const { data: result } = await apiCetStats({
    examTimes: [selectedTerm.value as string],
    majorIds: selectedMajor.value === null ? [] : [selectedMajor.value]
  })
  if (result.code !== 200) {
    console.error(result)
    notify({ title: '错误', text: result.message, type: 'error' })
    loading.value = false
    return
  }

  if (result.data === null || result.data['CET4情况统计'] === undefined) {
    stats.value = {
      cet4: {},
      cet6: {},
      score: {}
    }
    notify({ type: 'warn', title: '提示', text: '无数据返回，请上传数据后重试！' })
    loading.value = false
    return
  }
  console.log(result.data)

  majorName.value = Object.keys(result.data['CET4情况统计'])[0]

  stats.value['CET4情况统计'] = result.data['CET4情况统计'][majorName.value]
  stats.value['CET6情况统计'] = result.data['CET6情况统计'][majorName.value]

  const cet4 = stats.value['CET4情况统计']
  const cet6 = stats.value['CET6情况统计']

  stats.value.cet4.state = [
    {
      type: '通过人数',
      value: toFixDot2((cet4['通过人数'] * 100) / cet4['总参与人数']),
      number: cet4['通过人数']
    },
    {
      type: '未通过人数',
      value: toFixDot2(((cet4['总参与人数'] - cet4['通过人数']) * 100) / cet4['总参与人数']),
      number: cet4['总参与人数'] - cet4['通过人数']
    }
  ]
  stats.value.cet6.state = [
    {
      type: '通过人数',
      value: toFixDot2((cet6['通过人数'] * 100) / cet6['总参与人数']),
      number: cet6['通过人数']
    },
    {
      type: '未通过人数',
      value: toFixDot2(((cet6['总参与人数'] - cet6['通过人数']) * 100) / cet6['总参与人数']),
      number: cet6['总参与人数'] - cet6['通过人数']
    }
  ]

  stats.value.score = [
    { type: 'CET4最高分', value: cet4['最高分'] },
    { type: 'CET6最高分', value: cet6['最高分'] }
  ]

  notify({ title: '成功', text: '获取统计成功！', type: 'success' })
  updateChart()
  loading.value = false
}

function toFixDot2(num: number): number {
  return Number(num.toFixed(2))
}

const exportStatsExeclHandler = async () => {
  if (!checkQueryField()) return
  loading.value = true
  const { data: result } = await apiCetDownloadStatExcel({
    examTimes: [selectedTerm.value as string],
    majorIds: selectedMajor.value === null ? [] : [selectedMajor.value]
  })
  notify({ title: '成功', text: '下载已开始！', type: 'success' })

  const url = URL.createObjectURL(result)
  const a = document.createElement('a')
  a.href = url
  a.download = (selectedTerm.value as string) + '-学生CET成绩情况统计.xlsx'
  a.click()
  URL.revokeObjectURL(url)
  loading.value = false
}

let cet4ParticipateStateChart: VChart
let cet6ParticipateStateChart: VChart
let scoreChart: VChart
const updateChart = () => {
  loading.value = true
  if (
    cet4ParticipateStateChart === undefined ||
    cet6ParticipateStateChart === undefined ||
    scoreChart === undefined
  ) {
    cet4ParticipateStateChart = new VChart(parsePieISpec('CET4通过率', stats.value.cet4.state), {
      dom: cet4ParticipateChartRef.value
    })
    cet4ParticipateStateChart.renderSync()

    cet6ParticipateStateChart = new VChart(parsePieISpec('CET6通过率', stats.value.cet6.state), {
      dom: cet6ParticipateChartRef.value
    })
    cet6ParticipateStateChart.renderSync()

    scoreChart = new VChart(parseBarISpec('考试分数', stats.value?.score), {
      dom: scoreChartRef.value
    })
    scoreChart.renderSync()
    loading.value = false
    return
  }
  cet4ParticipateStateChart?.updateSpec(parsePieISpec('CET4通过率', stats.value.cet4.state))
  cet4ParticipateStateChart?.renderAsync()
  cet6ParticipateStateChart?.updateSpec(parsePieISpec('CET6通过率', stats.value.cet6.state))
  cet6ParticipateStateChart.renderSync()
  scoreChart?.updateSpec(parseBarISpec('考试分数', stats.value?.score))
  scoreChart.renderSync()
  loading.value = false
}
</script>

<template>
  <section class="h-100 d-flex flex-column">
    <section class="menu">
      <span class="w-20 text-indigo">
        <SemesterSelect v-model="selectedTerm" variant="underlined" />
      </span>
      <span class="w-20">
        <MajorSelect v-model="selectedMajor" variant="underlined" />
      </span>
      <v-btn
        v-if="has('student_cet:select')"
        prepend-icon="mdi-poll"
        color="indigo"
        :loading="loading"
        @click="getStatsDataHandler"
        >统计分析</v-btn
      >
      <v-btn
        v-if="has('student_cet:select') && has('file:download')"
        prepend-icon="mdi-export"
        :loading="loading"
        @click="exportStatsExeclHandler"
        >导出表格</v-btn
      >
    </section>
    <v-card :loading="loading" class="chart-container pt-8">
      <span class="d-flex justify-space-evenly">
        <v-card>
          <div ref="cet4ParticipateChartRef"></div>
        </v-card>
        <v-card>
          <div ref="cet6ParticipateChartRef"></div>
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

.menu > * {
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
