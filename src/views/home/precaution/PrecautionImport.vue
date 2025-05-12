<script lang="ts" setup>
import { ref, computed } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import {
  HeaderValidChecker,
  AnalyzeFileToTable,
  checkValid,
  type StudentPrecautionHeader,
  studentPrecautionHeaders
} from '@/misc/table'
import { useUserStore } from '@/stores/userStore'
import ExcelTable from '@/components/home/ExcelTable.vue'
import UploadDialog from '@/components/home/UploadDialog.vue'
import { apiAddStudentPrecautions } from '@/api/precaution'
import type { StudentPrecaution } from '@/model/precautionModel'

const excel = ref<File>()
const jsonData = ref<StudentPrecautionHeader[]>([])
const uploadDialog = ref(false)
const loading = ref(false)

const nilData: StudentPrecautionHeader = {
  studentId: '',
  levelCode: null,
  term: '',
  detail: ''
}

// 检查权限
const store = useUserStore()
const has = (authority: string) => store.hasAuthorized(authority)

const refStudentPrecautionHeaders = computed(() => studentPrecautionHeaders)

const analyzeHandler = async () => {
  loading.value = true
  const ret = (await AnalyzeFileToTable(
    excel.value as File,
    refStudentPrecautionHeaders.value,
    notify
  )) as StudentPrecautionHeader[]
  if (ret !== undefined) {
    jsonData.value = ret
  }
  loading.value = false
}

const uploadLogic = async () => {
  loading.value = true
  const isValid = jsonData.value.every((item) => HeaderValidChecker(item, studentPrecautionHeaders))
  if (!isValid) {
    notify({ title: '提示', text: '数据格式有误，请检查！', type: 'warn' })
    loading.value = false
    return
  }
  const list = createStudentPrecautionList(jsonData.value)
  const { data: result } = await apiAddStudentPrecautions(list)
  if (result.code !== 200) {
    notify({ title: '错误', text: result.message, type: 'error' })
    loading.value = false
    return
  }
  notify({ title: '成功', text: '上传成功！', type: 'success' })
  uploadDialog.value = false
  loading.value = false
}

const createStudentPrecautionList = (raw: StudentPrecautionHeader[]): StudentPrecaution[] => {
  return raw.map((item) => ({
    studentId: checkValid(item.studentId) ? item.studentId : '',
    levelCode: checkValid(item.levelCode) ? item.levelCode : null,
    term: checkValid(item.term) ? item.term : '',
    detail: checkValid(item.detail) ? item.detail : ''
  }))
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
        />
      </span>
      <v-btn
        prepend-icon="mdi-calculator-variant"
        color="indigo"
        @click="analyzeHandler"
        text="解析文件"
      />
      <v-btn
        v-if="has('student_precaution:insert')"
        prepend-icon="mdi-upload"
        color="primary"
        @click="uploadDialog = true"
        text="上传数据"
      />
      <v-btn
        prepend-icon="mdi-download"
        href="/template/学生学业预警上传模板.xlsx"
        text="下载模板"
      />
    </section>
    <section class="pa-4 w-100">
      <ExcelTable v-model="jsonData" :headers="refStudentPrecautionHeaders" :nil-data="nilData" />
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
