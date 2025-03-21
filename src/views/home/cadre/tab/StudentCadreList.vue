<!-- eslint-disable vue/valid-v-slot -->
<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import EditStudentCadre from '@/components/home/cadre/EditStudentCadre.vue'
import SemesterSelect from '@/components/home/SemesterSelect.vue'
import {
  apiGetStudentCadreList,
  apiDeleteStudentCadre,
  getCadreLevers,
  apiGetCadreList
} from '@/api/cadre'
import type { StudentCadreItem, CadreQuery } from '@/model/cadreModel'
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import { onMounted } from 'vue'
import { reactive } from 'vue'
import { studentCadreTableHeaders } from '@/misc/table'
import { useCadreStore } from '@/stores/cadreStore'

const loading = ref(false)
const selected = ref<any[]>([])
const data = ref<StudentCadreItem[]>([])
const CadreLevels = ref<String[]>(getCadreLevers())
const dataLength = ref<number>(0)
const deleteDialog = ref(false)
const editDialog = ref(false)
const store = useUserStore()
const chargeGrades = store.user.chargeGrades
const cadreStore = useCadreStore()
const query = reactive<CadreQuery>({
  search: '',
  majorId: null,
  gradeId: null,
  cadreLevel: null,
  appointmentStartTerm: null,
  appointmentEndTerm: null,
  pageNo: 1,
  pageSize: 10
})
const modifyInfo = ref<StudentCadreItem>({
  studentCadreId: '',
  studentId: '',
  name: '',
  gender: '',
  majorName: '',
  gradeName: '',
  cadreId: '',
  cadrePosition: '',
  cadreLevel: '',
  cadreBelong: '',
  appointmentStartTerm: '',
  appointmentEndTerm: '',
  comment: ''
})
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const fetchStudentCadreLogic = async () => {
  loading.value = true
  if (query.pageSize === -1) query.pageSize = 9999

  const { data: result } = await apiGetStudentCadreList(query)

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
onMounted(fetchStudentCadreLogic)

const loadItems = () => {
  fetchStudentCadreLogic()
}

const deleteStudentCadreLogic = async () => {
  loading.value = true
  const studentIds = selected.value.map((v) => v.studentCadreId)

  let reqs = studentIds.map((id) =>
    (async () => {
      const { data: result } = await apiDeleteStudentCadre(id)
      if (result.code !== 200) {
        console.error(result.message)
        notify({ type: 'error', title: '错误', text: result.message })
        return
      }
    })()
  )

  await Promise.all(reqs)

  notify({ type: 'success', title: '成功', text: `删除成功！` })
  deleteDialog.value = false
  loading.value = false
  fetchStudentCadreLogic()
}

const closeHandler = () => {
  editDialog.value = false
  fetchStudentCadreLogic()
}

const onEdit = (item: StudentCadreItem) => {
  modifyInfo.value = item
  editDialog.value = true
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

onMounted(async () => {
  const { data: cadreList } = await apiGetCadreList()
  cadreStore.setCadreList(cadreList.data)
})
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <EditStudentCadre v-model="editDialog" :info="modifyInfo" @on-closed="closeHandler" />

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
            @click="deleteStudentCadreLogic"
          >
            删除
          </v-btn>
          <v-btn @click="deleteDialog = false">取消</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <section class="menu">
      <span class="w-10">
        <MajorSelect v-model="query.majorId" variant="underlined" />
      </span>
      <span class="w-10">
        <GradeSelect v-model="query.gradeId" :chargeGrades="chargeGrades" variant="underlined" />
      </span>
      <span class="w-10">
        <v-select
          label="职位等级"
          v-model="query.cadreLevel"
          :items="CadreLevels"
          class="text-indigo"
          color="indigo"
          hide-details
          clearable
          variant="underlined"
          density="compact"
        >
        </v-select>
      </span>
      <span class="w-10 text-indigo">
        <SemesterSelect
          v-model="query.appointmentStartTerm as string"
          color="'indigo'"
          :label="'任职开始学期'"
          variant="underlined"
          density="compact"
        />
      </span>
      <span class="w-10 text-indigo">
        <SemesterSelect
          v-model="query.appointmentEndTerm as string"
          :color="'indigo'"
          :label="'任职结束学期'"
          variant="underlined"
          density="compact"
        />
      </span>

      <span class="w-15 text-indigo">
        <v-text-field
          v-model="query.search"
          color="indigo"
          @update:modelValue="fetchStudentCadreLogic"
          :loading="loading"
          :counter="15"
          clearable
          label="搜索"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
          density="compact"
        >
          <v-tooltip activator="parent" location="top">以学号/姓名/职位名称搜索</v-tooltip>
        </v-text-field>
      </span>
      <v-btn
        prepend-icon="mdi-refresh"
        v-if="
          has('student:select') &&
          has('student_cadre:select') &&
          has('cadre:select') &&
          has('major:select')
        "
        @click="fetchStudentCadreLogic"
        >刷新</v-btn
      >

      <v-btn
        v-if="has('student_cadre:delete')"
        prepend-icon="mdi-delete"
        color="error"
        @click="deleteDialog = true"
        >删除</v-btn
      >
    </section>

    <section class="pa-4 w-100" ref="tableDom">
      <v-card>
        <v-data-table-server
          v-model="selected"
          :headers="studentCadreTableHeaders as any"
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
                v-if="has('student_cadre:update')"
                prepend-icon="mdi-pencil"
                color="indigo"
                @click="onEdit(item)"
              >
                编辑
              </v-btn>
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
