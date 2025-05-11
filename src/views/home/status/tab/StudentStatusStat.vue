<script setup lang="ts">
import { apiGetStat } from '@/api/status'
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import type { StudentStatusStatQuery, StudentStatusStatGroup } from '@/model/statusModel'
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'

const store = useUserStore()
const chargeGrades = store.user.chargeGrades

const query = reactive<StudentStatusStatQuery>({
  gradeId: null,
  majorId: null
})
const loading = ref(false)
const items = ref<StudentStatusStatGroup[]>([])

const getStudentStatusStat = async () => {
  try {
    loading.value = true
    const { data: result } = await apiGetStat(query)
    if (result.code !== 200) {
      console.error(result.message)
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    items.value = result.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
onMounted(getStudentStatusStat)

const generateTableData = (group: StudentStatusStatGroup) => {
  const allStatus = getAllStatusNames(group)
  return group.majors.map((major) => {
    const row: any = {
      majorName: major.majorName
    }
    // 初始化所有字段为 "-"
    allStatus.forEach((statusName) => {
      row[statusName] = '-'
    })
    // 覆盖实际有数据的状态
    major.status.forEach((s) => {
      row[s.statusName] = s.number
    })
    return row
  })
}

const getAllStatusNames = (group: StudentStatusStatGroup) => {
  const set = new Set<string>()
  group.majors.forEach((major) => {
    major.status.forEach((s) => set.add(s.statusName))
  })
  return Array.from(set)
}

// 高度相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tabsHeight = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - tabsHeight.value - 61
})

onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.classList.contains('card-container')) {
        containerHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('tabs')) {
        tabsHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('menu')) {
        selectMenuHeight.value = entry.contentRect.height
      }
    }
  })
  const container = document.querySelector('.card-container')
  const tabs = document.querySelector('.tabs')
  const menu = document.querySelector('.menu')
  if (container) resizeObserver.observe(container)
  if (tabs) resizeObserver.observe(tabs)
  if (menu) resizeObserver.observe(menu)
  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})
</script>

<template>
  <v-card elevation="10" height="100%" width="100%" class="card-container">
    <section class="menu mb-2">
      <span class="w-15">
        <GradeSelect
          v-model="query.gradeId"
          :chargeGrades="chargeGrades"
          variant="underlined"
          density="compact"
        />
      </span>
      <span class="w-15">
        <MajorSelect v-model="query.majorId" variant="underlined" density="compact" />
      </span>
      <v-btn prepend-icon="mdi-refresh" text="刷新" @click="getStudentStatusStat" />
    </section>
    <section
      class="w-100"
      :style="{
        height: `${tableHeight}px`,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }"
    >
      <template v-if="items.length > 0">
        <v-card v-for="group in items" :key="group.gradeName" class="pa-1" style="flex: 0 0 auto">
          <v-card-title align="center">{{ group.gradeName }}</v-card-title>
          <el-table :data="generateTableData(group)" border>
            <el-table-column prop="majorName" label="专业名称" width="150" align="center" fixed />
            <el-table-column
              v-for="statusName in getAllStatusNames(group)"
              :key="statusName"
              :prop="statusName"
              :label="statusName"
              align="center"
              width="120"
            />
          </el-table>
        </v-card>
      </template>
      <v-card v-else class="w-100 d-flex align-center justify-center" style="flex: 1">
        <v-card-title align="center"> 暂无数据 </v-card-title>
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
.w-15 {
  width: 15% !important;
}
</style>
