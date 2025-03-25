<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import {
  HeaderValidChecker,
  AnalyzeFileToTable,
  checkValid,
  type ForeignLanguageHeader,
  foreignLanguageHeaders
} from '@/misc/table'
import { useForeignStore } from '@/stores/foreignStore'
import ExcelTable from '@/components/home/ExcelTable.vue'
import UploadDialog from '@/components/home/UploadDialog.vue'
import { useUserStore } from '@/stores/userStore'
import { apiAddForeignLanguage, apiGetLanguages } from '@/api/foreign'
import { type ForeignLanguage } from '@/model/foreignModel'
const excel = ref<File>()
const jsonData = ref<ForeignLanguageHeader[]>([])
const uploadDialog = ref()
const loading = ref(false)
const nilData: ForeignLanguageHeader = {
  studentId: '',
  languageId: '',
  score: '',
  date: '',
  certificate: ''
}
const foreignStore = useForeignStore()
const languageOptions = computed(() => {
  return foreignStore
    .getLanguageList()
    .map((language) => `${language.languageName} - ${language.type} - ${language.total}`)
})
const languageMap = computed(() => {
  return foreignStore.getLanguageList().reduce((map, language) => {
    map.set(`${language.languageName} - ${language.type} - ${language.total}`, language.languageId)
    return map
  }, new Map())
})
const refForeignLanguageHeaders = computed(() => {
  const languageInfoIndex = foreignLanguageHeaders.findIndex(
    (header) => header.field === 'languageInfo'
  )
  foreignLanguageHeaders.splice(languageInfoIndex, 1, {
    ...foreignLanguageHeaders[languageInfoIndex],
    options: languageOptions.value
  })
  return foreignLanguageHeaders
})

const analyzeHandler = async () => {
  loading.value = true
  const ret = (await AnalyzeFileToTable(
    excel.value as File,
    foreignLanguageHeaders,
    notify
  )) as ForeignLanguageHeader[]
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
  if (
    !jsonData.value.reduce(
      (valid, studentcadre) =>
        !valid ? false : HeaderValidChecker(studentcadre, foreignLanguageHeaders),
      true
    )
  ) {
    notify({ title: '提示', text: '数据格式有问题！', type: 'warn' })
    loading.value = false
    return
  }
  const foreignLanguageList = createForeignLanuageList(jsonData.value)
  const { data: result } = await apiAddForeignLanguage(foreignLanguageList)
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

const createForeignLanuageList = (
  rawForeignLanguages: ForeignLanguageHeader[]
): ForeignLanguage[] => {
  return rawForeignLanguages.map((foreignLanguage) => ({
    studentId: checkValid(foreignLanguage.studentId) ? foreignLanguage.studentId : '',
    languageId: checkValid(foreignLanguage.languageInfo)
      ? languageMap.value.get(foreignLanguage.languageInfo)
      : '',
    score: checkValid(foreignLanguage.score) ? foreignLanguage.score : '',
    date: checkValid(foreignLanguage.date) ? foreignLanguage.date : '',
    certificate: checkValid(foreignLanguage.certificate) ? foreignLanguage.certificate : ''
  }))
}

onMounted(async () => {
  const { data } = await apiGetLanguages()
  if (data.code !== 200) {
    notify({ title: '错误', text: data.message, type: 'error' })
    return
  }
  foreignStore.setLanguageList(data.data)
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
        v-if="has('student_cadre:insert')"
        prepend-icon="mdi-upload"
        color="primary"
        @click="uploadDialog = true"
        text="上传数据"
      />
      <v-btn
        prepend-icon="mdi-download"
        href="/template/外语等级成绩上传模板.xlsx"
        text="下载模板"
      />
    </section>
    <section class="pa-4 w-100">
      <ExcelTable v-model="jsonData" :headers="refForeignLanguageHeaders" :nil-data="nilData" />
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
