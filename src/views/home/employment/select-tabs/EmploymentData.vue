<script lang="ts" setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { apiGetEmployList, apiDeleteEmploy } from '@/api/employment'
import type { StudentEmploymentItem, EmploymentQuery } from '@/model/employmentModel'
import DeleteDialog from '@/components/home/DeleteDialog.vue'
import { notify } from '@kyvg/vue3-notification'
import { useUserStore } from '@/stores/userStore'
import EditStudentEmploymentDialog from '@/components/home/employment/EditStudentEmploymentDialog.vue'
import { employmentTableHeaders } from '@/misc/table'
import MajorSelect from '@/components/home/MajorSelect.vue'
import GradeSelect from '@/components/home/GradeSelect.vue'
import DegreeSelect from '@/components/home/DegreeSelect.vue'
import PoliticSelect from '@/components/home/PoliticSelect.vue'
import ItemSelect from '@/components/home/ItemSelect.vue'

const deleteDialog = ref(false)
const editDialog = ref(false)
const selected = ref<StudentEmploymentItem[]>([])
const loading = ref(false)
const data = ref<StudentEmploymentItem[]>()
const dataLength = ref(0)
const editModel = ref<StudentEmploymentItem>({
  studentEmploymentId: '',
  studentId: '',
  idNumber: '',
  name: '',
  gender: '',
  nation: '',
  email: '',
  phone: '',
  classNo: '',
  location: '',
  studentFrom: '',
  enrollmentTime: '',
  gradeName: '',
  majorName: '',
  degreeName: '',
  politicStatus: '',
  graduationYear: '',
  householdType: '',
  organizationName: '',
  code: '',
  whereabouts: '',
  jobNature: '',
  jobIndustry: '',
  jobLocation: '',
  contactPerson: '',
  contactPhone: '',
  category: '',
  salary: '',
  state: '',
  certificateTime: '',
  comment: ''
})
const query = reactive<EmploymentQuery>({
  search: '',
  gender: null,
  majorId: null,
  gradeId: null,
  degreeId: null,
  politicId: null,
  graduationYear: null,
  pageNo: 1,
  pageSize: 25
})
const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const chargeGrade = store.getUserData.chargeGrades
const chargeDegree = store.getUserData.chargeDegrees

const onEdit = (row: StudentEmploymentItem) => {
  editModel.value = row
  editDialog.value = true
}

const deleteEmploymentLogic = async () => {
  loading.value = true
  let reqs = selected.value.map((e) =>
    (async (e) => {
      const eid = e.studentEmploymentId!
      const { data: result } = await apiDeleteEmploy(eid)
      if (result.code !== 200) {
        console.error(result)
        notify({ type: 'error', title: '错误', text: `就业信息: ${eid}, ` + result.message })
        return
      }
      notify({ type: 'success', title: '成功', text: `就业信息: ${eid} 删除成功！` })
    })(e)
  )

  await Promise.all(reqs)
  afterEditHandler()
  loading.value = false
}

const afterEditHandler = () => {
  editDialog.value = false
  deleteDialog.value = false
  fetchEmploymentLogic()
}

const fetchEmploymentLogic = async () => {
  loading.value = true
  if (query.pageSize === -1) query.pageSize = 9999
  const { data: result } = await apiGetEmployList(query)
  if (result.code !== 200) {
    console.error(result)
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    deleteDialog.value = false
    return
  }
  selected.value = []
  data.value = result.data.records
  dataLength.value = result.data.totalRow
  loading.value = false
}

const currentPageNoHandler = async (val: number) => {
  query.pageNo = val
  await fetchEmploymentLogic()
}

const currentPageSizeHandler = async (val: number) => {
  query.pageSize = val
  await fetchEmploymentLogic()
}

const selectedChangeHandler = (val: StudentEmploymentItem[]) => {
  selected.value = val
}

onMounted(fetchEmploymentLogic)

// 高度计算相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tabsHeight = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - tabsHeight.value - 132
})
onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.classList.contains('card-container')) {
        containerHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('menu')) {
        selectMenuHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('tabs')) {
        tabsHeight.value = entry.contentRect.height
      }
    }
  })

  // 观察元素
  const container = document.querySelector('.card-container')
  const selectMenu = document.querySelector('.menu')
  const tabs = document.querySelector('.tabs')

  if (container) resizeObserver.observe(container)
  if (selectMenu) resizeObserver.observe(selectMenu)
  if (tabs) resizeObserver.observe(tabs)

  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})
</script>

<template>
  <DeleteDialog
    v-model="deleteDialog"
    v-model:length="selected.length"
    @delete="deleteEmploymentLogic"
  />
  <EditStudentEmploymentDialog
    v-model="editDialog"
    v-model:info="editModel"
    @on-closed="afterEditHandler"
  />
  <section class="menu text-indigo">
    <span class="w-12">
      <MajorSelect v-model="query.majorId" variant="underlined" density="compact" />
    </span>

    <span class="w-12">
      <ItemSelect
        label="性别"
        v-model="query.gender"
        :items="['男', '女']"
        variant="underlined"
        density="compact"
      />
    </span>

    <span class="w-12">
      <GradeSelect
        :charge-grades="chargeGrade"
        v-model="query.gradeId"
        variant="underlined"
        density="compact"
      />
    </span>

    <span class="w-12">
      <PoliticSelect v-model="query.politicId" variant="underlined" density="compact" />
    </span>

    <span class="w-12">
      <DegreeSelect
        :charge-degrees="chargeDegree"
        v-model="query.degreeId"
        variant="underlined"
        density="compact"
      />
    </span>

    <span class="w-12">
      <v-text-field
        v-model="query.graduationYear"
        color="indigo"
        label="毕业年份"
        variant="underlined"
        density="compact"
        hide-details
        clearable
      />
    </span>

    <span class="w-12 text-indigo">
      <v-text-field
        v-model="query.search"
        color="indigo"
        @update:modelValue="fetchEmploymentLogic"
        :loading="loading"
        :counter="15"
        clearable
        label="搜索"
        density="compact"
        prepend-inner-icon="mdi-magnify"
        variant="underlined"
        hide-details
      >
        <v-tooltip
          activator="parent"
          location="top"
          text="以 学生学号 / 学生姓名 / 学生邮箱 / 学生联系方式 搜索"
        />
      </v-text-field>
    </span>

    <v-btn
      v-if="has('student_employment:select')"
      prepend-icon="mdi-refresh"
      @click="fetchEmploymentLogic"
      text="刷新"
    />

    <v-btn
      v-if="has('student_employment:delete')"
      prepend-icon="mdi-delete"
      color="error"
      @click="deleteDialog = true"
      text="删除"
    />
  </section>

  <section class="pa-4 w-100" ref="tableDom">
    <v-card>
      <div class="container">
        <div class="table-container">
          <el-table
            :data="data"
            row-key="studentId"
            :height="tableHeight"
            :selected-rows="selected"
            @selection-change="selectedChangeHandler"
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
            <el-table-column
              prop="studentId"
              align="center"
              label="学号"
              fixed="left"
              width="120"
            />
            <el-table-column prop="name" align="center" label="姓名" fixed="left" width="120" />
            <el-table-column
              v-for="header in employmentTableHeaders"
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
                <v-btn
                  v-if="has('cadre:update')"
                  prepend-icon="mdi-pencil"
                  color="indigo"
                  @click="onEdit(row as StudentEmploymentItem)"
                  text="编辑"
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
            :total="dataLength"
            @size-change="currentPageSizeHandler"
            @current-change="currentPageNoHandler"
          />
        </div>
      </div>
    </v-card>
  </section>
</template>

<style scoped>
.menu {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 0rem 1rem 0 1rem;
  margin-top: 4px;
}

.menu > * {
  margin-right: 0.5rem;
}

.w-12 {
  width: 12% !important;
}

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
