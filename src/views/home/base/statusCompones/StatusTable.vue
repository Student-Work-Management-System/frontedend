<script lang="ts" setup>
import { ref } from 'vue'

// Mock数据 - 2021级各专业统计
const tableData = ref([
  {
    majorId: '0801',
    majorName: '计算机科学与技术',
    totalCount: 120,
    // 学籍状态
    normalCount: 110,
    suspendCount: 2,
    militaryCount: 3,
    returnCount: 1,
    transferInCount: 4,
    transferOutCount: 2,
    // 性别
    maleCount: 85,
    femaleCount: 35,
    // 政治面貌
    massCount: 40, // 群众
    leagueCount: 65, // 共青团员
    partyCount: 10, // 中共党员
    prepareCount: 5, // 预备党员
    // 其他
    disabilityCount: 0,
    loanCount: 8
  },
  {
    majorId: '0802',
    majorName: '软件工程',
    totalCount: 110,
    normalCount: 102,
    suspendCount: 1,
    militaryCount: 2,
    returnCount: 2,
    transferInCount: 3,
    transferOutCount: 1,
    maleCount: 75,
    femaleCount: 35,
    massCount: 35,
    leagueCount: 60,
    partyCount: 8,
    prepareCount: 7,
    disabilityCount: 1,
    loanCount: 6
  },
  {
    majorId: '0803',
    majorName: '网络工程',
    totalCount: 90,
    normalCount: 85,
    suspendCount: 1,
    militaryCount: 1,
    returnCount: 0,
    transferInCount: 2,
    transferOutCount: 2,
    maleCount: 60,
    femaleCount: 30,
    massCount: 30,
    leagueCount: 50,
    partyCount: 6,
    prepareCount: 4,
    disabilityCount: 0,
    loanCount: 5
  },
  {
    majorId: '0804',
    majorName: '人工智能',
    totalCount: 100,
    normalCount: 95,
    suspendCount: 0,
    militaryCount: 2,
    returnCount: 1,
    transferInCount: 2,
    transferOutCount: 1,
    maleCount: 70,
    femaleCount: 30,
    massCount: 32, // 群众
    leagueCount: 55, // 共青团员
    partyCount: 8, // 中共党员
    prepareCount: 5, // 预备党员
    disabilityCount: 0,
    loanCount: 7
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
</script>

<template>
  <div class="status-table">
    <div class="table-header">
      <h3>2021级学生学籍状态统计</h3>
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
        <el-table-column prop="militaryCount" label="入伍保留" align="center" width="90" />
        <el-table-column prop="returnCount" label="复学" align="center" width="90" />
        <el-table-column prop="transferInCount" label="转入" align="center" width="90" />
        <el-table-column prop="transferOutCount" label="转出" align="center" width="90" />
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
        <el-table-column prop="loanCount" label="助学贷款" align="center" width="90" />
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped>
.status-table {
  margin-top: 16px;
  background-color: white;
  padding: 16px;
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
