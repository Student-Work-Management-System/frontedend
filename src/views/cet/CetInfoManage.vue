<script lang="ts" setup>
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import { ref } from 'vue'
import { type StudentCetVO , apiGetAllRecord,apiDeleteStudentCET } from '@/api/cet'
import { notify } from '@kyvg/vue3-notification'
import { onMounted } from 'vue'
import { reactive } from 'vue'
import EditStudentCet from '@/components/cet/EditStudentCet.vue'


const headers = [
    {
    title: '编号',
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
    sortable: false,
    key: 'score'
  },
  {
    title: '考试日期',
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
const search = ref('')
const data = ref<StudentCetVO[]>([])
const dataLength = ref<number>(0)
const selectedMajor = ref<string>('')
const selectedGrade = ref<string>('')
const deleteDialog = ref(false)
const editDialog = ref(false)
const modifyInfo = ref<StudentCetVO>({
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

const fetchStudentLogic = async () => {
  loading.value = true
  if (pageOptions.pageSize === -1) pageOptions.pageSize = 9999
  const { data: result } = await apiGetAllRecord({
    score: null,
    grade: selectedGrade.value === '' ? null : selectedGrade.value,
    majorId: selectedMajor.value === '' ? null : selectedMajor.value,
    examDate: null,
    examType: null,
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

  deleteDialog.value = false
  loading.value = false
}
onMounted(fetchStudentLogic)

const loadItems = (args: { page: any; itemsPerPage: any; sortBy: any }) => {
  fetchStudentLogic()
}

const deleteStudentLogic = async () => {
  loading.value = true
  const studentCetId = selected.value.map((v) => v.studentCetId)
  studentCetId.forEach(async (id) => {
    const { data: result } = await apiDeleteStudentCET(id)
    if (result.code !== 200) {
      console.error(result.message)
      console.log(id)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
  })
  setTimeout(() => {
    deleteDialog.value = false
    loading.value = false
  }, 500)
}

const afterEditStudent = () => {
  editDialog.value = false
  fetchStudentLogic()
}
</script>
<template>
  <v-card elevation="10" height="100%" width="100%">
    <v-dialog width="500" v-model="deleteDialog">
      <v-card
        prepend-icon="mdi-delete"
        title="删除选择"
        :text="`已选择 ${selected.length} 条记录，本操作不可撤回，确定要删除吗？`"
      >
        <v-card-actions class="mx-auto">
          <v-btn
            :loading="loading"
            :disabled="selected.length === 0"
            color="error"
            @click="deleteStudentLogic"
            >删除</v-btn
          >
          <v-btn @click="deleteDialog = false">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <EditStudentCet
      v-model="editDialog"
      v-model:info="modifyInfo"
      @on-closed="afterEditStudent"
    />
    <section class="menu">
      <span class="w-20">
        <MajorSelect v-model="selectedMajor" variant="underlined" />
      </span>
      <span class="w-20">
        <GradeSelect v-model="selectedGrade" variant="underlined" />
      </span>
      <span class="w-20 text-indigo">
        <v-text-field
          v-model="search"
          color="indigo"
          @update:modelValue="fetchStudentLogic"
          :loading="loading"
          :counter="15"
          clearable
          label="搜索"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
        >
          <v-tooltip activator="parent" location="top">以学号或姓名搜索</v-tooltip>
        </v-text-field>
      </span>
      <v-btn prepend-icon="mdi-refresh" @click="fetchStudentLogic">刷新</v-btn>

      <v-btn prepend-icon="mdi-delete" color="error" @click="deleteDialog = true">删除</v-btn>
    </section>
    <section class="pa-4 w-100">
      <v-card>
        <v-data-table-server
          v-model="selected"
          :headers="headers"
          :items="data"
          :items-length="dataLength"
          :loading="loading"
          v-model:page="pageOptions.pageNo"
          v-model:items-per-page="pageOptions.pageSize"
          @update:options="loadItems"
          show-select
          return-object
        >
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn
                prepend-icon="mdi-pencil"
                color="indigo"
                @click="
                  () => {
                    modifyInfo = { ...item }
                    editDialog = true
                  }
                "
                >编辑</v-btn
              >
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
.menu > * {
  margin-right: 0.5rem;
}
.w-20 {
  width: 15% !important;
}
</style>
