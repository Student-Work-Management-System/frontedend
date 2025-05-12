<script lang="ts" setup>
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import {
  apiGetStudentPrecautionList,
  apiDeleteStudentPrecaution,
  levelOptions,
  apiHandlePrecaution
} from '@/api/precaution'
import type { StudentPrecautionItem, PrecautionQuery } from '@/model/precautionModel'
import { useUserStore } from '@/stores/userStore'
import { studentPrecautionTableHeaders } from '@/misc/table'
import EditStudentPrecaution from '@/components/home/precaution/EditStudentPrecaution.vue'
import AddStudentprecaution from '@/components/home/precaution/AddStudentprecaution.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import GradeSelect from '@/components/home/GradeSelect.vue'

const loading = ref(false)
const addDialog = ref(false)
const selected = ref<StudentPrecautionItem[]>([])
const data = ref<StudentPrecautionItem[]>([])
const dataLength = ref<number>(0)
const editDialog = ref(false)
const deleteDialog = ref(false)
const store = useUserStore()
const chargeGrades = store.getUserData.chargeGrades
const query = reactive<PrecautionQuery>({
  search: '',
  detailSearch: '',
  gradeId: null,
  majorId: null,
  levelCode: null,
  startTerm: null,
  endTerm: null,
  pageNo: 1,
  pageSize: 10
})
const handleDialog = ref(false)
const handleItem = ref<StudentPrecautionItem | null>(null)
const modifyInfo = ref<StudentPrecautionItem>({
  studentPrecautionId: '',
  levelCode: null,
  term: '',
  detail: ''
})
const viewDetailDialog = ref<boolean>(false)
const viewDetailItem = ref<StudentPrecautionItem | null>(null)

const has = (authority: string) => store.hasAuthorized(authority)

const levelCodeToText = (code: '0' | '1' | '2' | null) => {
  switch (code) {
    case '0':
      return '红色'
    case '1':
      return '橙色'
    case '2':
      return '黄色'
    default:
      return '未知'
  }
}

const getLevelColor = (code: '0' | '1' | '2' | null) => {
  switch (code) {
    case '0':
      return 'red'
    case '1':
      return 'orange'
    case '2':
      return 'yellow darken-4'
    default:
      return 'grey'
  }
}

const fetchData = async () => {
  loading.value = true
  const { data: result } = await apiGetStudentPrecautionList(query)

  if (result.code !== 200) {
    notify({ type: 'error', title: '错误', text: result.message })
    loading.value = false
    return
  }

  selected.value = []
  data.value = result.data.records
  dataLength.value = result.data.totalRow
  loading.value = false
}

const deleteLogic = async () => {
  loading.value = true
  const ids = selected.value.map((item) => item.studentPrecautionId)
  await Promise.all(
    ids.map(async (id) => {
      const { data: result } = await apiDeleteStudentPrecaution(id)
      if (result.code !== 200) {
        notify({ type: 'error', title: '删除失败', text: result.message })
      }
    })
  )
  notify({ type: 'success', title: '成功', text: '删除成功' })
  deleteDialog.value = false
  fetchData()
}

const handle = (item: StudentPrecautionItem) => {
  handleItem.value = item
  handleDialog.value = true
}

const confirmHandle = async () => {
  loading.value = true
  try {
    const { data: result } = await apiHandlePrecaution(handleItem.value!.studentPrecautionId)
    if (result.code !== 200) {
      notify({ type: 'error', title: '处理失败', text: result.message })
      return
    }
    notify({ type: 'success', title: '成功', text: '处理完成' })
  } catch (error) {
    console.error(error)
  } finally {
    fetchData()
    handleDialog.value = false
    loading.value = false
  }
}

const viewDetail = (item: StudentPrecautionItem) => {
  viewDetailDialog.value = true
  viewDetailItem.value = item
}

const onEdit = (item: StudentPrecautionItem) => {
  modifyInfo.value = item
  editDialog.value = true
}

const detailText = (rawDetail: string) => {
  console.log(rawDetail.split('\n'))
  return rawDetail.split('\n')
}

const closeHandler = () => {
  editDialog.value = false
  addDialog.value = false
  fetchData()
}

onMounted(fetchData)

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
  <v-card elevation="10" width="100%" height="100%">
    <EditStudentPrecaution v-model="editDialog" :info="modifyInfo" @on-closed="closeHandler" />
    <AddStudentprecaution v-model="addDialog" @on-closed="closeHandler" />

    <v-dialog width="500" v-model="deleteDialog">
      <v-card title="确认删除" :text="`选中 ${selected.length} 条记录，是否删除？`">
        <v-card-actions>
          <v-btn color="error" :disabled="!selected.length" @click="deleteLogic">删除</v-btn>
          <v-btn @click="deleteDialog = false">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog width="400" v-model="handleDialog">
      <v-card title="确认将该预警标记为已处理？">
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="confirmHandle" text="确定" />
          <v-btn @click="(handleDialog = false), (handleItem = null)" text="取消" />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog width="750" v-model="viewDetailDialog">
      <v-card title="查看学业预警详情">
        <v-card-text>
          <div>
            <strong>预警等级：</strong>
            <span>{{ levelCodeToText(viewDetailItem?.levelCode!) }}</span>
          </div>
          <div>
            <strong>学期：</strong>
            <span>{{ viewDetailItem?.term }}</span>
          </div>
          <div>
            <strong>详细描述：</strong>
            <p :key="idx" v-for="(text, idx) in detailText(viewDetailItem?.detail!)">
              {{ text }}
            </p>
          </div>
          <v-divider v-if="viewDetailItem?.status === true" class="my-2" />
          <div v-if="viewDetailItem?.status === true">
            <div>
              <strong>处理人：</strong>
              <span>{{ viewDetailItem?.handlerName! }}</span>
            </div>
            <div>
              <strong>处理时间：</strong>
              <span>{{ viewDetailItem?.handledAt! }}</span>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="viewDetailDialog = false">关闭</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <section class="menu">
      <span class="w-8">
        <GradeSelect
          v-model="query.gradeId"
          variant="underlined"
          density="compact"
          :charge-grades="chargeGrades"
        />
      </span>
      <span class="w-8">
        <MajorSelect v-model="query.majorId" variant="underlined" density="compact" />
      </span>
      <span class="w-8">
        <v-select
          class="text-indigo"
          label="预警等级"
          v-model="query.levelCode"
          :items="levelOptions"
          item-title="label"
          item-value="value"
          variant="underlined"
          density="compact"
          clearable
          hide-details
        />
      </span>
      <span class="w-10">
        <v-text-field
          v-model="query.startTerm"
          label="检索起始学期"
          class="text-indigo"
          clearable
          variant="underlined"
          density="compact"
          hide-details
        >
          <v-tooltip
            activator="parent"
            location="top"
            text="格式为xxxx-xxxx_[1|2], 如2021-2022_1"
          />
        </v-text-field>
      </span>
      <span class="w-10">
        <v-text-field
          v-model="query.endTerm"
          label="检索结束学期"
          class="text-indigo"
          clearable
          variant="underlined"
          density="compact"
          hide-details
        >
          <v-tooltip
            activator="parent"
            location="top"
            text="格式为xxxx-xxxx_[1|2], 如2021-2022_1"
          />
        </v-text-field>
      </span>
      <span class="w-10 text-indigo">
        <v-text-field
          v-model="query.search"
          label="搜索"
          clearable
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          density="compact"
          hide-details
        >
          <v-tooltip activator="parent" location="top" text="以 学生姓名 / 学号 搜索" />
        </v-text-field>
      </span>
      <span class="w-15 text-indigo">
        <v-text-field
          v-model="query.detailSearch"
          label="从学业预警明细中搜索"
          clearable
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          density="compact"
          hide-details
        />
      </span>
      <v-btn
        prepend-icon="mdi-refresh"
        @click="fetchData"
        v-if="has('student_precaution:select')"
        text="刷新"
      />
      <v-btn
        v-if="has('student_precaution:insert')"
        prepend-icon="mdi-plus-circle"
        text="添加"
        color="primary"
        @click="addDialog = true"
      />
      <v-btn
        prepend-icon="mdi-delete"
        color="error"
        @click="deleteDialog = true"
        v-if="has('student_precaution:delete')"
        text="删除"
      />
    </section>

    <section class="pa-4">
      <v-data-table-server
        v-model="selected"
        :headers="studentPrecautionTableHeaders as any"
        :height="tableHeight"
        :items="data"
        :items-length="dataLength"
        :loading="loading"
        v-model:page="query.pageNo"
        v-model:items-per-page="query.pageSize"
        show-select
        return-object
        @update:options="fetchData"
      >
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.levelCode="{ item }">
          <v-chip :color="getLevelColor(item.levelCode)" small label>
            {{ levelCodeToText(item.levelCode) }}
          </v-chip>
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.status="{ item }">
          {{ item.status === true ? '是' : '否' }}
        </template>
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.operations="{ item }">
          <v-btn
            v-if="has('student_precaution:select')"
            text="查看明细"
            @click="viewDetail(item)"
            color="success"
            class="me-2"
          />
          <v-btn
            v-if="has('student_precaution:update')"
            text="编辑"
            @click="onEdit(item)"
            color="indigo"
            class="me-2"
          />
          <v-btn
            v-if="has('student_precaution:update') && !item.status"
            text="处理完成"
            color="primary"
            @click="handle(item)"
          />
        </template>
      </v-data-table-server>
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

.w-8 {
  width: 8% !important;
}

.w-15 {
  width: 15% !important;
}
</style>
