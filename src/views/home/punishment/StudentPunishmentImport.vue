<script lang="ts" setup>
import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import {
  HeaderValidChecker,
  AnalyzeFileToTable,
  studentPunishmentHeaders,
  type StudentPunishmentHeader
} from '@/misc/table'
import ExcelTable from '@/components/home/ExcelTable.vue'
import UploadDialog from '@/components/home/UploadDialog.vue'
import { useUserStore } from '@/stores/userStore'
import type { StudentPunishment } from '@/model/punishmentModel'
import { apiAddStudentPunishment } from '@/api/punishment'
import moment from 'moment'

const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const excel = ref<File>()
const jsonData = ref<StudentPunishmentHeader[]>([])
const uploadDialog = ref(false)
const loading = ref(false)
const nilData: StudentPunishment = {
  studentId: '',
  reason: '',
  level: '',
  date: ''
}
const analyzeHandler = async () => {
  loading.value = true
  const ret = (await AnalyzeFileToTable(
    excel.value as File,
    studentPunishmentHeaders,
    notify
  )) as StudentPunishmentHeader[]
  if (ret !== undefined) {
    jsonData.value = ret
  }
  loading.value = false
}

const createStudentPunishmentList = (raws: StudentPunishmentHeader[]): StudentPunishment[] => {
  return raws.map((raw) => ({
    studentId: raw.studentId,
    level: raw.level,
    reason: raw.reason,
    date: moment().format('YYYY-MM-DD')
  }))
}

const upload = async () => {
  loading.value = true
  try {
    if (
      !jsonData.value.reduce(
        (valid, studentPunishment) =>
          !valid ? false : HeaderValidChecker(studentPunishment, studentPunishmentHeaders),
        true
      )
    ) {
      notify({ title: '提示', text: '数据格式有问题！', type: 'warn' })
      loading.value = false
      return
    }
    const studentPunishmentList = createStudentPunishmentList(jsonData.value)
    const { data: result } = await apiAddStudentPunishment(studentPunishmentList)
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
        v-if="has('student_punishment:insert')"
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
      <ExcelTable v-model="jsonData" :headers="studentPunishmentHeaders" :nil-data="nilData" />
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
