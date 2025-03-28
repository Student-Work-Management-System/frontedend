<script lang="ts" setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import {
  competitionHeaders,
  type CompetitionHeader,
  AnalyzeFileToTable,
  HeaderValidChecker,
  checkValid
} from '@/misc/table'
import { notify } from '@kyvg/vue3-notification'
import { apiImportCompetition } from '@/api/competition'
import type { Competition } from '@/model/competitionModel'

const nilData = {
  competitionId: '',
  competitionName: '',
  competitionNature: '',
  competitionType: ''
}
const excel = ref<File>()
const jsonData = ref<CompetitionHeader[]>([])
const loading = ref(false)
const uploadDialog = ref(false)

const uploadLogic = async () => {
  loading.value = true
  const competitions = jsonData.value.map(createCompetition)
  const { data: result } = await apiImportCompetition(competitions)
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

const createCompetition = (data: CompetitionHeader): Competition => {
  return {
    competitionName: checkValid(data.competitionName) ? data.competitionName : '',
    competitionNature: checkValid(data.competitionNature) ? data.competitionNature : '',
    competitionType: checkValid(data.competitionType) ? data.competitionType : '',
    comment: checkValid(data.comment) ? data.comment : ''
  }
}

const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const analyzeHandler = async () => {
  loading.value = true
  if (
    !jsonData.value.reduce(
      (valid, e) => (!valid ? false : HeaderValidChecker(e, competitionHeaders)),
      true
    )
  ) {
    notify({ title: '提示', text: '数据格式有问题！', type: 'warn' })
    loading.value = false
    return
  }
  const ret = (await AnalyzeFileToTable(
    excel.value as File,
    competitionHeaders,
    notify
  )) as CompetitionHeader[]
  if (ret !== undefined) {
    jsonData.value = ret
  }
  loading.value = false
}
</script>

<template>
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
      v-if="has('competition:insert')"
      prepend-icon="mdi-upload"
      color="primary"
      @click="uploadDialog = true"
      text="上传数据"
    />
    <v-btn prepend-icon="mdi-download" href="/template/竞赛信息上传模板.xlsx" text="下载模板" />
  </section>
  <section class="pa-4 w-100">
    <ExcelTable v-model="jsonData" :headers="competitionHeaders" :nil-data="nilData" />
  </section>
</template>

<style scoped>
.menu {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0rem 1rem 0 1rem;
}

.menu > * {
  margin-right: 0.5rem;
}

.file {
  overflow: hidden;
  width: 26%;
}
</style>
