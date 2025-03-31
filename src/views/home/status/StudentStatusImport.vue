<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import {
  HeaderValidChecker,
  AnalyzeFileToTable,
  type StudentStatusHeader,
  statusHeader
} from '@/misc/table'
import ExcelTable from '@/components/home/ExcelTable.vue'
import UploadDialog from '@/components/home/UploadDialog.vue'
import { apiGetAllStatus } from '@/api/status'
import { useUserStore } from '@/stores/userStore'
import { useBaseStore } from '@/stores/baseStore'
import type { StudentStatus } from '@/model/statusModel'
import { apiAddStudentStatusBatch } from '@/api/status'

const excel = ref<File>()
const jsonData = ref<StudentStatusHeader[]>([])
const uploadDialog = ref()
const loading = ref(false)
const nilData: StudentStatusHeader = {
  studentId: '',
  statusId: ''
}
const baseStore = useBaseStore()
const statusOptions = computed(() => {
  return baseStore.getStatusList().map((status) => status.statusName)
})
const statusMap = computed(() => {
  return baseStore.getStatusList().reduce((statusMap, status) => {
    statusMap.set(status.statusName, status.statusId)
    return statusMap
  }, new Map())
})
const refstatusHeaders = computed(() => {
  const statusNameIndex = statusHeader.findIndex((header) => header.field === 'statusName')
  statusHeader.splice(statusNameIndex, 1, {
    ...statusHeader[statusNameIndex],
    options: statusOptions.value
  })
  return statusHeader
})
const analyzeHandler = async () => {
  loading.value = true
  const ret = (await AnalyzeFileToTable(
    excel.value as File,
    statusHeader,
    notify
  )) as StudentStatusHeader[]
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
      (valid, studentStatus) => (!valid ? false : HeaderValidChecker(studentStatus, statusHeader)),
      true
    )
  ) {
    notify({ title: '提示', text: '数据格式有问题！', type: 'warn' })
    loading.value = false
    return
  }
  const studentCadreList = createStudentStatusList(jsonData.value)
  const { data: result } = await apiAddStudentStatusBatch(studentCadreList)
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

const createStudentStatusList = (rawStudentStatuses: StudentStatusHeader[]): StudentStatus[] => {
  return rawStudentStatuses.map((studentStatus) => ({
    studentId: studentStatus.studentId,
    statusId: statusMap.value.get(studentStatus.statusName)
  }))
}

onMounted(async () => {
  try {
    const { data: result } = await apiGetAllStatus()
    if (result.code !== 200) {
      console.log(result.message)
      notify({ title: '错误', text: result.message, type: 'error' })
    }
    baseStore.updateStatusList(result.data)
  } catch (error) {
    console.log(error)
  }
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
        prepend-icon="mdi-calculator-variant"
        color="indigo"
        @click="analyzeHandler"
        text="解析文件"
      />
      <v-btn
        v-if="has('student_status:insert')"
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
      <ExcelTable v-model="jsonData" :headers="refstatusHeaders" :nil-data="nilData" />
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
