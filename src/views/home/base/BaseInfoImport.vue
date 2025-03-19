<script lang="ts" setup>
import { onMounted, computed } from 'vue'
import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { baseheaders, type BaseHeader, HeaderValidChecker, AnalyzeFileToTable } from '@/misc/table'
import ExcelTable from '@/components/home/ExcelTable.vue'
import UploadDialog from '@/components/home/UploadDialog.vue'
import { apiGetMajorList, apiGetAllDegrees, apiGetAllGrades, apiGetAllPolitics } from '@/api/other'
import { apiAddStudentBaseInfo, apiGetHeaderTeahcers } from '@/api/student'
import { useUserStore } from '@/stores/userStore'
import { useBaseStore } from '@/stores/baseStore'
import type { Student } from '@/model/studentModel'

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
  headerTeacherUsername: '' as string | null,
  headerTeacherName: '' as string | null,
  headerTeacherPhone: '' as string | null,
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
  joiningTime: '' as string | null,
  isStudentLoans: true as boolean | null,
  height: '' as string | null,
  weight: '' as string | null,
  religiousBeliefs: '' as string | null,
  location: '' as string | null,
  familyPopulation: '' as string | null,
  isOnlyChild: true as boolean | null,
  familyMembers: '' as string | null,
  degreeId: '' as string | null,
  gradeId: '' as string | null,
  politicId: '' as string | null,
  disability: false as boolean | null,
  enabled: true,
  statusId: '' as string | null,
  gradeName: '' as string | null
}
const baseStore = useBaseStore()
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
  // 构造Student[]
  const students: Student[] = jsonData.value.map((student) => ({
    ...student,
    majorId: majorMap.value.get(student.majorName),
    gradeId: gradeMap.value.get(student.gradeName?.toString()),
    degreeId: degreeMap.value.get(student.degreeName),
    politicId: politicMap.value.get(student.politicStatus),
    headerTeacherUsername: student.headTeacherUsername
  }))
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

const getSelectableOptions = async () => {
  // 获取所有数据
  const [DegreeResult, GradeResult, PoliticResult, MajorResult, HeaderTeacherResult] =
    await Promise.all([
      apiGetAllDegrees(),
      apiGetAllGrades(),
      apiGetAllPolitics(),
      apiGetMajorList(),
      apiGetHeaderTeahcers()
    ])

  // 更新 store
  baseStore.updateDegreeList(DegreeResult.data.data)
  baseStore.updateGradeList(GradeResult.data.data)
  baseStore.updatePoliticList(PoliticResult.data.data)
  baseStore.updateMajorList(MajorResult.data.data)
  baseStore.updateHeaderTeacherList(HeaderTeacherResult.data.data)
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
