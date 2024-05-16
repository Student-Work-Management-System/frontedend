<script lang="ts" setup>
import { apiGetStudentOwnCompetition } from '@/api/competition';
import { apiDownloadFile } from '@/api/file'
import { useUserStore } from '@/stores/user';
import { ref, reactive, onMounted } from 'vue'
import { notify } from '@kyvg/vue3-notification'

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
]

const loading = ref(false)

const selected = ref<any[]>([])
const data = ref<any[]>([])
const addDialog = ref(false)

const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const pageOptions = reactive({
  pageSize: 10,
  pageNo: 1
})

const fetchStudentCompetitionLogic = async () => {
  const { data: result } = await apiGetStudentOwnCompetition(store.getUserData.username)
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  selected.value = []
  data.value = result.data.map(item => ({
    ...item,
    headerInfo: item.headerId + item.headerName,
    members: item.members.map((m) => m.studentId + m.realName)
  }))
  loading.value = false
}
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


const afterLogic = () => {
  addDialog.value = false
  fetchStudentCompetitionLogic()
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
    <CompetitionStudentAddForm v-model="addDialog" v-model:header="store.getUserData" @on-closed="afterLogic" />

    <div class="pt-6 px-4">
      <v-alert text="团队类型竞赛比赛只需要队长填写即可。" title="提示：" type="info" color="indigo" variant="outlined"></v-alert>
    </div>


    <section class="menu">
      <v-btn prepend-icon="mdi-refresh" @click="fetchStudentCompetitionLogic"> 刷新 </v-btn>
      <v-btn v-if="has('student_competition:insert')" prepend-icon="mdi-plus-circle" color="primary"
        @click="addDialog = true">添加</v-btn>

    </section>


    <section class="pa-4 w-100">
      <v-card>
        <v-data-table v-model="selected" :headers="headers" :items="data" :loading="loading"
          v-model:page="pageOptions.pageNo" v-model:items-per-page="pageOptions.pageSize" show-select return-object>
          <template v-slot:item.headerInfo="{ item }">
            <v-chip class="mr-1" prepend-icon="mdi-account" color="primary">
              {{ item.headerInfo }}
            </v-chip>
          </template>
          <template v-slot:item.members="{ item }">
            <v-chip class="mr-1" prepend-icon="mdi-account" v-for="(  member, id  ) in  item.members " :key="id">
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

.menu>* {
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
