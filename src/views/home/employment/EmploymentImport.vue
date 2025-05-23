<script lang="ts" setup>
import {
  employmentHeaders,
  type EmploymentHeader,
  AnalyzeFileToTable,
  HeaderValidChecker
} from '@/misc/table'
import { ref, computed } from 'vue'
import UploadDialog from '@/components/home/UploadDialog.vue'
import { notify } from '@kyvg/vue3-notification'
import { useUserStore } from '@/stores/userStore'
import { apiAddEmployInfo } from '@/api/employment'

const excel = ref<File[]>()
const jsonData = ref<EmploymentHeader[]>([])
const file = computed(() => (excel.value === undefined ? null : excel.value[0]))
const loading = ref(false)
const uploadDialog = ref(false)
const nilData: EmploymentHeader = {
  studentId: '',
  graduationState: '',
  graduationYear: '',
  whereabouts: '',
  jobNature: '',
  jobIndustry: '',
  jobLocation: '',
  category: '',
  salary: '',
  studentEmploymentId: '',
  grade: '',
  code: '',
  organizationName: '',
  state: '',
  contactPerson: '',
  contactPhone: '',
  certificateTime: '',
  comment: ''
}

const analyzeHandler = async () => {
  loading.value = true
  const ret = (await AnalyzeFileToTable(
    file.value as File,
    employmentHeaders,
    notify
  )) as EmploymentHeader[]
  if (ret !== undefined) {
    jsonData.value = ret
  }
  loading.value = false
}

const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const uploadLogic = async () => {
  loading.value = true
  // valid data format before upload
  if (
    !jsonData.value.reduce(
      (valid, employment) => (!valid ? false : HeaderValidChecker(employment, employmentHeaders)),
      true
    )
  ) {
    notify({ title: '提示', text: '数据格式有问题！', type: 'warn' })
    loading.value = false
    return
  }
  const { data: result } = await apiAddEmployInfo(jsonData.value)
  if (result.code !== 200) {
    console.error(result)
    notify({ title: '错误', text: result.message, type: 'error' })
    loading.value = false
    uploadDialog.value = false
    return
  }
  notify({ title: '成功', text: '上传成功！', type: 'success' })
  uploadDialog.value = false
  loading.value = false
}
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" :loading="loading">
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
        v-if="has('student_employment:insert')"
        prepend-icon="mdi-upload"
        color="primary"
        @click="uploadDialog = true"
        text="上传数据"
      />
      <v-btn
        prepend-icon="mdi-download"
        href="/template/学生就业信息上传模板.xlsx"
        text="下载模板"
      />
    </section>
    <section class="pa-4 w-100">
      <ExcelTable v-model="jsonData" :headers="employmentHeaders" :nil-data="nilData" />
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
