<!-- eslint-disable vue/valid-v-slot -->
<script lang="ts" setup>
import { apiGetCompetitions, apiGetOwnCompetition } from '@/api/competition'
import { apiDownloadFile } from '@/api/file'
import { useUserStore } from '@/stores/userStore'
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { studentCompetitionTableHeaders } from '@/misc/table/competition-import-header'
import CompetitionStudentAddForm from '@/components/home/competition/CompetitionStudentAddForm.vue'
import { useCompetitionStore } from '@/stores/competitionStore'
import CompetitionMemberDialog from '@/components/home/competition/CompetitionMemberDialog.vue'
import type { TeamItem } from '@/model/competitionModel'

const loading = ref(false)
const selected = ref<any[]>([])
const data = ref<any[]>([])
const addDialog = ref(false)
const store = useUserStore()
const competitionStore = useCompetitionStore()
const membersDialog = ref(false)
const membersDialogStudentIds = ref<string[]>([])

const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const pageOptions = reactive({
  pageSize: 10,
  pageNo: 1
})

const fetchStudentCompetitionLogic = async () => {
  try {
    if (pageOptions.pageSize === -1) pageOptions.pageSize = 9999
    const { data: result } = await apiGetOwnCompetition()
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    selected.value = []
    data.value = result.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
onMounted(fetchStudentCompetitionLogic)

const downloadEvidence = async (filename: string) => {
  loading.value = true
  try {
    const { data: result } = await apiDownloadFile(filename)
    notify({ title: '成功', text: '下载已开始！', type: 'success' })
    const url = URL.createObjectURL(result)
    const a = document.createElement('a')
    a.href = url
    a.download = filename.split('-').slice(1).join('')
    a.click()
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error(error)
    notify({ title: '错误', text: '下载失败！', type: 'error' })
  } finally {
    loading.value = false
  }
}

const afterLogic = () => {
  addDialog.value = false
  fetchStudentCompetitionLogic()
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

onMounted(async () => {
  if (competitionStore.getCompetitionList().length === 0) {
    loading.value = true
    const { data: result } = await apiGetCompetitions({
      search: '',
      competitionNature: null,
      competitionType: null,
      pageNo: 1,
      pageSize: 999
    })
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: result.message })
      loading.value = false
      return
    }
    competitionStore.setCompetitionList(result.data.records)
    loading.value = false
  }
})

// 高度计算相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const titleContainerHeight = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - titleContainerHeight.value - 125
})

onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.classList.contains('card-container')) {
        containerHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('menu')) {
        selectMenuHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('title-container')) {
        titleContainerHeight.value = entry.contentRect.height
      }
    }
  })

  // 观察元素
  const container = document.querySelector('.card-container')
  const selectMenu = document.querySelector('.menu')
  const titleContainer = document.querySelector('.title-container')

  if (container) resizeObserver.observe(container)
  if (selectMenu) resizeObserver.observe(selectMenu)
  if (titleContainer) resizeObserver.observe(titleContainer)

  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <CompetitionStudentAddForm v-model="addDialog" @on-closed="afterLogic" />

    <CompetitionMemberDialog
      v-model="membersDialog"
      :student-ids="membersDialogStudentIds"
      @on-close="membersDialog = false"
    />

    <div class="pt-6 px-4 title-container">
      <v-alert
        text="团队类型竞赛比赛只需要队长填写即可。"
        title="提示："
        type="info"
        color="indigo"
        variant="outlined"
      />
    </div>

    <section class="menu">
      <v-btn
        v-if="has('student_competition:select:own')"
        prepend-icon="mdi-refresh"
        @click="fetchStudentCompetitionLogic"
        text="刷新"
      />
      <v-btn
        v-if="has('student_competition:insert')"
        prepend-icon="mdi-plus-circle"
        color="primary"
        @click="addDialog = true"
        text="添加"
      />
    </section>

    <section class="pa-4 w-100" ref="tableDom">
      <v-card>
        <v-data-table
          v-model="selected"
          :headers="studentCompetitionTableHeaders as any"
          :height="tableHeight"
          :items="data"
          :loading="loading"
          v-model:page="pageOptions.pageNo"
          v-model:items-per-page="pageOptions.pageSize"
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
            <div class="d-flex justify-center">
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
                text="下载证明材料"
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
