<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import {
  apiGetStudentScholarships,
  apiDeleteStudentScholarships,
  scholarshipLevels
} from '@/api/scholarship'
import type { StudentScholarshipItem, ScholarshipQuery } from '@/model/scholarshipModel'
import { studentScholarshipTableHeaders } from '@/misc/table'
import { useUserStore } from '@/stores/userStore'
import DeleteDialog from '@/components/home/DeleteDialog.vue'
import EditStudentScholarshipDialog from '@/components/home/scholarship/EditStudentScholarshipDialog.vue'

const store = useUserStore()
const chargeGrades = store.user.chargeGrades
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const loading = ref(false)
const selected = ref<StudentScholarshipItem[]>([])

const deleteDialog = ref(false)
const editDialog = ref(false)
const dataLength = ref<number>(0)
const data = ref<StudentScholarshipItem[]>([])
const modifyInfo = ref<StudentScholarshipItem>({
  studentScholarshipId: '',
  studentId: '',
  name: '',
  gradeName: '',
  majorName: '',
  scholarshipId: '',
  scholarshipName: '',
  scholarshipLevel: '',
  awardYear: ''
})
const query = reactive<ScholarshipQuery>({
  search: '',
  majorId: null,
  gradeId: null,
  scholarshipLevel: null,
  awardYear: null,
  pageNo: 1,
  pageSize: 10
})

const fetchStudentScholarship = async () => {
  loading.value = true
  try {
    const { data: result } = await apiGetStudentScholarships(query)
    if (result.code !== 200) {
      console.error(result)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    data.value = result.data.records
    dataLength.value = result.data.totalRow
  } catch (error) {
    console.log(error)
  } finally {
    selected.value = []
    loading.value = false
  }
}

const loadItems = () => {
  fetchStudentScholarship()
}

const deleteStudentScholarship = async () => {
  loading.value = true
  try {
    const studentIds = selected.value.map((v) => v.studentScholarshipId)
    let reqs = studentIds.map((id) =>
      (async () => {
        const { data: result } = await apiDeleteStudentScholarships(id)
        if (result.code !== 200) {
          console.error(result.message)
          notify({ type: 'error', title: '错误', text: result.message })
          return
        }
      })()
    )
    await Promise.all(reqs)
    notify({ type: 'success', title: '成功', text: `删除成功！` })
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
    fetchStudentScholarship()
  }
}

const onEdit = (item: StudentScholarshipItem) => {
  modifyInfo.value = item
  editDialog.value = true
}

const afterHandler = () => {
  editDialog.value = false
  deleteDialog.value = false
  selected.value = []
  fetchStudentScholarship()
}

// 高度计算相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tabsHeight = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - tabsHeight.value - 100
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
  <v-card elevation="10" height="100%" width="100%">
    <EditStudentScholarshipDialog
      v-model="editDialog"
      :info="modifyInfo"
      @on-closed="afterHandler"
    />
    <DeleteDialog
      v-model="deleteDialog"
      :length="selected.length"
      @delete="deleteStudentScholarship"
    />

    <section class="menu">
      <span class="w-10">
        <MajorSelect v-model="query.majorId" variant="underlined" density="compact" />
      </span>

      <span class="w-10">
        <GradeSelect
          v-model="query.gradeId"
          :chargeGrades="chargeGrades"
          variant="underlined"
          density="compact"
        />
      </span>

      <span class="w-10">
        <v-select
          label="奖学金级别"
          v-model="query.scholarshipLevel"
          :items="scholarshipLevels"
          class="text-indigo"
          color="indigo"
          hide-details
          clearable
          variant="underlined"
          density="compact"
        />
      </span>

      <span class="w-15 text-indigo">
        <v-text-field
          v-model="query.search"
          color="indigo"
          @update:modelValue="fetchStudentScholarship"
          :loading="loading"
          :counter="15"
          clearable
          label="搜索"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
          density="compact"
        >
          <v-tooltip activator="parent" location="top" text="以学号 / 姓名 搜索" />
        </v-text-field>
      </span>
      <v-btn
        prepend-icon="mdi-refresh"
        v-if="has('student_scholarship:select')"
        text="刷新"
        @click="fetchStudentScholarship"
      />

      <v-btn
        v-if="has('student_scholarship:delete')"
        prepend-icon="mdi-delete"
        color="error"
        text="删除"
        @click="deleteDialog = true"
      />
    </section>

    <section class="pa-4 w-100" ref="tableDom">
      <v-card>
        <v-data-table-server
          v-model="selected"
          :headers="studentScholarshipTableHeaders as any"
          :height="tableHeight"
          :items="data"
          :items-length="dataLength"
          :loading="loading"
          v-model:page="query.pageNo"
          v-model:items-per-page="query.pageSize"
          @update:options="loadItems"
          show-select
          return-object
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn
                v-if="has('student_scholarship:update')"
                text="编辑"
                prepend-icon="mdi-pencil"
                color="indigo"
                @click="onEdit(item)"
              />
            </div>
          </template>
        </v-data-table-server>
      </v-card>
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

.w-10 {
  width: 10% !important;
}

.w-15 {
  width: 15% !important;
}
</style>
