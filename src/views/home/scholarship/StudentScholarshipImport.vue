<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import {
  HeaderValidChecker,
  AnalyzeFileToTable,
  studentScholarHeader,
  type StudentScholarshipHeader
} from '@/misc/table'
import { useScholarshipStore } from '@/stores/scholarshipStore'
import ExcelTable from '@/components/home/ExcelTable.vue'
import UploadDialog from '@/components/home/UploadDialog.vue'
import { useUserStore } from '@/stores/userStore'
import type { StudentScholarship } from '@/model/scholarshipModel'
import { apiAddStudentScholarships, apiGetScholarships } from '@/api/scholarship'

const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const scholarshipStore = useScholarshipStore()
const excel = ref<File>()
const jsonData = ref<StudentScholarshipHeader[]>([])
const uploadDialog = ref(false)
const loading = ref(false)
const nilData: StudentScholarship = {
  scholarshipId: '',
  studentId: '',
  awardYear: ''
}
const scholarOptions = computed(() => {
  return scholarshipStore
    .getScholarshipList()
    .map((scholarship) => `${scholarship.scholarshipName} - ${scholarship.scholarshipLevel}`)
})
const scholarshipMap = computed(() => {
  return scholarshipStore.getScholarshipList().reduce((scholarshipMap, scholarship) => {
    scholarshipMap.set(
      `${scholarship.scholarshipName} - ${scholarship.scholarshipLevel}`,
      scholarship.scholarshipId
    )
    return scholarshipMap
  }, new Map())
})
const refStudentScolarshipHeaders = computed(() => {
  const scholarshipInfoIndex = studentScholarHeader.findIndex(
    (header) => header.field === 'scholarshipInfo'
  )
  studentScholarHeader.splice(scholarshipInfoIndex, 1, {
    ...studentScholarHeader[scholarshipInfoIndex],
    options: scholarOptions.value
  })
  return studentScholarHeader
})
const analyzeHandler = async () => {
  loading.value = true
  const ret = (await AnalyzeFileToTable(
    excel.value as File,
    refStudentScolarshipHeaders.value,
    notify
  )) as StudentScholarshipHeader[]
  if (ret !== undefined) {
    jsonData.value = ret
  }
  loading.value = false
}

const createStudentScholarList = (raws: StudentScholarshipHeader[]): StudentScholarship[] => {
  return raws.map((raw) => ({
    studentId: raw.studentId,
    scholarshipId: scholarshipMap.value.get(raw.scholarshipInfo),
    awardYear: raw.awardYear
  }))
}

const upload = async () => {
  loading.value = true
  try {
    if (
      !jsonData.value.reduce(
        (valid, studentScholarship) =>
          !valid ? false : HeaderValidChecker(studentScholarship, studentScholarHeader),
        true
      )
    ) {
      notify({ title: '提示', text: '数据格式有问题！', type: 'warn' })
      loading.value = false
      return
    }
    const studentScholarshipList = createStudentScholarList(jsonData.value)
    const { data: result } = await apiAddStudentScholarships(studentScholarshipList)
    if (result.code !== 200) {
      console.log(result)
      notify({ title: '错误', text: result.message, type: 'error' })
      loading.value = false
      return
    }
    notify({ title: '成功', text: '上传成功！', type: 'success' })
  } catch (error) {
    console.log(error)
  } finally {
    uploadDialog.value = false
    loading.value = false
  }
}

onMounted(async () => {
  if (scholarshipStore.getScholarshipList().length <= 0) {
    const { data: result } = await apiGetScholarships()
    if (result.code !== 200) {
      console.log(result)
      notify({ title: '错误', text: result.message, type: 'error' })
    }
    scholarshipStore.setScholarshipList(result.data)
  }
})
</script>

<template>
  <v-card elevation="10" height="100%" width="100%">
    <UploadDialog v-model="uploadDialog" v-model:length="jsonData.length" @upload="upload" />
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
        v-if="has('student_scholarship:insert')"
        prepend-icon="mdi-upload"
        color="primary"
        @click="uploadDialog = true"
        text="上传数据"
      />
      <v-btn
        prepend-icon="mdi-download"
        href="/template/学生任职信息上传模板.xlsx"
        text="下载模板"
      />
    </section>
    <section class="pa-4 w-100">
      <ExcelTable v-model="jsonData" :headers="refStudentScolarshipHeaders" :nil-data="nilData" />
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
