<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { apiGetStudentList, apiDeleteStudent, apiRecoverDeleteStudent } from '@/api/student'
import { type Student } from '@/model/studentModel'
import { notify } from '@kyvg/vue3-notification'
import TableSelectMenu from '../tableComponents/TableSelectMenu.vue'
import BaseInfoTable from '../tableComponents/BaseInfoTable.vue'
import EditBaseInfoForm from '@/components/home/base/EditBaseInfoForm.vue'
import DeleteDialog from '@/components/home/DeleteDialog.vue'
import { useBaseStore } from '@/stores/baseStore'

const baseStore = useBaseStore()
const studentQuery = baseStore.getStudentQuery
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
  gradeId: '',
  classNo: '',
  politicId: '',
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
  joiningTime: '',
  isStudentLoans: false,
  height: '',
  weight: '',
  religiousBeliefs: '',
  location: '',
  familyPopulation: '',
  isOnlyChild: true,
  familyMembers: '',
  degreeId: '',
  disability: false
})

const fetchStudentLogic = async () => {
  loading.value = true
  const { data: result } = await apiGetStudentList(studentQuery)
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

const exportData = () => {
  console.log(
    `exportData, 使用数据大小: ${data.value.length}, 头号数据: ${JSON.stringify(data.value[0])}`
  )
}

// 高度计算相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tabsHeight = ref(0)

const tableHeight = computed(() => {
  if (!containerHeight.value || !selectMenuHeight.value || !tabsHeight.value) return 560
  return containerHeight.value - selectMenuHeight.value - tabsHeight.value - 60
})

onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.classList.contains('card-container')) {
        containerHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('table-select-menu')) {
        selectMenuHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('tabs')) {
        tabsHeight.value = entry.contentRect.height
      }
    }
  })

  // 观察元素
  const container = document.querySelector('.card-container')
  const selectMenu = document.querySelector('.table-select-menu')
  const tabs = document.querySelector('.tabs')

  if (container) resizeObserver.observe(container)
  if (selectMenu) resizeObserver.observe(selectMenu)
  if (tabs) resizeObserver.observe(tabs)

  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})

onMounted(fetchStudentLogic)
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="d-flex flex-column card-container">
    <!-- 编辑弹窗 -->
    <EditBaseInfoForm v-model="editDialog" :info="modifyInfo" @on-closed="fetchStudentLogic" />
    <!-- 删除弹窗 -->
    <DeleteDialog v-model="deleteDialog" :length="selected.length" @delete="deleteStudentLogic" />
    <!-- 查询条件 -->
    <TableSelectMenu
      class="table-select-menu"
      :loading="loading"
      @refresh="fetchStudentLogic"
      @after-student="fetchStudentLogic"
      @delete-button-click="deleteStudent"
      @export-data="exportData"
    />
    <!-- 表格 -->
    <BaseInfoTable
      :data="data"
      :loading="loading"
      :table-height="tableHeight"
      :selected="selected"
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
