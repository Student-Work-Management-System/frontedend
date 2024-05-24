<script lang="ts" setup>
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import { ref } from 'vue'
import { apiGetAllRecord, apiDeleteStudentCET } from '@/api/cet'
import { notify } from '@kyvg/vue3-notification'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { reactive } from 'vue'
import EditStudentCet from '@/components/home/cet/EditStudentCet.vue'
import SemesterSelect from '@/components/home/SemesterSelect.vue'


const headers = [
  {
    title: '考试ID',
    align: 'start',
    sortable: false,
    key: 'studentCetId'
  },
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
    title: '成绩',
    align: 'start',
    sortable: true,
    key: 'score'
  },
  {
    title: '学期',
    align: 'start',
    sortable: false,
    key: 'examDate'
  },
  {
    title: '证书编号',
    align: 'start',
    sortable: false,
    key: 'certificateNumber'
  },
  {
    title: '考试类别',
    align: 'start',
    sortable: true,
    key: 'examType'
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
const search = ref<string | null>(null)
const examDate = ref<string | null>(null)
const examType = ref<string | null>(null)
const data = ref<any[]>([]);
const dataLength = ref<number>(0)
const selectedMajor = ref<string | null>(null)
const selectedGrade = ref<string | null>(null)
const deleteDialog = ref(false)
const editDialog = ref(false)
const modifyInfo = ref({
  studentCetId: '',
  studentId: '',
  name: '',
  majorName: '',
  score: 0,
  examDate: '',
  certificateNumber: '',
  examType: '',
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
  const { data: result } = await apiGetAllRecord({
    search: search.value,
    grade: selectedGrade.value,
    majorId: selectedMajor.value,
    examDate: examDate.value,
    examType: examType.value,
    ...pageOptions
  })
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    deleteDialog.value = false
    return
  }

  data.value = result.data.records.flatMap(record => record.cets.map(cet => ({
    studentCetId: cet.studentCetId,
    studentId: record.studentId,
    name: record.name,
    grade: record.grade,
    majorName: record.majorName,
    score: cet.score,
    examDate: cet.examDate,
    certificateNumber: cet.certificateNumber,
    examType: cet.examType
  })));
  dataLength.value = result.data.totalRow
  deleteDialog.value = false
  loading.value = false
}

onMounted(fetchStudentLogic)

const loadItems = (args: { page: any; itemsPerPage: any; sortBy: any }) => {
  fetchStudentLogic()
}

const deleteStudentLogic = async () => {
  loading.value = true;
  const studentCetId = selected.value.map((v) => v.studentCetId);
  await Promise.all(studentCetId.map(async (id) => {
    const { data: result } = await apiDeleteStudentCET(id);
    if (result.code !== 200) {
      console.error(result);
      notify({ type: 'error', title: '错误', text: `CET成绩:${id}, ` + result.message })
      return
    }
    notify({ type: 'success', title: '成功', text: `CET成绩:${id} 删除成功！` })
  }));
  afterEditStudent()
  loading.value = false;
};

const afterEditStudent = () => {
  editDialog.value = false
  deleteDialog.value = false;
  fetchStudentLogic()
}


// js 写响应式
const tableHeight = ref(0)
const tableDom = ref<HTMLElement | null>(null)
const fixHeight = () => {
  const offsetTop = tableDom.value?.offsetTop as number
  const windowHeight = window.screen.height as number
  const totalHeight = document.body.clientHeight
  const padding = (totalHeight * 0.5 / windowHeight) * 32
  tableHeight.value = (totalHeight - offsetTop) * 0.69 - padding
}
onMounted(() => {
  fixHeight()
  window.onresize = fixHeight
})
</script>
<template>
  <v-dialog width="500" v-model="deleteDialog">
    <v-card prepend-icon="mdi-delete" title="删除选择" :text="`已选择 ${selected.length} 条记录，本操作不可撤回，确定要删除吗？`">
      <v-card-actions class="mx-auto">
        <v-btn :loading="loading" :disabled="selected.length === 0" color="error" @click="deleteStudentLogic">删除</v-btn>
        <v-btn @click="deleteDialog = false">取消</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <EditStudentCet v-model="editDialog" v-model:info="modifyInfo" @on-closed="afterEditStudent" />

  <section class="menu">
    <span class="w-20">
      <MajorSelect v-model="selectedMajor" variant="underlined" />
    </span>
    <span class="w-20">
      <GradeSelect v-model="selectedGrade" variant="underlined" />
    </span>

    <span class="w-20 text-indigo">
      <SemesterSelect v-model="examDate" color="indigo" variant="underlined" />
    </span>

    <span class="w-20">
      <v-select label="考试类别" v-model="examType" :items="['CET4', 'CET6']" class="text-indigo" color="indigo" hide-details
        clearable variant="underlined">
      </v-select>
    </span>

    <span class="w-20 text-indigo">
      <v-text-field v-model="search" color="indigo" @update:modelValue="fetchStudentLogic" :loading="loading"
        :counter="15" clearable label="搜索" prepend-inner-icon="mdi-magnify" variant="underlined" hide-details>
        <v-tooltip activator="parent" location="top">以姓名、学号、证书编号搜索</v-tooltip>
      </v-text-field>
    </span>
    <v-btn v-if="has('student_cet:select')" prepend-icon="mdi-refresh" @click="fetchStudentLogic">刷新</v-btn>

    <v-btn v-if="has('student_cet:delete')" prepend-icon="mdi-delete" color="error"
      @click="deleteDialog = true">删除</v-btn>
  </section>

  <section class="pa-4 w-100" ref="tableDom">
    <v-card>
      <v-data-table-server v-model="selected" :headers="headers" :height="tableHeight" :items="data"
        :items-length="dataLength" :loading="loading" v-model:page="pageOptions.pageNo"
        v-model:items-per-page="pageOptions.pageSize" @update:options="loadItems" show-select return-object>
        <template v-slot:item.operations="{ item }">
          <div>
            <v-btn v-if="has('student_cet:update')" prepend-icon="mdi-pencil" color="indigo" @click="() => {
              modifyInfo = { ...item }
              editDialog = true
            }
              ">编辑</v-btn>
          </div>
        </template>
      </v-data-table-server>
    </v-card>
  </section>
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
