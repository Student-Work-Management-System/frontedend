<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  apiGetStudentList,
  apiDeleteStudent,
  apiRecoverDeleteStudent,
  apiGetStudentArchive
} from '@/api/student'
import type { EnrollmentItem } from '@/model/enrollmentModel'
import { notify } from '@kyvg/vue3-notification'
import { enrollmentTableHeaders } from '@/misc/table/base-import-header'
import { Edit, RefreshRight, Document } from '@element-plus/icons-vue'
import EditBaseInfoForm from '@/components/home/base/EditBaseInfoForm.vue'
import DeleteDialog from '@/components/home/DeleteDialog.vue'
import { useBaseStore } from '@/stores/baseStore'
import StudentArchiveDialog from '@/components/home/base/StudentArchiveDialog.vue'
import { useUserStore } from '@/stores/userStore'
import type { StudentArchive } from '@/model'

const baseStore = useBaseStore()
const query = baseStore.getQuery()
const store = useUserStore()
const chargeGrades = store.getUserData.chargeGrades
const loading = ref(false)
const selected = ref<EnrollmentItem[]>([])
const data = ref<EnrollmentItem[]>([])
const totalPage = ref<number>()
const totalRow = ref<number>()
const editDialog = ref(false)
const deleteDialog = ref(false)
const archiveDialog = ref(false)
const archive = ref<StudentArchive | null>(null)
const modifyInfo = ref<EnrollmentItem>({
  enrollmentId: '',
  studentId: '',
  idNumber: '',
  name: '',
  gender: '',
  birthdate: '',
  hobbies: '',
  nativePlace: '',
  nation: '',
  height: '',
  weight: '',
  politicId: '',
  politicStatus: '',
  phone: '',
  email: '',
  headerTeacherUsername: '',
  headerTeacherRealName: '',
  headerTeacherPhone: '',
  dormitory: '',
  classNo: '',
  majorId: '',
  majorName: '',
  degreeId: '',
  degreeName: '',
  gradeId: '',
  gradeName: '',
  studentType: '',
  admissionBatch: '',
  subjectCategory: '',
  provinceName: '',
  examId: '',
  admittedMajor: '',
  volunteerMajor: '',
  volunteerCollege: '',
  totalExamScore: '',
  convertedScore: '',
  specialScore: '',
  feature: '',
  volunteer1: '',
  volunteer2: '',
  volunteer3: '',
  volunteer4: '',
  volunteer5: '',
  volunteer6: '',
  studentFrom: '',
  isAdjusted: false,
  receiver: '',
  receiverPhone: '',
  postalCode: '',
  householdRegistration: '',
  householdType: '',
  address: '',
  fatherName: '',
  fatherPhone: '',
  fatherOccupation: '',
  motherName: '',
  motherPhone: '',
  motherOccupation: '',
  guardian: '',
  guardianPhone: '',
  familyPopulation: '',
  familyMembers: '',
  familyLocation: '',
  isOnlyChild: false,
  highSchoolCode: '',
  highSchoolName: '',
  candidateCategoryClassification: '',
  graduationCategoryClassification: '',
  graduationCategory: '',
  candidateCategory: '',
  foreignLanguage: '',
  scoreChinese: '',
  scoreMath: '',
  scoreForeignLanguage: '',
  scoreComprehensive: '',
  scorePhysics: '',
  scoreChemistry: '',
  scoreBiology: '',
  scorePolitics: '',
  scoreHistory: '',
  scoreGeography: '',
  scoreTechnology: '',
  selectedSubjects: '',
  studentLoans: false,
  disability: false,
  religiousBeliefs: '',
  otherNotes: '',
  enabled: false
})

const has = (auth: string) => store.hasAuthorized(auth)

const fetchStudentLogic = async () => {
  loading.value = true
  try {
    const { data: result } = await apiGetStudentList(query)
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: result.message })
      loading.value = false
      return
    }
    totalPage.value = result.data.totalPage
    totalRow.value = result.data.totalRow
    data.value = result.data.records
    selected.value = []
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const deleteStudentLogic = async () => {
  loading.value = true
  try {
    const studentIds = selected.value.map((v) => v.studentId)
    let reqs = studentIds.map((id) =>
      (async (id) => {
        const { data: result } = await apiDeleteStudent(id!!)
        if (result.code !== 200) {
          console.error(result.message)
          notify({ type: 'error', title: '错误', text: result.message })
          return
        }
      })(id)
    )
    await Promise.all(reqs)
  } catch (error) {
    console.error(error)
  } finally {
    fetchStudentLogic()
    loading.value = false
  }
}

const recoverStudent = async (id: string) => {
  loading.value = true
  try {
    const { data: result } = await apiRecoverDeleteStudent(id)
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: result.message })
      loading.value = false
      return
    }
    notify({ type: 'success', title: '成功', text: '恢复成功！' })
  } catch (error) {
    console.error(error)
    notify({ type: 'error', title: '错误', text: '恢复失败！' })
  } finally {
    fetchStudentLogic()
    loading.value = false
  }
}

const getStudentArchive = async (studentId: string) => {
  archive.value = null
  try {
    const { data: result } = await apiGetStudentArchive(studentId)
    if (result.code !== 200) {
      console.error(result.message)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    archive.value = result.data
    archiveDialog.value = true
  } catch (error) {
    console.error(error)
  }
}

const editStudent = (val: EnrollmentItem) => {
  modifyInfo.value = { ...val }
  editDialog.value = true
}

const deleteStudent = () => {
  deleteDialog.value = true
}

const exportData = () => {
  console.log(
    `exportData, 使用数据大小: ${data.value.length}, 头号数据: ${JSON.stringify(data.value[0])}`
  )
}

// 高度计算相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tabsHeight = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - tabsHeight.value - 75
})
onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.classList.contains('card-container')) {
        containerHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('table-select-menu')) {
        selectMenuHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('tabs')) {
        tabsHeight.value = entry.contentRect.height
      }
    }
  })

  // 观察元素
  const container = document.querySelector('.card-container')
  const selectMenu = document.querySelector('.table-select-menu')
  const tabs = document.querySelector('.tabs')

  if (container) resizeObserver.observe(container)
  if (selectMenu) resizeObserver.observe(selectMenu)
  if (tabs) resizeObserver.observe(tabs)

  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})

onMounted(fetchStudentLogic)
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="d-flex flex-column card-container">
    <!-- 编辑弹窗 -->
    <EditBaseInfoForm v-model="editDialog" :info="modifyInfo" @on-closed="fetchStudentLogic" />
    <!-- 删除弹窗 -->
    <DeleteDialog v-model="deleteDialog" :length="selected.length" @delete="deleteStudentLogic" />
    <!-- 学生信息 -->
    <StudentArchiveDialog v-if="archive" :archive="archive" v-model="archiveDialog" />
    <!-- 查询条件 -->
    <section class="menu table-select-menu">
      <div class="d-flex align-center gap-4">
        <div class="flex-grow-1">
          <v-col cols="12" class="d-flex flex-wrap align-center gap-4 pa-0 mb-4">
            <GradeSelect
              v-model="query.gradeId"
              :charge-grades="chargeGrades"
              label="年级"
              variant="underlined"
              density="compact"
            />

            <MajorSelect
              v-model="query.majorId"
              label="专业"
              variant="underlined"
              density="compact"
            />
            <DegreeSelect
              v-model="query.degreeId"
              label="培养层次"
              variant="underlined"
              density="compact"
            />

            <StatusSelect
              v-model="query.statusId"
              label="学籍状态"
              variant="underlined"
              density="compact"
            />

            <PoliticSelect
              v-model="query.politicId"
              label="政治面貌"
              variant="underlined"
              density="compact"
            />

            <ItemSelect
              v-model="query.gender"
              label="性别"
              variant="underlined"
              density="compact"
              :items="['男', '女']"
            />
            <TrueOrFalseSelect
              v-model="query.isOnlyChild!!"
              label="独生子女"
              variant="underlined"
              density="compact"
              :items="[
                { key: '是', value: true },
                { key: '否', value: false }
              ]"
            />

            <TrueOrFalseSelect
              v-model="query.studentLoans!!"
              label="助学贷款"
              variant="underlined"
              density="compact"
              :items="[
                { key: '是', value: true },
                { key: '否', value: false }
              ]"
            />

            <TrueOrFalseSelect
              v-model="query.disability!"
              label="是否残疾"
              variant="underlined"
              density="compact"
              :items="[
                { key: '是', value: true },
                { key: '否', value: false }
              ]"
            />
            <TrueOrFalseSelect
              v-model="query.enabled!"
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
              v-model="query.familySearch"
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
              v-model="query.schoolSearch"
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
              v-model="query.headerTeacherSearch"
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
              v-model="query.highSchoolSearch"
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
              v-model="query.search"
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
              v-model="query.householdRegistration"
              label="户籍所在地"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />

            <v-text-field
              v-model="query.householdType"
              label="户口类型"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />

            <v-text-field
              v-model="query.candidateCategory"
              label="考生类别"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />

            <v-text-field
              v-model="query.studentType"
              label="学生类型"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />

            <v-text-field
              v-model="query.admissionBatch"
              label="录取批次"
              class="text-indigo text-input-select"
              variant="underlined"
              color="indigo"
              density="compact"
              hide-details
              clearable
            />

            <v-text-field
              v-model="query.religiousBeliefs"
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
                @click="fetchStudentLogic"
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
    <!-- 表格 -->
    <section>
      <div class="table-container">
        <el-table
          :data="data"
          row-key="studentId"
          :height="tableHeight"
          :selected-rows="selected"
          @selection-change="
            (rows: EnrollmentItem[]) => {
              selected = rows
            }
          "
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
            v-for="header in enrollmentTableHeaders"
            :key="header.key"
            :prop="header.key"
            :label="header.label"
            :align="header.align"
            :width="header.width"
            :show-overflow-tooltip="header.showOverflowTooltip"
            :formatter="header.formatter"
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
                @click="editStudent(row)"
              />
              <el-button
                v-if="has('student:select')"
                :icon="Document"
                type="success"
                @click="getStudentArchive(row.studentId)"
                circle
              />
              <el-button
                v-if="has('student:update') && !row.enabled"
                :icon="RefreshRight"
                type="warning"
                circle
                @click="recoverStudent(row.studentId)"
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
          :current-page="query.pageNo"
          :page-size="query.pageSize"
          :page-sizes="[25, 50, 100, 200, 500, 1000]"
          :background="true"
          layout="total, sizes, prev, pager, next"
          :total="totalRow"
          @current-change="
            (val: number) => {
              query.pageNo = val
              fetchStudentLogic()
            }
          "
          @size-change="
            (val: number) => {
              query.pageSize = val
              fetchStudentLogic()
            }
          "
        />
      </div>
    </section>
  </v-card>
</template>

<style scoped>
.contain {
  flex: 1;
  width: 100%;
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
