<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { apiGetStudentAuditCompetition, apiAuditStudentCompetition, type StudentCompetition } from '@/api/competition'
import { apiDownloadFile } from '@/api/file'
import { notify } from '@kyvg/vue3-notification'

const store = useUserStore()
const has = (permission: string) => {
  return store.hasAuthorized(permission)
}

const headers = [
  {
    title: '竞赛名称',
    align: 'start',
    sortable: true,
    key: 'competitionName'
  },
  {
    title: '竞赛性质',
    align: 'start',
    sortable: false,
    key: 'competitionNature'
  },
  {
    title: '竞赛级别',
    align: 'start',
    sortable: false,
    key: 'competitionLevel'
  },
  {
    title: '填报人',
    align: 'start',
    sortable: false,
    key: 'headerInfo'
  },
  {
    title: '团队成员',
    align: 'start',
    sortable: false,
    key: 'members'
  },
  {
    title: '奖项级别',
    align: 'start',
    sortable: false,
    key: 'awardLevel'
  },
  {
    title: '获奖日期',
    align: 'start',
    sortable: true,
    key: 'awardDate'
  },
  {
    title: '审核状态',
    align: 'start',
    sortable: false,
    key: 'reviewState'
  },
  {
    title: '审核备注',
    align: 'start',
    sortable: false,
    key: 'rejectReason'
  },
  {
    title: '操作',
    align: 'start',
    sortable: false,
    key: 'operations'
  }
];

const auditDialog = ref(false)
const selected = ref<StudentCompetition[]>([])
const loading = ref(false)
const search = ref<string | null>(null)
const selectedGrade = ref<string | null>(null)
const selectMajor = ref<string | null>(null)
const selectStartDate = ref<Date | null>(null)
const selectEndDate = ref<Date | null>(null)


const data = ref<any[]>([])
const dataLength = ref(0)
const pageOptions = reactive({
  pageSize: 10,
  pageNo: 1
})

const loadItems = (args: { page: any; itemsPerPage: any; sortBy: any }) => {
  fetchStudentCompetitionLogic()
}

const auditLogic = async (auditState: "已通过" | "已拒绝", reason: string) => {
  loading.value = true

  let reqs = selected.value.map(e => (async (scid) => {
    const { data: result } = await apiAuditStudentCompetition({
      studentCompetitionId: scid,
      reviewState: auditState,
      rejectReason: auditState === "已通过" ? null : reason
    })
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: `记录: ${scid}, ` + result.message })
      return
    }
    notify({ type: 'success', title: '成功', text: `记录: ${scid} 已审核！` })
  })(e.studentCompetitionId))
  await Promise.all(reqs)

  afterHandler()
}

const afterHandler = () => {
  auditDialog.value = false
  fetchStudentCompetitionLogic()
}

const fetchStudentCompetitionLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetStudentAuditCompetition({
    search: search.value?.length ? search.value : null,
    grade: selectedGrade.value,
    majorId: selectMajor.value,
    startDate: selectStartDate.value ? selectStartDate.value.toISOString().split('T')[0] : null,
    endDate: selectEndDate.value ? selectEndDate.value.toISOString().split('T')[0] : null,
    ...pageOptions
  })
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  dataLength.value = result.data.totalRow
  data.value = result.data.records.map(item => ({
    ...item,
    headerInfo: item.headerId + item.headerName,
    members: item.members.map((m) => m.studentId + m.realName)
  }))
  selected.value = []
  loading.value = false
};
onMounted(fetchStudentCompetitionLogic)

const downloadEvidence = async (filename: string) => {
  loading.value = true
  const { data: result } = await apiDownloadFile(filename)
  notify({ title: '成功', text: '下载已开始！', type: 'success' })
  const url = URL.createObjectURL(result);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.split('-').slice(1).join('');
  a.click();
  URL.revokeObjectURL(url);
  loading.value = false
  loading.value = false
}

const checkStateColor = (state: string): "indigo" | "green" | "error" => {
  switch (state) {
    case "审核中":
      return "indigo"
    case "已通过":
      return "green"
    default:
      return "error"
  }
}

const checkStateIcon = (state: string): string => {
  switch (state) {
    case "审核中":
      return "mdi-progress-clock"
    case "已通过":
      return "mdi-progress-check"
    default:
      return "mdi-progress-close"
  }
}

</script>
<template>
  <v-card elevation="10" height="100%" width="100%">
    <CompetitionAuditDialog v-model="auditDialog" v-model:length="selected.length" @on-audit="auditLogic" />
    <section class="menu">
      <span class="w-15">
        <GradeSelect v-model="selectedGrade" variant="underlined" />
      </span>
      <span class="w-15">
        <MajorSelect v-model="selectMajor" variant="underlined" />
      </span>
      <span class="w-15">
        <DateSelect label="开始日期" variant="underlined" v-model="selectStartDate" />
      </span>
      <span class="w-15">
        <DateSelect label="结束日期" variant="underlined" v-model="selectEndDate" />
      </span>
      <span class="w-20 text-indigo">
        <v-text-field v-model="search" color="indigo" @update:modelValue="fetchStudentCompetitionLogic" :loading="loading"
          :counter="15" clearable label="搜索" prepend-inner-icon="mdi-magnify" variant="underlined" hide-details>
          <v-tooltip activator="parent" location="top">以填报学生姓名、学号搜索</v-tooltip>
        </v-text-field>
      </span>
      <v-btn v-if="has('student_competition_claim:select')" prepend-icon="mdi-refresh"
        @click="fetchStudentCompetitionLogic">刷新</v-btn>
      <v-btn v-if="has('student_competition_claim:update')" prepend-icon="mdi-eye" color="primary"
        @click="auditDialog = true">审核</v-btn>
    </section>

    <section class="pa-4 w-100">
      <v-card>
        <v-data-table-server v-model="selected" :headers="headers" :items="data" :items-length="dataLength"
          :loading="loading" v-model:page="pageOptions.pageNo" v-model:items-per-page="pageOptions.pageSize"
          @update:options="loadItems" show-select return-object>
          <template v-slot:item.headerInfo="{ item }">
            <v-chip class="mr-1" prepend-icon="mdi-account" color="primary">
              {{ item.headerInfo }}
            </v-chip>
          </template>
          <template v-slot:item.members="{ item }">
            <v-chip class="mr-1" prepend-icon="mdi-account" v-for="( member, id ) in item.members" :key="id">
              {{ member }}
            </v-chip>
          </template>
          <template v-slot:item.reviewState="{ item }">
            <v-chip class="mr-1" :prepend-icon="checkStateIcon(item.reviewState)"
              :color="checkStateColor(item.reviewState)">
              {{ item.reviewState }}
            </v-chip>
          </template>
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn color="indigo" prepend-icon="mdi-download" variant="link"
                @click="downloadEvidence(item.evidence)">证明材料</v-btn>
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

.menu>* {
  margin-right: 0.5rem;
}

.w-20 {
  width: 15% !important;
}

.w-15 {
  width: 10% !important;
}
</style>
