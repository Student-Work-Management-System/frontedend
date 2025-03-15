<script lang="ts" setup>
import { computed } from 'vue'
import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'

import {
  studentpovertyheaders,
  type StudentPovertyHeader,
  HeaderValidChecker,
  AnalyzeFileToTable
} from '@/misc/table'

import ExcelTable from '@/components/home/ExcelTable.vue'
import UploadDialog from '@/components/home/UploadDialog.vue'
import { apiAddStudentPovertyAssistanceInfo, apiGetPovertyAssistanceList } from '@/api/poverty'

import { useUserStore } from '@/stores/userStore'

const excel = ref<File[]>()
const jsonData = ref<StudentPovertyHeader[]>([])
const file = computed(() => (excel.value === undefined ? null : excel.value[0]))
const uploadDialog = ref()
const loading = ref(false)
const nilData: StudentPovertyHeader = {
  studentPovertyAssistanceId: '',
  povertyAssistanceId: '',
  studentId: '',
  povertyLevel: '',
  povertyType: '',
  assistanceYear: ''
}

const analyzeHandler = async () => {
  loading.value = true
  const ret = (await AnalyzeFileToTable(
    file.value as File,
    studentpovertyheaders,
    notify
  )) as StudentPovertyHeader[]
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
      (valid, poverty) => (!valid ? false : HeaderValidChecker(poverty, studentpovertyheaders)),
      true
    )
  ) {
    notify({ title: '提示', text: '数据格式有问题！', type: 'warn' })
    loading.value = false
    return
  }

  const { data: result } = await apiGetPovertyAssistanceList()
  if (result.code !== 200) {
    console.log(result)
    notify({ title: '错误', text: result.message, type: 'error' })
    loading.value = false
    return
  }

  const povertyMap = result.data.reduce((povertyMap, poverty) => {
    povertyMap.set(poverty.povertyLevel + '_' + poverty.povertyType, poverty.povertyAssistanceId)
    return povertyMap
  }, new Map())

  const studentpovertys = jsonData.value.map((studentpoverty) => ({
    ...studentpoverty,
    povertyAssistanceId: povertyMap.get(
      studentpoverty.povertyLevel + '_' + studentpoverty.povertyType
    )
  }))

  const { data: result2 } = await apiAddStudentPovertyAssistanceInfo(studentpovertys)
  if (result2.code !== 200) {
    console.log(result2)
    notify({ title: '错误', text: result.message, type: 'error' })
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
        v-if="has('student_poverty_assistance:insert')"
        prepend-icon="mdi-upload"
        color="primary"
        @click="uploadDialog = true"
        >上传数据</v-btn
      >
      <v-btn prepend-icon="mdi-download" href="/template/学生贫困信息上传模板.xlsx">下载模板</v-btn>
    </section>
    <section class="pa-4 w-100">
      <ExcelTable v-model="jsonData" :headers="studentpovertyheaders" :nil-data="nilData" />
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
