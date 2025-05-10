<script setup lang="ts">
import { apiGetStat } from '@/api/punishment'
import MajorSelect from '@/components/home/MajorSelect.vue'
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import type {
  StudentPunishmentStatQuery,
  StudentPunishmentStatGroup
} from '@/model/punishmentModel'

const store = useUserStore()
const chargeGrades = store.user.chargeGrades

const query = reactive<StudentPunishmentStatQuery>({
  gradeId: null,
  majorId: null
})

const loading = ref(false)
const items = ref<StudentPunishmentStatGroup[]>([])

const getStudentPunishmentStat = async () => {
  try {
    loading.value = true
    const { data: result } = await apiGetStat(query)
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

onMounted(getStudentPunishmentStat)

const getPunishmentTypes = (group: StudentPunishmentStatGroup) => {
  const set = new Set<string>()
  group.majors.forEach((major) => {
    major.punishments.forEach((p) => {
      set.add(p.punishmentName)
    })
  })
  return Array.from(set)
}

const generateTableData = (group: StudentPunishmentStatGroup) => {
  const types = getPunishmentTypes(group)
  return group.majors.map((major) => {
    const row: any = {
      majorName: major.majorName
    }
    types.forEach((type) => {
      const item = major.punishments.find((p) => p.punishmentName === type)
      row[type] = item ? item.number : '-'
    })
    return row
  })
}

// 动态高度计算
const containerHeight = ref(0)
const selectMenuHeight = ref(0)
const tableHeight = computed(() => {
  return containerHeight.value - selectMenuHeight.value - 115
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
      <v-btn
        prepend-icon="mdi-refresh"
        v-if="store.hasAuthorized('student_punishment:select')"
        text="刷新"
        @click="getStudentPunishmentStat"
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
            <el-table-column prop="majorName" label="专业名称" width="150" align="center" fixed />
            <template v-for="type in getPunishmentTypes(group)" :key="type">
              <el-table-column :label="type" :prop="type" align="center" width="150" />
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

.table-section {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
