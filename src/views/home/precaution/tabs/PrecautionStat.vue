<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import type { StudentPrecautionStatGroup, PrecautionStatQuery } from '@/model/precautionModel'
import { apiGetStudentPrecautionStat } from '@/api/precaution'
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'

const store = useUserStore()
const has = (auth: string) => store.hasAuthorized(auth)
const chargeGrades = store.user.chargeGrades

const query = reactive<PrecautionStatQuery>({
  gradeId: null,
  majorId: null,
  startTerm: null,
  endTerm: null
})

const loading = ref(false)
const items = ref<StudentPrecautionStatGroup[]>([])

const getPrecautionStat = async () => {
  try {
    loading.value = true
    const { data: result } = await apiGetStudentPrecautionStat(query)
    if (result.code !== 200) {
      notify({ type: 'error', title: '错误', text: result.message })
      return
    }
    items.value = result.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

// 获取不重复的学期
const extractUniqueTerms = (group: StudentPrecautionStatGroup): string[] => {
  const termSet = new Set<string>()
  group.majors.forEach((major) => {
    major.terms.forEach((t) => {
      termSet.add(t.term)
    })
  })
  return Array.from(termSet).sort()
}

// 组织每个学期的表格数据
const buildTermTableData = (majors: StudentPrecautionStatGroup['majors'], term: string) => {
  return majors.map((major) => {
    const termData = major.terms.find((t) => t.term === term)
    const get = (code: '1' | '2' | '3', field: 'handledNumber' | 'allNumber') => {
      const lv = termData?.levels.find((l) => l.levelCode === code)
      return lv ? lv[field] : 0
    }
    return {
      majorName: major.majorName,
      red: { handled: get('1', 'handledNumber'), total: get('1', 'allNumber') },
      orange: { handled: get('2', 'handledNumber'), total: get('2', 'allNumber') },
      yellow: { handled: get('3', 'handledNumber'), total: get('3', 'allNumber') }
    }
  })
}

// 自适应表格高度
const containerHeight = ref(0)
const menuHeight = ref(0)
const tableHeight = computed(() => containerHeight.value - menuHeight.value - 94)

onMounted(() => {
  getPrecautionStat()
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.classList.contains('card-container'))
        containerHeight.value = entry.contentRect.height
      if (entry.target.classList.contains('menu')) menuHeight.value = entry.contentRect.height
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
    <!-- 查询条件 -->
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
      <span class="w-15">
        <v-text-field
          v-model="query.startTerm"
          label="起始学期"
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
      <span class="w-15">
        <v-text-field
          v-model="query.endTerm"
          label="结束学期"
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
      <v-btn
        v-if="has('student_precaution:select')"
        prepend-icon="mdi-refresh"
        text="刷新"
        @click="getPrecautionStat"
      />
    </section>

    <!-- 数据展示 -->
    <section class="w-100" :style="{ height: `${tableHeight}px`, overflowY: 'auto' }">
      <template v-if="items.length > 0">
        <v-card v-for="group in items" :key="group.gradeName" class="pa-2 mb-5">
          <v-card-title class="text-h6 font-weight-bold text-center">
            {{ group.gradeName }}
          </v-card-title>
          <!-- 收集所有该年级下存在的学期 -->
          <div v-for="term in extractUniqueTerms(group)" :key="term" class="mb-4">
            <div class="text-subtitle-1 font-weight-bold mb-2 text-center">学期：{{ term }}</div>
            <el-table :data="buildTermTableData(group.majors, term)" border>
              <el-table-column label="专业" prop="majorName" align="center" width="180" />

              <el-table-column label="红色预警" align="center">
                <el-table-column label="已处理" align="center">
                  <template #default="{ row }"> {{ row.red.handled }} </template>
                </el-table-column>
                <el-table-column label="总人数" align="center">
                  <template #default="{ row }"> {{ row.red.total }} </template>
                </el-table-column>
              </el-table-column>

              <el-table-column label="橙色预警" align="center">
                <el-table-column label="已处理" align="center">
                  <template #default="{ row }"> {{ row.orange.handled }} </template>
                </el-table-column>
                <el-table-column label="总人数" align="center">
                  <template #default="{ row }"> {{ row.orange.total }} </template>
                </el-table-column>
              </el-table-column>

              <el-table-column label="黄色预警" align="center">
                <el-table-column label="已处理" align="center">
                  <template #default="{ row }"> {{ row.yellow.handled }} </template>
                </el-table-column>
                <el-table-column label="总人数" align="center">
                  <template #default="{ row }"> {{ row.yellow.total }} </template>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
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
