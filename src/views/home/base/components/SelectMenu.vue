<script lang="ts" setup>
import { ref } from 'vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import GradeSelect from '@/components/home/GradeSelect.vue'
import TrueOrFalseSelect from '@/components/home/TrueOrFalseSelect.vue'
import { type StudentQuery } from '@/model/studentModel'
import { useUserStore } from '@/stores/user'
import ItemSelect from '@/components/home/ItemSelect.vue'
const props = defineProps<{
  loading: boolean
  selectedLength: number
  studentQuery: StudentQuery
}>()

const emit = defineEmits(['update:studentQuery', 'refresh', 'deleteButtonClick'])

const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const search = ref('')

// 更新查询条件
const updateQuery = (field: keyof StudentQuery, value: any) => {
  emit('update:studentQuery', { ...props.studentQuery, [field]: value })
}

const deleteStudent = () => {
  emit('deleteButtonClick')
}
</script>

<template>
  <section class="menu">
    <div class="d-flex align-center gap-4">
      <div class="flex-grow-1">
        <div class="d-flex flex-wrap align-center gap-4">
          <MajorSelect
            :model-value="studentQuery.majorId"
            @update:model-value="(v) => updateQuery('majorId', v)"
            label="专业"
            variant="underlined"
          />

          <GradeSelect
            :model-value="studentQuery.grade"
            @update:model-value="(v) => updateQuery('grade', v)"
            label="年级"
            variant="underlined"
          />

          <ItemSelect
            :model-value="studentQuery.gender"
            @update:model-value="(v) => updateQuery('gender', v)"
            label="性别"
            variant="underlined"
            :items="['男', '女']"
          />

          <ItemSelect
            :model-value="studentQuery.politicsStatus"
            @update:model-value="(v) => updateQuery('politicsStatus', v)"
            label="政治面貌"
            variant="underlined"
            :items="['中共党员', '中共预备党员', '共青团员', '群众']"
          />

          <TrueOrFalseSelect
            :model-value="studentQuery.isCommunistYouthLeagueMember as boolean"
            @update:model-value="(v) => updateQuery('isCommunistYouthLeagueMember', v)"
            label="是否共青团员"
            variant="underlined"
            :items="[
              { key: '是', value: true },
              { key: '否', value: false }
            ]"
          />

          <TrueOrFalseSelect
            :model-value="studentQuery.isStudentLoans as boolean"
            @update:model-value="(v) => updateQuery('isStudentLoans', v)"
            label="是否助学贷款"
            variant="underlined"
            :items="[
              { key: '是', value: true },
              { key: '否', value: false }
            ]"
          />

          <v-text-field
            :model-value="studentQuery.classNo"
            @update:model-value="(v) => updateQuery('classNo', v)"
            label="班号"
            class="text-indigo text-input-select"
            variant="underlined"
            color="indigo"
            density="compact"
            hide-details
            clearable
          />

          <v-text-field
            :model-value="studentQuery.dormitory"
            @update:model-value="(v) => updateQuery('dormitory', v)"
            label="宿舍"
            class="text-indigo text-input-select"
            variant="underlined"
            color="indigo"
            density="compact"
            hide-details
            clearable
          />

          <v-text-field
            :model-value="studentQuery.nation"
            @update:model-value="(v) => updateQuery('nation', v)"
            label="民族"
            class="text-indigo text-input-select"
            variant="underlined"
            color="indigo"
            density="compact"
            hide-details
            clearable
          />

          <TrueOrFalseSelect
            :model-value="studentQuery.enabled"
            @update:model-value="(v) => updateQuery('enabled', v)"
            label="学生状态"
            variant="underlined"
            :items="[
              { key: '正常', value: true },
              { key: '已删除', value: false }
            ]"
          />
        </div>
      </div>
      <div class="flex-shrink-0 operation-area-right" style="width: 20%">
        <v-text-field
          v-model="search"
          color="indigo"
          :loading="loading"
          :counter="15"
          clearable
          label="搜索"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
          density="compact"
          class="search-input"
        >
          <v-tooltip activator="parent" location="top">以学号或姓名搜索</v-tooltip>
        </v-text-field>
        <v-btn
          v-if="has('student:select')"
          icon="mdi-refresh"
          variant="text"
          color="indigo"
          @click="$emit('refresh')"
        />
        <v-btn
          v-if="has('student:delete')"
          icon="mdi-delete"
          variant="text"
          color="error"
          @click="deleteStudent"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.menu {
  width: 100%;
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  align-items: stretch;
  padding: 1rem 1rem 0 1rem;
  gap: 8px;
}

.w-20 {
  width: calc(25% - 12px) !important;
  min-width: 200px;
  margin-bottom: 8px;
}

.operation-area-right {
  display: flex;
  align-items: center;
  margin-left: 8px;
}

.search-input {
  width: 160px;
}

.text-input-select {
  padding-left: 8px !important;
  padding-right: 8px !important;
}

:deep(.v-field__input) {
  min-height: 32px !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}

:deep(.v-field__outline) {
  color: rgba(var(--v-theme-on-surface), 0.15) !important;
}

:deep(.v-field--focused .v-field__outline) {
  color: rgb(var(--v-theme-indigo)) !important;
}

:deep(.v-label) {
  font-size: 14px;
  margin-bottom: 8px;
}

:deep(.v-field__field) {
  padding-top: 8px !important;
}
</style>
