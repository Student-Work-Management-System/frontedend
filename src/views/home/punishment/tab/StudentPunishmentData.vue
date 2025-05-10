<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import { apiGetStudentPunishment, apiDeleteStudentPunishment } from '@/api/punishment'
import type { StudentPunishmentItem, StudentPunishmentQuery } from '@/model/punishmentModel'
import { studentPunishmentTableHeaders } from '@/misc/table'
import { useUserStore } from '@/stores/userStore'
import DeleteDialog from '@/components/home/DeleteDialog.vue'
import EditStudentPunishmentDialog from '@/components/home/punishment/EditStudentPunishmentDialog.vue'
import PunishtmentSelect from '@/components/home/punishment/PunishtmentSelect.vue'

const store = useUserStore()
const chargeGrades = store.user.chargeGrades
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const loading = ref(false)
const selected = ref<StudentPunishmentItem[]>([])
const deleteDialog = ref(false)
const editDialog = ref(false)
const dataLength = ref<number>(0)
const data = ref<StudentPunishmentItem[]>([])
const modifyInfo = ref<StudentPunishmentItem>({
  studentPunishmentId: '',
  studentId: '',
  name: '',
  gradeName: '',
  majorName: '',
  punishmentId: '',
  punishmentName: '',
  reason: '',
  date: ''
})
const query = reactive<StudentPunishmentQuery>({
  search: '',
  majorId: null,
  gradeId: null,
  punishmentId: null,
  pageNo: 1,
  pageSize: 10
})

const fetchStudentPunishment = async () => {
  loading.value = true
  try {
    const { data: result } = await apiGetStudentPunishment(query)
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

const deleteStudentPunishment = async () => {
  loading.value = true
  try {
    const ids = selected.value.map((v) => v.studentPunishmentId)
    let reqs = ids.map((id) =>
      (async () => {
        const { data: result } = await apiDeleteStudentPunishment(id)
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
    fetchStudentPunishment()
  }
}

const onEdit = (item: StudentPunishmentItem) => {
  modifyInfo.value = item
  editDialog.value = true
}

const afterHandler = () => {
  editDialog.value = false
  deleteDialog.value = false
  selected.value = []
  fetchStudentPunishment()
}

onMounted(async () => {
  await fetchStudentPunishment()
})

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
    <EditStudentPunishmentDialog
      v-model="editDialog"
      :info="modifyInfo"
      @on-closed="afterHandler"
    />
    <DeleteDialog
      v-model="deleteDialog"
      :length="selected.length"
      @delete="deleteStudentPunishment"
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
        <PunishtmentSelect v-model="query.punishmentId" variant="underlined" density="compact" />
      </span>

      <span class="w-15 text-indigo">
        <v-text-field
          v-model="query.search"
          color="indigo"
          @update:modelValue="fetchStudentPunishment"
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
        v-if="has('student_punishment:select')"
        text="刷新"
        @click="fetchStudentPunishment"
      />

      <v-btn
        v-if="has('student_punishment:delete')"
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
          :headers="studentPunishmentTableHeaders as any"
          :height="tableHeight"
          :items="data"
          :items-length="dataLength"
          :loading="loading"
          v-model:page="query.pageNo"
          v-model:items-per-page="query.pageSize"
          @update:options="fetchStudentPunishment()"
          show-select
          return-object
        >
          <!--eslint-disable-next-line vue/valid-v-slot-->
          <template v-slot:item.operations="{ item }">
            <div>
              <v-btn
                v-if="has('student_punishment:update')"
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
