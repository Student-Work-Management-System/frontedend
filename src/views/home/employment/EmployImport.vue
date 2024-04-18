<script lang="ts" setup>
import { employheaders, type EmployHeader } from '@/misc/table'
import { ref, computed } from 'vue'
import UploadDialog from '@/components/home/UploadDialog.vue';

const excel = ref<File[]>()
const jsonData = ref<EmployHeader[]>([])
const file = computed(() => (excel.value === undefined ? null : excel.value[0]))
const loading = ref(false);
const uploadDialog = ref(false)
const nilData: EmployHeader = {
  studentId: '',
  graduationState: '',
  graduationYear: '',
  whereabouts: '',
  jobNature: '',
  jobIndustry: '',
  jobLocation: '',
  category: '',
  salary: ''
}

const analyzeHandler = () => {
  loading.value = true
  loading.value = false
}

</script>

<template>
  <v-card elevation="10" height="100%" width="100%" :loading="loading">
    <UploadDialog v-model="uploadDialog" />
    <section class="menu">
      <span class="file text-indigo">
        <v-file-input v-model="excel" color="indigo" variant="underlined" hide-details free-select
          accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          label="Excel 文件选择"></v-file-input>
      </span>
      <v-btn prepend-icon="mdi-calculator-variant" color="indigo" @click="analyzeHandler">解析文件</v-btn>
      <v-btn prepend-icon="mdi-upload" color="primary" @click="uploadDialog = true">上传数据</v-btn>
      <v-btn prepend-icon="mdi-download" href="/template/学生基本信息上传模版.xlsx">下载模板</v-btn>
    </section>
    <section class="pa-4 w-100">
      <ExcelTable v-model="jsonData" :headers="employheaders" :nil-data="nilData" />
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

.menu>* {
  margin-right: 0.5rem;
}

.file {
  overflow: hidden;
  width: 26%;
}
</style>
