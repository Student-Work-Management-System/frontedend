<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import { computed, onUnmounted, ref } from 'vue'
import { apiGetCounselors } from '@/api/other'
import DeleteDialog from '@/components/home/DeleteDialog.vue'
import { onMounted } from 'vue'
import type { CounselorItem, CounselorQuery } from '@/model/otherModel'
import EditCounselorForm from '@/components/home/system/EditCounselorForm.vue'
import CounselorFrom from '@/components/home/system/CounselorFrom.vue'

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
    title: '负责学历层次',
    align: 'start',
    key: 'chargeDegree',
    sortable: false
  },
  {
    title: '负责年级',
    align: 'start',
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

const editDialog = ref(false)
const deleteDialog = ref(false)
const type = ref<'degree' | 'grade' | null>()
const addDialog = ref(false)
const selected = ref<CounselorItem[]>([])
const data = ref<CounselorItem[]>([])
const loading = ref(false)
const modifiedInfo = ref<CounselorItem>({
  uid: '',
  counselorUsername: '',
  counselorName: '',
  counselorPhone: '',
  chargeDegree: [],
  chargeGrade: []
})
const query = ref<CounselorQuery>({
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
const fetchDataLogic = async () => {
  try {
    if (query.value.pageSize === -1) query.value.pageSize = 9999
    loading.value = true
    const { data: result } = await apiGetCounselors(query.value)

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
  addDialog.value = true
}

const addGrade = () => {
  type.value = 'grade'
  addDialog.value = true
}

const afterEdit = () => {
  editDialog.value = false
  fetchDataLogic()
}

const afterAdd = () => {
  addDialog.value = false
  type.value = null
  fetchDataLogic()
  // todo: 更新grade和degree
}

const onEdit = (item: CounselorItem) => {
  modifiedInfo.value = item
  editDialog.value = true
}

const deleteLogic = async () => {}

// 高度计算相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - 100
})

onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.classList.contains('card-container')) {
        containerHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('menu')) {
        selectMenuHeight.value = entry.contentRect.height
      }
    }
  })

  // 观察元素
  const container = document.querySelector('.card-container')
  const selectMenu = document.querySelector('.menu')

  if (container) resizeObserver.observe(container)
  if (selectMenu) resizeObserver.observe(selectMenu)

  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="d-flex flex-column card-container">
    <EditCounselorForm v-model="editDialog" :info="modifiedInfo" @on-closed="afterEdit" />
    <CounselorFrom v-model="addDialog" :type="type" @on-closed="afterAdd" />
    <DeleteDialog v-model="deleteDialog" :length="selected.length" @delete="deleteLogic" />

    <section class="menu">
      <span>
        <v-btn
          v-if="has('counselor:select')"
          prepend-icon="mdi-refresh"
          text="刷新"
          @click="fetchDataLogic"
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
</style>
