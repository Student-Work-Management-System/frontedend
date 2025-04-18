<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script lang="ts" setup>
import MajorSelect from '@/components/home/MajorSelect.vue'
import StatusSelect from '@/components/home/StatusSelect.vue'
import GradeSelect from '@/components/home/GradeSelect.vue'
import DegreeSelect from '@/components/home/DegreeSelect.vue'
import PoliticSelect from '@/components/home/PoliticSelect.vue'
import TrueOrFalseSelect from '@/components/home/TrueOrFalseSelect.vue'
import { useUserStore } from '@/stores/userStore'
import ItemSelect from '@/components/home/ItemSelect.vue'
import { useBaseStore } from '@/stores/baseStore'
import { watch } from 'vue'
import { debounce } from '@/utils/debounce'
import type { EnrollmentQuery } from '@/model/enrollmentModel'

const baseStore = useBaseStore()
const query = baseStore.getQuery()
const loading = defineModel<boolean>('loading')
const emit = defineEmits(['refresh', 'deleteButtonClick', 'exportData'])

const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const chargeGrades = store.getUserData.chargeGrades

const deleteStudent = () => {
  emit('deleteButtonClick')
}

const refreshData = () => {
  emit('refresh')
}

const exportData = () => {
  emit('exportData')
}

const updateQuery = <K extends keyof EnrollmentQuery>(field: K, value: EnrollmentQuery[K]) => {
  baseStore.updateQuery(field, value)
}

watch(
  () => ({
    gradeId: query.gradeId,
    degreeId: query.degreeId
  }),
  debounce((newVal) => {
    refreshData()
  }, 300),
  { deep: true }
)
</script>

<template>
  <div class="table-select-menu">
    <section class="menu table-select-menu">
      <div class="d-flex align-center gap-4">
        <div class="flex-grow-1">
          <v-col cols="12" class="d-flex flex-wrap align-center gap-4 pa-0 mb-4">
            <GradeSelect
              :model-value="query.gradeId"
              :charge-grades="chargeGrades"
              @update:model-value="(v) => updateQuery('gradeId', v as string | null)"
              label="年级"
              variant="underlined"
              density="compact"
            />

            <MajorSelect
              :model-value="query.majorId"
              @update:model-value="(v) => updateQuery('majorId', v as string | null)"
              label="专业"
              variant="underlined"
              density="compact"
            />
            <DegreeSelect
              :model-value="query.degreeId"
              @update:model-value="(v) => updateQuery('degreeId', v as string | null)"
              label="培养层次"
              variant="underlined"
              density="compact"
            />

            <StatusSelect
              :model-value="query.statusId"
              @update:model-value="(v) => updateQuery('statusId', v as string | null)"
              label="学籍状态"
              variant="underlined"
              density="compact"
            />

            <PoliticSelect
              :model-value="query.politicId"
              @update:model-value="(v) => updateQuery('politicId', v as string | null)"
              label="政治面貌"
              variant="underlined"
              density="compact"
            />

            <ItemSelect
              :model-value="query.gender"
              @update:model-value="(v) => updateQuery('gender', v as string | null)"
              label="性别"
              variant="underlined"
              density="compact"
              :items="['男', '女']"
            />
            <TrueOrFalseSelect
              :model-value="query.isOnlyChild!!"
              @update:model-value="(v) => updateQuery('isOnlyChild', v as boolean | null)"
              label="独生子女"
              variant="underlined"
              density="compact"
              :items="[
                { key: '是', value: true },
                { key: '否', value: false }
              ]"
            />

            <TrueOrFalseSelect
              :model-value="query.studentLoans!!"
              @update:model-value="(v) => updateQuery('studentLoans', v as boolean | null)"
              label="助学贷款"
              variant="underlined"
              density="compact"
              :items="[
                { key: '是', value: true },
                { key: '否', value: false }
              ]"
            />

            <TrueOrFalseSelect
              :model-value="query.disability!"
              @update:model-value="(v) => updateQuery('disability', v as boolean)"
              label="是否残疾"
              variant="underlined"
              density="compact"
              :items="[
                { key: '是', value: true },
                { key: '否', value: false }
              ]"
            />
            <TrueOrFalseSelect
              :model-value="query.enabled!"
              @update:model-value="(v) => updateQuery('enabled', v as boolean)"
              label="学生状态"
              variant="underlined"
              density="compact"
              :items="[
                { key: '正常', value: true },
                { key: '已删除', value: false }
              ]"
            />
          </v-col>

          <v-col cols="12" class="d-flex flex-wrap align-center gap-4 pa-0 mb-4">
            <v-text-field
              :model-value="query.familySearch"
              @update:model-value="(v) => updateQuery('familySearch', v)"
              color="indigo"
              :loading="loading"
              clearable
              prepend-inner-icon="mdi-magnify"
              style="margin-left: 16px"
              label="家庭成员信息"
              variant="underlined"
              hide-details
              density="compact"
              class="search-input text-indigo"
            >
              <v-tooltip
                activator="parent"
                location="top"
                text="以 父母姓名 / 父母手机号 / 监护人姓名 / 监护人电话 搜索"
              />
            </v-text-field>

            <v-text-field
              :model-value="query.schoolSearch"
              @update:model-value="(v) => updateQuery('schoolSearch', v)"
              color="indigo"
              :loading="loading"
              clearable
              prepend-inner-icon="mdi-magnify"
              label="学生在校信息"
              variant="underlined"
              hide-details
              density="compact"
              class="search-input text-indigo"
            >
              <v-tooltip activator="parent" location="top" text="以 宿舍号 / 班号 搜索" />
            </v-text-field>

            <v-text-field
              :model-value="query.headerTeacherSearch"
              @update:model-value="(v) => updateQuery('headerTeacherSearch', v)"
              color="indigo"
              :loading="loading"
              prepend-inner-icon="mdi-magnify"
              clearable
              label="班主任信息"
              variant="underlined"
              hide-details
              density="compact"
              class="search-input text-indigo"
            >
              <v-tooltip
                activator="parent"
                location="top"
                text="以 班主任工号 / 班主任姓名 / 班主任联系方式 搜索"
              />
            </v-text-field>

            <v-text-field
              :model-value="query.highSchoolSearch"
              @update:model-value="(v) => updateQuery('highSchoolSearch', v)"
              label="高中信息"
              class="text-indigo search-input"
              variant="underlined"
              prepend-inner-icon="mdi-magnify"
              color="indigo"
              density="compact"
              hide-details
              clearable
            >
              <v-tooltip activator="parent" location="top" text="以 中学名称 / 中学代码 搜索" />
            </v-text-field>

            <v-text-field
              :model-value="query.search"
              @update:model-value="(v) => updateQuery('search', v)"
              color="indigo"
              style="margin-left: 16px"
              :loading="loading"
              clearable
              prepend-inner-icon="mdi-magnify"
              label="学生个人信息"
              variant="underlined"
              hide-details
              density="compact"
              class="search-input text-indigo"
            >
              <v-tooltip
                activator="parent"
                location="top"
                text="以 学号 / 姓名 / 身份证 / 邮箱 / 手机号 搜索"
              />
            </v-text-field>
          </v-col>

          <v-col cols="12" class="d-flex flex-wrap align-center gap-4 pa-0 mb-4">
            <v-text-field
              :model-value="query.householdRegistration"
              @update:model-value="(v) => updateQuery('householdRegistration', v as string | null)"
              label="户籍所在地"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />

            <v-text-field
              :model-value="query.householdType"
              @update:model-value="(v) => updateQuery('householdType', v as string | null)"
              label="户口类型"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />

            <v-text-field
              :model-value="query.candidateCategory"
              @update:model-value="(v) => updateQuery('candidateCategory', v as string | null)"
              label="考生类别"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />

            <v-text-field
              :model-value="query.studentType"
              @update:model-value="(v) => updateQuery('studentType', v as string | null)"
              label="学生类型"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />

            <v-text-field
              :model-value="query.admissionBatch"
              @update:model-value="(v) => updateQuery('admissionBatch', v as string | null)"
              label="录取批次"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />

            <v-text-field
              :model-value="query.religiousBeliefs"
              @update:model-value="(v) => updateQuery('religiousBeliefs', v as string | null)"
              label="宗教信仰"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />

            <div class="flex-shrink-0 operation-area-right">
              <v-btn
                v-if="has('student:select')"
                prepend-icon="mdi-refresh"
                text="刷新"
                color="indigo"
                @click="refreshData"
              />
              <v-btn
                v-if="has('student:delete')"
                prepend-icon="mdi-delete"
                text="删除"
                color="error"
                @click="deleteStudent"
              />
              <v-btn
                v-if="has('student:select')"
                prepend-icon="mdi-file-export-outline"
                text="导出"
                color="orange-darken-1"
                @click="exportData"
              />
            </div>
          </v-col>
        </div>
      </div>
    </section>
  </div>
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
  width: calc(11.11% - 12px) !important;
  min-width: 200px;
}

.operation-area-right {
  width: 18%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: 8px;
  padding-top: 8px;
}

.search-input {
  width: 160px;
  margin-right: 8px;
}

.text-input-select {
  padding-left: 16px !important;
  padding-right: 8px !important;
  min-width: 130px !important;
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
