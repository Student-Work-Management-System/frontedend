<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import { computed, onUnmounted, reactive, ref } from 'vue'
import {
  apiDeleteCounselor,
  apiGetAllDegrees,
  apiGetAllGrades,
  apiGetCounselors
} from '@/api/other'
import DeleteDialog from '@/components/home/DeleteDialog.vue'
import { onMounted } from 'vue'
import type { CounselorItem, CounselorQuery } from '@/model/otherModel'
import EditCounselorForm from '@/components/home/system/EditCounselorForm.vue'
import { debounce } from '@/utils/debounce'
import AddCounselorForm from '@/components/home/system/AddCounselorForm.vue'
import AddOtherForm from '@/components/home/system/AddOtherForm.vue'
import { useBaseStore } from '@/stores/baseStore'

const headers = [
  {
    title: '辅导员工号',
    align: 'start',
    key: 'counselorUsername',
    sortable: true
  },
  {
    title: '辅导员姓名',
    align: 'start',
    key: 'counselorName',
    sortable: false
  },
  {
    title: '辅导员联系方式',
    align: 'start',
    key: 'counselorPhone',
    sortable: false
  },
  {
    title: '负责',
    align: 'center',
    key: 'chargeGrade',
    sortable: false
  },
  {
    title: '操作',
    align: 'center',
    key: 'operations',
    sortable: false
  }
]
const baseStore = useBaseStore()
const editDialog = ref(false)
const deleteDialog = ref(false)
const addDialog = ref(false)
const type = ref<'degree' | 'grade' | null>()
const addOtherDialog = ref(false)
const selected = ref<CounselorItem[]>([])
const data = ref<CounselorItem[]>([])
const loading = ref(false)
const modifiedInfo = ref<CounselorItem>({
  uid: '',
  counselorUsername: '',
  counselorName: '',
  counselorPhone: '',
  chargeGrade: []
})
const query = reactive<CounselorQuery>({
  search: '',
  gradeId: null,
  degreeId: null,
  pageNo: 1,
  pageSize: 10
})
const dataLength = ref(0)

const store = useUserStore()
const has = (permission: string) => {
  return store.hasAuthorized(permission)
}

// 使用防抖包装 fetchDataLogic
const debouncedFetchData = debounce(() => {
  fetchDataLogic()
}, 300)

const fetchDataLogic = async () => {
  try {
    if (query.pageSize === -1) query.pageSize = 9999
    loading.value = true
    const { data: result } = await apiGetCounselors(query)

    if (result.code !== 200) {
      console.error(result.message)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }

    data.value = result.data.records
    selected.value = []
    dataLength.value = result.data.totalRow
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const loadItems = async () => {
  await fetchDataLogic()
}

onMounted(async () => {
  await fetchDataLogic()
})

const addDegree = () => {
  type.value = 'degree'
  addOtherDialog.value = true
}

const addGrade = () => {
  type.value = 'grade'
  addOtherDialog.value = true
}

const afterEdit = () => {
  editDialog.value = false
  fetchDataLogic()
}

const updateOther = async () => {
  const { data: gradeResult } = await apiGetAllGrades()
  if (gradeResult.code !== 200) {
    console.log(gradeResult.message)
    notify({ type: 'error', title: '错误', text: '更新年级失败' })
    return
  }
  baseStore.updateGradeList(gradeResult.data)
  const { data: degreeResult } = await apiGetAllDegrees()
  if (degreeResult.code !== 200) {
    console.log(degreeResult.message)
    notify({ type: 'error', title: '错误', text: '更新学历层次失败' })
    return
  }
  baseStore.updateDegreeList(degreeResult.data)
}

const afterAddCounselor = () => {
  addDialog.value = false
  fetchDataLogic()
}

const afterAddOther = async () => {
  addOtherDialog.value = false
  type.value = null
  fetchDataLogic()
  await updateOther()
}

const onEdit = (item: CounselorItem) => {
  modifiedInfo.value = item
  editDialog.value = true
}

const deleteLogic = async () => {
  try {
    loading.value = true
    let reqs = selected.value.map((it) =>
      (async (it) => {
        const uid = it.uid
        const { data: result } = await apiDeleteCounselor(uid)
        if (result.code !== 200) {
          console.log(result.message)
          notify({ type: 'error', title: '错误', text: result.message })
          return
        }
      })(it)
    )
    await Promise.all(reqs)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
    fetchDataLogic()
  }
}

// 高度计算相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tabHeiht = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - tabHeiht.value - 148
})

onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.classList.contains('card-container')) {
        containerHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('menu')) {
        selectMenuHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('tab')) {
        tabHeiht.value = entry.contentRect.height
      }
    }
  })

  // 观察元素
  const container = document.querySelector('.card-container')
  const selectMenu = document.querySelector('.menu')
  const tabs = document.querySelector('.tab')

  if (container) resizeObserver.observe(container)
  if (selectMenu) resizeObserver.observe(selectMenu)
  if (tabs) resizeObserver.observe(tabs)
  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="d-flex flex-column">
    <EditCounselorForm v-model="editDialog" :info="modifiedInfo" @on-closed="afterEdit" />
    <AddCounselorForm v-model="addDialog" @on-closed="afterAddCounselor" />
    <AddOtherForm v-model="addOtherDialog" :type="type" @on-closed="afterAddOther" />
    <DeleteDialog v-model="deleteDialog" :length="selected.length" @delete="deleteLogic" />

    <section class="menu">
      <span class="w-20 text-indigo">
        <v-text-field
          v-model="query.search"
          @update:modelValue="debouncedFetchData"
          color="indigo"
          :loading="loading"
          clearable
          label="搜索"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
          density="compact"
        >
          <v-tooltip activator="parent" location="top" text="以 工号 / 姓名 搜索" />
        </v-text-field>
      </span>
      <span>
        <v-btn
          v-if="has('counselor:select')"
          prepend-icon="mdi-refresh"
          text="刷新"
          @click="fetchDataLogic"
        />
        <v-btn
          v-if="has('counselor:insert')"
          prepend-icon="mdi-plus-circle"
          color="primary"
          text="新增工作辅导员"
          @click="addDialog = true"
        />
        <v-btn
          v-if="has('grade:insert')"
          prepend-icon="mdi-plus-circle"
          color="primary"
          text="添加年级"
          @click="addGrade"
        />
        <v-btn
          v-if="has('degree:insert')"
          prepend-icon="mdi-plus-circle"
          color="primary"
          text="添加学历层次"
          @click="addDegree"
        />
        <v-btn
          v-if="has('counselor:delete')"
          prepend-icon="mdi-delete"
          color="error"
          @click="deleteDialog = true"
          text="删除"
        />
      </span>
    </section>

    <section class="pa-4 w-100" ref="tableDom">
      <v-card>
        <v-data-table-server
          v-model="selected"
          :headers="headers as any"
          :height="tableHeight"
          :items="data"
          :items-length="dataLength"
          :loading="loading"
          v-model:page="query.pageNo"
          v-model:items-per-page="query.pageSize"
          @update:options="loadItems"
          return-object
          show-select
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.chargeGrade="{ item }">
            <v-chip-group>
              <v-chip
                v-for="grade in item.chargeGrade"
                :key="grade"
                class="text-white bg-indigo"
                :clickable="false"
                :ripple="false"
                :active="false"
              >
                {{ grade }}
              </v-chip>
            </v-chip-group>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn
                v-if="has('counselor:update')"
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
.v-card {
  align-items: start;
}

.menu {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 1rem 1rem 0 1rem;
}

.menu span > * {
  margin-right: 0.5rem;
}

.w-20 {
  width: 20% !important;
}

:deep(.v-chip) {
  cursor: default !important;
}
</style>
