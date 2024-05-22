<script lang="ts" setup>
import { useUserStore } from '@/stores/user'
import { ref, reactive, onMounted } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { apiDeleteCometition, apiGetCompetitions, type Competition } from '@/api/competition'
import CompetitionForm from '@/components/home/competition/CompetitonForm.vue'
import DeleteDialog from '@/components/home/DeleteDialog.vue'

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
    sortable: true,
    key: 'competitionNature'
  },
  {
    title: '竞赛等级',
    align: 'start',
    sortable: true,
    key: 'competitionLevel'
  },
  {
    title: '操作',
    align: 'center',
    key: 'operations',
    sortable: false
  }
]

const loading = ref(false)
const deleteDialog = ref(false)
const selected = ref<Competition[]>([])
const formType = ref<"add" | "edit">('add')
const editInfo = ref<Competition>({
  competitionId: '',
  competitionName: '',
  competitionNature: null,
  competitionLevel: null
})
const formDialog = ref(false)
const data = ref<Competition[]>([])
const dataLength = ref(0)

const pageOptions = reactive({
  pageSize: 10,
  pageNo: 1
})
const loadItems = (args: { page: any; itemsPerPage: any; sortBy: any }) => {
  fetchCompetitionLogic()
}

const store = useUserStore()
const has = (permission: string) => {
  return store.hasAuthorized(permission)
}

const deleteLogic = async () => {
  let reqs = selected.value.map(e => (async (e) => {
    const cid = e.competitionId
    const { data: result } = await apiDeleteCometition(cid)
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    notify({ type: 'success', title: '成功', text: `就业信息:${cid} 删除成功！` })
  })(e))

  await Promise.all(reqs)
  afterEdit()
  loading.value = false
}

const fetchCompetitionLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetCompetitions({
    ...pageOptions
  })
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    deleteDialog.value = false
    return
  }
  selected.value = []
  data.value = result.data.records
  dataLength.value = result.data.totalRow
  loading.value = false
}

onMounted(fetchCompetitionLogic)

const afterEdit = () => {
  deleteDialog.value = false
  formDialog.value = false
  fetchCompetitionLogic()
}

</script>
<template>
  <v-card elevation="10" height="100%" width="100%">
    <DeleteDialog v-model="deleteDialog" v-model:length="selected.length" @delete="deleteLogic" />
    <CompetitionForm v-model="formDialog" v-model:type="formType" v-model:info="editInfo" @on-closed="afterEdit" />
    <section class="menu">
      <span>
        <v-btn v-if="has('competition:select')" prepend-icon="mdi-refresh" @click="fetchCompetitionLogic">刷新</v-btn>
        <v-btn v-if="has('competition:insert')" prepend-icon="mdi-plus-circle" color="primary" @click="() => {
          formType = 'add'
          editInfo = {
            competitionId: '',
            competitionName: '',
            competitionNature: null,
            competitionLevel: null
          }
          formDialog = true
        }
          ">添加</v-btn>
        <v-btn v-if="has('competition:delete')" prepend-icon="mdi-delete" color="error"
          @click="deleteDialog = true">删除</v-btn>
      </span>
    </section>
    <section class="pa-4 d-inline-block w-100">
      <v-card>
        <v-data-table-server v-model="selected" :headers="headers" :items="data" :items-length="dataLength"
          :loading="loading" v-model:page="pageOptions.pageNo" v-model:items-per-page="pageOptions.pageSize"
          @update:options="loadItems" show-select return-object>
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn v-if="has('competition:update')" prepend-icon="mdi-pencil" color="indigo"
                @click="formType = 'edit', editInfo = JSON.parse(JSON.stringify(item)), formDialog = true">编辑</v-btn>
            </div>
          </template>
        </v-data-table-server>
      </v-card>
    </section>
  </v-card>
</template>
<style scoped>
.v-card {
  align-items: start;
}

.menu {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1rem 1rem 0 1rem;
}

.menu span>* {
  margin-right: 0.5rem;
}

.w-20 {
  width: 20% !important;
}
</style>
