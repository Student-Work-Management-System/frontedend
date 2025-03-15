<script lang="ts" setup>
import MajorSelect from '@/components/home/MajorSelect.vue'
import StatusSelect from '@/components/home/StatusSelect.vue'
import GradeSelect from '@/components/home/GradeSelect.vue'
import DegreeSelect from '@/components/home/DegreeSelect.vue'
import PoliticSelect from '@/components/home/PoliticSelect.vue'
import TrueOrFalseSelect from '@/components/home/TrueOrFalseSelect.vue'
import { useUserStore } from '@/stores/userStore'
import ItemSelect from '@/components/home/ItemSelect.vue'
import { type Degree } from '@/model/otherModel'
import { useBaseStore } from '@/stores/baseStore'
import type { StudentQuery } from '@/model/studentModel'
import { watch } from 'vue'
import { debounce } from '@visactor/vchart/esm/util'

const baseStore = useBaseStore()
const studentQuery = baseStore.getStudentQuery
const loading = defineModel<boolean>('loading')
const emit = defineEmits(['refresh', 'deleteButtonClick', 'exportData'])

const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const chargeGrades = store.getUserData.chargeGrades
const chargeDegrees = store.getUserData.chargeDegrees

const deleteStudent = () => {
  emit('deleteButtonClick')
}

const refreshData = () => {
  emit('refresh')
}

const exportData = () => {
  emit('exportData')
}

const updateQuery = <K extends keyof StudentQuery>(field: K, value: StudentQuery[K]) => {
  baseStore.updateStudentQuery(field, value)
}

watch(
  () => ({
    gradeId: studentQuery.gradeId,
    degreeId: studentQuery.degreeId
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
            <MajorSelect
              :model-value="studentQuery.majorId"
              @update:model-value="(v) => updateQuery('majorId', v as string | null)"
              label="专业"
              variant="underlined"
            />
            <GradeSelect
              :model-value="studentQuery.gradeId"
              :charge-grades="chargeGrades"
              @update:model-value="(v) => updateQuery('gradeId', v as string | null)"
              label="年级"
              variant="underlined"
            />
            <ItemSelect
              :model-value="studentQuery.gender"
              @update:model-value="(v) => updateQuery('gender', v as string | null)"
              label="性别"
              variant="underlined"
              :items="['男', '女']"
            />
            <v-text-field
              :model-value="studentQuery.classNo"
              @update:model-value="(v: string) => updateQuery('classNo', v as string | null)"
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
              @update:model-value="(v) => updateQuery('dormitory', v as string | null)"
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
              @update:model-value="(v) => updateQuery('nation', v as string | null)"
              label="民族"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />

            <PoliticSelect
              :model-value="studentQuery.politicId"
              @update:model-value="(v) => updateQuery('politicId', v as string | null)"
              label="政治面貌"
              variant="underlined"
            />

            <v-text-field
              :model-value="studentQuery.nativePlace"
              @update:model-value="(v) => updateQuery('nativePlace', v as string | null)"
              label="籍贯"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />
            <v-text-field
              :model-value="studentQuery.religiousBeliefs"
              @update:model-value="(v) => updateQuery('religiousBeliefs', v as string | null)"
              label="宗教信仰"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />
            <v-text-field
              :model-value="studentQuery.location"
              @update:model-value="(v) => updateQuery('location', v as string | null)"
              label="家庭所在地"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            >
              <v-tooltip activator="parent" location="top"> 省/市/县 </v-tooltip>
            </v-text-field>
          </v-col>

          <v-col cols="12" class="d-flex flex-wrap align-center gap-4 pa-0 mb-4">
            <v-text-field
              :model-value="studentQuery.address"
              @update:model-value="(v) => updateQuery('address', v as string | null)"
              label="家庭住址"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />
            <v-text-field
              :model-value="studentQuery.householdRegistration"
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
              :model-value="studentQuery.householdType"
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
              :model-value="studentQuery.familyPopulation"
              @update:model-value="(v) => updateQuery('familyPopulation', v as string | null)"
              label="家庭人口"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />
            <TrueOrFalseSelect
              :model-value="studentQuery.isOnlyChild!!"
              @update:model-value="(v) => updateQuery('isOnlyChild', v as boolean | null)"
              label="是否独生子女"
              variant="underlined"
              :items="[
                { key: '是', value: true },
                { key: '否', value: false }
              ]"
            />
            <TrueOrFalseSelect
              :model-value="studentQuery.isStudentLoans!!"
              @update:model-value="(v) => updateQuery('isStudentLoans', v as boolean | null)"
              label="助学贷款"
              variant="underlined"
              :items="[
                { key: '是', value: true },
                { key: '否', value: false }
              ]"
            />

            <v-text-field
              :model-value="studentQuery.highSchool"
              @update:model-value="(v) => updateQuery('highSchool', v as string | null)"
              label="高中名称"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />

            <v-text-field
              :model-value="studentQuery.examId"
              @update:model-value="(v) => updateQuery('examId', v as string | null)"
              label="考生号"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />
            <v-text-field
              :model-value="studentQuery.admissionBatch"
              @update:model-value="(v) => updateQuery('admissionBatch', v as string | null)"
              label="录取批次"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />
          </v-col>

          <v-col cols="12" class="d-flex flex-wrap align-center gap-4 pa-0 mb-4">
            <v-text-field
              :model-value="studentQuery.totalExamScore"
              @update:model-value="(v) => updateQuery('totalExamScore', v as string | null)"
              label="高考总分"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />
            <v-text-field
              :model-value="studentQuery.foreignLanguage"
              @update:model-value="(v) => updateQuery('foreignLanguage', v as string | null)"
              label="外语语种"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />
            <v-text-field
              :model-value="studentQuery.foreignScore"
              @update:model-value="(v) => updateQuery('foreignScore', v as string | null)"
              label="外语分数"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />
            <v-text-field
              :model-value="studentQuery.hobbies"
              @update:model-value="(v) => updateQuery('hobbies', v as string | null)"
              label="兴趣爱好"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />
            <DegreeSelect
              :model-value="studentQuery.degreeId"
              :charge-degrees="chargeDegrees as Degree[]"
              @update:model-value="(v) => updateQuery('degreeId', v as string | null)"
              label="学历"
              variant="underlined"
            />
            <StatusSelect
              :model-value="studentQuery.statusId"
              @update:model-value="(v) => updateQuery('statusId', v as string | null)"
              label="学籍状态"
              variant="underlined"
            />
            <TrueOrFalseSelect
              :model-value="studentQuery.disability"
              @update:model-value="(v) => updateQuery('disability', v as boolean)"
              label="是否残疾"
              variant="underlined"
              :items="[
                { key: '是', value: true },
                { key: '否', value: false }
              ]"
            />
            <TrueOrFalseSelect
              :model-value="studentQuery.enabled"
              @update:model-value="(v) => updateQuery('enabled', v as boolean)"
              label="学生状态"
              variant="underlined"
              :items="[
                { key: '正常', value: true },
                { key: '已删除', value: false }
              ]"
            />
            <div class="flex-shrink-0 operation-area-right" style="width: 30%">
              <v-text-field
                :model-value="studentQuery.search"
                @update:model-value="(v) => updateQuery('search', v as string)"
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
                margin-right="8px"
              >
                <v-tooltip activator="parent" location="top">
                  学号、姓名、身份证、邮箱、手机号、父母姓名、父母手机号、监护人姓名、监护人电话
                </v-tooltip>
              </v-text-field>
              <v-btn
                v-if="has('student:select')"
                icon="mdi-refresh"
                variant="text"
                color="indigo"
                @click="refreshData"
              />
              <v-btn
                v-if="has('student:delete')"
                icon="mdi-delete"
                variant="text"
                color="error"
                @click="deleteStudent"
              />
              <v-btn
                v-if="has('student:select')"
                icon="mdi-file-export-outline"
                variant="text"
                color="indigo"
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
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
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
