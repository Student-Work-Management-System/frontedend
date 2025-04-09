<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { apiGetStudentCompetitions, apiUpdateStudentCompetition } from '@/api/competition'
import type {
  StudentCompetitionItem,
  StudentCompetitionQuery,
  StudentCompetitionAudit,
  TeamItem
} from '@/model/competitionModel'
import { apiDownloadFile } from '@/api/file'
import { notify } from '@kyvg/vue3-notification'
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import DateSelect from '@/components/home/DateSelect.vue'
import CompetitionAuditDialog from '@/components/home/competition/CompetitionAuditDialog.vue'
import CompetitionMemberDialog from '@/components/home/competition/CompetitionMemberDialog.vue'
import { useCompetitionStore } from '@/stores/competitionStore'
import { studentCompetitionAuditHeaders } from '@/misc/table/competition-import-header'
import moment from 'moment'
import CompetitionAuditSelect from '@/components/home/competition/CompetitionAuditSelect.vue'
import CompetitionTypeSelect from '@/components/home/competition/CompetitionTypeSelect.vue'
import CompetitionNatureSelect from '@/components/home/competition/CompetitionNatureSelect.vue'
import DegreeSelect from '@/components/home/DegreeSelect.vue'

const store = useUserStore()
const chargeGrades = store.getUserData.chargeGrades
const has = (permission: string) => {
  return store.hasAuthorized(permission)
}
const competitionStore = useCompetitionStore()
const deleteDialog = ref(false)
const membersDialog = ref(false)
const membersDialogStudentIds = ref<string[]>([])
const auditDialog = ref(false)
const selected = ref<StudentCompetitionItem[]>([])
const loading = ref(false)
const query = reactive<StudentCompetitionQuery>({
  search: '',
  majorId: null,
  gradeId: null,
  degreeId: null,
  competitionNature: null,
  competitionType: null,
  start: null,
  end: null,
  level: null,
  state: '审核中',
  pageNo: 1,
  pageSize: 10
})
const data = ref<StudentCompetitionItem[]>([])
const dataLength = ref(0)
const loadItems = () => {
  fetchStudentCompetitionLogic()
}

const updateStudentCompetitionAudits = async (state: string, reason: string) => {
  try {
    loading.value = true
    if (state === '通过') reason = ''
    const studentCompetitionAudits = createStudentCompetitionAudits(state, reason, selected.value)
    const { data: result } = await apiUpdateStudentCompetition(studentCompetitionAudits)
    if (result.code !== 200) {
      notify({ type: 'error', title: '错误', text: result.message })
      loading.value = false
      return
    }
    notify({
      type: 'success',
      title: '成功',
      text: `审核成功！已审核 ${studentCompetitionAudits.length} 条记录`
    })
  } catch (error) {
    console.log(error)
  } finally {
    afterHandler()
    loading.value = false
  }
}
const createStudentCompetitionAudits = (
  state: string,
  reason: string,
  studentCompetitionItems: StudentCompetitionItem[]
) => {
  const studentCompetitionAudits: StudentCompetitionAudit[] = studentCompetitionItems.map(
    (item) => ({
      studentCompetitionId: item.studentCompetitionId,
      state: state,
      operatorId: store.getUserData.uid,
      operatorTime: moment(new Date()).format('YYYY-MM-DD'),
      rejectReason: reason
    })
  )
  return studentCompetitionAudits
}

const afterHandler = () => {
  auditDialog.value = false
  fetchStudentCompetitionLogic()
}
const fetchStudentCompetitionLogic = async () => {
  try {
    if (query.pageSize === -1) query.pageSize = 9999
    loading.value = true
    const { data: result } = await apiGetStudentCompetitions(query)
    if (result.code !== 200) {
      notify({ type: 'error', title: '错误', text: result.message })
      loading.value = false
      return
    }
    data.value = result.data.records
    dataLength.value = result.data.totalRow
    selected.value = []
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}
onMounted(fetchStudentCompetitionLogic)
const downloadEvidence = async (filename: string) => {
  loading.value = true
  const { data: result } = await apiDownloadFile(filename)
  notify({ title: '成功', text: '下载已开始！', type: 'success' })
  const url = URL.createObjectURL(result)
  const a = document.createElement('a')
  a.href = url
  a.download = filename.split('-').slice(1).join('')
  a.click()
  URL.revokeObjectURL(url)
  loading.value = false
  loading.value = false
}
const checkStateColor = (state: string): 'indigo' | 'green' | 'error' => {
  switch (state) {
    case '审核中':
      return 'indigo'
    case '通过':
      return 'green'
    default:
      return 'error'
  }
}
const checkStateIcon = (state: string): string => {
  switch (state) {
    case '审核中':
      return 'mdi-progress-clock'
    case '通过':
      return 'mdi-progress-check'
    default:
      return 'mdi-progress-close'
  }
}

const checkCompetitionIsSolo = (competitionId: string) => {
  return competitionStore.checkCompetitionIsSolo(competitionId)
}
const viewMembers = (team: TeamItem[]) => {
  const studentIds = team.map((item: TeamItem) => item.studentId)
  membersDialogStudentIds.value = studentIds
  membersDialog.value = true
}

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
  const tabs = document.querySelector('.tabs')

  if (container) resizeObserver.observe(container)
  if (selectMenu) resizeObserver.observe(selectMenu)
  if (tabs) resizeObserver.observe(tabs)

  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})
</script>
<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <CompetitionAuditDialog
      v-model="auditDialog"
      v-model:length="selected.length"
      @updateStudentCompetitionAudits="updateStudentCompetitionAudits"
    />

    <CompetitionMemberDialog
      v-model="membersDialog"
      :student-ids="membersDialogStudentIds"
      @on-close="membersDialog = false"
    />

    <section class="menu">
      <span class="w-8">
        <GradeSelect v-model="query.gradeId" variant="underlined" :charge-grades="chargeGrades" />
      </span>
      <span class="w-8">
        <MajorSelect v-model="query.majorId" variant="underlined" />
      </span>
      <span class="w-8">
        <DegreeSelect v-model="query.degreeId" variant="underlined" />
      </span>
      <span class="w-8">
        <CompetitionTypeSelect v-model="query.competitionType" variant="underlined" />
      </span>
      <span class="w-8">
        <CompetitionNatureSelect v-model="query.competitionNature" variant="underlined" />
      </span>
      <span class="w-8">
        <DateSelect label="开始日期" variant="underlined" v-model="query.start" />
      </span>
      <span class="w-8">
        <DateSelect label="结束日期" variant="underlined" v-model="query.end" />
      </span>
      <span class="w-8">
        <LevelSelect v-model="query.level" variant="underlined" />
      </span>
      <span class="w-8">
        <CompetitionAuditSelect variant="underlined" v-model="query.state" :show-waiting="true" />
      </span>
      <span class="w-10 text-indigo">
        <v-text-field
          v-model="query.search"
          color="indigo"
          @update:modelValue="fetchStudentCompetitionLogic"
          :loading="loading"
          :counter="15"
          clearable
          label="搜索"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
        >
          <v-tooltip activator="parent" location="top" text="以填报 姓名 / 学号 / 竞赛名称 搜索" />
        </v-text-field>
      </span>
      <v-btn
        v-if="has('student_competition:select')"
        prepend-icon="mdi-refresh"
        @click="fetchStudentCompetitionLogic"
        text="刷新"
      />
      <v-btn
        v-if="has('student_competition:update')"
        prepend-icon="mdi-eye"
        color="primary"
        @click="auditDialog = true"
        text="审核"
      />
      <v-btn
        v-if="has('student_competition:delete')"
        prepend-icon="mdi-delete"
        color="error"
        @click="deleteDialog = true"
        text="删除"
      />
    </section>

    <section class="pa-4 w-100" ref="tableDom">
      <v-card>
        <v-data-table-server
          v-model="selected"
          :height="tableHeight"
          :headers="studentCompetitionAuditHeaders as any"
          :items="data"
          :items-length="dataLength"
          :loading="loading"
          v-model:page="query.pageNo"
          v-model:items-per-page="query.pageSize"
          @update:options="loadItems"
          show-select
          return-object
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.headerInfo="{ item }">
            <v-chip class="mr-1" prepend-icon="mdi-account" color="primary">
              {{ item.headerId }} - {{ item.headerName }}
            </v-chip>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.state="{ item }">
            <v-chip
              class="mr-1"
              :prepend-icon="checkStateIcon(item.state)"
              :color="checkStateColor(item.state)"
            >
              {{ item.state }}
            </v-chip>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn
                v-if="!checkCompetitionIsSolo(item.competitionId)"
                text="查看成员"
                variant="text"
                color="indigo"
                prepend-icon="mdi-account"
                @click="viewMembers(item.team)"
              />
              <v-btn
                v-if="has('student_competition:select') && has('file:download')"
                color="indigo"
                prepend-icon="mdi-download"
                variant="text"
                @click="downloadEvidence(item.evidence)"
                text="证明材料"
              />
            </div>
          </template>
        </v-data-table-server>
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

.w-10 {
  width: 10% !important;
}

.w-8 {
  width: 8% !important;
}
</style>
