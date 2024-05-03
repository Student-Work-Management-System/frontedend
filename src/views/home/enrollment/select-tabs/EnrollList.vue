<script lang="ts"  setup>
import { ref, reactive } from 'vue'
import { apiGetEnrollment, apiDeleteEnrollment, type Enrollment } from '@/api/enroll'
import { notify } from '@kyvg/vue3-notification'
import EnrollForm from '@/components/home/enroll/EnrollForm.vue';

const headers = [
  {
    title: '准考证号',
    align: 'start',
    sortable: true,
    key: 'examineeId'
  },
  {
    title: '身份证号',
    align: 'start',
    sortable: true,
    key: 'id'
  },
  {
    title: '姓名',
    align: 'start',
    sortable: true,
    key: 'name'
  },
  {
    title: '生源地',
    align: 'start',
    sortable: false,
    key: 'origin'
  },
  {
    title: '招生年份',
    align: 'start',
    sortable: false,
    key: 'enrollTime'
  },
  {
    title: '录取专业',
    align: 'start',
    sortable: false,
    key: 'enrollMajor'
  },
  {
    title: '第一志愿专业',
    align: 'start',
    sortable: false,
    key: 'firstMajor'
  },
  {
    title: '高考分数',
    align: 'start',
    sortable: false,
    key: 'score'
  },
  {
    title: '操作',
    align: 'start',
    sortable: false,
    key: 'operations'
  }
]

const loading = ref(false)
const deleteDialog = ref(false)
const editDialog = ref(false)
const data = ref<Enrollment[]>([])
const dataLength = ref(0)
const selected = ref<Enrollment[]>([])
const selectedEnrollMajor = ref<string | null>(null)
const selectedFirstMajor = ref<string | null>(null)
const selectedYear = ref<string | null>(null)
const editModel = ref<Enrollment>({
  enrollmentId: '',
  examineeId: '',
  id: '',
  name: '',
  origin: '',
  enrollSchool: '',
  enrollMajor: '',
  firstMajor: '',
  score: '',
  enrollTime: ''
})
const search = ref<string | null>('')

const pageOptions = reactive({
  pageSize: 10,
  pageNo: 1
})
const loadItems = (args: { page: any; itemsPerPage: any; sortBy: any }) => {
  fetchEnrollLogic()
}
const fetchEnrollLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetEnrollment({
    name: search.value?.length ? search.value : null,
    enrollTime: selectedYear.value?.length ? selectedYear.value : null,
    examineeId: search.value?.length ? search.value : null,
    id: search.value?.length ? search.value : null,
    origin: search.value?.length ? search.value : null,
    enrollMajor: selectedEnrollMajor.value,
    firstMajor: selectedFirstMajor.value,
    ...pageOptions,
    enrollMajorId: null
  })
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    deleteDialog.value = false
    return
  }
  data.value = result.data.records
  dataLength.value = result.data.totalRow
  loading.value = false
}

const afterEditHandler = () => {
  deleteDialog.value = false
  editDialog.value = false
  fetchEnrollLogic()
}

const deleteEnrollLogic = async () => {
  selected.value.forEach(async (e) => {
    const eid = e.enrollmentId
    const { data: result } = await apiDeleteEnrollment(eid)
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    notify({ type: 'success', title: '成功', text: `就业信息:${eid} 删除成功！` })
  })
  setTimeout(() => {
    afterEditHandler()
    loading.value = false
  }, 500)
}

</script>
<template>
  <v-card elevation="10" height="100%" width="100%">
    <DeleteDialog v-model="deleteDialog" v-model:length="selected.length" @delete="deleteEnrollLogic" />
    <EnrollForm v-model="editDialog" v-model:info="editModel" @on-closed="afterEditHandler" />
    <section class="menu">
      <span class="w-20">
        <GradeSelect label="招生年份" v-model="selectedYear" variant="underlined" />
      </span>
      <span class="w-20">
        <MajorSelect label="录取专业" v-model="selectedEnrollMajor" variant="underlined" />
      </span>
      <span class="w-20">
        <MajorSelect label="第一志愿专业" v-model="selectedFirstMajor" variant="underlined" />
      </span>
      <span class="w-20 text-indigo">
        <v-text-field v-model="search" color="indigo" @update:modelValue="fetchEnrollLogic" :loading="loading"
          :counter="15" clearable label="搜索" prepend-inner-icon="mdi-magnify" variant="underlined" hide-details>
          <v-tooltip activator="parent" location="top">以准考证号、姓名、身份证号、生源地搜索</v-tooltip>
        </v-text-field>
      </span>
      <v-btn prepend-icon="mdi-refresh" @click="fetchEnrollLogic">刷新</v-btn>

      <v-btn prepend-icon="mdi-delete" color="error" @click="deleteDialog = true">删除</v-btn>
    </section>

    <section class="pa-4 w-100">
      <v-card>
        <v-data-table-server v-model="selected" :headers="headers" :items="data" :items-length="dataLength"
          :loading="loading" v-model:page="pageOptions.pageNo" v-model:items-per-page="pageOptions.pageSize"
          @update:options="loadItems" show-select return-object>
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn prepend-icon="mdi-pencil" color="indigo" @click="() => {
                editModel = JSON.parse(JSON.stringify(item))
                editDialog = true
              }
                ">编辑</v-btn>
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
  padding: 0rem 1rem 0 1rem;
}

.menu>* {
  margin-right: 0.5rem;
}

.w-20 {
  width: 15% !important;
}
</style>
