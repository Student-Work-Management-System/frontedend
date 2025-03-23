<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import {
  HeaderValidChecker,
  AnalyzeFileToTable,
  checkValid,
  type StudentCadreHeader,
  studentCadreHeaders
} from '@/misc/table'
import { useCadreStore } from '@/stores/cadreStore'
import ExcelTable from '@/components/home/ExcelTable.vue'
import UploadDialog from '@/components/home/UploadDialog.vue'
import { apiAddStudentCadres, apiGetCadreList } from '@/api/cadre'
import { useUserStore } from '@/stores/userStore'
import type { StudentCadre } from '@/model/cadreModel'

const excel = ref<File>()
const jsonData = ref<StudentCadreHeader[]>([])
const uploadDialog = ref()
const loading = ref(false)
const nilData: StudentCadreHeader = {
  studentCadreId: '',
  studentId: '',
  cadreId: '',
  cadreInfo: '',
  appointmentStartTerm: '',
  appointmentEndTerm: '',
  comment: '',
  cadrePosition: '',
  cadreLevel: ''
}
const cadreStore = useCadreStore()
const cadreOptions = computed(() => {
  return cadreStore
    .getCadreList()
    .map((cadre) => `${cadre.cadrePosition} - ${cadre.cadreLevel} - ${cadre.cadreBelong}`)
})
const cadreMap = computed(() => {
  return cadreStore.getCadreList().reduce((cadreMap, cadre) => {
    cadreMap.set(
      `${cadre.cadrePosition} - ${cadre.cadreLevel} - ${cadre.cadreBelong}`,
      cadre.cadreId
    )
    return cadreMap
  }, new Map())
})
const refStudentCadreHeaders = computed(() => {
  const cadreInfoIndex = studentCadreHeaders.findIndex((header) => header.field === 'cadreInfo')
  studentCadreHeaders.splice(cadreInfoIndex, 1, {
    ...studentCadreHeaders[cadreInfoIndex],
    options: cadreOptions.value
  })
  return studentCadreHeaders
})
const analyzeHandler = async () => {
  loading.value = true
  const ret = (await AnalyzeFileToTable(
    excel.value as File,
    studentCadreHeaders,
    notify
  )) as StudentCadreHeader[]
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
  if (
    !jsonData.value.reduce(
      (valid, studentcadre) =>
        !valid ? false : HeaderValidChecker(studentcadre, studentCadreHeaders),
      true
    )
  ) {
    notify({ title: '提示', text: '数据格式有问题！', type: 'warn' })
    loading.value = false
    return
  }
  const studentCadreList = createStudentCadreList(jsonData.value)
  const { data: result } = await apiAddStudentCadres(studentCadreList)
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

const createStudentCadreList = (rawStudentCadres: StudentCadreHeader[]): StudentCadre[] => {
  return rawStudentCadres.map((studentCadre) => ({
    studentId: checkValid(studentCadre.studentId) ? studentCadre.studentId : '',
    cadreId: checkValid(studentCadre.cadreInfo) ? cadreMap.value.get(studentCadre.cadreInfo) : '',
    appointmentStartTerm: checkValid(studentCadre.appointmentStartTerm)
      ? studentCadre.appointmentStartTerm
      : '',
    appointmentEndTerm: checkValid(studentCadre.appointmentEndTerm)
      ? studentCadre.appointmentEndTerm
      : '',
    comment: checkValid(studentCadre.comment) ? studentCadre.comment : ''
  }))
}

onMounted(async () => {
  const { data: result } = await apiGetCadreList()
  if (result.code !== 200) {
    console.log(result)
    notify({ title: '错误', text: result.message, type: 'error' })
  }
  cadreStore.setCadreList(result.data)
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
      <v-btn prepend-icon="mdi-calculator-variant" color="indigo" @click="analyzeHandler"
        >解析文件</v-btn
      >
      <v-btn
        v-if="has('student_cadre:insert')"
        prepend-icon="mdi-upload"
        color="primary"
        @click="uploadDialog = true"
        >上传数据</v-btn
      >
      <v-btn prepend-icon="mdi-download" href="/template/学生任职信息上传模板.xlsx">下载模板</v-btn>
    </section>
    <section class="pa-4 w-100">
      <ExcelTable v-model="jsonData" :headers="refStudentCadreHeaders" :nil-data="nilData" />
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
