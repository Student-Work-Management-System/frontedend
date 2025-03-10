<script lang="ts" setup>
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import { ref } from 'vue'
import { apiGetStudentList, apiDeleteStudent, apiRecoverDeleteStudent } from '@/api/student'
import { type Student, type StudentQuery } from '@/model/studentModel'
import { notify } from '@kyvg/vue3-notification'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import EditBaseInfoForm from '@/components/home/base/EditBaseInfoForm.vue'
import DeleteDialog from '@/components/home/DeleteDialog.vue'
import EnabledSelect from '@/components/home/EnabledSelect.vue'
import { tableHeaders } from '@/misc/table/base-import-header'
import { Edit, RefreshRight, Document } from '@element-plus/icons-vue'

const loading = ref(false)
const selected = ref<any[]>([])
const search = ref('')
const data = ref<Student[]>([])
const deleteDialog = ref(false)
const editDialog = ref(false)
const totalPage = ref<number>()
const totalRow = ref<number>()
const modifyInfo = ref<Student>({
  majorId: '',
  majorName: '',
  studentId: '',
  idNumber: '',
  name: '',
  gender: '',
  nativePlace: '',
  postalCode: '',
  phone: '',
  nation: '',
  email: '',
  headTeacherUsername: '',
  // headTeacherName、headTeacherPhone不需要
  headTeacherName: '',
  headTeacherPhone: '',
  birthdate: '',
  householdRegistration: '',
  householdType: '',
  address: '',
  grade: '',
  classNo: '',
  politicsStatus: '',
  fatherName: '',
  fatherPhone: '',
  fatherOccupation: '',
  motherName: '',
  motherPhone: '',
  motherOccupation: '',
  guardian: '',
  guardianPhone: '',
  highSchool: '',
  examId: '',
  admissionBatch: '',
  totalExamScore: '',
  foreignLanguage: '',
  foreignScore: '',
  hobbies: '',
  dormitory: '',
  otherNotes: '',
  enabled: true,
  isCommunistYouthLeagueMember: false,
  joiningTime: '',
  isStudentLoans: false,
  height: '',
  weight: '',
  religiousBeliefs: '',
  location: '',
  familyPopulation: '',
  isOnlyChild: true,
  familyMembers: ''
})
// 查询参数
const studentQuery = ref<StudentQuery>({
  search: '' as string,
  grade: null as string | null,
  majorId: null as string | null,
  gender: null as string | null,
  nation: null as string | null,
  politicsStatus: null as string | null,
  postalCode: null as string | null,
  classNo: null as string | null,
  dormitory: null as string | null,
  birthdate: null as string | null,
  householdRegistration: null as string | null,
  householdType: null as string | null,
  address: null as string | null,
  examId: null as string | null,
  admissionBatch: null as string | null,
  nativePlace: null as string | null,
  highSchool: null as string | null,
  totalExamScore: null as string | null,
  foreignLanguage: null as string | null,
  foreignScore: null as string | null,
  hobbies: null as string | null,
  otherNotes: null as string | null,
  enabled: true as boolean,
  pageNo: 1 as number,
  pageSize: 25 as number,
  isCommunistYouthLeagueMember: null as boolean | null,
  joiningTime: null as string | null,
  isStudentLoans: null as boolean | null,
  height: null as string | null,
  weight: null as string | null,
  religiousBeliefs: null as string | null,
  location: null as string | null,
  familyPopulation: null as string | null,
  isOnlyChild: null as boolean | null,
  familyMembers: null as string | null
})

// 检验用户权限用的
const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const fetchStudentLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetStudentList(studentQuery.value)
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    deleteDialog.value = false
    return
  }
  totalPage.value = result.data.totalPage
  totalRow.value = result.data.totalRow
  data.value = result.data.records

  selected.value = []
  deleteDialog.value = false
  loading.value = false
}

onMounted(fetchStudentLogic)

const deleteStudentLogic = async () => {
  loading.value = true
  const studentIds = selected.value.map((v) => v.studentId)
  let reqs = studentIds.map((id) =>
    (async (id) => {
      const { data: result } = await apiDeleteStudent(id)
      if (result.code !== 200) {
        console.error(result.message)
        notify({ type: 'error', title: '错误', text: result.message })
        return
      }
    })(id)
  )
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
  notify({ type: 'success', title: '成功', text: '恢复成功！' })
  loading.value = false
  afterStudent()
  return
}

const editInfo = (item: Student) => {
  modifyInfo.value = { ...item }
  editDialog.value = true
}

const handleSelectionChange = (val: any) => {
  selected.value = val
}

const getStudentArchive = (studentId: string) => {
  console.log(studentId)
}

const handleSizeChange = () => {
  fetchStudentLogic()
}

const handleCurrentChange = () => {
  fetchStudentLogic()
}
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="d-flex flex-column">
    <section class="menu d-flex align-center pa-2">
      <DeleteDialog
        v-model="deleteDialog"
        v-model:length="selected.length"
        @delete="deleteStudentLogic"
      />
      <EditBaseInfoForm v-model="editDialog" v-model:info="modifyInfo" @on-closed="afterStudent" />
      <span class="w-20">
        <MajorSelect v-model="studentQuery.majorId" variant="underlined" />
      </span>
      <span class="w-20">
        <GradeSelect v-model="studentQuery.grade" variant="underlined" />
      </span>
      <span class="w-20">
        <EnabledSelect v-model="studentQuery.enabled" label="学生状态" variant="underlined" />
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
      <v-btn v-if="has('student:select')" prepend-icon="mdi-refresh" @click="fetchStudentLogic">
        刷新
      </v-btn>
      <v-btn
        v-if="has('student:delete')"
        prepend-icon="mdi-delete"
        color="error"
        @click="deleteDialog = true"
      >
        删除
      </v-btn>
    </section>
    <section class="table-container flex-grow-1 pa-4 w-100" ref="tableDom">
      <el-table
        :data="data"
        row-key="studentId"
        style="width: 100%; table-layout: auto"
        v-model:selected-rows="selected"
        @selection-change="handleSelectionChange"
        :header-cell-style="{
          color: '#333333',
          fontSize: '14px',
          fontWeight: 700,
          background: '#F9FAFC'
        }"
        :cell-style="{
          padding: '5px',
          fontSize: '14px',
          color: 'black'
        }"
        size="small"
        border
        stripe
      >
        <el-table-column type="selection" align="center" fixed="left" />
        <el-table-column prop="studentId" align="center" label="学号" fixed="left" width="120" />
        <el-table-column prop="name" align="center" label="姓名" fixed="left" width="120" />
        <el-table-column
          v-for="header in tableHeaders"
          :key="header.key"
          :prop="header.key"
          :label="header.label"
          :align="header.align"
          :width="header.width"
          :show-overflow-tooltip="header.showOverflowTooltip"
        />
        <el-table-column
          prop="otherNotes"
          align="center"
          label="备注"
          fixed="right"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center" fixed="right" width="150">
          <template #default="{ row }">
            <el-button
              v-if="has('student:delete')"
              :icon="Edit"
              type="primary"
              circle
              @click="editInfo(row)"
            />
            <el-button
              v-if="has('student:select')"
              :icon="Document"
              type="success"
              @click="getStudentArchive(row.studentId)"
              circle
            />
            <el-button
              v-if="has('student:update') && !row.enabled"
              :icon="RefreshRight"
              type="warning"
              circle
              @click="recoverStudent(row.studentId)"
            />
          </template>
        </el-table-column>
      </el-table>
    </section>
    <section class="pagination d-flex justify-end pa-2">
      <el-pagination
        style="
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 8px;
          font-size: 14px;
        "
        v-model:current-page="studentQuery.pageNo"
        v-model:page-size="studentQuery.pageSize"
        :page-sizes="[25, 50, 100, 200]"
        :background="true"
        layout="total, sizes, prev, pager, next"
        :total="totalRow"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </section>
  </v-card>
</template>

<style scoped>
.menu {
  width: 100%;
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  padding: 1rem 1rem 0 1rem;
}

.menu > * {
  margin-right: 0.5rem;
}

.table-container {
  flex: 1 1 auto;
  overflow: auto;
}

.pagination {
  flex: 0 0 auto;
}

.w-20 {
  width: 15% !important;
}

.contain {
  flex: 1;
  width: 100%;
}
</style>
