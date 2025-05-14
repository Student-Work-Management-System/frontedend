<script setup lang="ts">
import {
  academicWorkTypes,
  apiGetAllAcademicWork,
  apiUpdateAcademicWorkAudit
} from '@/api/academicWork'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import type {
  AcademicWorkQuery,
  AcademicWorkState,
  AcademicWorkItem,
  AcademicWorkMemberItem
} from '@/model/academicWorkModel'
import { studentAcademicWorkTableHeader } from '@/misc/table'
import { useUserStore } from '@/stores/userStore'
import { apiDownloadFile } from '@/api/file'
import { notify } from '@kyvg/vue3-notification'
import AcademicWorkTypeSelect from '@/components/home/academicWork/AcademicWorkTypeSelect.vue'
import StateSelect from '@/components/home/competition/StateSelect.vue'
import AuditAcademicWorkDialog from '@/components/home/academicWork/AuditAcademicWorkDialog.vue'

const loading = ref(false)
const data = ref<AcademicWorkItem[]>([])
const selected = ref<AcademicWorkItem[]>([])
const auditDialog = ref(false)

const query = reactive<AcademicWorkQuery>({
  search: '',
  state: '审核中',
  type: null,
  pageNo: 1,
  pageSize: 10
})

const store = useUserStore()
const has = (permission: string) => {
  return store.hasAuthorized(permission)
}

const fetchStudentAcademicWork = async () => {
  loading.value = true
  try {
    if (query.pageSize === -1) query.pageSize = 9999
    const { data: result } = await apiGetAllAcademicWork(query)
    if (result.code !== 200) {
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    data.value = result.data.records
    selected.value = []
  } catch (error) {
    console.log(error)
    notify({ type: 'error', title: '错误', text: `${error}` })
  } finally {
    loading.value = false
  }
}
onMounted(fetchStudentAcademicWork)

const loadItems = () => {
  fetchStudentAcademicWork()
}

const auditHandler = async (state: AcademicWorkState, reason: string) => {
  loading.value = true
  try {
    if (state === '通过') reason = ''
    const audits = createStudentAcademicWorkAudit(state, reason, selected.value)
    const { data: result } = await apiUpdateAcademicWorkAudit(audits)
    if (result.code !== 200) {
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    notify({
      type: 'success',
      title: '成功',
      text: `审核成功！已审核 ${audits.length} 条记录`
    })
  } catch (error) {
    console.log(error)
    notify({ type: 'error', title: '错误', text: `${error}` })
  } finally {
    auditDialog.value = false
    fetchStudentAcademicWork()
    loading.value = false
  }
}

const createStudentAcademicWorkAudit = (
  state: AcademicWorkState,
  reason: string,
  items: AcademicWorkItem[]
) => {
  return items.map((item) => ({
    academicWorkId: item.academicWorkId,
    state: state,
    rejectReason: reason,
    operatorId: store.getUserData.uid
  }))
}

const membersDialog = ref(false)
const membersDialogInfo = ref<AcademicWorkMemberItem[]>([])
const workDialog = ref(false)
const workDialogInfo = ref<AcademicWorkItem>()

const viewMembers = (item: AcademicWorkMemberItem[]) => {
  membersDialogInfo.value = item
  membersDialog.value = true
}

const viewWork = (item: AcademicWorkItem) => {
  workDialog.value = true
  workDialogInfo.value = item
}

const getTypeLabel = (value: string) => {
  return academicWorkTypes.find((it) => it.val == value)?.key
}

const checkAcademicWorkIcon = (value: string) => {
  switch (value) {
    case 'paper':
      return 'mdi-file-document-outline' // 代表文档/论文
    case 'soft':
      return 'mdi-application-cog-outline' // 代表应用/软件
    default:
      return 'mdi-lightbulb-outline' // 代表创意/专利
  }
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
    <AuditAcademicWorkDialog
      v-model="auditDialog"
      :length="selected.length"
      @update="auditHandler"
    />

    <AcademicWorkMemberDailog
      v-model="membersDialog"
      :members="membersDialogInfo"
      @on-close="membersDialog = false"
    />

    <AcademicWorkDialog v-model="workDialog" :item="workDialogInfo!" />

    <section class="menu">
      <span class="w-10">
        <AcademicWorkTypeSelect v-model="query.type" variant="underlined" />
      </span>
      <span class="w-10">
        <StateSelect variant="underlined" v-model="query.state" :show-waiting="true" />
      </span>
      <span class="w-10 text-indigo">
        <v-text-field
          v-model="query.search"
          color="indigo"
          :loading="loading"
          :counter="15"
          clearable
          label="搜索"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
        >
          <v-tooltip
            activator="parent"
            location="top"
            text="以 填报人姓名 / 学号 / 作品名称 搜索"
          />
        </v-text-field>
      </span>
      <v-btn
        v-if="has('student_academic_work:select')"
        prepend-icon="mdi-refresh"
        @click="fetchStudentAcademicWork"
        text="刷新"
      />
      <v-btn
        v-if="has('student_academic_work:update')"
        prepend-icon="mdi-eye"
        color="primary"
        @click="auditDialog = true"
        text="审核"
      />
    </section>

    <section class="pa-4 w-100" ref="tableDom">
      <v-card>
        <v-data-table
          v-model="selected"
          :headers="studentAcademicWorkTableHeader as any"
          :height="tableHeight"
          :items="data"
          :loading="loading"
          v-model:page="query.pageNo"
          v-model:items-per-page="query.pageSize"
          @update:options="loadItems"
          show-select
          return-object
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.type="{ item }">
            <v-chip class="mr-1" :prepend-icon="checkAcademicWorkIcon(item.type)" color="primary">
              {{ getTypeLabel(item.type) }}
            </v-chip>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.headerInfo="{ item }">
            <v-chip class="mr-1" prepend-icon="mdi-account" color="primary">
              {{ item.username }} - {{ item.realName }}
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
                text="查看成员"
                variant="text"
                color="indigo"
                prepend-icon="mdi-account"
                @click="viewMembers(item.team)"
              />
              <v-btn
                text="查看作品详情"
                variant="text"
                color="indigo"
                prepend-icon="mdi-eye"
                @click="viewWork(item)"
              />
              <v-btn
                v-if="has('student_academic_work:select') && has('file:download')"
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

.w-10 {
  width: 10% !important;
}

.w-8 {
  width: 8% !important;
}
</style>
