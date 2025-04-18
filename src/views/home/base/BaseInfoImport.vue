<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import {
  enrollmentHeaders,
  type EnrollmentHeader,
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
import type { HeaderTeacher } from '@/model/studentModel'
import type { Degree, Grade, Major, Politics } from '@/model/otherModel'
import type { Status } from '@/model/statusModel'
import type { Enrollment } from '@/model/enrollmentModel'

const excel = ref<File>()
const jsonData = ref<EnrollmentHeader[]>([])
const uploadDialog = ref()
const loading = ref(false)
const nilData: EnrollmentHeader = {
  studentId: '',
  idNumber: '',
  name: '',
  gender: '',
  birthdate: '',
  hobbies: '',
  nativePlace: '',
  nation: '',
  height: '',
  weight: '',
  politicId: '',
  phone: '',
  email: '',
  headerTeacherUsername: '',
  dormitory: '',
  classNo: '',
  majorId: '',
  gradeId: '',
  degreeId: '',
  studentType: '',
  admissionBatch: '',
  subjectCategory: '',
  provinceName: '',
  examId: '',
  admittedMajor: '',
  volunteerMajor: '',
  volunteerCollege: '',
  totalExamScore: '',
  convertedScore: '',
  specialScore: '',
  feature: '',
  volunteer1: '',
  volunteer2: '',
  volunteer3: '',
  volunteer4: '',
  volunteer5: '',
  volunteer6: '',
  studentFrom: '',
  isAdjusted: false,
  receiver: '',
  receiverPhone: '',
  postalCode: '',
  householdRegistration: '',
  householdType: '',
  address: '',
  fatherName: '',
  fatherPhone: '',
  fatherOccupation: '',
  motherName: '',
  motherPhone: '',
  motherOccupation: '',
  guardian: '',
  guardianPhone: '',
  familyPopulation: '',
  familyMembers: '',
  familyLocation: '',
  isOnlyChild: true,
  highSchoolCode: '',
  highSchoolName: '',
  candidateCategoryClassification: '',
  graduationCategoryClassification: '',
  graduationCategory: '',
  candidateCategory: '',
  foreignLanguage: '',
  scoreChinese: '',
  scoreMath: '',
  scoreForeignLanguage: '',
  scoreComprehensive: '',
  scorePhysics: '',
  scoreChemistry: '',
  scoreBiology: '',
  scorePolitics: '',
  scoreHistory: '',
  scoreGeography: '',
  scoreTechnology: '',
  selectedSubjects: '',
  studentLoans: false,
  disability: false,
  religiousBeliefs: '',
  otherNotes: '',
  enabled: true,
  isAdujustText: '',
  isOnlyChildText: '',
  studentLoansText: '',
  disabilityText: ''
}
const baseStore = useBaseStore()
// const statusOptions = computed(() => baseStore.getStatusList().map((status) => status.statusName))
const degreeOptions = computed(() => baseStore.getDegreeList().map((degree) => degree.degreeName))
const gradeOptions = computed(() => baseStore.getGradeList().map((grade) => grade.gradeName))
const politicOptions = computed(() =>
  baseStore.getPoliticList().map((politic) => politic.politicStatus)
)
const majorOptions = computed(() => baseStore.getMajorList().map((major) => major.majorName))
const headerTeacherOptions = computed(() =>
  baseStore.getHeaderTeacherList().map((headerTeacher) => headerTeacher.headerTeacherUsername)
)
const refHeaders = computed(() => {
  const degreeNameIndex = enrollmentHeaders.findIndex((header) => header.field === 'degreeName')
  enrollmentHeaders.splice(degreeNameIndex, 1, {
    ...enrollmentHeaders[degreeNameIndex],
    options: degreeOptions.value
  })
  const gradeNameIndex = enrollmentHeaders.findIndex((header) => header.field === 'gradeName')
  enrollmentHeaders.splice(gradeNameIndex, 1, {
    ...enrollmentHeaders[gradeNameIndex],
    options: gradeOptions.value
  })
  const politicStatusIndex = enrollmentHeaders.findIndex(
    (header) => header.field === 'politicStatus'
  )
  enrollmentHeaders.splice(politicStatusIndex, 1, {
    ...enrollmentHeaders[politicStatusIndex],
    options: politicOptions.value
  })
  const majorNameIndex = enrollmentHeaders.findIndex((header) => header.field === 'majorName')
  enrollmentHeaders.splice(majorNameIndex, 1, {
    ...enrollmentHeaders[majorNameIndex],
    options: majorOptions.value
  })
  const headerTeacherUsernameIndex = enrollmentHeaders.findIndex(
    (header) => header.field === 'headerTeacherUsername'
  )
  enrollmentHeaders.splice(headerTeacherUsernameIndex, 1, {
    ...enrollmentHeaders[headerTeacherUsernameIndex],
    options: headerTeacherOptions.value
  })
  // const statusNameIndex = enrollmentHeaders.findIndex((header) => header.field === 'statusName')
  // enrollmentHeaders.splice(statusNameIndex, 1, {
  //   ...enrollmentHeaders[statusNameIndex],
  //   options: statusOptions.value
  // })
  return enrollmentHeaders
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
const booleanMap = new Map([
  ['是', true],
  ['否', false]
])

const analyzeHandler = async () => {
  loading.value = true
  const ret = (await AnalyzeFileToTable(
    excel.value as File,
    refHeaders.value,
    notify
  )) as EnrollmentHeader[]
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
      (valid, raw) => (!valid ? false : HeaderValidChecker(raw, refHeaders.value)),
      true
    )
  ) {
    notify({ title: '提示', text: '数据格式有问题！', type: 'warn' })
    loading.value = false
    return
  }
  const students = jsonData2EnrollmentArray(jsonData.value)
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

const jsonData2EnrollmentArray = (jsonData: EnrollmentHeader[]): Enrollment[] => {
  return jsonData.map((raw) => ({
    // 个人基础信息
    studentId: raw.studentId,
    idNumber: raw.idNumber,
    name: raw.name,
    gender: raw.gender,
    birthdate: checkValid(raw.birthdate) ? raw.birthdate : '',
    hobbies: checkValid(raw.hobbies) ? raw.hobbies : '',
    nativePlace: checkValid(raw.nativePlace) ? raw.nativePlace : '',
    nation: checkValid(raw.nation) ? raw.nation : '',
    height: checkValid(raw.height) ? raw.height : '',
    weight: checkValid(raw.weight) ? raw.weight : '',
    politicId: politicMap.value.get(raw.politicStatus),
    phone: checkValid(raw.phone) ? raw.phone : '',
    email: checkValid(raw.email) ? raw.email : '',

    // 在校信息
    headerTeacherUsername: checkValid(raw.headerTeacherUsername) ? raw.headerTeacherUsername : '',
    dormitory: checkValid(raw.dormitory) ? raw.dormitory : '',
    classNo: checkValid(raw.classNo) ? raw.classNo : '',
    majorId: majorMap.value.get(raw.majorName),
    gradeId: gradeMap.value.get(raw.gradeName),
    degreeId: degreeMap.value.get(raw.degreeName),

    // 高考信息
    studentType: checkValid(raw.studentType) ? raw.studentType : '',
    admissionBatch: checkValid(raw.admissionBatch) ? raw.admissionBatch : '',
    subjectCategory: checkValid(raw.subjectCategory) ? raw.subjectCategory : '',
    provinceName: checkValid(raw.provinceName) ? raw.provinceName : '',
    examId: checkValid(raw.examId) ? raw.examId : '',
    admittedMajor: checkValid(raw.admittedMajor) ? raw.admittedMajor : '',
    volunteerMajor: checkValid(raw.volunteerMajor) ? raw.volunteerMajor : '',
    volunteerCollege: checkValid(raw.volunteerCollege) ? raw.volunteerCollege : '',
    totalExamScore: checkValid(raw.totalExamScore) ? raw.totalExamScore : '',
    convertedScore: checkValid(raw.convertedScore) ? raw.convertedScore : '',
    specialScore: checkValid(raw.specialScore) ? raw.specialScore : '',
    feature: checkValid(raw.feature) ? raw.feature : '',
    volunteer1: checkValid(raw.volunteer1) ? raw.volunteer1 : '',
    volunteer2: checkValid(raw.volunteer2) ? raw.volunteer2 : '',
    volunteer3: checkValid(raw.volunteer3) ? raw.volunteer3 : '',
    volunteer4: checkValid(raw.volunteer4) ? raw.volunteer4 : '',
    volunteer5: checkValid(raw.volunteer5) ? raw.volunteer5 : '',
    volunteer6: checkValid(raw.volunteer6) ? raw.volunteer6 : '',
    studentFrom: checkValid(raw.studentFrom) ? raw.studentFrom : '',
    isAdjusted: booleanMap.get(raw.isAdjustedText) ?? false,
    receiver: checkValid(raw.receiver) ? raw.receiver : '',
    receiverPhone: checkValid(raw.receiverPhone) ? raw.receiverPhone : '',
    postalCode: checkValid(raw.postalCode) ? raw.postalCode : '',

    // 户口信息
    householdRegistration: checkValid(raw.householdRegistration) ? raw.householdRegistration : '',
    householdType: checkValid(raw.householdType) ? raw.householdType : '',
    address: checkValid(raw.address) ? raw.address : '',
    fatherName: checkValid(raw.fatherName) ? raw.fatherName : '',
    fatherPhone: checkValid(raw.fatherPhone) ? raw.fatherPhone : '',
    fatherOccupation: checkValid(raw.fatherOccupation) ? raw.fatherOccupation : '',
    motherName: checkValid(raw.motherName) ? raw.motherName : '',
    motherPhone: checkValid(raw.motherPhone) ? raw.motherPhone : '',
    motherOccupation: checkValid(raw.motherOccupation) ? raw.motherOccupation : '',
    guardian: checkValid(raw.guardian) ? raw.guardian : '',
    guardianPhone: checkValid(raw.guardianPhone) ? raw.guardianPhone : '',
    familyPopulation: checkValid(raw.familyPopulation) ? raw.familyPopulation : '',
    familyMembers: checkValid(raw.familyMembers) ? raw.familyMembers : '',
    familyLocation: checkValid(raw.familyLocation) ? raw.familyLocation : '',
    isOnlyChild: booleanMap.get(raw.isOnlyChildText) ?? false,

    // 中学信息
    highSchoolCode: checkValid(raw.highSchoolCode) ? raw.highSchoolCode : '',
    highSchoolName: checkValid(raw.highSchoolName) ? raw.highSchoolName : '',
    candidateCategoryClassification: checkValid(raw.candidateCategoryClassification)
      ? raw.candidateCategoryClassification
      : '',
    graduationCategoryClassification: checkValid(raw.graduationCategoryClassification)
      ? raw.graduationCategoryClassification
      : '',
    graduationCategory: checkValid(raw.graduationCategory) ? raw.graduationCategory : '',
    candidateCategory: checkValid(raw.candidateCategory) ? raw.candidateCategory : '',
    foreignLanguage: checkValid(raw.foreignLanguage) ? raw.foreignLanguage : '',
    scoreChinese: checkValid(raw.scoreChinese) ? raw.scoreChinese : '',
    scoreMath: checkValid(raw.scoreMath) ? raw.scoreMath : '',
    scoreForeignLanguage: checkValid(raw.scoreForeignLanguage) ? raw.scoreForeignLanguage : '',
    scoreComprehensive: checkValid(raw.scoreComprehensive) ? raw.scoreComprehensive : '',
    scorePhysics: checkValid(raw.scorePhysics) ? raw.scorePhysics : '',
    scoreChemistry: checkValid(raw.scoreChemistry) ? raw.scoreChemistry : '',
    scoreBiology: checkValid(raw.scoreBiology) ? raw.scoreBiology : '',
    scorePolitics: checkValid(raw.scorePolitics) ? raw.scorePolitics : '',
    scoreHistory: checkValid(raw.scoreHistory) ? raw.scoreHistory : '',
    scoreGeography: checkValid(raw.scoreGeography) ? raw.scoreGeography : '',
    scoreTechnology: checkValid(raw.scoreTechnology) ? raw.scoreTechnology : '',
    selectedSubjects: checkValid(raw.selectedSubjects) ? raw.selectedSubjects : '',

    // 其他
    studentLoans: booleanMap.get(raw.studentLoansText) ?? false,
    disability: booleanMap.get(raw.disabilityText) ?? false,
    religiousBeliefs: checkValid(raw.religiousBeliefs) ? raw.religiousBeliefs : '',

    // 备注
    otherNotes: checkValid(raw.otherNotes) ? raw.otherNotes : '',

    // 启用状态
    enabled: true
  }))
}

const getSelectableOptions = async () => {
  const store = baseStore
  const requests = []

  // 检查各个列表长度，只请求空列表的数据
  if (!store.getDegreeList().length) {
    requests.push(apiGetAllDegrees())
  }
  if (!store.getGradeList().length) {
    requests.push(apiGetAllGrades())
  }
  if (!store.getPoliticList().length) {
    requests.push(apiGetAllPolitics())
  }
  if (!store.getMajorList().length) {
    requests.push(apiGetMajorList())
  }
  if (!store.getHeaderTeacherList().length) {
    requests.push(apiGetHeaderTeahcers())
  }
  if (!store.getStatusList().length) {
    requests.push(apiGetAllStatus())
  }

  // 如果没有需要请求的数据，直接返回
  if (!requests.length) return

  // 获取需要更新的数据
  const results = await Promise.all(requests)

  // 根据请求顺序更新对应的store
  let index = 0
  if (!store.getDegreeList().length) {
    store.updateDegreeList(results[index++].data.data as Degree[])
  }
  if (!store.getGradeList().length) {
    store.updateGradeList(results[index++].data.data as Grade[])
  }
  if (!store.getPoliticList().length) {
    store.updatePoliticList(results[index++].data.data as Politics[])
  }
  if (!store.getMajorList().length) {
    store.updateMajorList(results[index++].data.data as Major[])
  }
  if (!store.getHeaderTeacherList().length) {
    store.updateHeaderTeacherList(results[index++].data.data as HeaderTeacher[])
  }
  if (!store.getStatusList().length) {
    store.updateStatusList(results[index++].data.data as Status[])
  }
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
      <v-btn
        prepend-icon="mdi-calculator-variant"
        color="indigo"
        @click="analyzeHandler"
        text="解析文件"
      />
      <v-btn
        v-if="has('raw:insert')"
        prepend-icon="mdi-upload"
        color="primary"
        @click="uploadDialog = true"
        text="上传数据"
      />
      <v-btn
        prepend-icon="mdi-download"
        href="/template/学生基本信息上传模板.xlsx"
        text="下载模板"
      />
    </section>
    <section class="pa-4 w-100">
      <ExcelTable v-model="jsonData" :headers="refHeaders" :nil-data="nilData" />
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
