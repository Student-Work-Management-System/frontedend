<script setup lang="ts">
import { apiGetAuditRecord, leaveTypes, auditStates } from '@/api/leave'
import { apiDownloadFile } from '@/api/file'
import { leaveTableHeader } from '@/misc/table'
import { useUserStore } from '@/stores/userStore'
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import type { StudentLeaveItem, AuditLeaveQuery } from '@/model/leaveModel'
import moment from 'moment'
import type { AuditState } from '@/model'
import ItemSelect from '@/components/home/ItemSelect.vue'
import TrueOrFalseSelect from '@/components/home/TrueOrFalseSelect.vue'

const loading = ref(false)
const data = ref<StudentLeaveItem[]>([])
const store = useUserStore()
const chargeGrades = store.getUserData.chargeGrades
const totalRow = ref(0)
const query = reactive<AuditLeaveQuery>({
  search: '',
  gradeId: null,
  majorId: null,
  totalDay: null,
  counselorHandleState: null,
  leaderHandleState: null,
  destroyed: null,
  type: null,
  pageNo: 1,
  pageSize: 25
})
const handleCurrentChange = (val: number) => {
  query.pageNo = val
}
const handleSizeChange = (val: number) => {
  query.pageSize = val
}

const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const getAuditRecords = async () => {
  try {
    loading.value = true
    const { data: result } = await apiGetAuditRecord(query)
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    data.value = result.data.records
    totalRow.value = result.data.totalRow
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const getResultState = (item: StudentLeaveItem): AuditState => {
  let startDay = moment(item.startDay)
  let endDay = moment(item.endDay)
  let totalDay = endDay.diff(startDay, 'days') + 1
  if (totalDay <= 7) return item.counselorHandleState
  if (item.counselorHandleState === '审核中') return '审核中'
  if (item.counselorHandleState === '拒绝') return '拒绝'
  return item.leaderHandleState
}

const getLastTime = (item: StudentLeaveItem): string => {
  let startDay = moment(item.startDay)
  let endDay = moment(item.endDay)
  let totalDay = endDay.diff(startDay, 'days') + 1
  if (totalDay <= 7) return item.counselorHandleTime
  return item.leaderHandleTime
}

const checkStateColor = (state: AuditState): 'indigo' | 'green' | 'error' => {
  switch (state) {
    case '审核中':
      return 'indigo'
    case '通过':
      return 'green'
    default:
      return 'error'
  }
}

const checkStateIcon = (state: AuditState): string => {
  switch (state) {
    case '审核中':
      return 'mdi-progress-clock'
    case '通过':
      return 'mdi-progress-check'
    default:
      return 'mdi-progress-close'
  }
}

const booleanFormatter = (destroyed: boolean) => {
  return destroyed ? '是' : '否'
}

// 高度计算相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - 90
})

onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.classList.contains('card-container')) {
        containerHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('menu')) {
        selectMenuHeight.value = entry.contentRect.height
      }
    }
  })

  // 观察元素
  const container = document.querySelector('.card-container')
  const selectMenu = document.querySelector('.menu')

  if (container) resizeObserver.observe(container)
  if (selectMenu) resizeObserver.observe(selectMenu)

  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <section class="menu">
      <span class="w-10">
        <ItemSelect
          v-model="query.type"
          :items="leaveTypes"
          label="请假类型"
          variant="underlined"
        />
      </span>
      <span v-if="has('student_leave_audit:update:counselor')" class="w-10">
        <ItemSelect
          v-model="query.counselorHandleState"
          :items="auditStates"
          label="审批状态"
          variant="underlined"
        />
      </span>
      <span v-if="has('student_leave_audit:update:leader')" class="w-10">
        <ItemSelect
          v-model="query.leaderHandleState"
          :items="auditStates"
          label="审批状态"
          variant="underlined"
        />
      </span>
      <span class="w-10">
        <GradeSelect
          v-model="query.gradeId"
          :charge-grades="chargeGrades"
          class="text-indigo"
          variant="underlined"
        />
      </span>
      <span class="w-10">
        <MajorSelect v-model="query.majorId" class="text-indigo" variant="underlined" />
      </span>
      <span class="w-10">
        <TrueOrFalseSelect
          v-model="query.destroyed as boolean"
          label="是否销假"
          variant="underlined"
          :items="[
            { key: '是', value: true },
            { key: '否', value: false }
          ]"
        />
      </span>
      <span class="search">
        <v-text-field
          v-model="query.search"
          color="indigo"
          :loading="loading"
          clearable
          prepend-inner-icon="mdi-magnify"
          style="margin-left: 16px"
          label="搜索"
          variant="underlined"
          hide-details
          class="search-input text-indigo"
        >
          <v-tooltip activator="parent" location="top" text="以 学生学号 / 学生姓名 搜索" />
        </v-text-field>
      </span>
      <v-btn
        v-if="has('student_leave:select') && has('student_leave_audit:select')"
        prepend-icon="mdi-refresh"
        @click="getAuditRecords()"
        text="刷新"
      />
    </section>

    <section class="pa-4 w-100" ref="tableDom">
      <div class="container">
        <div class="table-container">
          <el-table
            :data="data"
            row-key="studentId"
            :height="tableHeight"
            :header-cell-style="{
              color: '#333333',
              fontSize: '14px',
              fontWeight: 700,
              background: '#F9FAFC'
            }"
            :cell-style="{
              padding: '5px',
              fontSize: '14px',
              color: 'black'
            }"
            size="small"
            border
            stripe
          >
            <el-table-column
              prop="studentId"
              align="center"
              label="学号"
              fixed="left"
              width="120"
            />
            <el-table-column prop="name" align="center" label="姓名" fixed="left" width="120" />
            <el-table-column
              v-for="header in leaveTableHeader"
              :key="header.key"
              :prop="header.key"
              :label="header.title"
              :align="header.align"
              :width="header.width"
              :show-overflow-tooltip="header.showOverflowTooltip"
              :formatter="header.formatter"
            />
            <el-table-column prop="state" label="审核状态" align="center" width="150">
              <template #default="{ row }">
                <v-chip
                  :color="checkStateColor(getResultState(row))"
                  :prepend-icon="checkStateIcon(getResultState(row))"
                >
                  {{ getResultState(row) }}
                </v-chip>
              </template>
            </el-table-column>
            <el-table-column prop="time" label="最后审核时间" align="center" width="150">
              <template #default="{ row }">
                {{ getLastTime(row) }}
              </template>
            </el-table-column>
            <el-table-column
              prop="destroyed"
              label="是否销假"
              align="center"
              fixed="right"
              width="150"
            >
              <template #default="{ row }">
                {{ booleanFormatter(row.destroyed) }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            style="
              display: flex;
              justify-content: flex-end;
              align-items: center;
              padding: 8px;
              font-size: 14px;
            "
            :current-page="query.pageNo"
            :page-size="query.pageSize"
            :page-sizes="[25, 50, 100, 200, 500, 1000]"
            :background="true"
            layout="total, sizes, prev, pager, next"
            :total="totalRow"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </section>
  </v-card>
</template>

<style scoped>
.menu {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  gap: 12px;
  align-items: center;
  justify-content: start;
  padding: 1rem 1rem 0 1rem;
}

.checkbox {
  transform: translateY(1px);
}

.file {
  overflow: hidden;
  width: 26%;
}

.search {
  width: 20% !important;
}

.w-10 {
  width: 10% !important;
}

.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table-container {
  flex: 1;
  overflow: hidden;
}

.pagination {
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 8px 16px;
  background-color: white;
  border-top: 1px solid #ebeef5;
}
</style>
