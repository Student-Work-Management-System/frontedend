<script setup lang="ts">
import { apiGetStudentScholarshipStat, scholarshipLevels } from '@/api/scholarship'
import ItemSelect from '@/components/home/ItemSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import type { ScholarshipStatQuery, StudentScholarshipStatGroup } from '@/model/scholarshipModel'
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'

const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const chargeGrades = store.user.chargeGrades
const query = reactive<ScholarshipStatQuery>({
  gradeId: null,
  majorId: null,
  level: null,
  time: null
})
const loading = ref<boolean>(false)
const items = ref<StudentScholarshipStatGroup[]>([])

const getStudentScholarshipStat = async () => {
  try {
    loading.value = true
    const { data: result } = await apiGetStudentScholarshipStat(query)
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
onMounted(getStudentScholarshipStat)

const getScholarshipLevelsByScholarship = (
  scholarshipName: string,
  group: StudentScholarshipStatGroup
): string[] => {
  const levelsSet = new Set<string>()
  group.studentScholarshipStatItems.forEach((it) => {
    it.scholarshipStatItems.forEach((item) => {
      if (item.scholarshipName === scholarshipName) {
        levelsSet.add(item.scholarshipLevel)
      }
    })
  })
  return Array.from(levelsSet)
}

const getScholarshipsByGrade = (gradeName: string) => {
  const set = new Set<string>()
  const group = items.value.find((item) => item.gradeName === gradeName)
  group?.studentScholarshipStatItems.forEach((statItem) => {
    statItem.scholarshipStatItems.forEach((scholarship) => {
      set.add(scholarship.scholarshipName)
    })
  })
  return Array.from(set)
}

const generateTableData = (group: StudentScholarshipStatGroup) => {
  const scholarships = getScholarshipsByGrade(group.gradeName)

  return group.studentScholarshipStatItems.map((statItem) => {
    const row: Record<string, any> = {
      majorName: statItem.majorName
    }

    scholarships.forEach((scholarshipName) => {
      const levels = getScholarshipLevelsByScholarship(scholarshipName, group)
      levels.forEach((level) => {
        const found = statItem.scholarshipStatItems.find(
          (item) => item.scholarshipName === scholarshipName && item.scholarshipLevel === level
        )
        row[`${scholarshipName}_${level}`] = found ? found.total : 0
      })
    })

    return row
  })
}

// 高度计算相关
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tabsHeight = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - tabsHeight.value - 60
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

  // 观察元素
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
      <span class="w-15">
        <ItemSelect
          v-model="query.level"
          label="奖学金级别"
          :items="scholarshipLevels"
          variant="underlined"
          density="compact"
        />
      </span>
      <span class="w-15">
        <v-text-field
          v-model="query.time"
          class="text-indigo"
          color="indigo"
          label="获奖学年"
          variant="underlined"
          hide-details
          density="compact"
          clearable
        >
          <v-tooltip activator="parent" location="top" text="格式为: 20xx-20xx" />
        </v-text-field>
      </span>
      <v-btn
        prepend-icon="mdi-refresh"
        v-if="has('student_scholarship:select')"
        text="刷新"
        @click="getStudentScholarshipStat"
      />
    </section>
    <section
      class="pa-2 w-100"
      :style="{
        height: `${tableHeight}px`,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column'
      }"
    >
      <template v-if="items.length > 0">
        <v-card
          v-for="group in items"
          :key="group.gradeName"
          class="pa-1 mb-2"
          style="flex: 0 0 auto"
        >
          <v-card-title align="center">{{ group.gradeName }}</v-card-title>
          <el-table :data="generateTableData(group)" border style="width: 100%">
            <el-table-column prop="majorName" label="专业名称" width="150" align="center" fixed />
            <template
              v-for="scholarship in getScholarshipsByGrade(group.gradeName)"
              :key="scholarship"
            >
              <el-table-column :label="scholarship" align="center">
                <template
                  v-for="level in getScholarshipLevelsByScholarship(scholarship, group)"
                  :key="level"
                >
                  <el-table-column
                    :prop="`${scholarship}_${level}`"
                    :label="level"
                    width="100"
                    align="center"
                  />
                </template>
              </el-table-column>
            </template>
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

.w-10 {
  width: 10% !important;
}

.w-15 {
  width: 15% !important;
}
</style>
