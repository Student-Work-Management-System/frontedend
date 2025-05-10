<script setup lang="ts">
import { apiGetStudentPovertyAssistanceStat } from '@/api/poverty'
import MajorSelect from '@/components/home/MajorSelect.vue'
import GradeSelect from '@/components/home/GradeSelect.vue'
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import type { PovertyAssistanceStatGroup, PovertyAssistanceStatQuery } from '@/model/povertyModel'

const store = useUserStore()
const chargeGrades = store.user.chargeGrades
const has = (authority: string) => store.hasAuthorized(authority)

const query = reactive<PovertyAssistanceStatQuery>({
  gradeId: null,
  majorId: null
})

const loading = ref(false)
const items = ref<PovertyAssistanceStatGroup[]>([])

const getPovertyStat = async () => {
  try {
    loading.value = true
    const { data: result } = await apiGetStudentPovertyAssistanceStat(query)
    if (result.code !== 200) {
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    items.value = result.data
    console.log(result.data)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
onMounted(getPovertyStat)

const getPovertyLevels = (group: PovertyAssistanceStatGroup) => {
  const set = new Set<string>()
  group.majors.forEach((m) => {
    m.povertyLevels.forEach((p) => set.add(p.povertyLevel))
  })
  return Array.from(set)
}

const generateTableData = (group: PovertyAssistanceStatGroup) => {
  const levels = getPovertyLevels(group)
  return group.majors.map((major) => {
    const row: Record<string, any> = { majorName: major.majorName }
    levels.forEach((lv) => {
      const item = major.povertyLevels.find((p) => p.povertyLevel === lv)
      row[lv] = item ? item.number : '-'
    })
    return row
  })
}

// 高度动态计算
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - 109
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
  const container = document.querySelector('.card-container')
  const menu = document.querySelector('.menu')
  if (container) resizeObserver.observe(container)
  if (menu) resizeObserver.observe(menu)
  onUnmounted(() => resizeObserver.disconnect())
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
      <v-btn
        prepend-icon="mdi-refresh"
        v-if="has('poverty_assistance:select')"
        text="刷新"
        @click="getPovertyStat"
      />
    </section>

    <section
      class="w-100 pa-2"
      :style="{
        height: `${tableHeight}px`,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }"
    >
      <template v-if="items?.length > 0">
        <v-card v-for="group in items" :key="group.gradeName" class="pa-1" style="flex: 0 0 auto">
          <v-card-title align="center">{{ group.gradeName }}</v-card-title>
          <el-table :data="generateTableData(group)" border>
            <el-table-column prop="majorName" label="专业名称" width="150" align="center" fixed />
            <template v-for="level in getPovertyLevels(group)" :key="level">
              <el-table-column :label="level" :prop="level" width="150" align="center" />
            </template>
          </el-table>
        </v-card>
      </template>
      <v-card v-else class="w-100 d-flex align-center justify-center" style="flex: 1">
        <v-card-title align="center">暂无数据</v-card-title>
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
