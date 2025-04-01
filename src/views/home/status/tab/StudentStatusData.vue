<script lang="ts" setup>
import { computed, onUnmounted, ref, onMounted, reactive } from 'vue'
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import { apiGetStudentStatusList } from '@/api/status'
import type { StudentStatusItem, StudentStatusQuery } from '@/model/statusModel'
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import { studentStatusTableHeader } from '@/misc/table'
import StatusSelect from '@/components/home/StatusSelect.vue'
import StudentStatusDetailDialog from '@/components/home/status/StudentStatusDetailDialog.vue'
import EditStudentStatusDialog from '@/components/home/status/EditStudentStatusDialog.vue'

const loading = ref(false)
const selected = ref<any[]>([])
const data = ref<StudentStatusItem[]>([])
const dataLength = ref<number>(0)
const getDetailDialog = ref(false)
const editDialog = ref(false)
const store = useUserStore()
const chargeGrades = store.user.chargeGrades
const query = reactive<StudentStatusQuery>({
  search: '',
  statusId: null,
  majorId: null,
  gradeId: null,
  pageNo: 1,
  pageSize: 10
})
const modifyInfo = ref<StudentStatusItem>({
  studentId: '',
  name: '',
  majorName: '',
  gradeName: '',
  studentStatusId: '',
  statusId: '',
  statusName: '',
  log: '',
  modifiedTime: ''
})

const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const fetchStudentStatusLogic = async () => {
  try {
    loading.value = true
    if (query.pageSize === -1) query.pageSize = 9999
    const { data: result } = await apiGetStudentStatusList(query)

    if (result.code !== 200) {
      console.error(result.message)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    selected.value = []
    data.value = result.data.records
    dataLength.value = result.data.totalRow
  } catch (error) {
    console.log(error)
  } finally {
    getDetailDialog.value = false
    loading.value = false
  }
}
onMounted(fetchStudentStatusLogic)

const loadItems = () => {
  fetchStudentStatusLogic()
}

const closeHandler = () => {
  editDialog.value = false
  fetchStudentStatusLogic()
}

const onEdit = (item: StudentStatusItem) => {
  modifyInfo.value = item
  editDialog.value = true
}
const onGetDetail = (item: StudentStatusItem) => {
  getDetailDialog.value = true
  modifyInfo.value = item
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
    <EditStudentStatusDialog v-model="editDialog" :info="modifyInfo" @on-closed="closeHandler" />
    <StudentStatusDetailDialog
      v-model="getDetailDialog"
      :item="modifyInfo"
      @on-close="getDetailDialog = false"
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
        <StatusSelect v-model="query.statusId" variant="underlined" density="compact" />
      </span>

      <span class="w-15 text-indigo">
        <v-text-field
          v-model="query.search"
          color="indigo"
          @update:modelValue="fetchStudentStatusLogic"
          :loading="loading"
          :counter="15"
          clearable
          label="搜索"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
          density="compact"
        >
          <v-tooltip activator="parent" location="top">以 学号 / 姓名 搜索</v-tooltip>
        </v-text-field>
      </span>

      <v-btn
        prepend-icon="mdi-refresh"
        v-if="has('student_status:select')"
        text="刷新"
        @click="fetchStudentStatusLogic"
      />
    </section>

    <section class="pa-4 w-100" ref="tableDom">
      <v-card>
        <v-data-table-server
          v-model="selected"
          :headers="studentStatusTableHeader as any"
          :height="tableHeight"
          :items="data"
          :items-length="dataLength"
          :loading="loading"
          v-model:page="query.pageNo"
          v-model:items-per-page="query.pageSize"
          @update:options="loadItems"
          return-object
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn
                v-if="has('student_status:update')"
                class="me-4"
                text="编辑"
                prepend-icon="mdi-pencil"
                color="indigo"
                @click="onEdit(item)"
              />
              <v-btn
                v-if="has('student_status:select')"
                text="详情"
                prepend-icon="mdi-information"
                color="green-lighten-1"
                @click="onGetDetail(item)"
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
