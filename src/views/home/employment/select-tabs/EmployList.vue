<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { type Employ, apiGetEmployList } from '@/api/employ'
import { notify } from '@kyvg/vue3-notification'

const headers = [
  {
    title: '学号',
    align: 'start',
    sortable: true,
    key: 'studentId'
  },
  {
    title: '姓名',
    align: 'start',
    sortable: false,
    key: 'name'
  },
  {
    title: '性别',
    align: 'start',
    sortable: false,
    key: 'gender'
  },
  {
    title: '专业',
    align: 'start',
    sortable: false,
    key: 'majorName'
  },
  {
    title: '毕业状态',
    align: 'start',
    sortable: true,
    key: 'graduationState'
  },
  {
    title: '毕业年份',
    align: 'start',
    sortable: true,
    key: 'graduationYear'
  },
  {
    title: '毕业去向',
    align: 'start',
    sortable: false,
    key: 'whereabouts'
  },
  {
    title: '工作性质',
    align: 'start',
    sortable: false,
    key: 'jobNature'
  },
  {
    title: '所处行业',
    align: 'start',
    sortable: false,
    key: 'jobIndustry'
  },
  {
    title: '工作地点',
    align: 'start',
    sortable: false,
    key: 'jobLocation'
  },
  {
    title: '职业类别',
    align: 'start',
    sortable: false,
    key: 'category'
  },
  {
    title: '薪水',
    align: 'start',
    sortable: false,
    key: 'salary'
  },
  {
    title: '操作',
    align: 'start',
    sortable: false,
    key: 'operations'
  }
]

const deleteDialog = ref(false)
const selected = ref([])
const loading = ref(false)
const selectedMajor = ref<string | null>(null)
const selectedGrade = ref<string | null>(null)
const search = ref('')
const data = ref<Employ[]>()
const dataLength = ref(0)
const editDialog = ref(false)
const editModel = ref<Employ>({
  studentId: '',
  graduationState: '',
  graduationYear: '',
  whereabouts: '',
  jobNature: '',
  jobIndustry: '',
  jobLocation: '',
  category: '',
  salary: ''
})
const pageOptions = reactive({
  pageSize: 10,
  pageNo: 1
})
const loadItems = (args: { page: any; itemsPerPage: any; sortBy: any }) => {
  fetchEmployLogic()
}

const deleteStudentLogic = async () => {

}
const fetchEmployLogic = async () => {
  loading.value = true
  if (pageOptions.pageSize === -1) pageOptions.pageSize = 9999
  const { data: result } = await apiGetEmployList({
    // search: search.value,
    grade: selectedGrade.value === '' ? null : selectedGrade.value,
    majorId: selectedMajor.value === '' ? null : selectedMajor.value,
    ...pageOptions
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
onMounted(fetchEmployLogic)

</script>
<template>
  <v-card elevation="10" height="100%" width="100%">
    <DeleteDialog v-model="deleteDialog" v-model:length="selected.length" @delete="deleteStudentLogic" />
    <section class="menu">
      <span class="w-20">
        <MajorSelect v-model="selectedMajor" variant="underlined" />
      </span>
      <span class="w-20">
        <GradeSelect v-model="selectedGrade" variant="underlined" />
      </span>
      <span class="w-20 text-indigo">
        <v-text-field v-model="search" color="indigo" @update:modelValue="fetchEmployLogic" :loading="loading"
          :counter="15" clearable label="搜索" prepend-inner-icon="mdi-magnify" variant="underlined" hide-details>
          <v-tooltip activator="parent" location="top">以学号或姓名搜索</v-tooltip>
        </v-text-field>
      </span>
      <v-btn prepend-icon="mdi-refresh" @click="fetchEmployLogic">刷新</v-btn>

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
                editModel = item
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
