<script lang="ts" setup>
import * as XLSX from 'xlsx'
import { computed } from 'vue'
import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { baseheaders, type BaseHeader, BaseHeaderChecker } from '@/misc/table'
import ExcelTable from '@/components/home/ExcelTable.vue'
import { apiGetMajorList } from '@/api/major'
import { apiAddStudentBaseInfo } from '@/api/base'

const excel = ref<File[]>()
const jsonData = ref<BaseHeader[]>([])
const file = computed(() => (excel.value === undefined ? null : excel.value[0]))
const uploadDialog = ref()
const loading = ref()
const ifValided = ref(false)
const nilData: BaseHeader = {
  studentId: '',
  name: '',
  idNumber: '',
  gender: '',
  nativePlace: '',
  postalCode: '',
  politicsStatus: '',
  phone: '',
  nation: '',
  majorName: '',
  grade: '',
  classNo: ''
}

const analyzeHandler = async () => {
  if (file.value === null || file.value === undefined) {
    notify({ type: 'warn', title: '提示', text: '还未选择文件！' })
    return
  }
  const workbook = XLSX.read(await file.value?.arrayBuffer())
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  jsonData.value = XLSX.utils.sheet_to_json(worksheet)
}

const uploadLogic = async () => {
  loading.value = true
  // valid data format before upload
  if (
    !jsonData.value.reduce((valid, student) => (!valid ? false : BaseHeaderChecker(student)), true)
  ) {
    notify({ title: '提示', text: '数据格式有问题！', type: 'warn' })
    loading.value = false
    return
  }

  const { data: result } = await apiGetMajorList()
  if (result.code !== 200) {
    console.log(result)
    notify({ title: '错误', text: result.message, type: 'error' })
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
    return
  }
  notify({ title: '成功', text: '上传成功！', type: 'success' })
  loading.value = false
}
</script>

<template>
  <v-card elevation="10" height="100%" width="100%">
    <v-dialog width="500" v-model="uploadDialog">
      <v-card
        prepend-icon="mdi-upload"
        title="上传数据"
        :text="`填写选择 ${jsonData.length} 条记录，确定要上传吗？`"
      >
        <v-card-actions class="mx-auto">
          <v-btn
            :loading="loading"
            :disabled="jsonData.length === 0 && ifValided"
            color="indigo"
            @click="uploadLogic"
            >上传</v-btn
          >
          <v-btn @click="uploadDialog = false">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      <v-btn prepend-icon="mdi-upload" color="primary" @click="uploadDialog = true">上传数据</v-btn>
      <v-btn prepend-icon="mdi-download">下载模板</v-btn>
    </section>
    <section class="pa-4 h-100 w-100">
      <ExcelTable v-model="jsonData" :headers="baseheaders" :nil-data="nilData" />
    </section>
  </v-card>
</template>

<style>
.component-content {
  width: 100% !important;
  height: 100% !important;
}
</style>
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
