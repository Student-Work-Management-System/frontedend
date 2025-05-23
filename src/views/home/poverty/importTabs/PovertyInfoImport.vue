<script lang="ts" setup>
import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import {
  povertyHeaders,
  type PovertyHeader,
  HeaderValidChecker,
  AnalyzeFileToTable
} from '@/misc/table'
import ExcelTable from '@/components/home/ExcelTable.vue'
import UploadDialog from '@/components/home/UploadDialog.vue'
import { apiAddPovertyAssistances } from '@/api/poverty'

import { useUserStore } from '@/stores/userStore'

const excel = ref<File>()
const jsonData = ref<PovertyHeader[]>([])
const uploadDialog = ref()
const loading = ref(false)
const nilData: PovertyHeader = {
  povertyLevel: '',
  povertyType: '',
  povertyAssistanceStandard: ''
}

const analyzeHandler = async () => {
  loading.value = true
  const ret = (await AnalyzeFileToTable(
    excel.value as File,
    povertyHeaders,
    notify
  )) as PovertyHeader[]
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
      (valid, poverty) => (!valid ? false : HeaderValidChecker(poverty, povertyHeaders)),
      true
    )
  ) {
    notify({ title: '提示', text: '数据格式有问题！', type: 'warn' })
    loading.value = false
    return
  }

  const { data: result } = await apiAddPovertyAssistances(jsonData.value)
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
        v-if="has('poverty_assistance:insert')"
        text="上传数据"
        prepend-icon="mdi-upload"
        color="primary"
        @click="uploadDialog = true"
      />
      <v-btn
        prepend-icon="mdi-download"
        href="/template/贫困类型信息上传模板.xlsx"
        text="下载模板"
      />
    </section>
    <section class="pa-4 w-100">
      <ExcelTable v-model="jsonData" :headers="povertyHeaders" :nil-data="nilData" />
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
