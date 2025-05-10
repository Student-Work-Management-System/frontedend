<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import {
  studentPovertyHeaders,
  type StudentPovertyHeader,
  HeaderValidChecker,
  AnalyzeFileToTable,
  checkValid
} from '@/misc/table'
import ExcelTable from '@/components/home/ExcelTable.vue'
import UploadDialog from '@/components/home/UploadDialog.vue'
import { apiAddStudentPovertyAssistanceInfo, apiGetPovertyAssistanceList } from '@/api/poverty'
import { useUserStore } from '@/stores/userStore'
import { usePovertyStore } from '@/stores/povertyStore'
import type { StudentPovertyAssistance } from '@/model/povertyModel'

const povertyStore = usePovertyStore()
const excel = ref<File>()
const jsonData = ref<StudentPovertyHeader[]>([])
const uploadDialog = ref()
const loading = ref(false)
const nilData: StudentPovertyHeader = {
  studentPovertyAssistanceId: '',
  povertyAssistanceId: '',
  studentId: '',
  assistanceYear: ''
}
const analyzeHandler = async () => {
  loading.value = true
  const ret = (await AnalyzeFileToTable(
    excel.value as File,
    studentPovertyHeaders,
    notify
  )) as StudentPovertyHeader[]
  if (ret !== undefined) {
    jsonData.value = ret
  }
  loading.value = false
}
const povertyOptions = computed(() => {
  return povertyStore
    .getPovertyList()
    .map(
      (poverty) =>
        poverty.povertyType +
        ' - ' +
        poverty.povertyLevel +
        ' - ' +
        poverty.povertyAssistanceStandard
    )
})
const povertyMap = computed(() => {
  return povertyStore.getPovertyList().reduce((povertyMap, poverty) => {
    povertyMap.set(
      poverty.povertyType +
        ' - ' +
        poverty.povertyLevel +
        ' - ' +
        poverty.povertyAssistanceStandard,
      poverty.povertyAssistanceId
    )
    return povertyMap
  }, new Map())
})
const refStudentPovertyHeaders = computed(() => {
  const povertyAssistanceIdIndex = studentPovertyHeaders.findIndex(
    (header) => header.field === 'povertyAssistanceInfo'
  )
  studentPovertyHeaders.splice(povertyAssistanceIdIndex, 1, {
    ...studentPovertyHeaders[povertyAssistanceIdIndex],
    options: povertyOptions.value
  })
  return studentPovertyHeaders
})
// 检验用户权限用的
const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const uploadLogic = async () => {
  loading.value = true
  if (
    !jsonData.value.reduce(
      (valid, poverty) => (!valid ? false : HeaderValidChecker(poverty, studentPovertyHeaders)),
      true
    )
  ) {
    notify({ title: '提示', text: '数据格式有问题！', type: 'warn' })
    loading.value = false
    return
  }
  const studentPovertys = createStudentPovertyAssistanceList(jsonData.value)
  const { data: result } = await apiAddStudentPovertyAssistanceInfo(
    studentPovertys as StudentPovertyAssistance[]
  )
  if (result.code !== 200) {
    console.log(result)
    notify({ title: '错误', text: result.message, type: 'error' })
    loading.value = false
    return
  }
  notify({ title: '成功', text: '上传成功！', type: 'success' })
  uploadDialog.value = false
  loading.value = false
}

const createStudentPovertyAssistanceList = (
  rawStudentPoverty: StudentPovertyHeader[]
): StudentPovertyAssistance[] => {
  return rawStudentPoverty.map((studentPoverty) => ({
    povertyAssistanceId: povertyMap.value.get(studentPoverty.povertyAssistanceInfo),
    studentId: checkValid(studentPoverty.studentId) ? studentPoverty.studentId : '',
    assistanceYear: checkValid(studentPoverty.assistanceYear) ? studentPoverty.assistanceYear : ''
  }))
}
onMounted(async () => {
  const { data: result } = await apiGetPovertyAssistanceList()
  if (result.code !== 200) {
    console.log(result)
    notify({ title: '错误', text: result.message, type: 'error' })
    return
  }
  povertyStore.setPovertyList(result.data)
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
        text="解析文件"
        prepend-icon="mdi-calculator-variant"
        color="indigo"
        @click="analyzeHandler"
      />
      <v-btn
        v-if="has('student_poverty_assistance:insert')"
        text="上传数据"
        prepend-icon="mdi-upload"
        color="primary"
        @click="uploadDialog = true"
      />
      <v-btn
        prepend-icon="mdi-download"
        href="/template/学生贫困信息上传模板.xlsx"
        text="下载模板"
      />
    </section>
    <section class="pa-4 w-100">
      <ExcelTable v-model="jsonData" :headers="refStudentPovertyHeaders" :nil-data="nilData" />
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
