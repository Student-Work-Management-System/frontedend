<!-- eslint-disable vue/valid-v-slot -->
<script lang="ts" setup>
import { computed, onUnmounted, ref } from 'vue'
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import DegreeSelect from '@/components/home/DegreeSelect.vue'
import { apiGetForeignLanguages, apiDeleteForeignLanguage } from '@/api/foreign'
import { type ForeignLanguageQuery, type ForeignLanguageItem } from '@/model/foreignModel'
import LanguageSelect from '@/components/home/foreign/LanguageSelect.vue'
import SemesterSelect from '@/components/home/SemesterSelect.vue'
import EditForeignLanguage from '@/components/home/foreign/EditForeignLanguageFrom.vue'
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import { onMounted } from 'vue'
import { reactive } from 'vue'
import { foreignLanguageTableHeaders } from '@/misc/table'

const loading = ref(false)
const selected = ref<any[]>([])
const data = ref<ForeignLanguageItem[]>([])
const dataLength = ref<number>(0)
const deleteDialog = ref(false)
const editDialog = ref(false)
const store = useUserStore()
const chargeGrades = store.user.chargeGrades
const query = reactive<ForeignLanguageQuery>({
  search: '',
  majorId: null,
  gradeId: null,
  degreeId: null,
  languageId: null,
  date: null,
  certificate: null,
  pageNo: 1,
  pageSize: 10
})
const modifyInfo = ref<ForeignLanguageItem>({
  foreignLanguageId: '',
  languageId: '',
  score: '',
  type: '',
  date: '',
  certificate: ''
})
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}

const fetchForeignLanguageLogic = async () => {
  loading.value = true
  if (query.pageSize === -1) query.pageSize = 9999

  const { data: result } = await apiGetForeignLanguages(query)

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
onMounted(fetchForeignLanguageLogic)

const loadItems = () => {
  fetchForeignLanguageLogic()
}

const deleteForeignLanguageLogic = async () => {
  loading.value = true
  const studentIds = selected.value.map((v) => v.studentCadreId)

  let reqs = studentIds.map((id) =>
    (async () => {
      const { data: result } = await apiDeleteForeignLanguage(id)
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
  fetchForeignLanguageLogic()
}

const closeHandler = () => {
  editDialog.value = false
  fetchForeignLanguageLogic()
}

const onEdit = (item: ForeignLanguageItem) => {
  console.log(item)
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
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <EditForeignLanguage v-model="editDialog" :info="modifyInfo" @on-closed="closeHandler" />

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
            @click="deleteForeignLanguageLogic"
          />
          <v-btn @click="deleteDialog = false" text="取消" />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <section class="menu">
      <span class="w-10">
        <GradeSelect
          v-model="query.gradeId"
          :chargeGrades="chargeGrades"
          variant="underlined"
          density="compact"
        />
      </span>
      <span class="w-10">
        <DegreeSelect v-model="query.degreeId" variant="underlined" density="compact" />
      </span>
      <span class="w-15">
        <MajorSelect v-model="query.majorId" variant="underlined" density="compact" />
      </span>
      <span class="w-15">
        <LanguageSelect v-model="query.languageId" variant="underlined" density="compact" />
      </span>
      <span class="w-15">
        <SemesterSelect
          v-model="query.date"
          variant="underlined"
          label="考试时间"
          density="compact"
        />
      </span>
      <span class="w-15 text-indigo">
        <v-text-field
          v-model="query.search"
          color="indigo"
          @update:modelValue="fetchForeignLanguageLogic"
          :loading="loading"
          :counter="15"
          clearable
          label="搜索"
          prepend-inner-icon="mdi-magnify"
          variant="underlined"
          hide-details
          density="compact"
        >
          <v-tooltip activator="parent" location="top" text="以 学号 / 姓名 / 证书编号 搜索" />
        </v-text-field>
      </span>
      <v-btn
        prepend-icon="mdi-refresh"
        v-if="has('foreign:select')"
        text="刷新"
        @click="fetchForeignLanguageLogic"
      />
      <v-btn
        v-if="has('student_cadre:delete')"
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
          :headers="foreignLanguageTableHeaders as any"
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
