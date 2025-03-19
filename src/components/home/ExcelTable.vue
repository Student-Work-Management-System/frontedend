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
      :validate="header.validate === null ? () => {} : header.validate"
      :to-text="header.toText === null ? () => {} : header.toText"
      :to-value="header.toValue === null ? () => {} : header.toValue"
      key-field
      autoFillWidth
    />
  </vue-excel-editor>
</template>
