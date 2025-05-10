<script setup lang="ts">
import { apiGetCadreStat, getCadreLevers } from '@/api/cadre'
import ItemSelect from '@/components/home/ItemSelect.vue'
import MajorSelect from '@/components/home/MajorSelect.vue'
import type { CadreStatQuery, StudentCadreStatGroup } from '@/model/cadreModel'
import { useUserStore } from '@/stores/userStore'
import { notify } from '@kyvg/vue3-notification'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'

const store = useUserStore()
const has = (authority: string) => {
  return store.hasAuthorized(authority)
}
const chargeGrades = store.user.chargeGrades
const query = reactive<CadreStatQuery>({
  gradeId: null,
  majorId: null,
  cadreLevel: null,
  startTerm: null,
  endTerm: null
})
const loading = ref<boolean>(false)
const items = ref<StudentCadreStatGroup[]>([])

const getStudentCadreStat = async () => {
  try {
    loading.value = true
    const { data: result } = await apiGetCadreStat(query)
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
onMounted(getStudentCadreStat)

const getCadreBelong = (gradeName: string) => {
  const set = new Set<string>()
  const group = items.value.find((item) => item.gradeName === gradeName)
  group?.studentCadreStatItems.forEach((statItem) => {
    statItem.cadreStatItems.forEach((cadre) => {
      set.add(cadre.cadreBelong)
    })
  })
  return Array.from(set)
}

const generateTableData = (group: StudentCadreStatGroup) => {
  const belongs = getCadreBelong(group.gradeName)
  return group.studentCadreStatItems.map((it) => {
    const row: any = {
      majorName: it.majorName
    }
    belongs.forEach((belong) => {
      const cadreItems = it.cadreStatItems.filter((cadre) => cadre.cadreBelong === belong)

      const schoolCadre = cadreItems.find((cadre) => cadre.cadreLevel === '校级')
      const collegeCadre = cadreItems.find((cadre) => cadre.cadreLevel === '院级')

      row[`${belong}_校级`] = schoolCadre ? schoolCadre.total : '-'
      row[`${belong}_院级`] = collegeCadre ? collegeCadre.total : '-'
    })
    return row
  })
}

// 高度计算相关
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
          v-model="query.cadreLevel"
          label="职位等级"
          :items="getCadreLevers()"
          variant="underlined"
          density="compact"
        />
      </span>
      <span class="w-15">
        <SemesterSelect
          v-model="query.startTerm"
          color="indigo"
          label="任职开始学期"
          variant="underlined"
          density="compact"
        />
      </span>
      <span class="w-15">
        <SemesterSelect
          v-model="query.endTerm"
          color="indigo"
          label="任职开始学期"
          variant="underlined"
          density="compact"
        />
      </span>
      <v-btn
        prepend-icon="mdi-refresh"
        v-if="has('student_cadre:select') && has('cadre:select')"
        text="刷新"
        @click="getStudentCadreStat"
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
            <template v-for="belong in getCadreBelong(group.gradeName)" :key="belong">
              <el-table-column :label="belong" align="center" width="150">
                <el-table-column
                  :label="'校级'"
                  :prop="`${belong}_校级`"
                  width="125"
                  align="center"
                />
                <el-table-column
                  :label="'院级'"
                  :prop="`${belong}_院级`"
                  width="125"
                  align="center"
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

.w-10 {
  width: 10% !important;
}

.w-15 {
  width: 15% !important;
}
</style>
