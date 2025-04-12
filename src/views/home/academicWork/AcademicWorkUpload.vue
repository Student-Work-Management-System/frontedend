<script setup lang="ts">
import { academicWorkTypes, apiGetStudentOwn } from '@/api/academicWork'
import { apiDownloadFile } from '@/api/file'
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import type {
  StudentAcademicWorkItem,
  StudentAcademicWorkMemberItem
} from '@/model/academicWorkModel'
import { studentAcademicWorkTableHeader } from '@/misc/table'
import AcademicWorkDialog from '@/components/home/academicWork/AcademicWorkDialog.vue'
import AcademicWorkMemberDailog from '@/components/home/academicWork/AcademicWorkMemberDailog.vue'
import AddStudentAcademicWorkDialog from '@/components/home/academicWork/AddStudentAcademicWorkDialog.vue'

const loading = ref(false)
const selected = ref<StudentAcademicWorkItem[]>([])
const data = ref<StudentAcademicWorkItem[]>([])
const addDialog = ref(false)
const store = useUserStore()
const membersDialog = ref(false)
const membersDialogInfo = ref<StudentAcademicWorkMemberItem[]>([])
const workDialog = ref(false)
const workDialogInfo = ref<StudentAcademicWorkItem>()

const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const pageOptions = reactive({
  pageNo: 1,
  pageSize: 10
})

const fetchStudentOwnAcademic = async () => {
  try {
    if (pageOptions.pageSize === -1) pageOptions.pageSize = 9999
    const { data: result } = await apiGetStudentOwn(store.getUserData.username)
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
onMounted(fetchStudentOwnAcademic)

const viewMembers = (item: StudentAcademicWorkMemberItem[]) => {
  membersDialogInfo.value = item
  membersDialog.value = true
}

const viewWork = (item: StudentAcademicWorkItem) => {
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

const afterAdd = async () => {
  addDialog.value = false
  fetchStudentOwnAcademic()
}

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
  <AcademicWorkMemberDailog
    v-model="membersDialog"
    :members="membersDialogInfo"
    @on-close="membersDialog = false"
  />

  <AcademicWorkDialog v-model="workDialog" :item="workDialogInfo!" />

  <AddStudentAcademicWorkDialog v-model="addDialog" @on-closed="afterAdd" />

  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <div class="pt-6 px-4 title-container">
      <v-alert
        text="学术作品一般由作者 / 第一作者填写"
        title="提示："
        type="info"
        color="indigo"
        variant="outlined"
      />
    </div>

    <section class="menu">
      <v-btn
        v-if="has('student_academic_work:select')"
        prepend-icon="mdi-refresh"
        @click="fetchStudentOwnAcademic"
        text="刷新"
      />
      <v-btn
        v-if="has('student_academic_work:insert')"
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
          :headers="studentAcademicWorkTableHeader as any"
          :height="tableHeight"
          :items="data"
          :loading="loading"
          v-model:page="pageOptions.pageNo"
          v-model:items-per-page="pageOptions.pageSize"
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

.file {
  overflow: hidden;
  width: 26%;
}

.w-20 {
  width: 15% !important;
}
</style>
