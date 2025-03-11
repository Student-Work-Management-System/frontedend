<script lang="ts" setup>
import { ref } from 'vue'
import { apiGetStudentList, apiDeleteStudent, apiRecoverDeleteStudent } from '@/api/student'
import { type Student, type StudentQuery } from '@/model/studentModel'
import { notify } from '@kyvg/vue3-notification'
import { onMounted } from 'vue'
import SelectMenu from './components/SelectMenu.vue'
import BaseInfoTable from './components/BaseInfoTable.vue'
import EditBaseInfoForm from '@/components/home/base/EditBaseInfoForm.vue'
import DeleteDialog from '@/components/home/DeleteDialog.vue'

const loading = ref(false)
const selected = ref<Student[]>([])
const data = ref<Student[]>([])
const totalPage = ref<number>()
const totalRow = ref<number>()
const editDialog = ref(false)
const deleteDialog = ref(false)
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

const fetchStudentLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetStudentList(studentQuery.value)
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }
  totalPage.value = result.data.totalPage
  totalRow.value = result.data.totalRow
  data.value = result.data.records
  selected.value = []
  loading.value = false
}

onMounted(fetchStudentLogic)

const deleteStudentLogic = async () => {
  loading.value = true
  const studentIds = selected.value.map((v) => v.studentId)
  let reqs = studentIds.map((id) =>
    (async (id) => {
      const { data: result } = await apiDeleteStudent(id!!)
      if (result.code !== 200) {
        console.error(result.message)
        notify({ type: 'error', title: '错误', text: result.message })
        return
      }
    })(id)
  )
  await Promise.all(reqs)
  fetchStudentLogic()
  loading.value = false
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
  fetchStudentLogic()
}

const getStudentArchive = (studentId: string) => {
  console.log(studentId)
}

const editStudent = (val: Student) => {
  modifyInfo.value = { ...val }
  editDialog.value = true
}

const deleteStudent = () => {
  deleteDialog.value = true
}
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="d-flex flex-column">
    <!-- 编辑弹窗 -->
    <EditBaseInfoForm v-model="editDialog" :info="modifyInfo" @on-closed="fetchStudentLogic" />
    <!-- 删除弹窗 -->
    <DeleteDialog v-model="deleteDialog" :length="selected.length" @delete="deleteStudentLogic" />
    <!-- 查询条件 -->
    <SelectMenu
      :loading="loading"
      :selected-length="selected.length"
      v-model:student-query="studentQuery"
      @refresh="fetchStudentLogic"
      @after-student="fetchStudentLogic"
      @delete-button-click="deleteStudent"
    />
    <!-- 表格 -->
    <BaseInfoTable
      :data="data"
      :loading="loading"
      v-model:selected="selected"
      v-model:student-query="studentQuery"
      :total-row="totalRow || 0"
      @edit="editStudent"
      @recover="recoverStudent"
      @getArchive="getStudentArchive"
      @sizeChange="fetchStudentLogic"
      @currentChange="fetchStudentLogic"
    />
  </v-card>
</template>

<style scoped>
.contain {
  flex: 1;
  width: 100%;
}
</style>
