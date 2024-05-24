<script lang="ts" setup>
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import { ref } from 'vue'
import { type Student, apiGetStudentList, apiDeleteStudent, apiRecoverDeleteStudent } from '@/api/student'
import { notify } from '@kyvg/vue3-notification'
import { onMounted } from 'vue'
import { reactive } from 'vue'
import { useUserStore } from '@/stores/user'
import EditBaseInfoForm from '@/components/home/base/EditBaseInfoForm.vue'
import DeleteDialog from '@/components/home/DeleteDialog.vue'
import EnabledSelect from '@/components/home/EnabledSelect.vue'

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
    title: '年级',
    align: 'start',
    sortable: true,
    key: 'grade'
  },
  {
    title: '班级',
    align: 'start',
    sortable: true,
    key: 'classNo'
  },
  {
    title: '身份证号',
    align: 'start',
    sortable: false,
    key: 'idNumber'
  },
  {
    title: '民族',
    align: 'start',
    sortable: false,
    key: 'nation'
  },
  {
    title: '籍贯',
    align: 'start',
    sortable: false,
    key: 'nativePlace'
  },
  {
    title: '政治面貌',
    align: 'start',
    sortable: false,
    key: 'politicsStatus'
  },
  {
    title: '手机号',
    align: 'start',
    sortable: false,
    key: 'phone'
  },
  {
    title: '邮政编码',
    align: 'start',
    sortable: false,
    key: 'postalCode'
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
const search = ref('')
const data = ref<Student[]>([])
const dataLength = ref<number>(0)
const selectedMajor = ref<string | null>(null)
const selectedGrade = ref<string | null>(null)
const deleteDialog = ref(false)
const editDialog = ref(false)
const selectedEnabled = ref(true)
const modifyInfo = ref<Student>({
  majorId: '',
  studentId: '',
  idNumber: '',
  name: '',
  gender: '',
  nativePlace: '',
  postalCode: '',
  phone: '',
  nation: '',
  majorName: '',
  grade: '',
  classNo: '',
  politicsStatus: '',
  enabled: true,
})
const pageOptions = reactive({
  pageSize: 10,
  pageNo: 1
})

// 检验用户权限用的
const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const fetchStudentLogic = async () => {
  loading.value = true
  if (pageOptions.pageSize === -1) pageOptions.pageSize = 9999
  const { data: result } = await apiGetStudentList({
    search: search.value,
    grade: selectedGrade.value,
    majorId: selectedMajor.value,
    enabled: selectedEnabled.value,
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

  selected.value = []
  deleteDialog.value = false
  loading.value = false
}
onMounted(fetchStudentLogic)

const loadItems = (args: { page: any; itemsPerPage: any; sortBy: any }) => {
  fetchStudentLogic()
}

const deleteStudentLogic = async () => {
  loading.value = true
  const studentIds = selected.value.map((v) => v.studentId)
  let reqs = studentIds.map(id => (async (id) => {
    const { data: result } = await apiDeleteStudent(id)
    if (result.code !== 200) {
      console.error(result.message)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
  })(id))
  await Promise.all(reqs)
  afterStudent()
  loading.value = false
}

const afterStudent = () => {
  editDialog.value = false
  deleteDialog.value = false
  fetchStudentLogic()
}
const recoverStudent = async (id: string) => {
  loading.value = true
  const { data: result } = await apiRecoverDeleteStudent(id)
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  notify({ type: 'success', title: '成功', text: "恢复成功！" })
  loading.value = false
  afterStudent()
  return
}

// js 写响应式
const tableHeight = ref(0)
const tableDom = ref<HTMLElement | null>(null)
const fixHeight = () => {
  const offsetTop = tableDom.value?.offsetTop as number
  const windowHeight = window.screen.height as number
  const totalHeight = document.body.clientHeight
  const padding = (totalHeight * 0.5 / windowHeight) * 32
  tableHeight.value = (totalHeight - offsetTop) * 0.8 - padding
}
onMounted(() => {
  fixHeight()
  window.onresize = fixHeight
})

</script>
<template>
  <v-card elevation="10" height="100%" width="100%" class="d-flex flex-column">
    <DeleteDialog v-model="deleteDialog" v-model:length="selected.length" @delete="deleteStudentLogic" />

    <EditBaseInfoForm v-model="editDialog" v-model:info="modifyInfo" @on-closed="afterStudent" />
    <section class="menu">
      <span class="w-20">
        <MajorSelect v-model="selectedMajor" variant="underlined" />
      </span>
      <span class="w-20">
        <GradeSelect v-model="selectedGrade" variant="underlined" />
      </span>
      <span class="w-20">
        <EnabledSelect v-model="selectedEnabled" label="学生状态" variant="underlined" />
      </span>

      <span class="w-20 text-indigo">
        <v-text-field v-model="search" color="indigo" @update:modelValue="fetchStudentLogic" :loading="loading"
          :counter="15" clearable label="搜索" prepend-inner-icon="mdi-magnify" variant="underlined" hide-details>
          <v-tooltip activator="parent" location="top">以学号或姓名搜索</v-tooltip>
        </v-text-field>
      </span>
      <v-btn v-if="has('student:select')" prepend-icon="mdi-refresh" @click="fetchStudentLogic">刷新</v-btn>

      <v-btn v-if="has('student:delete')" prepend-icon="mdi-delete" color="error" @click="deleteDialog = true">删除</v-btn>
    </section>

    <section class="pa-4 w-100" ref="tableDom">
      <v-card>
        <v-data-table-server v-model="selected" :headers="headers" :height="tableHeight" :items="data"
          :items-length="dataLength" :loading="loading" v-model:page="pageOptions.pageNo"
          v-model:items-per-page="pageOptions.pageSize" @update:options="loadItems" show-select return-object>
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn v-if="has('student:delete')" prepend-icon="mdi-pencil" color="indigo" class="mr-2" @click="() => {
                modifyInfo = { ...item }
                editDialog = true
              }
                ">编辑</v-btn>
              <v-btn v-if="has('student:update') && !item.enabled" prepend-icon="mdi-refresh" color="warning"
                variant="plain" @click="recoverStudent(item.studentId)">恢复删除</v-btn>
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

.contain {
  flex: 1;
  width: 100%;
}
</style>
