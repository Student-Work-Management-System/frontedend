<script lang="ts" setup>
import { useUserStore } from '@/stores/userStore'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { type Competition, type CompetitionQuery } from '@/model/competitionModel'
import { apiGetCompetitions, apiDeleteCompetition } from '@/api/competition'
import DeleteDialog from '@/components/home/DeleteDialog.vue'
import { competitionTableHeaders } from '@/misc/table/competition-import-header'
import AddCompetitionDialog from '@/components/home/competition/AddCompetitionDialog.vue'
import CompetitionNatureSelect from '@/components/home/competition/CompetitionNatureSelect.vue'
import CompetitionTypeSelect from '@/components/home/competition/CompetitionTypeSelect.vue'
import EditCompetitionDialog from '@/components/home/competition/EditCompetitionDialog.vue'

const loading = ref(false)
const deleteDialog = ref(false)
const selected = ref<Competition[]>([])
const addDialog = ref<boolean>(false)
const editDialog = ref<boolean>(false)
const editInfo = ref<Competition>({
  competitionId: '',
  competitionName: '',
  competitionNature: '',
  competitionType: '',
  comment: ''
})
const query = ref<CompetitionQuery>({
  search: '',
  competitionNature: null,
  competitionType: null,
  page: 1,
  pageSize: 10
})
const data = ref<Competition[]>([])
const dataLength = ref(0)

const loadItems = () => {
  fetchCompetitionLogic()
}

const store = useUserStore()
const has = (permission: string) => {
  return store.hasAuthorized(permission)
}

const deleteLogic = async () => {
  let reqs = selected.value.map((e) =>
    (async (e) => {
      const cid = e.competitionId
      const { data: result } = await apiDeleteCompetition(cid as string)
      if (result.code !== 200) {
        console.error(result)
        notify({ type: 'error', title: '错误', text: result.message })
        return
      }
      notify({ type: 'success', title: '成功', text: `就业信息:${cid} 删除成功！` })
    })(e)
  )
  await Promise.all(reqs)
  afterEdit()
  loading.value = false
}

const fetchCompetitionLogic = async () => {
  loading.value = true
  if (query.value.pageSize === -1) {
    query.value.pageSize = 9999
  }
  const { data: result } = await apiGetCompetitions(query.value)
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

const onClosed = () => {
  addDialog.value = false
  editDialog.value = false
  fetchCompetitionLogic()
}

onMounted(fetchCompetitionLogic)

const afterEdit = () => {
  deleteDialog.value = false
  fetchCompetitionLogic()
}

const onAddClick = () => {
  addDialog.value = true
}

const onEditClick = (item: Competition) => {
  editInfo.value = item
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
</script>
<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <DeleteDialog v-model="deleteDialog" v-model:length="selected.length" @delete="deleteLogic" />

    <AddCompetitionDialog v-model="addDialog" @on-closed="onClosed" />

    <EditCompetitionDialog v-model="editDialog" :info="editInfo" @on-closed="onClosed" />

    <section class="menu">
      <span class="w-15 text-indigo">
        <CompetitionNatureSelect
          v-model="query.competitionNature as any"
          variant="underlined"
          density="compact"
        />
      </span>
      <span class="w-10 text-indigo">
        <CompetitionTypeSelect
          v-model="query.competitionType as any"
          variant="underlined"
          density="compact"
        />
      </span>
      <span class="w-15 text-indigo">
        <v-text-field
          v-model="query.search"
          color="indigo"
          @update:modelValue="fetchCompetitionLogic"
          :loading="loading"
          :counter="15"
          clearable
          label="搜索"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
          density="compact"
        >
          <v-tooltip activator="parent" location="top">以竞赛名称搜索</v-tooltip>
        </v-text-field>
      </span>
      <v-btn
        v-if="has('competition:select')"
        prepend-icon="mdi-refresh"
        @click="fetchCompetitionLogic"
        text="刷新"
      />
      <v-btn
        v-if="has('competition:insert')"
        prepend-icon="mdi-plus-circle"
        color="primary"
        @click="onAddClick()"
        text="添加"
      />
      <v-btn
        v-if="has('competition:delete')"
        prepend-icon="mdi-delete"
        color="error"
        @click="deleteDialog = true"
        text="删除"
      />
    </section>

    <section class="pa-4 w-100" ref="tableDom">
      <v-card>
        <v-data-table-server
          v-model="selected"
          :headers="competitionTableHeaders as any"
          :height="tableHeight"
          :items="data"
          :items-length="dataLength"
          :loading="loading"
          v-model:page="query.page"
          v-model:items-per-page="query.pageSize"
          @update:options="loadItems"
          show-select
          return-object
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn
                v-if="has('competition:update')"
                prepend-icon="mdi-pencil"
                color="indigo"
                @click="onEditClick(item)"
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

.w-20 {
  width: 15% !important;
}

.w-15 {
  width: 15% !important;
}
</style>
