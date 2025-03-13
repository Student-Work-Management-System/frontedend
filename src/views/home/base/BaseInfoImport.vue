<script lang="ts" setup>
import { computed } from 'vue'
import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { baseheaders, type BaseHeader, HeaderValidChecker, AnalyzeFileToTable } from '@/misc/table'
import ExcelTable from '@/components/home/ExcelTable.vue'
import UploadDialog from '@/components/home/UploadDialog.vue'
import { apiGetMajorList } from '@/api/major'
import { apiAddStudentBaseInfo } from '@/api/student'
import { useUserStore } from '@/stores/user'

const excel = ref<File[]>()
const jsonData = ref<BaseHeader[]>([])
const file = computed(() => (excel.value === undefined ? null : excel.value[0]))
const uploadDialog = ref()
const loading = ref(false)
const nilData: BaseHeader = {
  studentId: '' as string | null,
  name: '' as string | null,
  idNumber: '' as string | null,
  gender: '' as string | null,
  nativePlace: '' as string | null,
  postalCode: '' as string | null,
  politicsStatus: '' as string | null,
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
  enabled: true
}

const analyzeHandler = async () => {
  loading.value = true
  const ret = (await AnalyzeFileToTable(file.value as File, baseheaders, notify)) as BaseHeader[]
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
      (valid, student) => (!valid ? false : HeaderValidChecker(student, baseheaders)),
      true
    )
  ) {
    notify({ title: '提示', text: '数据格式有问题！', type: 'warn' })
    loading.value = false
    return
  }

  const { data: result } = await apiGetMajorList()
  if (result.code !== 200) {
    console.log(result)
    notify({ title: '错误', text: result.message, type: 'error' })
    loading.value = false
    return
  }

  const majorMap = result.data.reduce((majorMap, major) => {
    majorMap.set(major.majorName, major.majorId)
    return majorMap
  }, new Map())

  const students = jsonData.value.map((student) => ({
    ...student,
    majorId: majorMap.get(student.majorName)
  }))
  const { data: result2 } = await apiAddStudentBaseInfo(students)
  if (result2.code !== 200) {
    console.log(result2)
    notify({ title: '错误', text: result2.message, type: 'error' })
    loading.value = false
    return
  }
  notify({ title: '成功', text: '上传成功！', type: 'success' })
  uploadDialog.value = false
  loading.value = false
}
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
        ></v-file-input>
      </span>
      <v-btn prepend-icon="mdi-calculator-variant" color="indigo" @click="analyzeHandler"
        >解析文件</v-btn
      >
      <v-btn
        v-if="has('student:insert')"
        prepend-icon="mdi-upload"
        color="primary"
        @click="uploadDialog = true"
        >上传数据</v-btn
      >
      <v-btn prepend-icon="mdi-download" href="/template/学生基本信息上传模板.xlsx">下载模板</v-btn>
    </section>
    <section class="pa-4 w-100">
      <ExcelTable v-model="jsonData" :headers="baseheaders" :nil-data="nilData" />
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
