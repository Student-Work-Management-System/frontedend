<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import type { StudentStatusItem } from '@/model/studentModel'
import { apiGetStudentStatus } from '@/api/student'
import { useBaseStore } from '@/stores/baseStore'
import { debounce } from '@visactor/vchart/esm/util'
import { notify } from '@kyvg/vue3-notification'
import { useUserStore } from '@/stores/userStore'

const baseStore = useBaseStore()
const studentQuery = baseStore.getStudentQuery
const userStore = useUserStore()

// 计算当前学历层次名称
const currentDegreeName = computed(() => {
  const degrees = userStore.getUserData.chargeDegrees
  const currentDegree = degrees?.find((degree) => degree.degreeId === studentQuery.degreeId)
  return currentDegree?.degreeName || ''
})

// 计算当前年级名称
const currentGradeName = computed(() => {
  const grades = userStore.getUserData.chargeGrades
  const currentGrade = grades?.find((grade) => grade.gradeId === studentQuery.gradeId)
  return currentGrade?.gradeName || ''
})

// 计算表格标题
const tableTitle = computed(() => {
  return `${currentGradeName.value}${currentDegreeName.value}学生信息统计`
})

// Mock数据 - 2021级各专业统计
const tableData = ref<StudentStatusItem[]>([
  {
    majorName: '计算机科学与技术',
    totalCount: 120,
    normalCount: 110,
    suspendCount: 2,
    militaryCount: 3,
    returnCount: 1,
    transferInCount: 4,
    transferOutCount: 2,
    dropOfEnrollmentCount: 0,
    retainEnrollmentCount: 1,
    graduationCount: 0,
    gradCount: 0,
    droppedCount: 1,
    rechristenCount: 0,
    deathCount: 0,
    maleCount: 85,
    femaleCount: 35,
    massCount: 40,
    leagueCount: 65,
    partyCount: 10,
    prepareCount: 5,
    disabilityCount: 0,
    minorityCount: 8,
    originData: []
  },
  {
    majorName: '软件工程',
    totalCount: 110,
    normalCount: 102,
    suspendCount: 1,
    militaryCount: 2,
    returnCount: 2,
    transferInCount: 3,
    transferOutCount: 1,
    dropOfEnrollmentCount: 0,
    retainEnrollmentCount: 0,
    graduationCount: 0,
    gradCount: 0,
    droppedCount: 0,
    rechristenCount: 0,
    deathCount: 0,
    maleCount: 75,
    femaleCount: 35,
    massCount: 35,
    leagueCount: 60,
    partyCount: 8,
    prepareCount: 7,
    disabilityCount: 1,
    minorityCount: 0,
    originData: []
  },
  {
    majorName: '网络工程',
    totalCount: 90,
    normalCount: 85,
    suspendCount: 1,
    militaryCount: 1,
    returnCount: 0,
    transferInCount: 2,
    transferOutCount: 2,
    dropOfEnrollmentCount: 0,
    retainEnrollmentCount: 0,
    graduationCount: 0,
    gradCount: 0,
    droppedCount: 0,
    rechristenCount: 0,
    deathCount: 0,
    maleCount: 60,
    femaleCount: 30,
    massCount: 30,
    leagueCount: 50,
    partyCount: 6,
    prepareCount: 4,
    disabilityCount: 0,
    minorityCount: 0,
    originData: []
  },
  {
    majorName: '人工智能',
    totalCount: 100,
    normalCount: 95,
    suspendCount: 0,
    militaryCount: 2,
    returnCount: 1,
    transferInCount: 2,
    transferOutCount: 1,
    dropOfEnrollmentCount: 0,
    retainEnrollmentCount: 0,
    graduationCount: 0,
    gradCount: 0,
    droppedCount: 0,
    rechristenCount: 0,
    deathCount: 0,
    maleCount: 70,
    femaleCount: 30,
    massCount: 32,
    leagueCount: 55,
    partyCount: 8,
    prepareCount: 5,
    disabilityCount: 0,
    minorityCount: 0,
    originData: []
  }
])

// 表格合计行
const getSummaries = (param: any) => {
  const { columns, data } = param
  const sums: string[] = []
  columns.forEach((column: any, index: number) => {
    if (index === 0) {
      sums[index] = '总计'
      return
    }
    const values = data.map((item: any) => Number(item[column.property]))
    if (!values.every((value: number) => isNaN(value))) {
      sums[index] = `${values.reduce((prev: number, curr: number) => {
        const value = Number(curr)
        if (!isNaN(value)) {
          return prev + curr
        } else {
          return prev
        }
      }, 0)}`
    } else {
      sums[index] = ''
    }
  })
  return sums
}

onMounted(() => {
  refreshData()
})

const refreshData = async () => {
  const { data: result } = await apiGetStudentStatus(studentQuery)
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
  }
  console.log(result.data)
  tableData.value = result.data
}

watch(
  () => ({
    gradeId: studentQuery.gradeId,
    degreeId: studentQuery.degreeId
  }),
  debounce((newVal) => {
    refreshData()
  }, 300),
  { deep: true }
)
</script>

<template>
  <div class="status-table">
    <div class="table-header">
      <h3>{{ tableTitle }}</h3>
    </div>
    <el-table
      :data="tableData"
      border
      show-summary
      :summary-method="getSummaries"
      style="width: 100%"
      :header-cell-style="{
        background: '#F5F7FA',
        color: '#606266',
        fontWeight: 600
      }"
    >
      <el-table-column prop="majorName" label="专业" align="center" min-width="180" fixed="left" />
      <el-table-column prop="totalCount" label="总人数" align="center" width="90" fixed="left" />

      <el-table-column label="学籍状态" align="center">
        <el-table-column prop="normalCount" label="在籍" align="center" width="90" />
        <el-table-column prop="suspendCount" label="休学" align="center" width="90" />
        <el-table-column prop="militaryCount" label="入伍" align="center" width="90" />
        <el-table-column prop="returnCount" label="复学" align="center" width="90" />
        <el-table-column prop="transferInCount" label="转入" align="center" width="90" />
        <el-table-column prop="transferOutCount" label="转出" align="center" width="90" />
        <el-table-column prop="dropOfEnrollmentCount" label="放弃入学" align="center" width="90" />
        <el-table-column prop="retainEnrollmentCount" label="保留入学" align="center" width="90" />
        <el-table-column prop="graduationCount" label="结业" align="center" width="90" />
        <el-table-column prop="gradCount" label="毕业" align="center" width="90" />
        <el-table-column prop="droppedCount" label="退学" align="center" width="90" />
        <el-table-column prop="rechristenCount" label="改名" align="center" width="90" />
        <el-table-column prop="deathCount" label="死亡" align="center" width="90" />
      </el-table-column>

      <el-table-column label="政治面貌" align="center">
        <el-table-column prop="massCount" label="群众" align="center" width="90" />
        <el-table-column prop="leagueCount" label="共青团员" align="center" width="90" />
        <el-table-column prop="partyCount" label="中共党员" align="center" width="90" />
        <el-table-column prop="prepareCount" label="预备党员" align="center" width="90" />
      </el-table-column>

      <el-table-column label="性别统计" align="center">
        <el-table-column prop="maleCount" label="男生" align="center" width="90" />
        <el-table-column prop="femaleCount" label="女生" align="center" width="90" />
      </el-table-column>

      <el-table-column label="其他统计" align="center">
        <el-table-column prop="disabilityCount" label="残疾" align="center" width="90" />
        <el-table-column prop="minorityCount" label="少数民族" align="center" width="90" />
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.status-table {
  padding: 0 16px 16px 16px;
  background-color: white;
  border-radius: 4px;
}

.table-header {
  margin-bottom: 16px;
}

.table-header h3 {
  color: #303133;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

:deep(.el-table__footer) {
  background-color: #f5f7fa;
  font-weight: 600;
}

:deep(.el-table__row) {
  height: 50px;
}

:deep(.el-table__header) th {
  background-color: #f5f7fa !important;
}

:deep(.el-table__header) th.is-leaf {
  background-color: #fafafa !important;
}

:deep(.el-table__fixed-right-patch) {
  background-color: #f5f7fa !important;
}
</style>
