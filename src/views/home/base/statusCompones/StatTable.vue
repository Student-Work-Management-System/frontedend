<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
import type { StudentStatItem } from '@/model/studentModel'
import { apiGetStudentStat } from '@/api/student'
import { useBaseStore } from '@/stores/baseStore'
import { debounce } from '@visactor/vchart/esm/util'
import { notify } from '@kyvg/vue3-notification'
import { useUserStore } from '@/stores/userStore'

const tableHeight = defineModel<number>('tableHeight')
const baseStore = useBaseStore()
const studentQuery = baseStore.getStudentQuery
const userStore = useUserStore()

// 计算当前学历层次名称
const currentDegreeName = computed(() => {
  const degrees = baseStore.getDegreeList()
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

const tableData = ref<StudentStatItem[]>([])

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
  const { data: result } = await apiGetStudentStat(studentQuery)
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
  }
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
    <div class="table-container">
      <el-table
        :data="tableData"
        border
        show-summary
        :height="tableHeight"
        :summary-method="getSummaries"
        style="width: 100%"
        :header-cell-style="{
          background: '#F5F7FA',
          color: '#606266',
          fontWeight: 600
        }"
      >
        <el-table-column
          prop="majorName"
          label="专业"
          align="center"
          min-width="180"
          fixed="left"
        />
        <el-table-column prop="totalCount" label="总人数" align="center" width="90" fixed="left" />

        <el-table-column label="学籍状态" align="center">
          <el-table-column prop="normalCount" label="在籍" align="center" width="90" />
          <el-table-column prop="suspendCount" label="休学" align="center" width="90" />
          <el-table-column prop="militaryCount" label="入伍" align="center" width="90" />
          <el-table-column prop="returnCount" label="复学" align="center" width="90" />
          <el-table-column prop="transferInCount" label="转入" align="center" width="90" />
          <el-table-column prop="transferOutCount" label="转出" align="center" width="90" />
          <el-table-column
            prop="dropOfEnrollmentCount"
            label="放弃入学"
            align="center"
            width="90"
          />
          <el-table-column
            prop="retainEnrollmentCount"
            label="保留入学"
            align="center"
            width="90"
          />
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
  </div>
</template>

<style scoped>
.status-table {
  padding: 0 16px 16px 16px;
  background-color: white;
  border-radius: 4px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-header {
  flex: none;
  margin-bottom: 16px;
}

.table-header h3 {
  color: #303133;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.table-container {
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

:deep(.el-table) {
  height: 100% !important;
}

:deep(.el-table__body-wrapper) {
  overflow-y: auto;
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
