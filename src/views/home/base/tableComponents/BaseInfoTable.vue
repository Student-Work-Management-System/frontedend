<script lang="ts" setup>
import { tableHeaders } from '@/misc/table/base-import-header'
import { type Student, type StudentQuery } from '@/model/studentModel'
import { Edit, RefreshRight, Document } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'

const props = defineProps<{
  data: Student[]
  loading: boolean
  studentQuery: StudentQuery
  totalRow: number
  selected: Student[]
  tableHeight: number
}>()

const emit = defineEmits<{
  'update:selected': [value: Student[]]
  'update:studentQuery': [value: StudentQuery]
  edit: [value: Student]
  recover: [value: string]
  getArchive: [value: string]
  sizeChange: []
  currentChange: []
}>()

const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const handleSelectionChange = (val: Student[]) => {
  emit('update:selected', val)
}

const handleSizeChange = (val: number) => {
  emit('update:studentQuery', { ...props.studentQuery, pageSize: val })
  emit('sizeChange')
}

const handleCurrentChange = (val: number) => {
  emit('update:studentQuery', { ...props.studentQuery, pageNo: val })
  emit('currentChange')
}

const currentPage = computed({
  get: () => props.studentQuery.pageNo,
  set: (val: number) => {
    emit('update:studentQuery', { ...props.studentQuery, pageNo: val })
  }
})

const pageSize = computed({
  get: () => props.studentQuery.pageSize,
  set: (val: number) => {
    emit('update:studentQuery', { ...props.studentQuery, pageSize: val })
  }
})

const selectedRows = computed({
  get: () => props.selected,
  set: (val: Student[]) => {
    emit('update:selected', val)
  }
})
</script>

<template>
  <div class="container">
    <div class="table-container">
      <el-table
        :data="data"
        row-key="studentId"
        :height="tableHeight"
        :selected-rows="selectedRows"
        @selection-change="handleSelectionChange"
        :header-cell-style="{
          color: '#333333',
          fontSize: '14px',
          fontWeight: 700,
          background: '#F9FAFC'
        }"
        :cell-style="{
          padding: '5px',
          fontSize: '14px',
          color: 'black'
        }"
        size="small"
        border
        stripe
      >
        <el-table-column type="selection" align="center" fixed="left" />
        <el-table-column prop="studentId" align="center" label="学号" fixed="left" width="120" />
        <el-table-column prop="name" align="center" label="姓名" fixed="left" width="120" />
        <el-table-column
          v-for="header in tableHeaders"
          :key="header.key"
          :prop="header.key"
          :label="header.label"
          :align="header.align"
          :width="header.width"
          :show-overflow-tooltip="header.showOverflowTooltip"
        />
        <el-table-column
          prop="otherNotes"
          align="center"
          label="备注"
          fixed="right"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column label="操作" align="center" fixed="right" width="150">
          <template #default="{ row }">
            <el-button
              v-if="has('student:update')"
              :icon="Edit"
              type="primary"
              circle
              @click="emit('edit', row)"
            />
            <el-button
              v-if="has('student:select')"
              :icon="Document"
              type="success"
              @click="emit('getArchive', row.studentId)"
              circle
            />
            <el-button
              v-if="has('student:update') && !row.enabled"
              :icon="RefreshRight"
              type="warning"
              circle
              @click="emit('recover', row.studentId)"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        style="
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 8px;
          font-size: 14px;
        "
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[25, 50, 100, 200, 500, 1000]"
        :background="true"
        layout="total, sizes, prev, pager, next"
        :total="totalRow"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.table-container {
  flex: 1;
  overflow: hidden;
}

.pagination {
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 8px 16px;
  background-color: white;
  border-top: 1px solid #ebeef5;
}
</style>
