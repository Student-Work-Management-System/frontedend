<script lang="ts" setup>
import { chLabel, type TableHeader } from '@/misc/table'
import { ref, onMounted } from 'vue'

const model = defineModel()
const headers = defineModel<TableHeader[]>('headers')
const nilData = defineModel<any>('nilData')
const tableRef = ref()

const addNewRow = () => {
  tableRef.value.newRecord(JSON.parse(JSON.stringify(nilData)))
}
const deleteSelectRows = () => {
  tableRef.value.deleteSelectedRecords()
}
onMounted(() => {
  console.log(headers.value)
  tableRef.value.newRecord(JSON.parse(JSON.stringify(nilData)))
})
</script>
<template>
  <v-btn variant="text" color="primary" @click="addNewRow">添加新行</v-btn>
  <v-btn variant="text" color="error" @click="deleteSelectRows">删除选行</v-btn>
  <vue-excel-editor
    v-model="model"
    no-header-edit
    ref="tableRef"
    free-select
    disable-panel-setting
    :localized-label="chLabel"
  >
    <vue-excel-column
      :key="idx"
      v-for="(header, idx) in headers"
      :field="header.field"
      :label="`${header.require ? '<span style=\'color: red;\'>*</span>' : ''}` + header.label"
      :type="header.type"
      :options="header.options"
      autoFillWidth
      :validate="header.validate === null ? () => {} : header.validate"
      key-field
    />
  </vue-excel-editor>
</template>
