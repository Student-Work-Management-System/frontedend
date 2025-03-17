<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { baseheaders, type BaseHeader, HeaderValidChecker, AnalyzeFileToTable } from '@/misc/table'
import ExcelTable from '@/components/home/ExcelTable.vue'
import UploadDialog from '@/components/home/UploadDialog.vue'
import { apiGetMajorList, apiGetAllDegrees, apiGetAllGrades, apiGetAllPolitics } from '@/api/other'
import { apiAddStudentBaseInfo } from '@/api/student'
import { useUserStore } from '@/stores/userStore'
import { useBaseStore } from '@/stores/baseStore'

const excel = ref<File>()
const jsonData = ref<BaseHeader[]>([])
const uploadDialog = ref()
const loading = ref(false)
const nilData: BaseHeader = {
  studentId: '' as string | null,
  name: '' as string | null,
  idNumber: '' as string | null,
  gender: '' as string | null,
  nativePlace: '' as string | null,
  postalCode: '' as string | null,
  politicStatus: '' as string | null,
  phone: '' as string | null,
  nation: '' as string | null,
  majorName: '' as string | null,
  majorId: '' as string | null,
  grade: '' as string | null,
  classNo: '' as string | null,
  email: '' as string | null,
  headTeacherUsername: '' as string | null,
  headTeacherName: '' as string | null,
  headTeacherPhone: '' as string | null,
  birthdate: '' as string | null,
  householdRegistration: '' as string | null,
  householdType: '' as string | null,
  address: '' as string | null,
  fatherName: '' as string | null,
  fatherPhone: '' as string | null,
  fatherOccupation: '' as string | null,
  motherName: '' as string | null,
  motherPhone: '' as string | null,
  motherOccupation: '' as string | null,
  guardian: '' as string | null,
  guardianPhone: '' as string | null,
  highSchool: '' as string | null,
  examId: '' as string | null,
  admissionBatch: '' as string | null,
  totalExamScore: '' as string | null,
  foreignLanguage: '' as string | null,
  foreignScore: '' as string | null,
  hobbies: '' as string | null,
  dormitory: '' as string | null,
  otherNotes: '' as string | null,
  isCommunistYouthLeagueMember: null as boolean | null,
  joiningTime: '' as string | null,
  isStudentLoans: null as boolean | null,
  height: '' as string | null,
  weight: '' as string | null,
  religiousBeliefs: '' as string | null,
  location: '' as string | null,
  familyPopulation: '' as string | null,
  isOnlyChild: null as boolean | null,
  familyMembers: '' as string | null,
  degreeId: null as string | null,
  gradeId: null as string | null,
  politicId: null as string | null,
  disability: null as boolean | null,
  enabled: true,
  statusId: null as string | null,
  gradeName: '' as string | null
}
const baseStore = useBaseStore()

const degreeOptions = computed(() => baseStore.getDegreeList().map((degree) => degree.degreeName))
const gradeOptions = computed(() => baseStore.getGradeList().map((grade) => grade.gradeName))
const politicOptions = computed(() =>
  baseStore.getPoliticList().map((politic) => politic.politicStatus)
)
const majorNameOptions = computed(() => baseStore.getMajorList().map((major) => major.majorName))

const refBaseHeaders = computed(() => {
  const degreeIndex = baseheaders.findIndex((header) => header.field === 'degree')
  const gradeIndex = baseheaders.findIndex((header) => header.field === 'grade')
  const politicIndex = baseheaders.findIndex((header) => header.field === 'politicStatus')
  const majorNameIndex = baseheaders.findIndex((header) => header.field === 'majorName')

  if (degreeIndex !== -1) {
    baseheaders[degreeIndex] = {
      ...baseheaders[degreeIndex],
      options: degreeOptions.value
    }
  }
  if (gradeIndex !== -1) {
    baseheaders[gradeIndex] = {
      ...baseheaders[gradeIndex],
      options: gradeOptions.value
    }
  }
  if (politicIndex !== -1) {
    baseheaders[politicIndex] = {
      ...baseheaders[politicIndex],
      options: politicOptions.value
    }
  }
  if (majorNameIndex !== -1) {
    baseheaders[majorNameIndex] = {
      ...baseheaders[majorNameIndex],
      options: majorNameOptions.value
    }
  }
  return baseheaders
})

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
  // valid data format before upload
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

  const majorMap = baseStore.getMajorList().reduce((majorMap, major) => {
    majorMap.set(major.majorName, major.majorId)
    return majorMap
  }, new Map())

  const degreeMap = baseStore.getDegreeList().reduce((degreeMap, degree) => {
    degreeMap.set(degree.degreeName, degree.degreeId)
    return degreeMap
  }, new Map())

  const gradeMap = baseStore.getGradeList().reduce((gradeMap, grade) => {
    gradeMap.set(grade.gradeName, grade.gradeId)
    return gradeMap
  }, new Map())

  const politicMap = baseStore.getPoliticList().reduce((politicMap, politic) => {
    politicMap.set(politic.politicStatus, politic.politicId)
    return politicMap
  }, new Map())

  const students = jsonData.value.map((student) => ({
    ...student,
    majorId: majorMap.get(student.majorName),
    gradeId: gradeMap.get(student.gradeName?.toString()),
    degreeId: degreeMap.get(student.degreeName),
    politicId: politicMap.get(student.politicStatus)
  }))
  let idx = 0
  let idNumber = 123456789012345678n
  students.forEach((student) => {
    student.idNumber = (idNumber + BigInt(idx)).toString()
    student.headTeacherUsername = '50'
    student.statusId = '1'
    if (student.majorId === null) {
      student.majorId = '1'
    }
    idx++
  })

  console.log(students)

  const size = students.length
  if (size >= 100) {
    const batchSize = 100 // 每批上传的大小
    for (let i = 0; i < students.length; i += batchSize) {
      const batch = students.slice(i, i + batchSize)
      const { data: result2 } = await apiAddStudentBaseInfo(batch)
      if (result2.code !== 200) {
        console.log(result2)
        notify({ title: '错误', text: result2.message, type: 'error' })
        loading.value = false
        return
      }
    }
    return
  }
  const { data: result2 } = await apiAddStudentBaseInfo(students)

  if (result2.code !== 200) {
    console.log(result2)
    notify({ title: '错误', text: result2.message, type: 'error' })
    loading.value = false
    return
  }
  notify({ title: '成功', text: '上传成功！', type: 'success' })
}

const getSelectableOptions = async () => {
  // 获取所有数据
  const [DegreeResult, GradeResult, PoliticResult, MajorResult] = await Promise.all([
    apiGetAllDegrees(),
    apiGetAllGrades(),
    apiGetAllPolitics(),
    apiGetMajorList()
  ])

  // 更新 store
  baseStore.updateDegreeList(DegreeResult.data.data)
  baseStore.updateGradeList(GradeResult.data.data)
  baseStore.updatePoliticList(PoliticResult.data.data)
  baseStore.updateMajorList(MajorResult.data.data)
}

onMounted(() => {
  getSelectableOptions()
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
