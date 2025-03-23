<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import EditStudentPovertyForm from '@/components/home/poverty/EditStudentPovertyForm.vue'
import AcademicYearSelect from '@/components/home/poverty/AcademicYearSelect.vue'
import {
  apiDeleteStudentPovertyAssistance,
  getPovertyLevels,
  apiGetStudentPovertyAssistanceList
} from '@/api/poverty'
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import { onMounted } from 'vue'
import { reactive } from 'vue'
import type { StudentPovertyAssistanceRecord, PovertyAssistanceQuery } from '@/model/povertyModel'
import { studentPovertyTableHeaders } from '@/misc/table/poverty-import-header'

const loading = ref(false)
const selected = ref<any[]>([])
const data = ref<StudentPovertyAssistanceRecord[]>([])
const povertyLevels = ref<String[]>(getPovertyLevels())
const dataLength = ref<number>(0)
const deleteDialog = ref(false)
const addStudentPovertyDialog = ref(false)
const editStudentPovertyFormDialog = ref(false)

const query = reactive<PovertyAssistanceQuery>({
  search: '',
  majorId: null as string | null,
  gradeId: null as string | null,
  povertyLevel: null as string | null,
  assistanceYear: null as string | null,
  pageNo: 1,
  pageSize: 10
})
const store = useUserStore()
const chargeGrades = store.getUserData.chargeGrades
const editInfo = ref<StudentPovertyAssistanceRecord>({
  studentPovertyAssistanceId: '',
  studentId: '',
  povertyAssistanceId: '',
  name: '',
  gradeName: '',
  majorName: '',
  povertyLevel: '',
  povertyType: '',
  povertyAssistanceStandard: '',
  assistanceYear: ''
})
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const fetchStudentPovertyLogic = async () => {
  loading.value = true
  if (query.pageSize === -1) query.pageSize = 9999

  const { data: result } = await apiGetStudentPovertyAssistanceList(query as PovertyAssistanceQuery)

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
  deleteDialog.value = false
  loading.value = false
}
onMounted(fetchStudentPovertyLogic)

const loadItems = () => {
  fetchStudentPovertyLogic()
}

const deleteStudentPovertyLogic = async () => {
  loading.value = true
  const studentPovertyIds = selected.value.map((v) => v.studentPovertyAssistanceId)

  let reqs = studentPovertyIds.map((id) =>
    (async (id) => {
      const { data: result } = await apiDeleteStudentPovertyAssistance(id)
      if (result.code !== 200) {
        console.error(result.message)
        notify({ type: 'error', title: '错误', text: result.message })
        return
      }
    })(id)
  )
  await Promise.all(reqs)

  deleteDialog.value = false
  loading.value = false
  notify({ type: 'success', title: '成功', text: `删除成功！` })
  fetchStudentPovertyLogic()
}

const onClose = () => {
  addStudentPovertyDialog.value = false
  fetchStudentPovertyLogic()
}

const onEdit = (item: StudentPovertyAssistanceRecord) => {
  editInfo.value = item
  editStudentPovertyFormDialog.value = true
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
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <AddStudentPovertyForm v-model="addStudentPovertyDialog" @on-closed="onClose" />

    <EditStudentPovertyForm
      v-model="editStudentPovertyFormDialog"
      :info="editInfo"
      @on-closed="onClose"
    />

    <v-dialog width="500" v-model="deleteDialog">
      <v-card
        prepend-icon="mdi-delete"
        title="删除选择"
        :text="`已选择 ${selected.length} 条记录，本操作不可撤回，确定要删除吗？`"
      >
        <v-card-actions class="mx-auto">
          <v-btn
            :loading="loading"
            :disabled="selected.length === 0"
            color="error"
            text="删除"
            @click="deleteStudentPovertyLogic"
          />
          <v-btn @click="deleteDialog = false" text="取消" />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <section class="menu">
      <span class="w-10">
        <MajorSelect v-model="query.majorId" variant="underlined" />
      </span>

      <span class="w-10">
        <GradeSelect v-model="query.gradeId" :charge-grades="chargeGrades" variant="underlined" />
      </span>

      <span class="w-10">
        <v-select
          label="贫困等级"
          v-model="query.povertyLevel"
          :items="povertyLevels"
          class="text-indigo"
          color="indigo"
          hide-details
          clearable
          variant="underlined"
          density="compact"
        />
      </span>

      <span class="w-10 text-indigo">
        <AcademicYearSelect
          v-model="query.assistanceYear as string"
          color="indigo"
          variant="underlined"
          density="compact"
        />
      </span>

      <span class="w-15 text-indigo">
        <v-text-field
          v-model="query.search"
          color="indigo"
          @update:modelValue="fetchStudentPovertyLogic"
          :loading="loading"
          :counter="15"
          clearable
          label="搜索"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
          density="compact"
        >
          <v-tooltip
            activator="parent"
            location="top"
            text="按 贫困类型/资助标准/学生学号/学生姓名 搜索"
          />
        </v-text-field>
      </span>

      <v-btn
        prepend-icon="mdi-refresh"
        text="刷新"
        v-if="
          has('student:select') &&
          has('student_poverty_assistance:select') &&
          has('poverty_assistance:select') &&
          has('major:select')
        "
        @click="fetchStudentPovertyLogic"
      />

      <v-btn
        v-if="has('student_poverty_assistance:delete')"
        prepend-icon="mdi-delete"
        text="删除"
        color="error"
        @click="deleteDialog = true"
      />
    </section>

    <section class="pa-4 w-100" ref="tableDom">
      <v-card>
        <v-data-table-server
          v-model="selected"
          :headers="studentPovertyTableHeaders as any"
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
                v-if="has('student_poverty_assistance:update')"
                prepend-icon="mdi-pencil"
                color="indigo"
                @click="onEdit(item)"
                text="编辑"
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
