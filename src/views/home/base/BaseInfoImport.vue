<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import {
  baseheaders,
  type BaseHeader,
  HeaderValidChecker,
  AnalyzeFileToTable,
  checkValid
} from '@/misc/table'
import ExcelTable from '@/components/home/ExcelTable.vue'
import UploadDialog from '@/components/home/UploadDialog.vue'
import { apiGetMajorList, apiGetAllDegrees, apiGetAllGrades, apiGetAllPolitics } from '@/api/other'
import { apiGetAllStatus } from '@/api/status'
import { apiAddStudentBaseInfo, apiGetHeaderTeahcers } from '@/api/student'
import { useUserStore } from '@/stores/userStore'
import { useBaseStore } from '@/stores/baseStore'
import type { Student } from '@/model/studentModel'

const excel = ref<File>()
const jsonData = ref<BaseHeader[]>([])
const uploadDialog = ref()
const loading = ref(false)
const nilData: BaseHeader = {
  studentId: null as string | null,
  name: null as string | null,
  idNumber: null as string | null,
  gender: null as string | null,
  nativePlace: null as string | null,
  postalCode: null as string | null,
  politicStatus: null as string | null,
  phone: null as string | null,
  nation: null as string | null,
  majorName: null as string | null,
  majorId: null as string | null,
  grade: null as string | null,
  classNo: null as string | null,
  email: null as string | null,
  headerTeacherUsername: null as string | null,
  headerTeacherName: null as string | null,
  headerTeacherPhone: null as string | null,
  birthdate: null as string | null,
  householdRegistration: null as string | null,
  householdType: null as string | null,
  address: null as string | null,
  fatherName: null as string | null,
  fatherPhone: null as string | null,
  fatherOccupation: null as string | null,
  motherName: null as string | null,
  motherPhone: null as string | null,
  motherOccupation: null as string | null,
  guardian: null as string | null,
  guardianPhone: null as string | null,
  highSchool: null as string | null,
  examId: null as string | null,
  admissionBatch: null as string | null,
  totalExamScore: null as string | null,
  foreignLanguage: null as string | null,
  foreignScore: null as string | null,
  hobbies: null as string | null,
  dormitory: null as string | null,
  otherNotes: null as string | null,
  joiningTime: null as string | null,
  isStudentLoans: true as boolean | null,
  height: null as string | null,
  weight: null as string | null,
  religiousBeliefs: null as string | null,
  location: null as string | null,
  familyPopulation: null as string | null,
  isOnlyChild: true as boolean | null,
  familyMembers: null as string | null,
  degreeId: null as string | null,
  gradeId: null as string | null,
  politicId: null as string | null,
  disability: false as boolean | null,
  enabled: true as boolean,
  statusId: '1' as string | null,
  gradeName: null as string | null,
  isOnlyChildText: '是' as string,
  isStudentLoansText: '是' as string,
  disabilityText: '否' as string,
  statusName: null as string | null
}
const baseStore = useBaseStore()
const statusOptions = computed(() => baseStore.getStatusList().map((status) => status.statusName))
const degreeOptions = computed(() => baseStore.getDegreeList().map((degree) => degree.degreeName))
const gradeOptions = computed(() => baseStore.getGradeList().map((grade) => grade.gradeName))
const politicOptions = computed(() =>
  baseStore.getPoliticList().map((politic) => politic.politicStatus)
)
const majorOptions = computed(() => baseStore.getMajorList().map((major) => major.majorName))
const headerTeacherOptions = computed(() =>
  baseStore.getHeaderTeacherList().map((headerTeacher) => headerTeacher.headerTeacherUsername)
)
const refBaseHeaders = computed(() => {
  const degreeNameIndex = baseheaders.findIndex((header) => header.field === 'degreeName')
  const gradeNameIndex = baseheaders.findIndex((header) => header.field === 'gradeName')
  const politicStatusIndex = baseheaders.findIndex((header) => header.field === 'politicStatus')
  const majorNameIndex = baseheaders.findIndex((header) => header.field === 'majorName')
  const headerTeacherUsernameIndex = baseheaders.findIndex(
    (header) => header.field === 'headerTeacherUsername'
  )
  const statusNameIndex = baseheaders.findIndex((header) => header.field === 'statusName')
  baseheaders.splice(degreeNameIndex, 1, {
    ...baseheaders[degreeNameIndex],
    options: degreeOptions.value
  })
  baseheaders.splice(gradeNameIndex, 1, {
    ...baseheaders[gradeNameIndex],
    options: gradeOptions.value
  })
  baseheaders.splice(politicStatusIndex, 1, {
    ...baseheaders[politicStatusIndex],
    options: politicOptions.value
  })
  baseheaders.splice(majorNameIndex, 1, {
    ...baseheaders[majorNameIndex],
    options: majorOptions.value
  })
  baseheaders.splice(headerTeacherUsernameIndex, 1, {
    ...baseheaders[headerTeacherUsernameIndex],
    options: headerTeacherOptions.value
  })
  baseheaders.splice(statusNameIndex, 1, {
    ...baseheaders[statusNameIndex],
    options: statusOptions.value
  })
  return baseheaders
})

const majorMap = computed(() =>
  baseStore.getMajorList().reduce((majorMap, major) => {
    majorMap.set(major.majorName, major.majorId)
    return majorMap
  }, new Map())
)
const degreeMap = computed(() =>
  baseStore.getDegreeList().reduce((degreeMap, degree) => {
    degreeMap.set(degree.degreeName, degree.degreeId)
    return degreeMap
  }, new Map())
)
const gradeMap = computed(() =>
  baseStore.getGradeList().reduce((gradeMap, grade) => {
    gradeMap.set(grade.gradeName, grade.gradeId)
    return gradeMap
  }, new Map())
)
const politicMap = computed(() =>
  baseStore.getPoliticList().reduce((politicMap, politic) => {
    politicMap.set(politic.politicStatus, politic.politicId)
    return politicMap
  }, new Map())
)
const statusMap = computed(() =>
  baseStore.getStatusList().reduce((statusMap, status) => {
    statusMap.set(status.statusName, status.statusId)
    return statusMap
  }, new Map())
)
const booleanMap = new Map([
  ['是', true],
  ['否', false]
])

const analyzeHandler = async () => {
  loading.value = true
  const ret = (await AnalyzeFileToTable(
    excel.value as File,
    refBaseHeaders.value,
    notify
  )) as BaseHeader[]
  if (ret !== undefined) {
    jsonData.value = ret
  }
  loading.value = false
}
// 检验用户权限用的
const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const uploadLogic = async () => {
  loading.value = true
  // 传数据前的检查
  if (
    !jsonData.value.reduce(
      (valid, student) => (!valid ? false : HeaderValidChecker(student, refBaseHeaders.value)),
      true
    )
  ) {
    notify({ title: '提示', text: '数据格式有问题！', type: 'warn' })
    loading.value = false
    return
  }
  const students = jsonDataToStudentArray(jsonData.value)
  // 判断是否需要批量传输数据
  const batchSize = 50
  for (let i = 0; i < students.length; i += batchSize) {
    const batch = students.slice(i, i + batchSize)
    const { data: result } = await apiAddStudentBaseInfo(batch)
    if (result.code !== 200) {
      console.log(
        '错误相应: ' +
          result +
          ', 在上传第' +
          i +
          '到' +
          (i + batchSize) +
          '条数据, 数据: ' +
          JSON.stringify(batch)
      )
      notify({ title: '错误', text: result.message, type: 'error' })
      loading.value = false
      uploadDialog.value = false
      return
    }
  }
  notify({ title: '成功', text: '上传成功！', type: 'success' })
  loading.value = false
  uploadDialog.value = false
}

const jsonDataToStudentArray = (jsonData: BaseHeader[]): Student[] => {
  return jsonData.map((student) => ({
    studentId: student.studentId,
    idNumber: student.idNumber,
    name: student.name,
    gender: student.gender,
    nativePlace: checkValid(student.nativePlace) ? student.nativePlace : null,
    postalCode: checkValid(student.postalCode) ? student.postalCode : null,
    politicStatus: checkValid(student.politicStatus) ? student.politicStatus : null,
    phone: checkValid(student.phone) ? student.phone : null,
    nation: checkValid(student.nation) ? student.nation : null,
    majorName: checkValid(student.majorName) ? student.majorName : null,
    grade: checkValid(student.grade) ? student.grade : null,
    classNo: checkValid(student.classNo) ? student.classNo : null,
    email: checkValid(student.email) ? student.email : null,
    headerTeacherUsername: checkValid(student.headerTeacherUsername)
      ? student.headerTeacherUsername
      : null,
    headerTeacherName: checkValid(student.headerTeacherName) ? student.headerTeacherName : null,
    headerTeacherPhone: checkValid(student.headerTeacherPhone) ? student.headerTeacherPhone : null,
    birthdate: checkValid(student.birthdate) ? student.birthdate : null,
    householdRegistration: checkValid(student.householdRegistration)
      ? student.householdRegistration
      : null,
    householdType: checkValid(student.householdType) ? student.householdType : null,
    address: checkValid(student.address) ? student.address : null,
    fatherName: checkValid(student.fatherName) ? student.fatherName : null,
    fatherPhone: checkValid(student.fatherPhone) ? student.fatherPhone : null,
    fatherOccupation: checkValid(student.fatherOccupation) ? student.fatherOccupation : null,
    motherName: checkValid(student.motherName) ? student.motherName : null,
    motherPhone: checkValid(student.motherPhone) ? student.motherPhone : null,
    motherOccupation: checkValid(student.motherOccupation) ? student.motherOccupation : null,
    guardian: checkValid(student.guardian) ? student.guardian : null,
    guardianPhone: checkValid(student.guardianPhone) ? student.guardianPhone : null,
    highSchool: checkValid(student.highSchool) ? student.highSchool : null,
    examId: checkValid(student.examId) ? student.examId : null,
    admissionBatch: checkValid(student.admissionBatch) ? student.admissionBatch : null,
    totalExamScore: checkValid(student.totalExamScore) ? student.totalExamScore : null,
    foreignLanguage: checkValid(student.foreignLanguage) ? student.foreignLanguage : null,
    foreignScore: checkValid(student.foreignScore) ? student.foreignScore : null,
    hobbies: checkValid(student.hobbies) ? student.hobbies : null,
    dormitory: checkValid(student.dormitory) ? student.dormitory : null,
    otherNotes: checkValid(student.otherNotes) ? student.otherNotes : null,
    joiningTime: checkValid(student.joiningTime) ? student.joiningTime : null,
    isStudentLoans: booleanMap.get(student.isStudentLoansText) ?? true,
    height: checkValid(student.height) ? student.height : null,
    weight: checkValid(student.weight) ? student.weight : null,
    religiousBeliefs: checkValid(student.religiousBeliefs) ? student.religiousBeliefs : null,
    location: checkValid(student.location) ? student.location : null,
    familyPopulation: checkValid(student.familyPopulation) ? student.familyPopulation : null,
    isOnlyChild: booleanMap.get(student.isOnlyChildText) ?? true,
    familyMembers: checkValid(student.familyMembers) ? student.familyMembers : null,
    degreeId: degreeMap.value.get(student.degreeName),
    politicId: politicMap.value.get(student.politicStatus),
    disability: booleanMap.get(student.disabilityText) ?? false,
    statusId: statusMap.value.get(student.statusName),
    gradeId: gradeMap.value.get(student.gradeName),
    majorId: majorMap.value.get(student.majorName),
    statusName: student.statusName,
    gradeName: student.gradeName,
    degreeName: student.degreeName,
    politicsStatus: student.politicStatus,
    enabled: true
  }))
}

const getSelectableOptions = async () => {
  // 获取所有数据
  const [DegreeResult, GradeResult, PoliticResult, MajorResult, HeaderTeacherResult, StatusResult] =
    await Promise.all([
      apiGetAllDegrees(),
      apiGetAllGrades(),
      apiGetAllPolitics(),
      apiGetMajorList(),
      apiGetHeaderTeahcers(),
      apiGetAllStatus()
    ])

  // 更新 store
  baseStore.updateDegreeList(DegreeResult.data.data)
  baseStore.updateGradeList(GradeResult.data.data)
  baseStore.updatePoliticList(PoliticResult.data.data)
  baseStore.updateMajorList(MajorResult.data.data)
  baseStore.updateHeaderTeacherList(HeaderTeacherResult.data.data)
  baseStore.updateStatusList(StatusResult.data.data)
}

onMounted(async () => {
  await getSelectableOptions()
})
</script>

<template>
  <v-card elevation="10" height="100%" width="100%">
    <UploadDialog v-model="uploadDialog" v-model:length="jsonData.length" @upload="uploadLogic" />
    <section class="menu">
      <span class="file text-indigo">
        <v-file-input
          v-model="excel"
          color="indigo"
          variant="underlined"
          hide-details
          free-select
          accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          label="Excel 文件选择"
        />
      </span>
      <v-btn prepend-icon="mdi-calculator-variant" color="indigo" @click="analyzeHandler">
        解析文件
      </v-btn>
      <v-btn
        v-if="has('student:insert')"
        prepend-icon="mdi-upload"
        color="primary"
        @click="uploadDialog = true"
      >
        上传数据
      </v-btn>
      <v-btn prepend-icon="mdi-download" href="/template/学生基本信息上传模板.xlsx">下载模板</v-btn>
    </section>
    <section class="pa-4 w-100">
      <ExcelTable v-model="jsonData" :headers="refBaseHeaders" :nil-data="nilData" />
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

.file {
  overflow: hidden;
  width: 26%;
}
</style>
