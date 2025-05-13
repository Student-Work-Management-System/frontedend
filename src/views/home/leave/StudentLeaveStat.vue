<script setup lang="ts">
import { apiGetStat } from '@/api/leave'
import GradeSelect from '@/components/home/GradeSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import type { LeaveStatQuery, StudentLeaveStatGroup } from '@/model/leaveModel'
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'

const store = useUserStore()
const chargeGrades = store.user.chargeGrades
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const query = reactive<LeaveStatQuery>({
  gradeId: null,
  majorId: null
})

const loading = ref(false)
const items = ref<StudentLeaveStatGroup[]>([])

const getLeaveStat = async () => {
  try {
    loading.value = true
    const { data: result } = await apiGetStat(query)
    if (result.code !== 200) {
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

onMounted(getLeaveStat)

// 动态生成表格数据
const getLeaveTypes = (group: StudentLeaveStatGroup) => {
  const set = new Set<string>()
  group.majors.forEach((m) => {
    m.studentLeaves.forEach((stat) => {
      set.add(stat.type)
    })
  })
  return Array.from(set)
}

const generateTableData = (group: StudentLeaveStatGroup) => {
  const types = getLeaveTypes(group)
  return group.majors.map((major) => {
    const row: any = {
      majorName: major.majorName
    }
    types.forEach((type) => {
      const stat = major.studentLeaves.find((s) => s.type === type)
      row[`${type}_total`] = stat?.totalNumber ?? '-'
      row[`${type}_internship`] = stat?.internshipNumber ?? '-'
      row[`${type}_destroyed`] = stat?.destroyedNumber ?? '-'
    })
    return row
  })
}

// 动态高度计算
const containerHeight = ref(0)
const menuHeight = ref(0)
const tableHeight = computed(() => containerHeight.value - menuHeight.value - 40)

onMounted(() => {
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target.classList.contains('card-container')) {
        containerHeight.value = entry.contentRect.height
      } else if (entry.target.classList.contains('menu')) {
        menuHeight.value = entry.contentRect.height
      }
    }
  })

  const container = document.querySelector('.card-container')
  const menu = document.querySelector('.menu')
  if (container) resizeObserver.observe(container)
  if (menu) resizeObserver.observe(menu)

  onUnmounted(() => {
    resizeObserver.disconnect()
  })
})
</script>

<template>
  <v-card class="card-container" elevation="10" width="100%" height="100%">
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
        v-if="has('student_leave:select')"
        prepend-icon="mdi-refresh"
        text="刷新"
        @click="getLeaveStat"
      />
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
            <el-table-column prop="majorName" label="专业名称" fixed width="150" align="center" />
            <template v-for="type in getLeaveTypes(group)" :key="type">
              <el-table-column :label="type" align="center" width="180">
                <el-table-column
                  :label="'总数'"
                  :prop="`${type}_total`"
                  align="center"
                  width="60"
                />
                <el-table-column
                  :label="'实习'"
                  :prop="`${type}_internship`"
                  align="center"
                  width="60"
                />
                <el-table-column
                  :label="'销假'"
                  :prop="`${type}_destroyed`"
                  align="center"
                  width="60"
                />
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
.w-15 {
  width: 15% !important;
}
</style>
