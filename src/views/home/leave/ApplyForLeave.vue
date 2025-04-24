<script setup lang="ts">
import { apiGetOwnStudentLeave, apiDestroyStudentLeave } from '@/api/leave'
import { apiDownloadFile } from '@/api/file'
import { leaveTableHeader } from '@/misc/table'
import { useUserStore } from '@/stores/userStore'
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import type { StudentLeaveItem } from '@/model/leaveModel'
import type { BaseQuery } from '@/api'
import moment from 'moment'
import AddStudentLeaveDialog from '@/components/home/leave/AddStudentLeaveDialog.vue'
import type { AuditState } from '@/model'
import DestoryLeaveDialog from '@/components/home/leave/DestoryLeaveDialog.vue'

const loading = ref(false)
const data = ref<StudentLeaveItem[]>([])
const addDialog = ref(false)
const destoryDialog = ref(false)
const store = useUserStore()

const baseQuery = reactive<BaseQuery>({
  pageNo: 1,
  pageSize: 10
})
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const getOwnStudentLeave = async () => {
  try {
    loading.value = true
    const { data: result } = await apiGetOwnStudentLeave(baseQuery)
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    data.value = result.data.records
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
onMounted(getOwnStudentLeave)

const selectedItem = ref<StudentLeaveItem>({
  leaveId: '',
  studentId: '',
  name: '',
  gradeName: '',
  majorName: '',
  type: '',
  reason: '',
  target: '',
  targetDetail: '',
  internship: false,
  startDay: '',
  endDay: '',
  destroyed: false,
  auditId: '',
  counselorId: '',
  counselorHandleTime: '',
  counselorHandleState: '审核中',
  leaderId: '',
  leaderHandleTime: '',
  leaderHandleState: '审核中',
  revoked: false,
  evidences: []
})
const setSelectItem = (item: StudentLeaveItem) => {
  selectedItem.value = item
  destoryDialog.value = true
}
const destoryLeave = async (item: StudentLeaveItem) => {
  try {
    loading.value = true
    const { data: result } = await apiDestroyStudentLeave(item.leaveId)
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    notify({ type: 'success', title: '成功', text: '销假成功' })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
    getOwnStudentLeave()
  }
}

const afterLogic = () => {
  addDialog.value = false
  getOwnStudentLeave()
}

const showDetory = (item: StudentLeaveItem): boolean => {
  return (
    has('student_leave_audit:update:student') && getResultState(item) == '通过' && !item.destroyed
  )
}

const getResultState = (item: StudentLeaveItem): AuditState => {
  let startDay = moment(item.startDay)
  let endDay = moment(item.endDay)
  let totalDay = endDay.diff(startDay, 'days') + 1
  if (totalDay <= 7) return item.counselorHandleState
  if (item.counselorHandleState !== '通过') return '拒绝'
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

// 高度计算相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - 100
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
    <AddStudentLeaveDialog v-model="addDialog" @on-closed="afterLogic" />
    <DestoryLeaveDialog v-model="destoryDialog" @destory="destoryLeave(selectedItem)" />
    <section class="menu">
      <v-btn
        v-if="has('student_leave:select:student') && has('student_leave_audit:select:student')"
        prepend-icon="mdi-refresh"
        @click="getOwnStudentLeave()"
        text="刷新"
      />
      <v-btn
        v-if="has('student_leave:insert') && has('student_leave_audit:insert')"
        prepend-icon="mdi-plus-circle"
        color="primary"
        @click="addDialog = true"
        text="添加请假记录"
      />
    </section>
    <section class="pa-4 w-100" ref="tableDom">
      <v-card>
        <v-data-table
          :headers="leaveTableHeader as any"
          :height="tableHeight"
          :items="data"
          :loading="loading"
          v-model:page="baseQuery.pageNo"
          v-model:items-per-page="baseQuery.pageSize"
          return-object
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.internship="{ item }">
            {{ item.internship ? '是' : '否' }}
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.state="{ item }">
            <v-chip
              class="mr-1"
              :prepend-icon="checkStateIcon(getResultState(item))"
              :color="checkStateColor(getResultState(item))"
            >
              {{ getResultState(item) }}
            </v-chip>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.time="{ item }">
            {{ getLastTime(item) }}
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.destory="{ item }">
            {{ item.destroyed ? '是' : '否' }}
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.operations="{ item }">
            <div class="d-flex justify-center">
              <v-btn
                v-if="showDetory(item)"
                @click="setSelectItem(item)"
                color="indigo"
                text="销假"
              />
            </div>
          </template>
        </v-data-table>
      </v-card>
    </section>
  </v-card>
</template>

<style scoped>
.menu {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1rem 1rem 0 1rem;
}

.menu > * {
  margin-right: 0.5rem;
}

.file {
  overflow: hidden;
  width: 26%;
}

.w-20 {
  width: 15% !important;
}
</style>
